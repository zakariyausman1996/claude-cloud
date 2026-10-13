"""Generate the voiceover per section with word timings -> build/voice.m4a + timeline.js"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VOICE, RATE, GAP = "en-US-BrianNeural", "+35%", 0.25
FF = os.environ.get("FFMPEG", "ffmpeg")
SCENES = ['Do. you know if your product makes the AI shortlist?', '39% of US shoppers already use AI to shop. And when they do, AI hands them a short list of products.', "Most don't look any further. 88% accepted the shortlist as it was, and 93% of ChatGPT shopping sessions never clicked through to a website.", "Being on the list isn't enough. 74% picked the top product. Rank third or lower, and you get just 10%. So how does AI decide who makes the list?", "It looks at your brand more than your links. YouTube videos and brand mentions across the web track AI visibility far more closely than domain authority. And 59% of AI shoppers trust it more when they've seen the brand before.", 'Most of those signals come from your customers: their reviews, their videos, their searches for your brand. Kevin Indig turns this into a five-stage loop. Each stage creates signals that put you on the next shortlist.', 'Before customers can talk about you, AI has to be able to read you. So stage one: give AI clean product data. Fill in every feed field, collect verified reviews, and answer the real questions buyers ask.', 'Since fewer people click through, stage two is making every visit count. Product quizzes convert about 5% of people who take them, almost three times the usual rate. And the answers tell you what buyers really want.', 'Once they buy, the unboxing is your chance to get talked about. 19% of shoppers say gift-like packaging makes them post photos or videos, and those videos are exactly the mentions AI looks at. Ask for reviews one to two weeks after delivery too.', 'Stage four: bring them back. Repeat customers are just 21% of customers but 44% of revenue, and every repeat purchase is another good experience. Send reorder reminders, since half of second purchases happen within 30 days.', "Stage five: become the brand people ask for by name. When shoppers name your brand in the question, AI's answer narrows to you. Ridge gets about 70% of its sales from direct, organic and branded search.", 'And that brings the loop back to the start: more reviews, videos and brand searches put you on the next shortlist.', "The catch: last-click reports don't credit any of this, so the loop is easy to miss and easy to underfund.", "Quizzes, bots and email flows are easy for competitors to copy, so just keep up. Reviews, creators, community and brand recall take time, and that's what lasts.", "In AI shopping, the experience after the sale decides whether you're on the next shortlist.", 'Follow for more.']
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
