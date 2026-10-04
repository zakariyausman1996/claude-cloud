"""Voiceover in Zakariya's cloned voice (local XTTS v2) -> build/voice.m4a + timeline.js"""
import os, re, json, subprocess, soundfile as sf, torch, torchaudio
os.environ["COQUI_TOS_AGREED"] = "1"
def _load(p, *a, **k):
    d, sr = sf.read(p, dtype="float32", always_2d=True); return torch.from_numpy(d.T.copy()), sr
torchaudio.load = _load
from TTS.api import TTS
FF = os.environ.get("FFMPEG", "ffmpeg")
src = open("voice.py").read()
SCENES = eval(src[src.index("SCENES = [") + 9:src.index("]\n# spoken") + 1])
GAP, SPEED, REF = 0.3, 1.1, "../clone/ref.wav"
SAY = [("hreflang", "aitch-ref-lang"), (" vs ", " versus "), ("L L M S dot text", "L-L-M-S dot text"), ("’", "'"), (" , meaning", ", meaning")]
def spoken(s):
    for a, b in SAY: s = s.replace(a, b)
    s = re.sub(r"\bAI\b", "A.I.", s); s = re.sub(r"\bLLM\b", "L.L.M.", s)
    return s.replace("PageRank", "Page Rank").replace("Gen Z", "Gen Zee").replace("HTML", "H.T.M.L.")
def dur(p): return float(subprocess.run([FF, "-i", p], capture_output=True, text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[-1])
def timings(text, d):
    ws = [w for w in text.replace("(", "").replace(")", "").split() if w not in (",",)]
    wt = [len(w) + 1 + (5 if w[-1] in ".?:" else 2 if w[-1] in ",;" else 0) for w in ws]
    tot, t, out = sum(wt), 0.08, []
    for w, k in zip(ws, wt):
        dd = (d - .16) * k / tot; out.append({"t": round(t, 3), "d": round(dd * .85, 3), "w": w.rstrip(".,:;?")}); t += dd
    return out
m = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
os.makedirs("build", exist_ok=True)
res = []
for i, s in enumerate(SCENES):
    raw, out = f"build/x{i}.wav", f"build/s{i}.wav"
    if not os.path.exists(out):
        m.tts_to_file(text=spoken(s), speaker_wav=REF, language="en", file_path=raw, speed=SPEED)
        subprocess.run([FF, "-v", "error", "-y", "-i", raw, "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse", out], check=True)
    d = dur(out); res.append({"words": timings(s, d), "audio": d}); print(i, round(d, 2), flush=True)
t, tl = 0.2, []
for r in res:
    dd = r["audio"] + GAP
    tl.append({"start": round(t, 3), "dur": round(dd, 3), "words": [{**w, "t": round(w["t"] + t, 3)} for w in r["words"]]}); t += dd
total = t + 1.2
open("timeline.js", "w").write("window.TL=" + json.dumps({"total": round(total, 3), "scenes": tl}) + ";\n")
inputs, fl = [], []
for i, s in enumerate(tl):
    inputs += ["-i", f"build/s{i}.wav"]; ms = int(s["start"] * 1000); fl.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
fl.append("".join(f"[a{i}]" for i in range(len(tl))) + f"amix=inputs={len(tl)}:normalize=0,apad,atrim=0:{total},loudnorm=I=-16[o]")
subprocess.run([FF, "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "build/voice.m4a"], check=True)
print("total", round(total, 2))
