#!/bin/bash
# assemble chart.html: shared primitives + v1 helpers (parts.js) + build.js + shared captions/frame + render
T=../index/index.html
{ sed -n 1,96p $T | sed 's#<title>How Google Manages its Index</title>#<title>Google Search Timings</title>#'
  cat parts.js build.js
  sed -n 238,278p $T | sed '/^<\/script><\/body><\/html>$/d'
  cat <<'R'
function render(T){T_NOW=T;x=X;X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;bgDraw();
  x=O;O.setTransform(1,0,0,1,0,0);O.globalAlpha=1;O.clearRect(0,0,W,H);drawDesign(T);
  x=X;X.drawImage(off,0,SY,W,SH,DX,DY,DW,DH);captions(T);rr(40,1222,1000,2,1,'#e2e8f0');const e=T>tFollow;watermark(e?0:1);
  if(!e){text('SOURCE',40,1268,17,K.blue,{w:800,ls:2});text('Gary Illyes, Google',135,1268,20,K.sub,{w:600})}}
</script></body></html>
R
} > chart.html
