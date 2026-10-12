#!/bin/bash
# assemble decay.html from the shared template + scenes.js
T=../index/index.html
{ sed -n 1,96p $T | sed 's#<title>How Google Manages its Index</title>#<title>AI Citation Half-Life</title>#'; cat scenes.js; sed -n 238,278p $T; } > decay.html
python3 - <<'P'
p='decay.html';s=open(p).read()
a=s.index("  if(si<LAST||lt<fw(LAST,'Follow',0,99)+.2){tagPill");b=s.index('\n',a);s=s[:a]+"  chromeTop(si,lt);"+s[b:]
a=s.index("function sourceBar");b=s.index("function watermark")
s=s[:a]+"function sourceBar(si,lt){if(si!==2)return;text('SOURCE',40,1268,17,K.blue,{w:800,ls:2});text('Profound',135,1268,20,K.sub,{w:600})}\n"+s[b:]
s=s.replace("watermark(si<LAST||lt<fw(LAST,'Follow',0,99)+.2?1:0)","watermark(si<LAST?1:0)")
open(p,'w').write(s)
P
