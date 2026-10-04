import os,subprocess,sys,json,re,difflib
exec(open("xvoice.py").read().split("m = TTS(")[0])
from faster_whisper import WhisperModel
W=WhisperModel("base.en",device="cpu",compute_type="int8")
m = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
AF="silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-40dB:stop_silence=0.22,atempo=1.08"
n=lambda s:re.sub(r"[^a-z0-9 ]","",s.lower().replace("-"," ")).split()
def score(p,i):
    segs,_=W.transcribe(p,language="en");t=" ".join(s.text for s in segs)
    return difflib.SequenceMatcher(None,n(SCENES[i]),n(t)).ratio(),t
for i in map(int,sys.argv[1:]):
    best=0
    for k in range(4):
        m.tts_to_file(text=spoken(SCENES[i]),speaker_wav=REF,language="en",file_path="build/try.wav",speed=SPEED,temperature=0.55)
        subprocess.run([FF,"-v","error","-y","-i","build/try.wav","-af",AF,"build/try2.wav"],check=True)
        r,t=score("build/try2.wav",i);print(i,k,round(r,2),round(best,2),"|",t,flush=True)
        if r>best: best=r;os.replace("build/try2.wav",f"build/s{i}.wav")
        if best>=.9: break
