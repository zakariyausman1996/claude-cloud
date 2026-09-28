"""Regenerate one scene's line with word timings -> build/line.mp3 + build/line.json"""
import asyncio, json, os, subprocess, sys, certifi
if os.path.exists("/root/.ccr/ca-bundle.crt"):
    certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
FF = os.environ.get("FFMPEG", "ffmpeg")
TEXT = sys.argv[1]
async def main():
    for k in range(6):
        try:
            words = []
            with open("build/line.mp3", "wb") as f:
                async for ch in edge_tts.Communicate(TEXT, "en-US-AndrewMultilingualNeural", rate="+34%", boundary="WordBoundary").stream():
                    if ch["type"] == "audio": f.write(ch["data"])
                    elif ch["type"] == "WordBoundary": words.append({"t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7, "w": ch["text"]})
            break
        except edge_tts.exceptions.NoAudioReceived:
            await asyncio.sleep(2 * (k + 1))
    dur = float(subprocess.run([FF, "-i", "build/line.mp3"], capture_output=True, text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[-1])
    json.dump({"audio": dur, "words": words}, open("build/line.json", "w"))
    print(dur, " ".join(f"{w['w']}@{w['t']:.2f}" for w in words))
asyncio.run(main())
