// ---------- How long Google Search changes take: one board, a moving camera ----------
const BLUE=K.blue,GREEN=K.green,AMB=K.amber,PURP='#7c3aed';
function fw(i,w,n=0,fb=0){const ws=Array.isArray(w)?w:[w];for(const q of ws){const m=S[i].words.filter(o=>o.w.toLowerCase().replace(/[^a-z0-9.'-]/g,'')===q.toLowerCase());if(m[n]||m[0])return (m[n]||m[0]).t-S[i].start}return fb}
const G=(i,w,n=0,fb=0)=>S[i].start+fw(i,w,n,fb); // global time of a word
const HR=1,DAY=24,WK=168,MON=720,YR=8760,NEVER=1e9;
const SEC=[
 {name:'Crawling',col:BLUE,tint:'#eff6ff',icon:0,first:3,note:'Crawl capacity can drop in seconds when Google backs off, e.g. if your server struggles.',noteRows:[4],rows:[
  ['Discovery (new URL)','~20 hours','Weeks to never',20,20,NEVER],['Refresh (known URL)','~30 days','Weeks to never',MON,MON,NEVER],
  ['Sitemap processing','~24 hours','Up to 14 days, or never (quality)',24,24,NEVER],['robots.txt update','~24 hours','25 hours',24,24,25],
  ['Crawl capacity update','4 hours to 1–2 weeks','1–3 weeks (in recovery)',4,2*WK,3*WK],['Crawl demand update','~20 hours','Weeks to months',20,20,3*MON]]},
 {name:'Indexing',col:GREEN,tint:'#f0fdf4',icon:1,first:10,note:'End to end means all the critical processes finish successfully. A small site move can be done in a few weeks.',noteRows:[3,6],rows:[
  ['Rendering','Seconds to render, hours in the queue','Days to weeks',.002,5,3*WK],['Meta annotations','45–90 minutes','1–4 days',.75,1.5,4*DAY],
  ['Link annotations','Minutes to 1–3 weeks','Months',.05,3*WK,3*MON],['Indexing (end to end)','~1.5 hours','Months or never (quality)',1.5,1.5,NEVER],
  ['Removal','1–3 weeks','Months',WK,3*WK,3*MON],['Canonicalisation change','1–3 weeks','Months (conflicting signals)',WK,3*WK,3*MON],
  ['Site move','1–3 months','6 months to 1 year+',MON,3*MON,1.4*YR],['Structured data updates','Hours to 1–2 weeks','Weeks or never (quality)',2,2*WK,NEVER],
  ['Images','Hours to days','Weeks to months',2,3*DAY,3*MON],['Videos','Hours to days','Weeks to months (deep analysis)',2,3*DAY,3*MON]]},
 {name:'Serving',col:AMB,tint:'#fffbeb',icon:2,first:21,note:'Core updates take 2–4 weeks to roll out. Spam updates roll out in 1–2 days.',noteRows:[5,6],rows:[
  ['Removal in Search Console (owner)','~2 hours','24 hours',2,2,24],['Snippet update','1–2 days','Several weeks to months',DAY,2*DAY,3*MON],
  ['Title update','1–2 days','Several weeks to months',DAY,2*DAY,3*MON],['Text result image update','1–2 weeks','Several weeks to months',WK,2*WK,3*MON],
  ['Manual action removal','1–2 weeks','4–6 weeks, or much longer for dormant sites',WK,2*WK,8*WK],['Core update change','3–6 months to recover','6 months to 1 year (next core update)',3*MON,6*MON,YR],
  ['Spam update change','1–2 weeks (continuous)','Months (batch refreshes)',WK,2*WK,3*MON]]},
];
// scene index -> [section,row]
const ROWOF={};SEC.forEach((s,i)=>s.rows.forEach((r,j)=>ROWOF[s.first+j]=[i,j]));
// ----- board geometry (board units)
const BW=760,ROWH=44,HDR=54,NOTEH=40,GAPS=20,TOP0=116;
let BH=0;{let y=TOP0;SEC.forEach(s=>{s.top=y;s.rowsTop=y+HDR;s.bot=y+HDR+s.rows.length*ROWH+NOTEH;y=s.bot+GAPS});BH=y-GAPS}
const rowY=(i,r)=>SEC[i].rowsTop+r*ROWH;
function TXr(h,a0,a1,an){if(h>=NEVER)return an;h=Math.max(h,1/60);const L=Math.log10;if(h>YR)return Math.min(a1+16,a1+(L(h)-L(YR))*50);return a0+(L(h)-L(1/60))/(L(YR)-L(1/60))*(a1-a0)}
const TICKS=[[1/60,'min'],[HR,'hour'],[DAY,'day'],[WK,'week'],[MON,'month'],[YR,'year']];
const BA0=24,BA1=630,BAN=725;

// ----- camera
const WT=395,WB=1112;
function stFull(top=390,bot=1500,dim=[1,1,1]){const s=Math.min(1000/BW,(bot-top)/BH);return {s,ox:540-BW*s/2,oy:top,z:0,a:dim.slice(),hr:0,ha:0,hc:0}}
function stZoom(i,r){const s=1000/BW,sc=SEC[i],up=WT-sc.top*s;let oy=up;if(r>=0){const want=730-(rowY(i,r)+ROWH/2)*s;oy=Math.min(up,Math.max(WB-sc.bot*s,want))}
  return {s,ox:40,oy,z:1,a:[0,1,2].map(k=>k===i?1:.12),hr:r>=0?rowY(i,r):sc.rowsTop,ha:r>=0?1:0,hc:i}}
function lerpSt(a,b,p){return {s:lerp(a.s,b.s,p),ox:lerp(a.ox,b.ox,p),oy:lerp(a.oy,b.oy,p),z:lerp(a.z,b.z,p),a:a.a.map((v,k)=>lerp(v,b.a[k],p)),hr:p<1&&a.ha>0&&b.ha>0?lerp(a.hr,b.hr,p):b.ha>0?b.hr:a.hr,ha:lerp(a.ha,b.ha,p),hc:p>.5?b.hc:a.hc}}
const KF=[];
function buildKF(){const st=i=>S[i].start;
  KF.push([0,stFull(680,1500),0]);KF.push([st(1)-.1,stFull(),1.1]);
  SEC.forEach((sc,i)=>{const intro=sc.first-1;
    if(i===0)KF.push([st(intro)+.1,stZoom(0,-1),1.2]);
    else{KF.push([st(intro)+.05,stFull(),.9]);KF.push([G(intro,['next','last'],0,1.2)-.1,stZoom(i,-1),1.1])}
    sc.rows.forEach((r,j)=>KF.push([st(sc.first+j)-.05,stZoom(i,j),.55]))});
  KF.push([st(S.length-1)+.05,stFull(),1.1]);}
function cam(T){let st=KF[0][1],rot=0;for(let k=1;k<KF.length;k++){const [t,s,d]=KF[k];if(T<t)break;const p=eio((T-t)/d);
  if(Math.abs(s.s-st.s)>.2)rot+=Math.sin(Math.PI*cl((T-t)/d))*.022*(k%2?1:-1);st=lerpSt(st,s,p)}st.rot=rot;return st}

// ----- small icons
function secIcon(kind,cx,cy,col,r=22){x.save();x.translate(cx,cy);x.beginPath();x.arc(0,0,r,0,7);x.fillStyle=col;x.fill();x.strokeStyle='#fff';x.fillStyle='#fff';x.lineWidth=r*.12;const q=r/22;x.scale(q,q);
  if(kind===0){rr(-11,-7,22,16,5,null,'#fff',2.6);x.beginPath();x.arc(-4,1,2.4,0,7);x.arc(4,1,2.4,0,7);x.fill();x.beginPath();x.moveTo(0,-7);x.lineTo(0,-12);x.stroke()}
  if(kind===1){for(let j=0;j<3;j++){x.beginPath();x.ellipse(0,-7+j*7,11,4,0,0,7);x.stroke()}}
  if(kind===2){for(let j=0;j<3;j++){rr(-11,-10+j*7,22,5,2,'#fff')}}x.restore()}

// ----- the board (full chart)
function buildSec(i,T){return T>=S[1].start?1:eo(pr(T,.6+i*.35,.5))}
function buildRow(i,r,T){return T>=S[1].start?1:eio(pr(T,.9+i*.35+r*.06,.6))}
function secDone(i,T){const sc=SEC[i];return T>S[sc.first+sc.rows.length-1].start+S[sc.first+sc.rows.length-1].dur}
function drawBoard(c,T){x.save();x.beginPath();x.rect(0,372,W,lerp(1530,1128,cl(c.z))-372);x.clip();x.translate(540,900);x.rotate(c.rot);x.translate(-540,-900);x.translate(c.ox,c.oy);x.scale(c.s,c.s);
  const ta=(1-c.z)*eo(pr(T,.3,.5));text('How Long Google Search Changes Take',0,30,36,K.ink,{w:800,a:ta,max:3000});
  x.save();x.globalAlpha*=eo(pr(T,.4,.5));TICKS.forEach(([h,l])=>text(l,TXr(h,BA0,BA1,BAN),94,15,K.sub,{al:'center',w:700}));text('never',BAN,94,15,K.red,{al:'center',w:800});x.restore();
  SEC.forEach((sc,i)=>{const b=buildSec(i,T),a=c.a[i]*b;if(a<=.01)return;x.save();x.globalAlpha*=a;x.translate(0,(1-b)*40);const h=sc.bot-sc.top,col=sc.col;
    rr(0,sc.top,BW,h,18,'#fff',col+'66',2,true);x.save();x.beginPath();x.roundRect(0,sc.top,BW,HDR,[18,18,0,0]);x.fillStyle=sc.tint;x.fill();x.restore();
    secIcon(sc.icon,38,sc.top+HDR/2,col,20);text(sc.name.toUpperCase(),70,sc.top+HDR/2+1,24,col,{w:800,ls:2});
    text('TYPICAL  ›  SLOWEST',BW-20,sc.top+HDR/2+1,14,K.mute,{al:'right',w:800,ls:1});
    // S1: pulse when named
    const tn=G(1,sc.name.toLowerCase(),0,99),pu=Math.max(0,Math.sin(Math.PI*cl((T-tn+.1)/.9)));if(pu>0){x.save();x.globalAlpha*=pu;rr(-6,sc.top-6,BW+12,h+12,22,null,col,6);x.restore()}
    if(secDone(i,T)){checkMark(BW-210,sc.top+HDR/2,16,pr(T,S[sc.first+sc.rows.length].start,.4),col)}
    const y0=sc.rowsTop,y1=y0+sc.rows.length*ROWH;x.save();x.setLineDash([3,6]);x.strokeStyle='#e2e8f0';x.lineWidth=1.5;TICKS.forEach(([hh])=>{const px=TXr(hh,BA0,BA1,BAN);x.beginPath();x.moveTo(px,y0+4);x.lineTo(px,y1);x.stroke()});x.restore();
    x.save();const g=x.createLinearGradient(BA1+30,0,BW,0);g.addColorStop(0,'rgba(220,38,38,0)');g.addColorStop(1,'rgba(220,38,38,.06)');x.fillStyle=g;x.fillRect(BA1+30,y0,BW-BA1-31,y1-y0);x.restore();
    if(c.ha>.01&&c.hc===i){x.save();x.globalAlpha*=c.ha;rr(6,c.hr+2,BW-12,ROWH-4,12,sc.tint,col,2.5);x.restore()}
    sc.rows.forEach((r,j)=>{const ry=rowY(i,j),bp=buildRow(i,j,T);text(r[0],20,ry+14,19,K.ink,{w:700,a:bp,max:440});text(r[1],BW-20,ry+14,17,col,{al:'right',w:800,a:bp,max:3000});
      rr(BA0-6,ry+27,BAN-BA0+12,10,5,'#eef2f6');const x0=TXr(r[3],BA0,BA1,BAN),x1=TXr(r[4],BA0,BA1,BAN),xs=TXr(r[5],BA0,BA1,BAN);
      if(r[5]>r[4]){x.save();x.globalAlpha*=.3*bp;rr(x1,ry+27,(xs-x1)*bp,10,5,r[5]>=NEVER?K.red:col);x.restore()}
      rr(x0-5,ry+27,Math.max(10,(x1-x0)*bp+10),10,5,col);if(bp>.98){x.beginPath();x.arc(xs,ry+32,5,0,7);x.fillStyle=r[5]>=NEVER?K.red:'#f87171';x.fill()}});
    const ny=y1,hot=SEC_ACT===i&&sc.noteRows.includes(ROW_ACT);x.save();if(hot){rr(10,ny+6,BW-20,NOTEH-12,10,sc.tint)}rr(16,ny+12,4,NOTEH-24,2,col);
    text(sc.note,30,ny+NOTEH/2,14.5,hot?K.ink:K.sub,{w:hot?700:600,max:BW-50});x.restore();x.restore()});
  x.restore()}
let SEC_ACT=-1,ROW_ACT=-1;

// ----- detail card for the active row (screen space)
function detail(i,j,lt,dur,a,dx=0){if(a<=0)return;const sc=SEC[i],r=sc.rows[j],col=sc.col;x.save();x.globalAlpha*=a;x.translate(dx,0);
  rr(60,1138,960,352,30,'#fff',col,3,true);x.save();x.beginPath();x.roundRect(60,1138,960,10,[30,30,0,0]);x.restore();
  text(String(j+1).padStart(2,'0')+' / '+String(sc.rows.length).padStart(2,'0'),100,1186,22,col,{w:800,ls:2});
  text(r[0],210,1186,38,K.ink,{w:800,max:780});
  rr(100,1226,140,40,20,sc.tint,col,2);text('TYPICAL',170,1247,18,col,{al:'center',w:800,ls:2});text(r[1],262,1247,34,col,{w:800,max:720});
  const p1=eio(pr(lt,.25,.7)),p2=eio(pr(lt,Math.min(Math.max(.9,dur*.4),dur-1),.9));
  x.save();x.globalAlpha*=.3+.7*p2;rr(100,1282,140,40,20,'#fef2f2',K.red,2);text('SLOWEST',170,1303,18,K.red,{al:'center',w:800,ls:2});text(r[2],262,1303,26,'#b91c1c',{w:700,max:720});x.restore();
  const A0=120,A1=860,AN=975,ty=1352;rr(A0-16,ty,AN-A0+32,24,12,'#eef2f6');
  x.save();const g=x.createLinearGradient(A1+30,0,AN+20,0);g.addColorStop(0,'rgba(220,38,38,0)');g.addColorStop(1,'rgba(220,38,38,.12)');x.fillStyle=g;x.fillRect(A1+30,ty-14,AN+20-A1-30,58);x.restore();
  TICKS.forEach(([h,l])=>{const px=TXr(h,A0,A1,AN);rr(px-1,ty+28,2,10,1,'#cbd5e1');text(l,px,ty+54,19,K.sub,{al:'center',w:700})});text('never',AN,ty+54,19,K.red,{al:'center',w:800});
  const x0=TXr(r[3],A0,A1,AN),x1=TXr(r[4],A0,A1,AN),xs=TXr(r[5],A0,A1,AN);
  if(p2>0&&r[5]>r[4]){x.save();const gg=x.createLinearGradient(x1,0,xs,0);gg.addColorStop(0,col);gg.addColorStop(1,K.red);x.globalAlpha*=.4;rr(x1,ty,(xs-x1)*p2,24,12,gg);x.restore();
    if(p2>.95){const pu=1+.25*Math.sin((lt-dur*.4)*8)*Math.exp(-(lt-dur*.4-1));x.beginPath();x.arc(xs,ty+12,13*pu,0,7);x.fillStyle=K.red;x.fill()}}
  rr(x0-12,ty,Math.max(24,(x1-x0)*p1+24),24,12,col);
  // a little runner dot sweeping along the typical bar
  if(p1>0&&p1<1){x.beginPath();x.arc(x0+(x1-x0)*p1,ty+12,16,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=5;x.strokeStyle=col;x.stroke()}
  x.restore()}

// ----- background with camera parallax
function bgDraw2(c){X.fillStyle=K.bg;X.fillRect(0,0,W,1350);X.save();X.strokeStyle='rgba(15,23,42,.045)';X.lineWidth=2;const gs=52*(.7+.3*c.s),offx=(c.ox*.3)%gs,offy=(c.oy*.3)%gs;
  for(let i=offx-gs;i<=W+gs;i+=gs){X.beginPath();X.moveTo(i,0);X.lineTo(i,1350);X.stroke()}for(let j=offy-gs;j<=1350+gs;j+=gs){X.beginPath();X.moveTo(0,j);X.lineTo(W,j);X.stroke()}
  const g=X.createRadialGradient(540,600,80,540,600,900);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(255,255,255,0)');X.fillStyle=g;X.fillRect(0,0,W,1350);X.restore()}

function sceneAt(T){let si=S.findIndex((s,i)=>T<s.start+s.dur&&(i===S.length-1||T<S[i+1].start));if(si<0)si=S.length-1;if(T<S[0].start)si=0;return si}
const LASTI=S.length-1;
const isEnd=T=>T>G(LASTI,'Follow',0,99);
function drawDesign(T){const si=sceneAt(T),c=cam(T),lt=T-S[si].start;const rw=ROWOF[si];SEC_ACT=rw?rw[0]:-1;ROW_ACT=rw?rw[1]:-1;
  const tf=G(LASTI,'Follow',0,1e9),gone=eo(pr(T,tf-.05,.3)),out=eo(pr(T,tf,.35));
  if(gone<1){x.save();x.globalAlpha*=1-gone;
    // headline on the first slide
    const ha=Math.min(eo(pr(T,.05,.4)),1-eio(pr(T,S[1].start-.1,.6)));if(ha>0){const L=wrap('How long does Google take to crawl, index and show your page?',54,800,900);L.forEach((l,j)=>{const k=eo(pr(T,.05+j*.1,.4));text(l,90,425+j*64+(1-k)*24,54,K.ink,{a:k*ha,w:800,max:3000})});
      callout("HERE'S WHAT GOOGLE SAYS",540,425+L.length*64+20,pr(T,G(0,["here's","heres"],0,4)-.1,.4)*ha,BLUE)}
    drawBoard(c,T);
    // top chrome: tag + section progress
    const zt=c.z>.5&&c.hc>=0,sc=SEC[c.hc];const tag=zt?sc.name.toUpperCase()+(rw?' · '+(rw[1]+1)+'/'+sc.rows.length:''):'GOOGLE SEARCH',tc=zt?sc.col:BLUE;
    if(T>=S[1].start-.2)tagPill(tag,90,330,eo(pr(T,S[1].start-.2,.4)),tc);
    SEC.forEach((s,i)=>{const px=720+i*92,n=s.rows.length;let f=0;if(secDone(i,T))f=1;else if(rw&&rw[0]===i)f=(rw[1]+cl(lt/S[si].dur))/n;rr(px,324,80,8,4,'#d1d5db');if(f>0)rr(px,324,80*f,8,4,s.col)});
    // detail card
    if(rw){const k=eo(pr(lt,0,.4)),za=cl((c.z-.6)/.4);const pr_=ROWOF[si-1];
      if(pr_&&pr_[0]===rw[0]&&k<1)detail(pr_[0],pr_[1],99,99,(1-k)*za,-90*k);
      detail(rw[0],rw[1],lt,S[si].dur,k*za,(1-k)*90)}
    // closing line
    if(si===LASTI)callout('CHECK THE TIMELINE BEFORE YOU WORRY',540,1452,pr(T,G(LASTI,'check',0,3)-.1,.4),K.ink);
    x.restore()}
  if(out>0){x.save();x.globalAlpha*=out;const k=back(pr(T,tf,.45));x.save();x.translate(540,820);x.scale(k,k);x.beginPath();x.arc(0,0,170,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle=K.blue;x.stroke();
    x.save();x.beginPath();x.arc(0,0,164,0,7);x.clip();const im=IMG.me;if(im&&im.width)x.drawImage(im,-164,-164,328,328);x.restore();x.restore();
    text('Zakariya',540,1080,72,K.ink,{al:'center',w:800});text('SEO & GEO',540,1150,32,K.sub,{al:'center',w:700});
    callout('FOLLOW FOR MORE SEO & GEO EXPLAINERS',540,1290,pr(T,tf+.2,.35),K.blue);x.restore()}
  return c}
