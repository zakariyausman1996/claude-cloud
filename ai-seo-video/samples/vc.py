import os,soundfile as sf,torch,torchaudio
os.environ["COQUI_TOS_AGREED"]="1"
def _load(p,*a,**k):
    d,sr=sf.read(p,dtype="float32",always_2d=True);return torch.from_numpy(d.T.copy()),sr
torchaudio.load=_load
from TTS.api import TTS
T="Google doesn't try to detect AI content. Ranking models favour natural, human-edited writing."
vc=TTS("voice_conversion_models/multilingual/multi-dataset/openvoice_v2")
vc.voice_conversion_to_file(source_wav="andrew.wav",target_wav="../clone/ref.wav",file_path="4_voice_conversion.wav")
x=TTS("tts_models/multilingual/multi-dataset/xtts_v2")
x.tts_to_file(text=T,speaker_wav="../clone/ref.wav",language="en",file_path="5_xtts_natural.wav",enable_text_splitting=False)
