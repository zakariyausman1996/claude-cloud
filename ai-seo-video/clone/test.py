import os,time,certifi
os.environ["COQUI_TOS_AGREED"]="1"

import soundfile as sf,torch,torchaudio
def _load(p,*a,**k):
    d,sr=sf.read(p,dtype="float32",always_2d=True);return torch.from_numpy(d.T.copy()),sr
torchaudio.load=_load
from TTS.api import TTS
t=time.time();m=TTS("tts_models/multilingual/multi-dataset/xtts_v2");print("load",time.time()-t)
t=time.time();m.tts_to_file(text="Search Central Deep Dive 2026. Here are the notes, day by day.",speaker_wav="ref.wav",language="en",file_path="clone_test.wav");print("gen",time.time()-t)
