// ---------- How long Google Search changes take ----------
const LAST=S.length-1,BLUE=K.blue,GREEN=K.green,AMB=K.amber;
function fw(i,w,n=0,fb=0){const ws=Array.isArray(w)?w:[w];for(const q of ws){const m=S[i].words.filter(o=>o.w.toLowerCase().replace(/[^a-z0-9.'-]/g,'')===q.toLowerCase());if(m[n]||m[0])return (m[n]||m[0]).t-S[i].start}return fb}
function clockFace(cx,cy,r,p,col){x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle='#e5e7eb';x.stroke();
  x.strokeStyle=col;x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*p);x.stroke();x.strokeStyle=K.ink;x.lineWidth=6;x.lineCap='round';
  const a=-Math.PI/2+Math.PI*2*p*6;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*r*.6,cy+Math.sin(a)*r*.6);x.stroke();x.restore()}
const TAG=['GOOGLE SEARCH','GOOGLE SEARCH','CRAWLING','CRAWLING','CRAWLING','INDEXING','INDEXING','INDEXING','INDEXING','SERVING','SERVING'];
const COL={CRAWLING:BLUE,INDEXING:GREEN,SERVING:AMB,'GOOGLE SEARCH':BLUE};
const HEADS=['How long does Google take to crawl, index and show your page?','Gary Illyes shared Google’s own numbers',
 'Crawling: new and known pages','Crawling: sitemaps and robots.txt','Crawling: capacity and demand',
 'Indexing: end to end','Indexing: signals Google attaches','Indexing: big changes','Indexing: rich results and media',
 'Serving: what users see','Serving: algorithm updates'];
function head(i,t){const big=i===0;let sz=big?66:58,lines=wrap(HEADS[i],sz,800,900);if(lines.length>2){sz=50;lines=wrap(HEADS[i],sz,800,900)}const lh=sz*1.16;
  lines.forEach((l,j)=>{const k=eo(pr(t,.05+j*.1,.4));text(l,90,430+j*lh+(1-k)*24,sz,K.ink,{a:k,w:800,max:3000})});return 430+lines.length*lh}

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
// one table row as a time bar
function row(r,y,t,col,a=1){const [lab,typ,slow,lo,hi,sh,cue]=r;const k=eo(pr(t,cue-.25,.4))*a;if(k<=0)return;x.save();x.globalAlpha*=k;x.translate((1-k)*-40,0);
  text(lab,90,y,34,K.ink,{w:800,max:640});text(typ,990,y,32,col,{al:'right',w:800,max:3000});
  const ty=y+36;rr(AX0-20,ty,AXN-AX0+40,24,12,'#eef2f6');
  const p1=eio(pr(t,cue,.6)),p2=eio(pr(t,cue+.55,.9));
  const x0=TX(lo),x1=TX(hi),xs=TX(sh);
  if(p2>0&&sh>hi){const e=lerp(x1,xs,p2);x.save();const g=x.createLinearGradient(x1,0,xs,0);g.addColorStop(0,col);g.addColorStop(1,sh>=NEVER?'rgba(220,38,38,.55)':K.red);x.globalAlpha*=.35;rr(x1,ty,Math.max(0,e-x1),24,12,g);x.restore();
    if(p2>.95){x.save();x.beginPath();x.arc(xs,ty+12,12,0,7);x.fillStyle=sh>=NEVER?K.red:'#f87171';x.fill();x.restore()}}
  const w=Math.max(24,(x1-x0)*p1+24);rr(x0-12,ty,w,24,12,col);
  text('Slowest: '+slow,990,y+86,24,K.sub,{al:'right',w:600,a:p2,max:3000});x.restore()}
function rowsBlock(i,t,R,col,y0=640,gap=170){const ax=eo(pr(t,.3,.4));axis(y0,y0+40+R.length*gap,ax);R.forEach((r,j)=>row(r,y0+60+j*gap,t,col));return y0+60+R.length*gap}
function note(s,y,t,t0,col){const k=eo(pr(t,t0,.45));if(k<=0)return;x.save();x.globalAlpha*=k;x.translate(0,(1-k)*24);const L=wrap(s,28,700,800);const h=L.length*38+44;
  rr(90,y,900,h,22,'#fff',K.line,2,true);rr(90,y,10,h,5,col);L.forEach((l,j)=>text(l,130,y+42+j*38,28,K.ink,{w:700,max:3000}));x.restore()}

// stage icons for the intro
function stage(kind,cx,cy,col,a,lit){if(a<=0)return;x.save();x.globalAlpha*=a;x.translate(cx,cy);const k=.85+.15*back(a);x.scale(k,k);
  rr(-130,-120,260,240,30,lit?'#fff':'#f8fafc',lit?col:K.line,lit?5:2,true);const c=lit?col:K.mute;x.fillStyle=c;x.strokeStyle=c;x.lineWidth=6;
  if(kind===0){rr(-40,-70,80,62,18,null,c,6);x.beginPath();x.arc(-14,-40,7,0,7);x.arc(14,-40,7,0,7);x.fill();x.beginPath();x.moveTo(0,-70);x.lineTo(0,-88);x.stroke()}
  if(kind===1){for(let j=0;j<3;j++){x.beginPath();x.ellipse(0,-78+j*26,42,13,0,0,7);x.fillStyle=j?'#fff':c;x.fill();x.stroke()}}
  if(kind===2){for(let j=0;j<3;j++){rr(-46,-88+j*28,92,22,6,null,c,5);x.beginPath();x.arc(28,-77+j*28,4,0,7);x.fill()}}
  text(['Crawling','Indexing','Serving'][kind],0,60,32,lit?K.ink:K.sub,{al:'center',w:800});x.restore()}

const D={
 s2:[['Discovery (new URL)','~20 hours','Weeks to never',20,20,NEVER,['discovers']],['Refresh (known URL)','~30 days','Weeks to never',MON,MON,NEVER,['refreshes']]],
 s3:[['Sitemap processing','~24 hours','Up to 14 days, or never (quality)',24,24,NEVER,['Sitemaps']],['robots.txt update','~24 hours','25 hours',24,24,25,['robots.txt','robots']]],
 s4:[['Crawl capacity update','4 hours to 1–2 weeks','1–3 weeks (in recovery)',4,2*WK,3*WK,['capacity']],['Crawl demand update','~20 hours','Weeks to months',20,20,3*MON,['demand']]],
 s5:[['Indexing (end to end)','~1.5 hours','Months or never (quality)',1.5,1.5,NEVER,['Indexing']],['Rendering','Seconds to render, hours in the queue','Days to weeks',.002,5,3*WK,['Rendering']]],
 s6:[['Meta annotations','45–90 minutes','1–4 days',.75,1.5,4*DAY,['Meta']],['Link annotations','Minutes to 1–3 weeks','Months',.05,3*WK,3*MON,['Link']],['Canonicalisation change','1–3 weeks','Months (conflicting signals)',WK,3*WK,3*MON,['canonical']]],
 s7:[['Removal','1–3 weeks','Months',WK,3*WK,3*MON,['Removing']],['Site move','1–3 months','6 months to 1 year+',MON,3*MON,1.4*YR,['site']]],
 s8:[['Structured data updates','Hours to 1–2 weeks','Weeks or never (quality)',2,2*WK,NEVER,['Structured']],['Images','Hours to days','Weeks to months',2,3*DAY,3*MON,['Images']],['Videos','Hours to days','Weeks to months (deep analysis)',2,3*DAY,3*MON,['videos']]],
 s9:[['Removal in Search Console (owner)','~2 hours','24 hours',2,2,24,['removal']],['Snippet update','1–2 days','Several weeks to months',DAY,2*DAY,3*MON,['snippets']],['Title update','1–2 days','Several weeks to months',DAY,2*DAY,3*MON,['titles']],
     ['Text result image update','1–2 weeks','Several weeks to months',WK,2*WK,3*MON,['snippets',1]],['Manual action removal','1–2 weeks','4–6 weeks, or much longer for dormant sites',WK,2*WK,8*WK,['manual']]],
 s10:[['Core update change','3–6 months to recover','6 months to 1 year (next core update)',3*MON,6*MON,YR,['core']],['Spam update change','1–2 weeks (continuous)','Months (batch refreshes)',WK,2*WK,3*MON,['spam']]],
};
// resolve cue words to local times
function cues(i,R){return R.map((r,j)=>{const c=r[6];const tt=fw(i,c[0]==='snippets'&&c[1]?'snippets':c,0,1+j*1.6)+(c[1]?.6:0);return [...r.slice(0,6),tt]})}
let CUE={};
function R(i,key){if(!CUE[key])CUE[key]=cues(i,D[key]);return CUE[key]}

const SC=[
// 0 HOOK
t=>{head(0,t);const th=fw(0,["here's","heres"],0,4);const tc=fw(0,'crawl',0,1.5),ti=fw(0,'index',0,2),ts=fw(0,'show',0,2.5);
  [[0,tc],[1,ti],[2,ts]].forEach(([k,tt],j)=>stage(k,240+j*300,880,[BLUE,GREEN,AMB][j],eo(pr(t,.3+j*.12,.4)),t>tt-.1));
  [0,1].forEach(j=>{const p=eio(pr(t,[ti,ts][j]-.3,.4));if(p>0)x.save(),x.globalAlpha*=p,x.strokeStyle='#cbd5e1',x.lineWidth=5,x.beginPath(),x.moveTo(375+j*300,880),x.lineTo(375+j*300+50*p,880),x.stroke(),x.restore()});
  const ck=eo(pr(t,.6,.4));if(ck>0){x.save();x.globalAlpha*=ck;clockFace(540,1150,90,(t*.15)%1,BLUE);x.restore()}
  callout("HERE'S WHAT GOOGLE SAYS",540,1360,pr(t,th-.1,.4),BLUE)},
// 1 WHO SAID IT
t=>{head(1,t);const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;x.translate(0,(1-k)*30);
  rr(90,640,900,250,30,'#fff',K.line,2,true);x.save();x.beginPath();x.arc(210,765,72,0,7);x.fillStyle=K.blueS;x.fill();x.restore();person(210,790,150,BLUE);
  text('Gary Illyes',320,725,44,K.ink,{w:800});text('Analyst, Google Search',320,782,28,K.sub,{w:700});
  chip('Search Central Live Deep Dive · Europe',540,850+80,pr(t,fw(1,'Search',0,2)-.1,.4),BLUE,K.blueS,26);x.restore();
  const tn=fw(1,'numbers',0,3.5);
  [['Crawling',BLUE],['Indexing',GREEN],['Serving',AMB]].forEach(([n,c],j)=>{const q=eo(pr(t,tn-.4+j*.18,.4));if(q<=0)return;x.save();x.globalAlpha*=q;x.translate(0,(1-q)*20);
    rr(90+j*310,1060,280,250,24,'#fff',c,4,true);text(n,230+j*310,1110,30,c,{al:'center',w:800});
    for(let r=0;r<4;r++){skel(120+j*310,1160+r*36,130,12,1,'#e5e7eb');skel(270+j*310,1160+r*36,70,12,1,r%2?'#e5e7eb':c+'55')}x.restore()})},
// 2..10 rows
t=>{head(2,t);rowsBlock(2,t,R(2,'s2'),BLUE,640,230)},
t=>{head(3,t);rowsBlock(3,t,R(3,'s3'),BLUE,640,230)},
t=>{head(4,t);const y=rowsBlock(4,t,R(4,'s4'),BLUE,640,200);note('Crawl capacity can drop in seconds when Google backs off, e.g. if your server struggles.',y+30,t,fw(4,'drop',0,5)-.2,BLUE)},
t=>{head(5,t);rowsBlock(5,t,R(5,'s5'),GREEN,640,230);
  const tq=fw(5,'quality',0,7);if(t>tq-.2)chip('Low quality → months or never',540,1250,pr(t,tq-.2,.4),K.red,K.redS,26)},
t=>{head(6,t);rowsBlock(6,t,R(6,'s6'),GREEN,640,215)},
t=>{head(7,t);const y=rowsBlock(7,t,R(7,'s7'),GREEN,640,200);note('A small site move can be done in a few weeks.',y+30,t,fw(7,'small',0,6)-.2,GREEN)},
t=>{head(8,t);rowsBlock(8,t,R(8,'s8'),GREEN,640,215)},
t=>{head(9,t);rowsBlock(9,t,R(9,'s9'),AMB,610,162)},
t=>{const tf=fw(10,'Follow',0,99),gone=eo(pr(t,tf-.05,.25)),out=eo(pr(t,tf,.35));
  if(gone<1){x.save();x.globalAlpha*=1-gone;head(10,t);const y=rowsBlock(10,t,R(10,'s10'),AMB,640,200);
    note('Core updates take 2–4 weeks to roll out. Spam updates roll out in 1–2 days.',y+30,t,fw(10,'roll',0,7)-.2,AMB);
    const tw=fw(10,'check',0,12);chip('Check the timeline before you worry',540,y+230,pr(t,tw-.1,.4),K.ink,'#fff',28);x.restore()}
  if(out>0){x.save();x.globalAlpha*=out;const k=back(pr(t,tf,.45));x.save();x.translate(540,820);x.scale(k,k);x.beginPath();x.arc(0,0,170,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle=K.blue;x.stroke();
    x.save();x.beginPath();x.arc(0,0,164,0,7);x.clip();const im=IMG.me;if(im&&im.width)x.drawImage(im,-164,-164,328,328);x.restore();x.restore();
    text('Zakariya',540,1080,72,K.ink,{al:'center',w:800});text('SEO & GEO',540,1150,32,K.sub,{al:'center',w:700});
    callout('FOLLOW FOR MORE SEO & GEO EXPLAINERS',540,1290,pr(t,tf+.2,.35),K.blue);x.restore()}},
];
const endCard=(si,lt)=>si===LAST&&lt>fw(LAST,'Follow',0,99);
function chromeTop(si,lt){if(endCard(si,lt))return;const c=COL[TAG[si]];tagPill(TAG[si],90,330,1,c);
  for(let i=0;i<S.length;i++){const px=990-(S.length-i)*36+8,f=si>i?1:si<i?0:cl(lt/S[si].dur);rr(px,324,28,8,4,'#d1d5db');if(f>0)rr(px,324,28*f,8,4,c)}}
