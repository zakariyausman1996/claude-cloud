#!/bin/bash
# assemble gtime.html from the shared template + scenes.js
T=../index/index.html
{ sed -n 1,96p $T | sed 's#<title>How Google Manages its Index</title>#<title>Google Search Timings</title>#'; cat scenes.js; sed -n 238,278p $T; } > gtime.html
python3 - <<'P'
p='gtime.html';s=open(p).read()
a=s.index("  if(si<LAST||lt<fw(LAST,'Follow',0,99)+.2){tagPill");b=s.index('\n',a);s=s[:a]+"  chromeTop(si,lt);"+s[b:]
a=s.index("function sourceBar");b=s.index("function watermark")
s=s[:a]+"function sourceBar(si,lt){if(endCard(si,lt))return;text('SOURCE',40,1268,17,K.blue,{w:800,ls:2});text('Gary Illyes, Google',135,1268,20,K.sub,{w:600})}\n"+s[b:]
s=s.replace("if(true){X.save();X.globalAlpha=Math.min(fin,fout);sourceBar(si,lt);X.restore()}","sourceBar(si,lt)")
open(p,'w').write(s)
P
