"""Generate the voiceover per scene with word timings -> voice.mp3 + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-AndrewMultilingualNeural", "+13%", 0.35
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = [
 "Everyone's selling GEO. Generative engine optimization. But Google just explained how its AI answers pick pages. Let's follow one question.",
 "Step one: retrieval. The AI doesn't invent its sources. It pulls pages from the same ranking systems as regular Search.",
 "Step two: query fan-out. It fires off related searches, all at once, to find even more pages.",
 "Step three: the answer. Written from those pages, with links. So the real GEO question is simple. Would your page rank?",
 "What ranks? Not commodity content. Top ten running shoes exists a thousand times. I ran five hundred miles in these on flat feet exists once.",
 "And the hacks? llms text files. AI-only markup. Chopping pages into chunks. Google says you don't need any of it.",
 "Measure it in Search Console's generative AI report. No outside tool sees Google's internal data.",
 "GEO isn't a new game. It's SEO, done really well. Follow for more.",
]
FIX = {"llms": "llms.txt", "text": None}  # merge "llms text" -> "llms.txt"

async def one(i, text):
    words, path = [], f"build/s{i}.mp3"
    with open(path, "wb") as f:
        async for ch in edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary").stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7, "w": ch["text"]})
    out = []
    for w in words:  # caption fix-ups
        if out and out[-1]["w"] == "llms.txt" and w["w"].lower() == "text": continue
        if w["w"] == "llms": w["w"] = "llms.txt"
        out.append(w)
    dur = float(subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[-1])
    return {"words": out, "audio": dur}

async def main():
    os.makedirs("build", exist_ok=True)
    res = [await one(i, s) for i, s in enumerate(SCENES)]
    t, tl, parts = 0.3, [], []
    for i, r in enumerate(res):
        dur = r["audio"] + GAP
        tl.append({"start": round(t, 3), "dur": round(dur, 3), "words": [{**w, "t": round(w["t"] + t, 3)} for w in r["words"]]})
        parts.append(f"build/s{i}.mp3"); t += dur
    total = t + 1.2
    open("timeline.js", "w").write("window.TL=" + json.dumps({"total": round(total, 3), "scenes": tl}) + ";\n")
    # assemble audio at exact offsets
    inputs, fl = [], []
    for i, (p, s) in enumerate(zip(parts, tl)):
        inputs += ["-i", p]; ms = int(s["start"] * 1000); fl.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
    fl.append("".join(f"[a{i}]" for i in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0,apad,atrim=0:{total},loudnorm=I=-16[o]")
    subprocess.run([FF, "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "build/voice.m4a"], check=True)
    print("total", round(total, 2), [round(s["dur"], 1) for s in tl])

asyncio.run(main())
