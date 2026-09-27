"""Regenerate only the intro line (scene 0) with word timings -> build/intro.mp3 + build/intro.json"""
import asyncio, json, os, subprocess, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
FF = os.environ.get("FFMPEG", "ffmpeg")
TEXT = "10 AI search terms every marketer should know."
async def main():
    for k in range(6):
        try:
            words = []
            with open("build/intro.mp3", "wb") as f:
                async for ch in edge_tts.Communicate(TEXT, "en-US-AndrewMultilingualNeural", rate="+20%", boundary="WordBoundary").stream():
                    if ch["type"] == "audio": f.write(ch["data"])
                    elif ch["type"] == "WordBoundary": words.append({"t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7, "w": ch["text"]})
            break
        except edge_tts.exceptions.NoAudioReceived:
            await asyncio.sleep(2 * (k + 1))
    dur = float(subprocess.run([FF, "-i", "build/intro.mp3"], capture_output=True, text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[-1])
    json.dump({"audio": dur, "words": words}, open("build/intro.json", "w"))
    print(dur, [(w["w"], round(w["t"], 2)) for w in words])
asyncio.run(main())
