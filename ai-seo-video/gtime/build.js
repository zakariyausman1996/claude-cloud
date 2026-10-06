// ---------- one chart per section, rows build up one by one; full table at the end ----------
const TINT={[BLUE]:'#eff6ff',[GREEN]:'#f0fdf4',[AMB]:'#fffbeb'};
// [label, typical, slowest, lo, hi, slowestHi, scene, cue word]  (exact text from Google's chart)
const GRP=[
 {n:'Crawling',sub:'How fast Google finds and fetches your pages',col:BLUE,s0:1,s1:6,size:'n',gap:138,
  note:['Crawl capacity can drop in seconds when Google backs off, e.g. if your server struggles.',5,'drop'],rows:[
  ['Discovery (new URL)','~20 hours','Weeks to never',20,20,NEVER,1,'new'],['Refresh (known URL)','~30 days','Weeks to never',MON,MON,NEVER,2,'known'],
  ['Sitemap processing','~24 hours','Up to 14 days, or never (quality)',24,24,NEVER,3,'Sitemaps'],['robots.txt update','~24 hours','25 hours',24,24,25,4,['robots.txt','robots']],
  ['Crawl capacity update','4 hours to 1–2 weeks','1–3 weeks (in recovery)',4,2*WK,3*WK,5,'capacity'],['Crawl demand update','~20 hours','Weeks to months',20,20,3*MON,6,'demand']]},
 {n:'Indexing',sub:'How fast Google processes and stores your pages',col:GREEN,s0:7,s1:16,size:'c',gap:96,rows:[
  ['Rendering','Seconds to render, hours in the queue','Days to weeks',.002,5,3*WK,7,'Rendering'],['Meta annotations','45–90 minutes','1–4 days',.75,1.5,4*DAY,8,'Meta'],
  ['Link annotations','Minutes to 1–3 weeks','Months',.05,3*WK,3*MON,9,'Link'],['Indexing (end to end)','~1.5 hours','Months or never (quality)',1.5,1.5,NEVER,10,'Indexing','End to end = all critical processes succeed'],
  ['Removal','1–3 weeks','Months',WK,3*WK,3*MON,11,'Removing'],['Canonicalisation change','1–3 weeks','Months (conflicting signals)',WK,3*WK,3*MON,12,'canonical'],
  ['Site move','1–3 months','6 months to 1 year+',MON,3*MON,1.4*YR,13,'site','Small site move: a few weeks'],['Structured data updates','Hours to 1–2 weeks','Weeks or never (quality)',2,2*WK,NEVER,14,'Structured'],
  ['Images','Hours to days','Weeks to months',2,3*DAY,3*MON,15,'Images'],['Videos','Hours to days','Weeks to months (deep analysis)',2,3*DAY,3*MON,16,'Videos']]},
 {n:'Serving',sub:'How fast changes show up in search results',col:AMB,s0:17,s1:23,size:'m',gap:120,
  note:['Core updates take 2–4 weeks to roll out. Spam updates roll out in 1–2 days.',22,'roll'],rows:[
  ['Removal in Search Console (owner)','~2 hours','24 hours',2,2,24,17,'removal'],['Snippet update','1–2 days','Several weeks to months',DAY,2*DAY,3*MON,18,'Snippets'],
  ['Title update','1–2 days','Several weeks to months',DAY,2*DAY,3*MON,19,'Titles'],['Text result image update','1–2 weeks','Several weeks to months',WK,2*WK,3*MON,20,'Text'],
  ['Manual action removal','1–2 weeks','4–6 weeks, or much longer for dormant sites',WK,2*WK,8*WK,21,'manual'],['Core update change','3–6 months to recover','6 months to 1 year (next core update)',3*MON,6*MON,YR,22,'core'],
  ['Spam update change','1–2 weeks (continuous)','Months (batch refreshes)',WK,2*WK,3*MON,23,'Spam']]},
];
const GT=(i,w,fb=.3)=>S[i].start+fw(i,w,0,fb); // global time of a spoken word
GRP.forEach(g=>{g.rows.forEach(r=>r.cue=GT(r[6],r[7])-.15);g.T0=S[g.s0].start;g.T1=S[g.s1].start+S[g.s1].dur;if(g.note)g.noteT=GT(g.note[1],g.note[2])-.2});
const SZ={n:{lab:32,typ:30,tr:26,th:20,sl:64,ss:22},m:{lab:30,typ:28,tr:24,th:18,sl:56,ss:20},c:{lab:26,typ:24,tr:18,th:14,sl:42,ss:17}};

