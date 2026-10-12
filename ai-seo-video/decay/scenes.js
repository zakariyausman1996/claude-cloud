// ---------- How long does an AI citation last? ----------
const LAST=S.length-1,BLUE=K.blue,PURP='#7c3aed';
function fw(i,w,n=0,fb=0){const ws=Array.isArray(w)?w:[w];for(const q of ws){const m=S[i].words.filter(o=>o.w.toLowerCase().replace(/[^a-z0-9.'-]/g,'')===q.toLowerCase());if(m[n]||m[0])return (m[n]||m[0]).t-S[i].start}return fb}
const HEADS=['How long does an AI citation last?','What is an AI citation?','Half gone in about 11 days',
 'Most citations are a short burst','Each AI tool decides on its own','Cited by more AI tools, cited for longer','News fades first',
 'Fresh content gets cited','How to keep your AI citations',''];
function head(i,t,sz0=60){let sz=sz0,lines=wrap(HEADS[i],sz,800,900);if(lines.length>2){sz=50;lines=wrap(HEADS[i],sz,800,900)}const lh=sz*1.16;
  lines.forEach((l,j)=>{const k=eo(pr(t,.05+j*.1,.4));text(l,90,430+j*lh+(1-k)*24,sz,K.ink,{a:k,w:800,max:3000})});return 430+lines.length*lh}
function clockFace(cx,cy,r,p,col){x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=10;x.strokeStyle='#e5e7eb';x.stroke();
  x.strokeStyle=col;x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*p);x.stroke();x.strokeStyle=K.ink;x.lineWidth=7;x.lineCap='round';
  const a=-Math.PI/2+Math.PI*2*p*4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*r*.62,cy+Math.sin(a)*r*.62);x.stroke();x.restore()}
function tile(big,small,cx,cy,a,col=BLUE,w=280){if(a<=0)return;x.save();x.globalAlpha*=a;x.translate(cx,cy);const k=.9+.1*back(a);x.scale(k,k);
  rr(-w/2,-100,w,200,28,'#fff',null,0,true);text(big,0,-22,52,col,{al:'center',w:800,max:3000});text(small,0,46,26,K.sub,{al:'center',w:700,max:3000});x.restore()}
function pageIcon(px,py,w,h,col,a=1,fill='#fff'){if(a<=0)return;x.save();x.globalAlpha*=a;rr(px,py,w,h,Math.min(10,w*.15),fill,col,2.5);rr(px+w*.18,py+h*.2,w*.5,Math.max(3,h*.08),2,col);
  for(let i=1;i<3;i++)rr(px+w*.18,py+h*.2+i*h*.2,w*(.64-(i%2)*.15),Math.max(2,h*.06),2,'#e5e7eb');x.restore()}
const TOOLS=['ChatGPT','Perplexity','Claude','AI Overviews','AI Mode','Gemini','Copilot'];

const SC=[
// 0 QUESTION
t=>{head(0,t,72);const k=eo(pr(t,.3,.5));if(k<=0)return;x.save();x.globalAlpha*=k;x.translate(0,(1-k)*30);
  answerCard(150,720,780,330,1,{title:'AI answer',lines:4,t:t,t0:.4});srcChip('your-site.com',190,980,1,true);x.restore();
  const c=eo(pr(t,.6,.4));if(c>0){x.save();x.globalAlpha*=c;clockFace(540,1270,110,(t*.25)%1,BLUE);x.restore()}},
// 1 WHAT IS A CITATION
t=>{head(1,t);const tl=fw(1,'links',0,2.5),tc=fw(1,'citation',0,4.5),tv=fw(1,'visibility',0,5.5),tt=fw(1,'traffic',0,6);
  const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;answerCard(110,640,860,320,1,{title:'AI answer',lines:4,t:t,t0:.3});
  ['wikipedia.org','your-site.com','reddit.com'].forEach((s,j)=>{const a=pr(t,tl-.1+j*.15,.35);let px=150+[0,230,500][j];srcChip(s,px,900,a,j===1&&t>tc-.1)});x.restore();
  if(t>tc-.2){const p=eio(pr(t,tc-.2,.5));x.save();x.globalAlpha*=p;x.strokeStyle=BLUE;x.lineWidth=4;x.setLineDash([10,8]);x.beginPath();x.moveTo(470,960);x.lineTo(470,1040);x.stroke();x.restore();
    chip('That link = a citation',470,1080,p,BLUE,K.blueS,30)}
  [['Visibility',tv,320],['Traffic',tt,760]].forEach(([n,tt2,cx])=>{const a=pr(t,tt2-.1,.4);if(a<=0)return;x.save();x.globalAlpha*=eo(a);rr(cx-170,1200,340,120,26,'#fff',K.green,3,true);
    text(n,cx-20,1261,36,K.ink,{al:'center',w:800});x.restore();checkMark(cx+120,1260,24,a)})},
// 2 THE ANSWER: 11 DAYS (source shown here)
t=>{head(2,t);const ta=fw(2,'11',0,1),th=fw(2,'half',0,4),tw=fw(2,'11',1,5.5);text('883,000 pages · 7 AI tools · 1 year',90,740,26,K.sub,{w:700,a:eo(pr(t,fw(2,'tracked',0,6)-.1,.4))});
  const n=back(pr(t,ta-.1,.5));if(n>0){x.save();x.translate(90,640);x.scale(n,n);text('11 days',0,0,120,BLUE,{w:800});x.restore()}
  const k=eo(pr(t,.3,.5));if(k<=0)return;x.save();x.globalAlpha*=k;const X0=130,X1=960,Y0=1380,Y1=820;rr(90,760,900,700,28,'#fff',null,0,true);
  text('Citations',130,800,24,K.sub,{w:700});text('Days',950,1420,24,K.sub,{al:'right',w:700});x.strokeStyle='#e2e8f0';x.lineWidth=3;x.beginPath();x.moveTo(X0,Y0);x.lineTo(X1,Y0);x.stroke();
  // curve: rise to peak at u=.38, then fall; half at u=.6
  const f=u=>u<.38?Math.sin(u/.38*Math.PI/2):Math.pow(.5,(u-.38)/.22),pt=u=>[lerp(X0,X1,u),lerp(Y0,Y1,f(u)*.95)];
  const g=eio(pr(t,.5,Math.max(1,th-.2)));x.beginPath();for(let i=0;i<=200*g;i++){const [px,py]=pt(i/200);i?x.lineTo(px,py):x.moveTo(px,py)}x.strokeStyle=BLUE;x.lineWidth=7;x.lineJoin='round';x.stroke();
  const [pkx,pky]=pt(.38),[hx,hy]=pt(.6);if(g>.4){x.beginPath();x.arc(pkx,pky,12,0,7);x.fillStyle=BLUE;x.fill();chip('Peak',pkx,pky-50,pr(t,.9,.3),BLUE,'#fff',24)}
  const hp=pr(t,th-.1,.5);if(hp>0){x.save();x.globalAlpha*=eo(hp);x.setLineDash([10,8]);x.strokeStyle=K.red;x.lineWidth=3;x.beginPath();x.moveTo(X0,hy);x.lineTo(X1,hy);x.stroke();x.restore();
    text('half',X1,hy-22,22,K.red,{al:'right',w:800,a:eo(hp)});x.beginPath();x.arc(hx,hy,12,0,7);x.fillStyle=K.red;x.fill()}
  const bp=eio(pr(t,tw-.2,.6));if(bp>0){x.save();x.strokeStyle=K.ink;x.lineWidth=4;const by=Y0+30;x.beginPath();x.moveTo(pkx,by);x.lineTo(lerp(pkx,hx,bp),by);x.stroke();
    [pkx,lerp(pkx,hx,bp)].forEach(px=>{x.beginPath();x.moveTo(px,by-12);x.lineTo(px,by+12);x.stroke()});x.restore();if(bp>.9)text('~11 days',(pkx+hx)/2,by+38,26,K.ink,{al:'center',w:800})}
  x.restore()},
// 4 SHORT BURST: 78 of 100
t=>{head(3,t);const t78=fw(3,'78',0,2.5),t22=fw(3,'22',0,5);const fade=eio(pr(t,t78,.9));
  for(let i=0;i<100;i++){const r=Math.floor(i/10),c=i%10,px=150+c*80,py=620+r*72,a=eo(pr(t,.2+i*.006,.3)),gone=(i*37)%100<78;
    pageIcon(px,py,54,62,gone&&fade>0?K.mute:BLUE,a*(gone?1-.75*fade:1),gone&&fade>.5?'#f8fafc':'#fff')}
  chip('78 fade within 2 weeks',330,1380,pr(t,t78,.4),K.red,K.redS,28);chip('22 hold on',800,1380,pr(t,t22-.1,.4),BLUE,K.blueS,28)},
// 5 EACH TOOL DECIDES
t=>{head(4,t);const tc=fw(4,'ChatGPT',0,3),td=fw(4,['doesnt',"doesn't"],0,4);
  pageIcon(470,610,140,170,BLUE,eo(pr(t,.2,.4)));text('your page',540,820,24,K.sub,{al:'center',w:700,a:eo(pr(t,.2,.4))});
  TOOLS.forEach((n,j)=>{const r=j<4?0:1,c=j<4?j:j-4,cx=r?270+c*270:180+c*240,cy=980+r*200,a=eo(pr(t,.4+j*.08,.35));if(a<=0)return;const lit=j===0&&t>tc-.1,dim=j>0&&t>td;
    x.save();x.globalAlpha*=a*(dim?.45:1);rr(cx-105,cy-70,210,140,22,lit?K.blueS:'#fff',lit?BLUE:K.line,lit?4:2,true);text(n,cx,cy,26,lit?BLUE:K.ink,{al:'center',w:800,max:3000});x.restore();
    if(lit)checkMark(cx+95,cy-60,22,pr(t,tc,.35),BLUE);if(dim)text('?',cx+88,cy-48,34,K.mute,{al:'center',w:800})})},
// 6 BREADTH: 1.2% vs 6.8%
t=>{head(5,t);const t5=fw(5,'five',0,1),tx=fw(5,'half',0,3),tm=fw(5,'months',0,5);const k=eo(pr(t,.2,.45));if(k<=0)return;
  x.save();x.globalAlpha*=k;rr(90,680,900,760,28,'#fff',null,0,true);text('Still cited after 2 months',130,730,26,K.sub,{w:700});
  const base=1340,H=480;[['Cited by 1 AI tool',1.2,330,K.mute,.3],['Cited by 5+ AI tools',6.8,750,BLUE,t5-.1]].forEach(([n,v,cx,col,t0])=>{const g=eio(pr(t,t0,.8)),h=H*v/6.8*g;
    rr(cx-110,base-h,220,h,18,col);text(v.toFixed(1)+'%',cx,base-h-34,40,col===K.mute?K.sub:col,{al:'center',w:800,a:g});text(n,cx,base+44,26,K.ink,{al:'center',w:700})});
  x.restore();callout('5.5× MORE LIKELY',540,640,pr(t,tx-.2,.4),BLUE)},
// 7 NEWS FADES FIRST
t=>{head(6,t);const tn=fw(6,'News',0,.3),to=fw(6,'Comparisons',0,2.5);text('Among pages that keep getting cited',90,520,28,K.sub,{w:600,a:eo(pr(t,.2,.4))});
  const R=[['News & announcements',27,K.red],['Comparisons',29,BLUE],['How-to guides',28,BLUE],['Product pages',28,BLUE]];
  R.forEach(([n,d,col],j)=>{const py=650+j*190,a=eo(pr(t,(j?to:tn)-.2+(j?j*.15:0),.4));if(a<=0)return;x.save();x.globalAlpha*=a;x.translate((1-a)*-40,0);
    rr(90,py,900,160,24,'#fff',j?K.line:K.red,j?2:3,true);text(n,130,py+50,34,K.ink,{w:800});text('halves in ~'+d+' days',950,py+50,28,col,{al:'right',w:800});
    const life=eio(pr(t,.6,Math.max(2,S[6].dur-1))),rem=Math.max(0,1-life*(30/d)*.8);rr(130,py+100,820,20,10,'#eef2f6');rr(130,py+100,820*rem,20,10,col);x.restore()})},
// 8 FRESHNESS: half under 13 weeks
t=>{head(7,t);const th=fw(7,'Half',0,1.5),t13=fw(7,'13',0,3);const k=eo(pr(t,.2,.45));if(k<=0)return;
  x.save();x.globalAlpha*=k;rr(90,660,900,720,28,'#fff',null,0,true);text('Age of content AI tools cite',130,710,26,K.sub,{w:700});
  for(let i=0;i<50;i++){const r=Math.floor(i/10),c=i%10,px=150+c*80,py=770+r*90,hot=i<25,on=t>th&&hot;pageIcon(px,py,54,64,on?BLUE:K.mute,eo(pr(t,.3+i*.01,.3)),on?K.blueS:'#fff')}
  const p=pr(t,t13-.1,.45);if(p>0){x.save();x.globalAlpha*=eo(p);rr(140,1240,800,90,20,K.blueS,BLUE,3);text('Half are less than 13 weeks old',540,1286,32,BLUE,{al:'center',w:800});x.restore()}
  x.restore()},
// 9 WHAT TO DO
t=>{head(8,t);const C=[['Answer specific questions clearly','answer'],['Refresh pages losing citations first','refresh'],['Get cited by many AI tools, not just one','many']];
  C.forEach(([s,w],j)=>{const tt=fw(8,w,0,1+j*2.5),a=eo(pr(t,tt-.3,.4)),py=680+j*210;if(a<=0)return;x.save();x.globalAlpha*=a;x.translate((1-a)*-50,0);
    rr(90,py,900,170,26,'#fff',K.green,3,true);text(s,140,py+86,34,K.ink,{w:800,max:700});x.restore();checkMark(930,py+85,30,pr(t,tt,.4))})},
// 10 OUTRO
t=>{const k=eo(pr(t,0,.35));x.save();x.globalAlpha*=k;const b=back(pr(t,0,.45));x.save();x.translate(540,820);x.scale(b,b);x.beginPath();x.arc(0,0,170,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle=K.blue;x.stroke();
  x.save();x.beginPath();x.arc(0,0,164,0,7);x.clip();const im=IMG.me;if(im&&im.width)x.drawImage(im,-164,-164,328,328);x.restore();x.restore();
  text('Zakariya',540,1080,72,K.ink,{al:'center',w:800});text('SEO & GEO',540,1150,32,K.sub,{al:'center',w:700});
  callout('FOLLOW FOR MORE SEO & GEO EXPLAINERS',540,1290,pr(t,.3,.35),K.blue);x.restore()},
];
const endCard=(si,lt)=>si===LAST;
function chromeTop(si,lt){if(endCard(si,lt))return;tagPill('AI CITATIONS',90,330,1,BLUE);
  const n=S.length-1;for(let i=0;i<n;i++){const px=990-(n-i)*40+12,f=si>i?1:si<i?0:cl(lt/S[si].dur);rr(px,324,32,8,4,'#d1d5db');if(f>0)rr(px,324,32*f,8,4,BLUE)}}
