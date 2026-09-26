"""Generate the voiceover per section with word timings -> build/voice.m4a + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-AndrewMultilingualNeural", "+6%", 0.6
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = ['AI search comes with a lot of new words. Here are the ten most common ones, explained simply.', "Zero-click search. It's when someone searches, gets the answer right on the results page, and never visits a website.", 'AI Overviews and AI Mode. AI Overviews is the AI summary at the top of Google results. AI Mode is a separate tab where you have a full conversation with Google, and ask follow-up questions.',
 'GEO. Generative Engine Optimization: the work of getting your content cited inside AI answers. SEO gets you found. GEO gets you quoted.',
 'RAG. Retrieval-augmented generation. Instead of answering only from memory, the AI first looks up fresh pages, then writes its answer using them.',
 'Query fan-out. When you ask one question, the AI quietly runs several related searches at once, like reviews, prices, and options for your exact need.', "Chunking. AI doesn't quote your whole page. It pulls the one passage that answers the question. So clear sections that make sense on their own are easier to quote.",
 "Citation. The link in an AI answer that credits the site the information came from. It's how AI search sends visitors to you.",
 "Hallucination. When AI gives a confident answer that's simply wrong, like inventing a price for your product. Clear, up-to-date facts on your site help it get things right.",
 "Information gain. Adding something new that other pages don't already say, like original data, first-hand testing, or expert insight. It's what makes you worth quoting.", 'AI referral traffic. Visitors who click through to your site from AI tools like ChatGPT or Perplexity. You can see them in your analytics.', "That's ten AI search terms, explained. Follow for more simple SEO and GEO explainers."]
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
    t, tl = 0.4, []
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