// one row of the chart as a time bar (T is global time)
function row(r,y,T,col,sz,active){const [lab,typ,slow,lo,hi,sh]=r,cue=r.cue,k=eo(pr(T,cue-.1,.4));if(k<=0)return;
  {const top=y-sz.lab*.85,h=sz.sl+sz.lab*.85+sz.ss*.85;x.save();x.globalAlpha*=k;rr(70,top,940,h,16,'#fff',K.line,1.5);if(active>0){x.globalAlpha*=active;rr(70,top,940,h,16,TINT[col],col,2.5)}x.restore()}
  x.save();x.globalAlpha*=k;x.translate((1-k)*-40,0);
  text(lab,96,y,sz.lab,K.ink,{w:800,max:640});text(typ,984,y,sz.typ,col,{al:'right',w:800,max:3000});
  const ty=y+sz.tr;rr(AX0-20,ty,AXN-AX0+40,sz.th,sz.th/2,'#e9edf2');
  const p1=eio(pr(T,cue+.15,.6)),p2=eio(pr(T,cue+.7,.9)),x0=TX(lo),x1=TX(hi),xs=TX(sh);
  if(p2>0&&sh>hi){const e=lerp(x1,xs,p2);x.save();const g=x.createLinearGradient(x1,0,xs,0);g.addColorStop(0,col);g.addColorStop(1,sh>=NEVER?'rgba(220,38,38,.55)':K.red);x.globalAlpha*=.35;rr(x1,ty,Math.max(0,e-x1),sz.th,sz.th/2,g);x.restore();
    if(p2>.95){x.beginPath();x.arc(xs,ty+sz.th/2,sz.th/2,0,7);x.fillStyle=sh>=NEVER?K.red:'#f87171';x.fill()}}
  rr(x0-sz.th/2,ty,Math.max(sz.th,(x1-x0)*p1+sz.th),sz.th,sz.th/2,col);
  text('Slowest: '+slow,96,y+sz.sl,sz.ss,K.sub,{w:600,a:p2,max:3000});
  if(r[8])text(r[8],984,y+sz.sl,sz.ss,col,{al:'right',w:700,a:p2,max:3000});
  x.restore()}

// a whole section chart at global time T
function chart(g,T){const sz=SZ[g.size];
  const hk=eo(pr(T,g.T0,.45));text(g.n,90,412+(1-hk)*24,60,K.ink,{a:hk,w:800});text(g.sub,90,470,28,K.sub,{a:eo(pr(T,g.T0+.15,.45)),w:600});
  const y0=508,n=g.rows.length,yEnd=y0+60+(n-1)*g.gap+sz.sl+10;axis(y0,yEnd,eo(pr(T,g.T0+.25,.45)));
  // the row currently being explained
  let cur=-1;g.rows.forEach((r,j)=>{if(T>=r.cue-.1)cur=j});
  g.rows.forEach((r,j)=>{const nx=g.rows[j+1],act=j===cur?(nx?1:1-eo(pr(T,g.T1-.6,.4))):0;row(r,y0+60+j*g.gap,T,g.col,sz,act)});
  if(g.note){const nk=eo(pr(T,g.noteT,.45));if(nk>0){const L=wrap(g.note[0],24,700,840),h=L.length*32+30,ny=yEnd+18;x.save();x.globalAlpha*=nk;x.translate(0,(1-nk)*20);
    rr(90,ny,900,h,18,'#fff',K.line,2,true);rr(90,ny,8,h,4,g.col);L.forEach((l,j)=>text(l,124,ny+31+j*32,24,K.ink,{w:700,max:3000}));x.restore()}}}

