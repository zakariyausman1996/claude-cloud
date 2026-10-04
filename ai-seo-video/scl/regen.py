import os,subprocess,sys
exec(open("xvoice.py").read().split("m = TTS(")[0])
m = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
AF="silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-40dB:stop_silence=0.22,atempo=1.08"
for i in map(int,sys.argv[1:]):
    best=dur(f"build/s{i}.wav")
    for k in range(3):
        m.tts_to_file(text=spoken(SCENES[i]),speaker_wav=REF,language="en",file_path="build/try.wav",speed=SPEED)
        subprocess.run([FF,"-v","error","-y","-i","build/try.wav","-af",AF,"build/try2.wav"],check=True)
        d=dur("build/try2.wav");print(i,k,round(d,2),"best",round(best,2),flush=True)
        if d<best: best=d;os.replace("build/try.wav",f"build/x{i}.wav");os.replace("build/try2.wav",f"build/s{i}.wav")
