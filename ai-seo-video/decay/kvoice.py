"""Voiceover with Kokoro (local) + word timings -> build/voice.m4a + timeline.js"""
import os, json, subprocess, numpy as np, soundfile as sf
from kokoro import KPipeline
FF = os.environ.get("FFMPEG", "ffmpeg")
src = open("voice.py").read()
SCENES = eval(src[src.index("SCENES = ") + 9:src.index("\n# spoken")])
VOICE, SPEED, GAP, SR = "am_michael", 1.22, 0.25, 24000
p = KPipeline(lang_code="a")
os.makedirs("build", exist_ok=True)
t, tl, mix = 0.2, [], []
for i, s in enumerate(SCENES):
    aud, words, off = [], [], 0.0
    for r in p(s, voice=VOICE, speed=SPEED):
        a = r.audio.numpy() if hasattr(r.audio, "numpy") else np.asarray(r.audio)
        for tk in (r.tokens or []):
            if tk.start_ts is None or not tk.text.strip() or not any(ch.isalnum() for ch in tk.text): continue
            words.append({"t": round(t + off + tk.start_ts, 3), "d": round(max(.05, (tk.end_ts or tk.start_ts + .2) - tk.start_ts), 3), "w": tk.text})
        aud.append(a); off += len(a) / SR
    a = np.concatenate(aud)
    # trim trailing silence
    nz = np.where(np.abs(a) > 0.01)[0]; a = a[: nz[-1] + int(.08 * SR)] if len(nz) else a
    sf.write(f"build/s{i}.wav", a, SR)
    d = len(a) / SR
    tl.append({"start": round(t, 3), "dur": round(d + GAP, 3), "words": words}); t += d + GAP
    print(i, round(d, 2), len(words), flush=True)
total = t + 1.2
open("timeline.js", "w").write("window.TL=" + json.dumps({"total": round(total, 3), "scenes": tl}) + ";\n")
inputs, fl = [], []
for i, sc in enumerate(tl):
    inputs += ["-i", f"build/s{i}.wav"]; ms = int(sc["start"] * 1000); fl.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
fl.append("".join(f"[a{i}]" for i in range(len(tl))) + f"amix=inputs={len(tl)}:normalize=0,apad,atrim=0:{total},loudnorm=I=-16[o]")
subprocess.run([FF, "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "build/voice.m4a"], check=True)
print("total", round(total, 2))
