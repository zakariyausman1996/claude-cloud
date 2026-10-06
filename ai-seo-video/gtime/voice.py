"""Generate the voiceover per section with word timings -> build/voice.m4a + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-BrianNeural", "+6%", 0.4
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = [
"How long does Google take to crawl, index and show your page? Here's what Google says.",
"Gary Illyes from Google shared the real numbers at Search Central Live in Europe.",
"Crawling first. Google usually discovers a new URL in about 20 hours and refreshes a known one in about 30 days. At the slow end, both can take weeks, or never happen.",
"Sitemaps get processed in about a day, but low-quality ones can take up to 14 days, or never. A robots dot text change gets picked up in about 24 hours.",
"Crawl capacity takes 4 hours to 2 weeks to update, and crawl demand about 20 hours. But capacity can drop in seconds when your server struggles.",
"Indexing a page end to end takes about an hour and a half. Rendering takes seconds, but the queue can take hours. If quality is low, indexing can take months, or never happen.",
"Meta annotations take 45 to 90 minutes. Link annotations take minutes to 3 weeks. A canonical change takes 1 to 3 weeks, or months if your signals conflict.",
"Removing a page takes 1 to 3 weeks. A site move takes 1 to 3 months, and can stretch past a year. A small site can move in a few weeks.",
"Structured data updates take hours to 2 weeks. Images and videos take hours to days. Videos can take months when Google analyses them in depth.",
"Then serving. A removal in Search Console takes about 2 hours. New titles and snippets show up in 1 to 2 days. Lifting a manual action takes 1 to 2 weeks.",
"Recovering from a core update takes 3 to 6 months, sometimes until the next one. Core updates take 2 to 4 weeks to roll out, and spam updates 1 to 2 days. So if a change hasn't shown up yet, check the timeline before you worry. Follow for more."
]
# spoken token sequences -> caption text
MERGES = [(["robots", "dot", "text"], "robots.txt"), (["O", "A", "I", "SearchBot"], "OAI-SearchBot"), (["llms", "text"], "llms.txt")]

def merge(words):
    out, i = [], 0
    while i < len(words):
        for seq, cap in MERGES:
            n = len(seq)
            if [w["w"] for w in words[i:i + n]] == seq:
                last = words[i + n - 1]
                out.append({"t": words[i]["t"], "d": last["t"] + last["d"] - words[i]["t"], "w": cap}); i += n; break
        else:
            out.append(words[i]); i += 1
    return out

async def one(i, text, tries=5):
    for k in range(tries):
        try:
            return await _one(i, text)
        except edge_tts.exceptions.NoAudioReceived:
            if k == tries - 1: raise
            await asyncio.sleep(2 * (k + 1))

async def _one(i, text):
    words, path = [], f"build/s{i}.mp3"
    with open(path, "wb") as f:
        async for ch in edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary").stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7, "w": ch["text"]})
    dur = float(subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[-1])
    return {"words": merge(words), "audio": dur}

async def main():
    os.makedirs("build", exist_ok=True)
    res = [await one(i, s) for i, s in enumerate(SCENES)]
    t, tl = 0.2, []
    for r in res:
        dur = r["audio"] + GAP
        tl.append({"start": round(t, 3), "dur": round(dur, 3), "words": [{**w, "t": round(w["t"] + t, 3)} for w in r["words"]]})
        t += dur
    total = t + 1.2
    open("timeline.js", "w").write("window.TL=" + json.dumps({"total": round(total, 3), "scenes": tl}) + ";\n")
    inputs, fl = [], []
    for i, s in enumerate(tl):
        inputs += ["-i", f"build/s{i}.mp3"]; ms = int(s["start"] * 1000); fl.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
    fl.append("".join(f"[a{i}]" for i in range(len(tl))) + f"amix=inputs={len(tl)}:normalize=0,apad,atrim=0:{total},loudnorm=I=-16[o]")
    subprocess.run([FF, "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "build/voice.m4a"], check=True)
    print("total", round(total, 2), [round(s["dur"], 1) for s in tl])

asyncio.run(main())
