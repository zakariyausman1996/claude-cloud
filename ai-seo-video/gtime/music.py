"""Soft ambient pad + sparse plucks, generated from scratch -> build/music.wav"""
import sys, numpy as np, soundfile as sf
SR, DUR = 48000, float(sys.argv[1]) if len(sys.argv) > 1 else 100
t = np.arange(int(SR * DUR)) / SR
midi = lambda n: 440 * 2 ** ((n - 69) / 12)
# Cmaj9 - Am9 - Fmaj9 - G6 (calm, warm)
CH = [[48, 55, 64, 71, 74], [45, 52, 60, 67, 71], [41, 48, 57, 64, 67], [43, 50, 59, 64, 69]]
BAR = 8.0
out = np.zeros((len(t), 2))
rng = np.random.default_rng(7)
for k in range(int(DUR // BAR) + 2):
    ch = CH[k % 4]; s0 = k * BAR - 1.5; s1 = s0 + BAR + 3
    i0, i1 = max(0, int(s0 * SR)), min(len(t), int(s1 * SR))
    if i0 >= i1: continue
    tt = t[i0:i1] - s0; L = s1 - s0
    env = np.clip(tt / 2.5, 0, 1) * np.clip((L - tt) / 3, 0, 1)
    env = env ** 1.5
    for j, n in enumerate(ch):
        f = midi(n)
        for det, pan in ((-0.12, .3), (0.12, .7)):
            ph = rng.uniform(0, 6.28)
            w = np.sin(2 * np.pi * (f + det) * tt + ph) + .18 * np.sin(2 * np.pi * 2 * (f + det) * tt + ph)
            g = .05 / (1 + j * .35)
            out[i0:i1, 0] += w * env * g * (1 - pan); out[i0:i1, 1] += w * env * g * pan
    # sparse soft plucks from the chord, an octave up
    for b in range(4):
        if rng.random() < .55:
            st = s0 + 1.5 + b * 2 + rng.uniform(0, .3); n = ch[rng.integers(2, 5)] + 12
            j0 = int(st * SR); j1 = min(len(t), j0 + int(2.5 * SR))
            if j0 < 0 or j0 >= len(t): continue
            tt2 = (np.arange(j1 - j0)) / SR
            p = np.sin(2 * np.pi * midi(n) * tt2) * np.exp(-tt2 * 2.2) * np.clip(tt2 / .01, 0, 1) * .045
            pn = rng.uniform(.3, .7); out[j0:j1, 0] += p * (1 - pn); out[j0:j1, 1] += p * pn
# simple echo for space
d = int(.37 * SR)
for r in range(3): out[d * (r + 1):] += out[:-d * (r + 1)] * (.25 / (r + 1))
fade = np.clip(t / 2, 0, 1) * np.clip((DUR - t) / 3, 0, 1)
out *= fade[:, None]
out /= np.abs(out).max() * 1.12
sf.write("build/music.wav", out.astype(np.float32), SR)
print("music", DUR)
