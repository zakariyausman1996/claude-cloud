import os,soundfile as sf,torch,torchaudio
os.environ["COQUI_TOS_AGREED"]="1"
def _load(p,*a,**k):
    d,sr=sf.read(p,dtype="float32",always_2d=True);return torch.from_numpy(d.T.copy()),sr
torchaudio.load=_load
from TTS.api import TTS
from faster_whisper import WhisperModel
W=WhisperModel('base.en',device='cpu',compute_type='int8')
T="Google doesn't try to detect AI content. Ranking models favour natural, human-edited writing."
x=TTS("tts_models/multilingual/multi-dataset/xtts_v2")
for k in range(5):
    x.tts_to_file(text=T,speaker_wav="../clone/ref.wav",language="en",file_path="5_xtts_natural.wav",enable_text_splitting=False)
    s,_=W.transcribe("5_xtts_natural.wav");t=" ".join(z.text for z in s);print(k,t,flush=True)
    if t.strip().endswith("writing."): break
