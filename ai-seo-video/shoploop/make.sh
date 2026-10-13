#!/bin/bash
# assemble shop.html from the shared template + scenes.js
T=../index/index.html
{ sed -n 1,96p $T | sed 's#<title>How Google Manages its Index</title>#<title>AI Shopping Loop</title>#'; cat scenes.js; sed -n 238,278p $T; } > shop.html
python3 - <<'P'
p='shop.html';s=open(p).read()
a=s.index("  if(si<LAST||lt<fw(LAST,'Follow',0,99)+.2){tagPill");b=s.index('\n',a);s=s[:a]+"  chromeTop(si,lt);"+s[b:]
a=s.index("function sourceBar");b=s.index("function watermark")
s=s[:a]+"function sourceBar(){}\n"+s[b:]   # each number carries its own source label
s=s.replace("watermark(si<LAST||lt<fw(LAST,'Follow',0,99)+.2?1:0)","watermark(si<LAST?1:0)")
a="x=X;const dx=(1-fin)*140-(1-fout)*140;"
assert a in s; s=s.replace(a,"x=X;const dx=NOSLIDE[si]?0:(1-fin)*140-(1-fout)*140;")
open(p,'w').write(s)
P
