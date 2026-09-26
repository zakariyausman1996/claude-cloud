"""Generate the voiceover per scene with word timings -> voice.mp3 + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-AndrewMultilingualNeural", "+10%", 0.5
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = [
 "This is your Search Update Roundup. Five updates, from a new spam update to changes in Europe.",
 "One. Google released the September 2026 spam update on September 24th. It's global, in all languages, and could take up to two weeks to roll out. Earlier spam updates this year took a day or two. John Mueller said this one would take longer. It's the fourth spam update of 2026.",
 "Two. In Europe, Google's aggregator and supplier units now support local business searches, like restaurants and salons. Directories can show listings by sending a local data feed. Businesses can appear without one. It's part of Google's DMA compliance.",
 "Three. Also in Europe, free product listings and product carousels are gone. Trackers saw carousels drop ninety to a hundred percent. Google's Ginny Marvin confirmed it's because of the DMA ruling.",
 "Four. Online stores must now label adult products, using the adult attribute in Merchant Center, or has adult consideration markup. It applies to Shopping features, and doesn't affect organic search.",
 "Five. Google Images now suggests AI-made collections when you save an image, marked with a Gemini icon. Spotted by Damien Andell, it's not widely confirmed yet.",
 "That's your Search Update Roundup. Sources are in the caption. See you next time.",
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
