"""Generate the voiceover per section with word timings -> build/voice.m4a + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-BrianNeural", "+45%", 0.08
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = ["How long does Google take to crawl, index and show your page? Here's what Google said at Google Search Central Deep Dive 2026.", 'Crawling first. A new URL is usually discovered in about 20 hours. At worst, it takes weeks, or never happens.', 'A known URL gets refreshed in about 30 days. The slowest is weeks, or never.', 'Sitemaps are processed in about 24 hours, but low-quality ones can take up to 14 days, or never.', 'A robots dot text update gets picked up in about 24 hours, 25 at most.', 'Crawl capacity updates in 4 hours to 2 weeks, and can drop in seconds when your server struggles.', 'Crawl demand updates in about 20 hours. The slowest takes weeks to months.', 'Next, indexing. Rendering takes seconds, but the queue can take hours. Worst case, days to weeks.', 'Meta annotations take 45 to 90 minutes.', 'Link annotations take minutes to 3 weeks, sometimes months.', 'Indexing a page end to end takes about an hour and a half. With quality issues, it takes months, or never happens.', 'Removing a page takes 1 to 3 weeks.', 'A canonical change takes 1 to 3 weeks, or months if your signals conflict.', 'A site move takes 1 to 3 months. A small site can move in a few weeks.', 'Structured data updates take hours to 2 weeks.', 'Images take hours to days.', 'Videos take hours to days, or months when Google analyses them in depth.', 'Finally, serving. A removal in Search Console takes about 2 hours.', 'Snippets update in 1 to 2 days.', 'Titles also update in 1 to 2 days.', 'Text result images take 1 to 2 weeks.', 'Lifting a manual action takes 1 to 2 weeks, or much longer for dormant sites.', 'Recovering from a core update takes 3 to 6 months. Core updates roll out over 2 to 4 weeks.', 'Spam update changes show up in 1 to 2 weeks. Spam updates roll out in 1 to 2 days.', "Here's the full picture. So if a change hasn't shown up yet, check the timeline before you worry. Follow for more."]
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
