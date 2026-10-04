import sys,json,re
from faster_whisper import WhisperModel
m=WhisperModel("base.en",device="cpu",compute_type="int8")
src=open("voice.py").read();S=eval(src[src.index("SCENES = [")+9:src.index("]\n# spoken")+1])
n=lambda s:re.sub(r"[^a-z0-9 ]","",s.lower().replace("-"," ")).split()
import difflib
out={}
for i in (map(int,sys.argv[1:]) if len(sys.argv)>1 else range(30)):
    segs,_=m.transcribe(f"build/s{i}.wav",word_timestamps=True,language="en")
    ws=[w for s in segs for w in s.words];txt=" ".join(w.word.strip() for w in ws)
    r=difflib.SequenceMatcher(None,n(S[i]),n(txt)).ratio()
    out[i]=[{"t":round(w.start,3),"d":round(w.end-w.start,3),"w":w.word.strip()} for w in ws]
    print(i,round(r,2),"|",txt if r<.85 else "",flush=True)
json.dump(out,open("build/asr.json","w"))
