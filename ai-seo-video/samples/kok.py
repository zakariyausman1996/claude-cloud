from kokoro import KPipeline
import soundfile as sf, numpy as np
T="Google doesn't try to detect AI content. Ranking models favour natural, human-edited writing."
p=KPipeline(lang_code='a')
a=np.concatenate([x[2] for x in p(T,voice='am_michael',speed=1.05)])
sf.write('3_kokoro.wav',a,24000)
