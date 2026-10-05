import asyncio,certifi
certifi.where=lambda:"/root/.ccr/ca-bundle.crt"
import edge_tts
T="Google doesn't try to detect AI content. Ranking models favour natural, human-edited writing."
async def m():
    for v,f in [("en-US-BrianNeural","1_brian.mp3"),("en-US-AndrewNeural","2_andrew.mp3")]:
        await edge_tts.Communicate(T,v,rate="+5%").save(f)
asyncio.run(m())
