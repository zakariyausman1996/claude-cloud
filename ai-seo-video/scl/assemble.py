"""Build timeline.js + build/voice.m4a from the cloned-voice clips build/s{i}.wav.
Caption words come from the script; their timing comes from a Whisper transcript of each clip."""
import os, re, json, subprocess, difflib
from faster_whisper import WhisperModel
FF = os.environ.get("FFMPEG", "ffmpeg")
src = open("voice.py").read()
SCENES = eval(src[src.index("SCENES = [") + 9:src.index("]\n# spoken") + 1])
GAP = 0.2
norm = lambda s: re.sub(r"[^a-z0-9 ]", " ", s.lower()).split()
def dur(p): return float(subprocess.run([FF, "-i", p], capture_output=True, text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[-1])

W = WhisperModel("base.en", device="cpu", compute_type="int8")
def words_for(i):
    d = dur(f"build/s{i}.wav")
    disp = [w for w in SCENES[i].replace("(", "").replace(")", "").split() if w != ","]
    st = [(k, tok) for k, w in enumerate(disp) for tok in norm(w)]
    segs, _ = W.transcribe(f"build/s{i}.wav", word_timestamps=True, language="en")
    hw = [(w.start, w.end, tok) for s in segs for w in s.words for tok in norm(w.word)]
    t0 = [None] * len(disp)
    sm = difflib.SequenceMatcher(None, [t for _, t in st], [t for _, _, t in hw], autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for j in range(n):
            k = st[a + j][0]
            if t0[k] is None: t0[k] = hw[b + j][0]
    # fill gaps by interpolating on word length
    known = [(-1, 0.05)] + [(k, t) for k, t in enumerate(t0) if t is not None] + [(len(disp), d)]
    for (ka, ta), (kb, tb) in zip(known, known[1:]):
        if kb - ka > 1:
            idx = ([ka] if ka >= 0 else []) + list(range(ka + 1, kb))
            wts = [len(disp[k]) + 1 for k in idx]
            acc = 0
            for k, wgt in zip(idx, wts):
                if t0[k] is None: t0[k] = ta + (tb - ta) * acc / sum(wts)
                acc += wgt
    for k in range(1, len(t0)):
        t0[k] = max(t0[k], t0[k - 1] + 0.04)
    out = []
    for k, w in enumerate(disp):
        nxt = t0[k + 1] if k + 1 < len(disp) else d
        out.append({"t": round(t0[k], 3), "d": round(max(0.08, min(nxt - t0[k], 1.2)), 3), "w": w.rstrip(".,:;?"), **({"e": 1} if w[-1] in ".?:" else {})})
    return out, d

t, tl = 0.2, []
for i in range(len(SCENES)):
    ws, d = words_for(i)
    tl.append({"start": round(t, 3), "dur": round(d + GAP, 3), "words": [{**w, "t": round(w["t"] + t, 3)} for w in ws]})
    t += d + GAP
total = t + 1.2
open("timeline.js", "w").write("window.TL=" + json.dumps({"total": round(total, 3), "scenes": tl}) + ";\n")
inputs, fl = [], []
for i, s in enumerate(tl):
    inputs += ["-i", f"build/s{i}.wav"]; ms = int(s["start"] * 1000); fl.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
fl.append("".join(f"[a{i}]" for i in range(len(tl))) + f"amix=inputs={len(tl)}:normalize=0,apad,atrim=0:{total},loudnorm=I=-16[o]")
subprocess.run([FF, "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "build/voice.m4a"], check=True)
print("total", round(total, 2))