// ----- the full table, built from everything shown above
const FB={W:900,RH:36,HD:46,GAP:12};(()=>{let y=48;GRP.forEach(g=>{g.fy=y;g.fh=FB.HD+g.rows.length*FB.RH+8;y+=g.fh+FB.GAP});FB.H=y-FB.GAP})();
const FA0=370,FA1=830,FAN=885;
function FX(h){if(h>=NEVER)return FAN;h=Math.max(h,1/60);const L=Math.log10;if(h>YR)return Math.min(FA1+12,FA1+(L(h)-L(YR))*40);return FA0+(L(h)-L(1/60))/(L(YR)-L(1/60))*(FA1-FA0)}
function fullTable(T,t0){t0+=.15;const fit=Math.min(1,(1490-470)/FB.H),ox=540-FB.W*fit/2,oy=470;
  x.save();x.translate(ox,oy);x.scale(fit,fit);
  const ak=eo(pr(T,t0+.2,.5));x.save();x.globalAlpha*=ak;TICKS.forEach(([h,l])=>text(l,FX(h),22,15,K.sub,{al:'center',w:700}));text('never',FAN,22,15,K.red,{al:'center',w:800});x.restore();
  GRP.forEach((g,i)=>{const k=eo(pr(T,t0+(2-i)*.18,.55));if(k<=0)return;x.save();x.globalAlpha*=k;x.translate(0,(1-k)*-30);
    rr(0,g.fy,FB.W,g.fh,16,'#fff',null,0,true);rr(0,g.fy,7,g.fh,3,g.col);text(g.n.toUpperCase(),24,g.fy+24,19,g.col,{w:800,ls:3});
    g.rows.forEach((r,j)=>{const ry=g.fy+FB.HD+j*FB.RH+12;text(r[0],24,ry,17,K.ink,{w:700,max:3000});
      rr(FA0-6,ry-4,FAN-FA0+12,8,4,'#eef2f6');const x0=FX(r[3]),x1=FX(r[4]),xs=FX(r[5]);
      if(r[5]>r[4]){x.save();x.globalAlpha*=.3;rr(x1,ry-4,xs-x1,8,4,r[5]>=NEVER?K.red:g.col);x.restore()}rr(x0-4,ry-4,Math.max(8,x1-x0+8),8,4,g.col);
      text(r[1],FB.W-16,ry+15,14,g.col,{al:'right',w:700,max:3000})});x.restore()});
  x.restore()}

// ----- intro scenes from the first version
function intro0(t){const L=wrap('How long does Google take to crawl, index and show your page?',66,800,900);L.forEach((l,j)=>{const k=eo(pr(t,.05+j*.1,.4));text(l,90,430+j*77+(1-k)*24,66,K.ink,{a:k,w:800,max:3000})});
  const th=fw(0,["here's","heres"],0,4),tc=fw(0,'crawl',0,1.5),ti=fw(0,'index',0,2),ts=fw(0,'show',0,2.5);
  [[0,tc],[1,ti],[2,ts]].forEach(([k,tt],j)=>stage(k,240+j*300,880,[BLUE,GREEN,AMB][j],eo(pr(t,.3+j*.12,.4)),t>tt-.1));
  const ck=eo(pr(t,.6,.4));if(ck>0){x.save();x.globalAlpha*=ck;clockFace(540,1150,90,(t*.15)%1,BLUE);x.restore()}
  callout("HERE'S WHAT GOOGLE SAID",540,1340,pr(t,th-.1,.4),BLUE);chip('Google Search Central Deep Dive 2026',540,1440,pr(t,fw(0,'Search',0,6)-.1,.4),BLUE,K.blueS,26)}
function intro1(t){const L=wrap('Gary Illyes shared Google’s own numbers',58,800,900);L.forEach((l,j)=>{const k=eo(pr(t,.05+j*.1,.4));text(l,90,430+j*67+(1-k)*24,58,K.ink,{a:k,w:800,max:3000})});
  const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;x.translate(0,(1-k)*30);
  rr(90,640,900,250,30,'#fff',K.line,2,true);x.save();x.beginPath();x.arc(210,765,72,0,7);x.fillStyle=K.blueS;x.fill();x.restore();person(210,790,150,BLUE);
  text('Gary Illyes',320,725,44,K.ink,{w:800});text('Analyst, Google Search',320,782,28,K.sub,{w:700});
  chip('Search Central Live Deep Dive · Europe',540,930,pr(t,fw(1,'Search',0,2)-.1,.4),BLUE,K.blueS,26);x.restore();
  const tn=fw(1,'numbers',0,3.5);
  [['Crawling',BLUE],['Indexing',GREEN],['Serving',AMB]].forEach(([n,c],j)=>{const q=eo(pr(t,tn-.4+j*.18,.4));if(q<=0)return;x.save();x.globalAlpha*=q;x.translate(0,(1-q)*20);
    rr(90+j*310,1060,280,250,24,'#fff',c,4,true);text(n,230+j*310,1110,30,c,{al:'center',w:800});
    for(let r=0;r<4;r++){skel(120+j*310,1160+r*36,130,12,1,'#e5e7eb');skel(270+j*310,1160+r*36,70,12,1,r%2?'#e5e7eb':c+'55')}x.restore()})}

