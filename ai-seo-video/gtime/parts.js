// ---------- How long Google Search changes take ----------
const LAST=S.length-1,BLUE=K.blue,GREEN=K.green,AMB=K.amber;
function fw(i,w,n=0,fb=0){const ws=Array.isArray(w)?w:[w];for(const q of ws){const m=S[i].words.filter(o=>o.w.toLowerCase().replace(/[^a-z0-9.'-]/g,'')===q.toLowerCase());if(m[n]||m[0])return (m[n]||m[0]).t-S[i].start}return fb}
function clockFace(cx,cy,r,p,col){x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle='#e5e7eb';x.stroke();
  x.strokeStyle=col;x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*p);x.stroke();x.strokeStyle=K.ink;x.lineWidth=6;x.lineCap='round';
  const a=-Math.PI/2+Math.PI*2*p*6;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*r*.6,cy+Math.sin(a)*r*.6);x.stroke();x.restore()}

// ----- time scale: 1 minute .. 1 year (log), then "never"
const HR=1,DAY=24,WK=168,MON=720,YR=8760,NEVER=1e9;
const AX0=110,AX1=860,AXN=990;
function TX(h){if(h>=NEVER)return AXN;h=Math.max(h,1/60);if(h>YR)return Math.min(AX1+20,AX1+(Math.log10(h)-Math.log10(YR))*60);
  return AX0+(Math.log10(h)-Math.log10(1/60))/(Math.log10(YR)-Math.log10(1/60))*(AX1-AX0)}
const TICKS=[[1/60,'min'],[HR,'hour'],[DAY,'day'],[WK,'week'],[MON,'month'],[YR,'year']];
function axis(y0,y1,a){if(a<=0)return;x.save();x.globalAlpha*=a;
  TICKS.forEach(([h,l])=>{const px=TX(h);x.save();x.setLineDash([4,8]);x.strokeStyle='#d5dbe3';x.lineWidth=2;x.beginPath();x.moveTo(px,y0+18);x.lineTo(px,y1);x.stroke();x.restore();text(l,px,y0,22,K.sub,{al:'center',w:700})});
  x.save();const g=x.createLinearGradient(AX1+40,0,AXN+20,0);g.addColorStop(0,'rgba(220,38,38,0)');g.addColorStop(1,'rgba(220,38,38,.07)');x.fillStyle=g;x.fillRect(AX1+40,y0+18,AXN+30-AX1-40,y1-y0-18);x.restore();
  text('never',AXN,y0,22,K.red,{al:'center',w:800});x.restore()}

// stage icons for the intro
function stage(kind,cx,cy,col,a,lit){if(a<=0)return;x.save();x.globalAlpha*=a;x.translate(cx,cy);const k=.85+.15*back(a);x.scale(k,k);
  rr(-130,-120,260,240,30,lit?'#fff':'#f8fafc',lit?col:K.line,lit?5:2,true);const c=lit?col:K.mute;x.fillStyle=c;x.strokeStyle=c;x.lineWidth=6;
  if(kind===0){rr(-40,-70,80,62,18,null,c,6);x.beginPath();x.arc(-14,-40,7,0,7);x.arc(14,-40,7,0,7);x.fill();x.beginPath();x.moveTo(0,-70);x.lineTo(0,-88);x.stroke()}
  if(kind===1){for(let j=0;j<3;j++){x.beginPath();x.ellipse(0,-78+j*26,42,13,0,0,7);x.fillStyle=j?'#fff':c;x.fill();x.stroke()}}
  if(kind===2){for(let j=0;j<3;j++){rr(-46,-88+j*28,92,22,6,null,c,5);x.beginPath();x.arc(28,-77+j*28,4,0,7);x.fill()}}
  text(['Crawling','Indexing','Serving'][kind],0,60,32,lit?K.ink:K.sub,{al:'center',w:800});x.restore()}
