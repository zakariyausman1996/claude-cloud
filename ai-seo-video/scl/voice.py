"""Generate the voiceover per section with word timings -> build/voice.m4a + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-AndrewMultilingualNeural", "+12%", 0.35
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = [
"Search Central Live Deep Dive 2026. Here are the notes, day by day.",
"Day 1. AI search is just search. Same bot everywhere. AI Overviews and AI Mode use Googlebot and classic Search. Gemini is not Search and may use a different crawler.",
"Google doesn’t try to detect AI content. But ranking models are trained on human content and favour natural, human-edited writing.",
"One in six queries is multimodal. Gen Z searches with images and expects text answers.",
"Skip L L M S dot text (and cats dot text). Google Search doesn’t use it.",
"Skip Markdown copies of pages for bots. Duplicate content, and a cloaking risk if implemented wrong.",
"Stop chasing crawl frequency. Crawling more doesn’t make you rank better.",
"A spammy past slows your crawl. Historically spammy sites get deprioritised in the crawl scheduler.",
"Two crawls, two goals. Gemini training crawls for token volume over quality. Search crawls for quality and freshness.",
"Day 2. Raw HTML or it didn’t happen. Google finds your centerpiece. HTML is parsed into a DOM tree, then the main content is separated from header, sidebar and footer.",
"Want to be cited? Put it in the raw HTML. Or render it server-side. Many AI crawlers don’t render JavaScript at all.",
"Chunk your content for AI is a myth. Gemini’s context window is around a million tokens. Tiny chunks aren’t needed.",
"Schema is still worth it. But it is not fed directly into AI context, and extra markup isn’t penalised.",
"Alt text and nearby text rank images. Descriptive alt text and the surrounding text are both used for ranking images.",
"No watch page, no video indexing. Each video needs its own page with the video above the fold. Use VideoObject markup and video sitemaps.",
"AI-generated images are fine. Check them for errors like garbled text first.",
"Content sets the language, not hreflang. Google ignores hreflang and URL language codes here, and assigns one language per page.",
"Machine translation isn’t a bad signal. It’s a business decision, and not a bad quality signal if done right.",
"SpamBrain catches five times more spam. Manual actions likely train it, which may explain slow recovery after a lifted penalty.",
"Day 3. Commodity content loses. Every query gets silently rewritten. The synonym system is one of the most important parts of ranking. Typos and plurals get fixed too.",
"Fan-out is just more searches. AI Overviews and AI Mode have an LLM generate extra queries. Each runs through normal Search.",
"Low quality? Not even retrieved. Higher-quality URLs are more likely to be retrieved at all, and quality is reused in ranking.",
"Quality is one signal among hundreds. Though, one of the most important.",
"Quality , meaning effort, originality, skill, accuracy. How much of each a human put into the content. The Search Quality Rater Guidelines help.",
"Top-10 lists lose. Commodity content anyone could write is the opposite of quality.",
"Rater guidelines aren’t ranking factors. Raters evaluate proposed changes: about 800,000 quality tests in 2023, about 5,000 launches a year.",
"PageRank is barely used any more. And the spam system is separate from quality ranking.",
"Judge quality, not AI vs human. The target: LLM-written top 10 reviews of products the author never used.",
"AI Overviews ignore structured data. AI Overviews and AI Mode work from normal indexed text, today.",
"Those are the notes. Follow for more."
]
# spoken token sequences -> caption text
MERGES = [(["O", "A", "I", "SearchBot"], "OAI-SearchBot"), (["llms", "text"], "llms.txt")]

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