// ----- timeline of "slides": intro, intro, 3 charts, full table
const LASTI=S.length-1;
const SLIDES=[{T0:S[0].start,T1:S[0].start+S[0].dur,draw:T=>intro0(T-S[0].start),tag:'GOOGLE SEARCH',col:BLUE},
  ...GRP.map(g=>({T0:g.T0,T1:g.T1,draw:T=>chart(g,T),tag:g.n.toUpperCase(),col:g.col,g})),
 {T0:S[LASTI].start,T1:TL.total,draw:T=>fullTable(T,S[LASTI].start+.35),tag:'THE FULL TABLE',col:BLUE,last:1}];
const tFollow=S[LASTI].start+fw(LASTI,'Follow',0,99);
function slideAt(T){for(let i=SLIDES.length-1;i>=0;i--)if(T>=SLIDES[i].T0-.001)return i;return 0}
function drawDesign(T){const si=slideAt(T),sl=SLIDES[si];
  const gone=eo(pr(T,tFollow-.05,.3)),out=eo(pr(T,tFollow,.35));
  if(gone<1){x.save();x.globalAlpha*=1-gone;
    if(sl.last){// zoom out: the serving chart shrinks into its place in the full table
      const z=eio(pr(T,sl.T0,.55));if(z<1){const prev=SLIDES[si-1],g=prev.g,fit=Math.min(1,(1490-470)/FB.H),tx=540,ty=470+(g.fy+g.fh/2)*fit,s=lerp(1,.42,z);
        x.save();x.globalAlpha*=1-z;x.translate(lerp(540,tx,z),lerp(960,ty,z));x.scale(s,s);x.translate(-540,-960);prev.draw(prev.T1-.01);x.restore()}
      text('How long Google Search changes take',90,425,52,K.ink,{a:eo(pr(T,sl.T0+.45,.5)),w:800,max:3000});
      x.save();x.globalAlpha*=eo(pr(T,sl.T0+.45,.5));x.translate(540,980);const zs=lerp(1.12,1,eio(pr(T,sl.T0+.45,.8)));x.scale(zs,zs);x.translate(-540,-980);sl.draw(T);x.restore()}
    else{const fin=eio(pr(T,sl.T0,.45)),fo=si<SLIDES.length-2?1-eio(pr(T,sl.T1-.35,.35)):1,dx=(1-fin)*140-(1-fo)*140;
      x.save();x.globalAlpha*=Math.min(fin,fo);x.translate(dx,0);sl.draw(T);x.restore()}
    // top chrome: tag + progress through the rows of the current section
    tagPill(sl.tag,90,330,1,sl.col);
    if(sl.g){const n=sl.g.rows.length;sl.g.rows.forEach((r,j)=>{const px=990-(n-j)*40+12,f=cl((T-r.cue)/.5);rr(px,324,32,8,4,'#d1d5db');if(f>0)rr(px,324,32*f,8,4,sl.col)})}
    x.restore()}
  if(out>0){x.save();x.globalAlpha*=out;const k=back(pr(T,tFollow,.45));x.save();x.translate(540,820);x.scale(k,k);x.beginPath();x.arc(0,0,170,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle=K.blue;x.stroke();
    x.save();x.beginPath();x.arc(0,0,164,0,7);x.clip();const im=IMG.me;if(im&&im.width)x.drawImage(im,-164,-164,328,328);x.restore();x.restore();
    text('Zakariya',540,1080,72,K.ink,{al:'center',w:800});text('SEO & GEO',540,1150,32,K.sub,{al:'center',w:700});
    callout('FOLLOW FOR MORE SEO & GEO EXPLAINERS',540,1290,pr(T,tFollow+.2,.35),K.blue);x.restore()}}
