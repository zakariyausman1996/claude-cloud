"""Generate the voiceover per section with word timings -> build/voice.m4a + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-AndrewMultilingualNeural", "+6%", 0.6
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = [
 "You ask ChatGPT, Perplexity, or Google's AI a question. You don't get ten blue links anymore. You get one written answer, with a few sources cited. GEO, Generative Engine Optimization, is the work of getting your content into that answer. The term comes from a research paper by a team including Princeton researchers, published at KDD 2024.",
 "Here's how it works. First, the AI searches the web, often firing off several related searches at once. Google calls this query fan-out. Then it reads the pages it found, and writes an answer, citing some of them. So before an AI can quote you, it has to find you.",
 "That's why GEO and SEO share the same foundation. Google says its AI features rely on its core search ranking systems. OpenAI says that to appear in ChatGPT search, you shouldn't block its crawler, O A I SearchBot. Microsoft says Bingbot must crawl and index your page first. The difference is what happens next. In SEO, your whole page competes for a position. In GEO, the AI lifts individual sentences into its answer. So SEO asks: do I rank? GEO asks: am I quoted?",
 "Why does this matter? Pew Research tracked real Google searches from 900 US adults in March 2025. When an AI summary appeared, people clicked a regular result in 8% of visits, compared with 15% without one. Only 1% clicked a link inside the summary itself. Fewer clicks means being one of the cited sources matters more.",
 "So what gets you cited? The GEO researchers tested nine ways of rewriting content. Adding expert quotes made content about 41% more visible in AI answers. Adding statistics, about 33%. Citing sources, about 28%. The old SEO trick, keyword stuffing, scored below the unedited original. And lower-ranked sites gained the most. Citing sources lifted a fifth-ranked page by 115%. One caveat: these were controlled experiments, not guarantees.",
 "Here's what the platforms and the research recommend. One: be crawlable. Don't block Googlebot, Bingbot, or O A I SearchBot. Two: write clear sentences that make sense on their own when quoted. Three: be specific. Say 42 decibel dishwasher, not quiet dishwasher. Four: back up claims with statistics, quotes, and sources. Five: use headings, lists, and tables, and don't hide answers in tabs, PDFs, or images. Six: be original. Google says to create non-commodity content, with a unique point of view.",
 "Now, the myths. You don't need an llms text file. Google says it ignores them. You don't need special AI schema. And GEO doesn't replace SEO. Every AI platform starts with crawling and indexing.",
 "To measure GEO: Google Search Console includes AI feature traffic in its performance report. Bing Webmaster Tools now has an AI Performance report that shows when you're cited. And you can track ChatGPT referrals in your analytics. Be wary of any tool promising guaranteed AI rankings. GEO isn't a new game. SEO gets you found. GEO gets you quoted.",
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

async def one(i, text):
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
    t, tl = 0.4, []
    for r in res:
        dur = r["audio"] + GAP
        tl.append({"start": round(t, 3), "dur": round(dur, 3), "words": [{**w, "t": round(w["t"] + t, 3)} for w in r["words"]]})
        t += dur
    total = t + 1.5
    open("timeline.js", "w").write("window.TL=" + json.dumps({"total": round(total, 3), "scenes": tl}) + ";\n")
    inputs, fl = [], []
    for i, s in enumerate(tl):
        inputs += ["-i", f"build/s{i}.mp3"]; ms = int(s["start"] * 1000); fl.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
    fl.append("".join(f"[a{i}]" for i in range(len(tl))) + f"amix=inputs={len(tl)}:normalize=0,apad,atrim=0:{total},loudnorm=I=-16[o]")
    subprocess.run([FF, "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "build/voice.m4a"], check=True)
    print("total", round(total, 2), [round(s["dur"], 1) for s in tl])

asyncio.run(main())
