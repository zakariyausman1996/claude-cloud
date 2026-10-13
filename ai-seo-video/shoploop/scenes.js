// ---------- Shopping is part of the product (Growth Memo, Kevin Indig) ----------
const LAST=S.length-1,BLUE=K.blue,GREEN=K.green,AMB=K.amber,PURP='#7c3aed';
function fw(i,w,n=0,fb=0){const ws=Array.isArray(w)?w:[w];for(const q of ws){const m=S[i].words.filter(o=>o.w.toLowerCase().replace(/[^a-z0-9.'-]/g,'')===q.toLowerCase());if(m[n]||m[0])return (m[n]||m[0]).t-S[i].start}return fb}
const HEADS=['Is your product on the AI shortlist?','Are shoppers really using AI to shop?','Do they look beyond that list?','So does your spot on the list matter?',
 'How does AI decide who makes the list?','Where do those signals come from?','Stage 1: How do you get onto the list?','Stage 2: What about shoppers who do visit?',
 'Stage 3: How do buyers create new signals?','Stage 4: Why chase the second purchase?','Stage 5: Where does all this lead?','And then?',
 "Why don't most brands see this?",'So where should you invest?',"What's the main idea?",''];
function head(i,t,sz0=58){let sz=sz0,lines=wrap(HEADS[i],sz,800,900);if(lines.length>2){sz=48;lines=wrap(HEADS[i],sz,800,900)}const lh=sz*1.16;
  lines.forEach((l,j)=>{const k=eo(pr(t,.05+j*.1,.4));text(l,90,430+j*lh+(1-k)*24,sz,K.ink,{a:k,w:800,max:3000})});return 430+lines.length*lh}
const STEPS=[['Visible',BLUE],['Convert',GREEN],['Unbox',AMB],['Repeat',PURP],['Brand',K.red]];
// product card: cx,cy, label, highlight
function product(cx,cy,label,a=1,o={}){if(a<=0)return;x.save();x.globalAlpha*=a;x.translate(cx,cy);const s=o.s??1;x.scale(s,s);
  rr(-110,-120,220,240,22,o.ghost?'#f8fafc':'#fff',o.col??(o.ghost?'#cbd5e1':K.line),o.col?4:2,!o.ghost);if(o.ghost){x.save();x.setLineDash([8,8]);rr(-110,-120,220,240,22,null,'#94a3b8',3);x.restore()}
  rr(-80,-95,160,110,14,o.ghost?'#eef2f6':(o.tint??'#e0e7ff'));x.fillStyle=o.ghost?'#cbd5e1':(o.col??'#818cf8');x.beginPath();x.ellipse(0,-40,46,24,0,0,7);x.fill();
  text(label,0,48,24,o.ghost?K.mute:K.ink,{al:'center',w:800,max:3000});if(o.rank)badge(o.rank,-92,-102,1,o.col??BLUE);x.restore()}
function chat(px,py,w,h,a,q,shown){if(a<=0)return;x.save();x.globalAlpha*=a;rr(px,py,w,h,30,'#fff',null,0,true);sparkle(px+44,py+48,16,BLUE);text('AI shopping assistant',px+74,py+49,24,K.sub,{w:700});
  rr(px+30,py+86,w-60,64,32,'#f1f5f9');text(q.slice(0,shown),px+60,py+119,28,K.ink,{w:600,max:3000});x.restore()}
// 5-step loop around a centre
function loop(cx,cy,R,t0,t,active=-1,o={}){const ap=eo(pr(t,t0,.5));if(ap<=0)return;x.save();x.globalAlpha*=ap;
  x.lineWidth=6;x.strokeStyle='#e2e8f0';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();
  if(o.spin!==undefined){x.strokeStyle=BLUE;x.beginPath();x.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*o.spin);x.stroke()}
  x.beginPath();x.arc(cx,cy,R*.42,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=4;x.strokeStyle=BLUE;x.stroke();
  text(o.center??'AI',cx,cy-14,o.cs??30,BLUE,{al:'center',w:800,max:3000});text(o.center2??'Shortlist',cx,cy+22,o.cs??30,BLUE,{al:'center',w:800,max:3000});
  STEPS.forEach(([n,col],i)=>{const an=-Math.PI/2+i*Math.PI*2/5,nx=cx+Math.cos(an)*R,ny=cy+Math.sin(an)*R,k=back(pr(t,t0+.2+i*.12,.4));if(k<=0)return;
    const on=active<0||active===i;x.save();x.translate(nx,ny);x.scale(k,k);x.beginPath();x.arc(0,0,o.nr??58,0,7);x.fillStyle=on?col:'#fff';x.fill();x.lineWidth=4;x.strokeStyle=col;x.stroke();
    text(String(i+1),0,-16,o.ns??30,on?'#fff':col,{al:'center',w:800});text(n,0,18,o.ls??21,on?'#fff':col,{al:'center',w:800});x.restore()});x.restore()}
// compact stage bar for stage screens
function stageBar(active,t){const k=eo(pr(t,.1,.4));x.save();x.globalAlpha*=k;STEPS.forEach(([n,col],i)=>{const px=90+i*182,on=i===active,done=i<active;
  rr(px,560,170,54,27,on?col:done?'#fff':'#f8fafc',on||done?col:K.line,on?0:2);text((i+1)+' '+n,px+85,588,22,on?'#fff':done?col:K.mute,{al:'center',w:800})});x.restore()}
function action(s,py,t,t0,col=GREEN){const a=eo(pr(t,t0-.15,.4));if(a<=0)return;x.save();x.globalAlpha*=a;x.translate((1-a)*-50,0);rr(90,py,900,104,22,'#fff',col,3,true);let fs=30;font(fs,800);while(x.measureText(s).width>770&&fs>20){fs--;font(fs,800)}text(s,130,py+53,fs,K.ink,{w:800,max:3000});x.restore();checkMark(940,py+52,24,pr(t,t0,.35),col)}
function bigStat(v,label,cx,cy,t,t0,col=BLUE,sz=120){const k=back(pr(t,t0-.1,.5));if(k<=0)return;x.save();x.translate(cx,cy);x.scale(k,k);text(v,0,0,sz,col,{al:'center',w:800,max:3000});x.restore();
  text(label,cx,cy+Math.max(sz*.62,66),28,K.sub,{al:'center',w:700,a:eo(pr(t,t0+.1,.4)),max:3000})}
function signal(s,x0,y0,x1,y1,p,col){if(p<=0)return;const e=eio(p);chip(s,lerp(x0,x1,e),lerp(y0,y1,e),Math.min(1,p*3)*(1-cl((p-.85)/.15)),col,'#fff',24)}

const SC=[
// 0 HOOK: AI chat, 3 products, yours left out
t=>{head(0,t,66);const q='best running shoes',sh=Math.floor(cl((t-.3)/1)*q.length);chat(90,620,900,190,eo(pr(t,.2,.4)),q,sh);
  ['Brand A','Brand B','Brand C'].forEach((n,j)=>product(240+j*300,1000,n,eo(pr(t,1.1+j*.12,.4)),{rank:String(j+1)}));
  const y=eo(pr(t,1.6,.5));if(y>0){product(540,1330,'Your product',y,{ghost:1,s:.8});text('?',640,1250,60,K.mute,{al:'center',w:800,a:y})}},
// 1 39% + shortlist
t=>{head(1,t);const tl=fw(1,'short',0,3);bigStat('39%','of US shoppers already use AI to shop',540,720,t,.3);
  const k=eo(pr(t,tl-.2,.45));if(k>0){x.save();x.globalAlpha*=k;rr(140,930,800,500,28,'#fff',null,0,true);sparkle(186,982,16,BLUE);text('AI shortlist',214,983,26,K.sub,{w:800});x.restore();
    ['Brand A','Brand B','Brand C'].forEach((n,j)=>product(310+j*230,1200,n,eo(pr(t,tl+j*.12,.4)),{s:.85,rank:String(j+1)}))}},
// 2 88% / 93%
t=>{head(2,t);const t8=fw(2,'88',0,1.2),t9=fw(2,'93',0,3.5);
  [['88%','accepted the AI Mode shortlist as it was',t8,700],['93%','of ChatGPT shopping sessions never clicked out',t9,1030]].forEach(([v,l,tt,py])=>{const k=eo(pr(t,tt-.15,.45));if(k<=0)return;x.save();x.globalAlpha*=k;x.translate((1-k)*-40,0);
    rr(90,py,900,270,28,'#fff',null,0,true);text(v,140,py+110,110,BLUE,{w:800});text(l,140,py+210,30,K.ink,{w:700,max:820});x.restore()});
  const b=pr(t,fw(2,'website',0,5)-.1,.4);if(b>0){chip('Visit website',760,1380,b,K.sub,'#fff',28);crossBadge(880,1350,pr(t,fw(2,'website',0,5)+.2,.35),24)}},
// 3 74% vs 10%
t=>{head(3,t);const t7=fw(3,'74',0,1.5),t1=fw(3,'10',0,4);const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;rr(90,660,900,620,28,'#fff',null,0,true);
  [['#1 product',74,t7,BLUE,780],['#3 or lower',10,t1,K.mute,1020]].forEach(([n,v,tt,col,py])=>{const g=eio(pr(t,tt-.1,.8));text(n,140,py,32,K.ink,{w:800});rr(140,py+40,800,70,35,'#eef2f6');
    rr(140,py+40,Math.max(70,800*v/100*g),70,35,col);text(Math.round(v*g)+'% picked it',140+Math.max(70,800*v/100*g)+20,py+76,30,col===K.mute?K.sub:col,{w:800})});x.restore();
  callout('HOW DOES AI DECIDE?',540,1380,pr(t,fw(3,'decide',0,7)-.2,.4),BLUE)},
// 4 signals + 59%
t=>{head(4,t);const ty=fw(4,'YouTube',0,2),td=fw(4,'domain',0,5),t5=fw(4,'59',0,8);const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;
  rr(90,620,900,560,28,'#fff',null,0,true);text('How closely each signal tracks AI visibility',130,670,24,K.sub,{w:700});
  [['YouTube mentions',.7,ty,BLUE],['Brand mentions',.7,ty+.4,BLUE],['Domain authority',.3,td,K.mute]].forEach(([n,v,tt,col],j)=>{const py=740+j*140,g=eio(pr(t,tt-.1,.7));text(n,130,py,30,K.ink,{w:800});
    rr(130,py+30,820,44,22,'#eef2f6');rr(130,py+30,Math.max(44,820*v*g),44,22,col);text(v.toFixed(1),130+Math.max(44,820*v*g)-14,py+53,22,'#fff',{al:'right',w:800,a:g})});x.restore();
  const c=eo(pr(t,t5-.15,.45));if(c>0){x.save();x.globalAlpha*=c;rr(90,1220,900,190,28,K.blueS,BLUE,3);text('59%',140,1300,72,BLUE,{w:800});text('trust AI more when they’ve',350,1290,28,K.ink,{w:700});text('seen the brand elsewhere',350,1330,28,K.ink,{w:700});x.restore()}},
// 5 signals from customers -> loop
t=>{head(5,t);const tr=fw(5,'reviews',0,2),tv=fw(5,'videos',0,2.6),tb=fw(5,'searches',0,3.2),tk=fw(5,'five-stage',0,5);
  loop(540,1080,300,tk-.3,t,-1);
  [['Reviews',tr,200],['Videos',tv,540],['Brand searches',tb,880]].forEach(([n,tt,cx])=>{const p=pr(t,tt-.1,1.6);if(p>0&&p<1)signal(n,cx,640,540,1080,p,BLUE);else if(p<=0)return});
  if(t<tk-.3)[['Reviews',tr,200],['Videos',tv,540],['Brand searches',tb,880]].forEach(([n,tt,cx])=>chip(n,cx,700,pr(t,tt-.1,.3)*(1-pr(t,tt+.3,.3)),BLUE,'#fff',28))},
// 6 STAGE 1
t=>{head(6,t);stageBar(0,t);const tc=fw(6,'clean',0,2.5);bigStat('Clean product data','so AI can read you',540,720,t,tc,BLUE,64);
  [['Fill in every feed field','feed'],['Collect verified reviews','reviews'],['Answer real buyer questions','questions']].forEach(([s,w],j)=>action(s,880+j*140,t,fw(6,w,0,4+j),BLUE))},
// 7 STAGE 2
t=>{head(7,t);stageBar(1,t);const tq=fw(7,'quizzes',0,2.5),t3=fw(7,'three',0,5);const k=eo(pr(t,tq-.2,.45));
  if(k>0){x.save();x.globalAlpha*=k;rr(90,680,500,560,28,'#fff',GREEN,3,true);text('Product quiz',130,735,24,K.sub,{w:800});text('What’s your skin type?',130,795,30,K.ink,{w:800});
    ['Dry','Oily','Combination'].forEach((o,j)=>{const sel=j===2&&t>tq+.8;rr(130,840+j*110,420,86,20,sel?'#dcfce7':'#f8fafc',sel?GREEN:K.line,sel?3:2);text(o,160,883+j*110,28,K.ink,{w:700})});x.restore()}
  bigStat('~5%','of quiz takers buy',800,820,t,tq+.6,GREEN,96);bigStat('2.75×','the usual rate',800,1110,t,t3-.1,GREEN,96)},
// 8 STAGE 3
t=>{head(8,t);stageBar(2,t);const t19=fw(8,'19',0,2.5),tm=fw(8,'mentions',0,6),trv=fw(8,'reviews',0,8);
  const ob=eio(pr(t,.4,1));x.save();x.globalAlpha*=eo(pr(t,.2,.4));rr(150,880,300,220,16,'#d6a76c');x.save();x.translate(150,880);x.rotate(-ob*.5);rr(0,-40,300,40,10,'#c08a4e');x.restore();
  if(ob>.5){sparkle(300,850,26*eo((ob-.5)*2),AMB);sparkle(240,800,16*eo((ob-.5)*2),AMB)}x.restore();
  const ph=eo(pr(t,t19-.3,.5));if(ph>0){x.save();x.globalAlpha*=ph;rr(560,700,200,380,30,K.ink);rr(575,740,170,300,14,'#1e293b');x.beginPath();x.arc(660,890,26,0,7);x.fillStyle=K.red;x.fill();x.restore()}
  bigStat('19%','post photos or videos of gift-like packaging',540,1220,t,t19,AMB,90);
  signal('→ YouTube mention',660,1080,900,660,pr(t,tm-.2,1.4),AMB);
  if(t>trv-.2)chip('Ask for reviews 7–14 days after delivery',540,1420,pr(t,trv-.2,.4),GREEN,'#f0fdf4',26)},
// 9 STAGE 4
t=>{head(9,t);stageBar(3,t);const t21=fw(9,'21',0,2),t44=fw(9,'44',0,3.5),tr=fw(9,'reminders',0,8);const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;
  rr(90,660,900,560,28,'#fff',null,0,true);text('Repeat customers are…',130,710,26,K.sub,{w:700});
  [['of customers',21,t21,PURP,320],['of revenue',44,t44,PURP,760]].forEach(([n,v,tt,col,cx])=>{const g=eio(pr(t,tt-.1,.8)),h=380*v/44*g;rr(cx-110,1140-h,220,h,18,col);text(v+'%',cx,1140-h-36,52,col,{al:'center',w:800,a:g});text(n,cx,1180,28,K.ink,{al:'center',w:800})});x.restore();
  action('Reorder reminders: half of 2nd purchases come within 30 days',1260,t,tr,PURP)},
// 10 STAGE 5
t=>{head(10,t);stageBar(4,t);const tn=fw(10,'name',0,2),tw=fw(10,'narrows',0,4.5),tr=fw(10,'Ridge',0,6.5);
  const q='best minimalist wallet from Ridge',sh=Math.floor(cl((t-tn+.1)/1.2)*q.length);chat(90,660,900,190,eo(pr(t,.2,.4)),q,sh);
  const p=eo(pr(t,tw-.2,.5));if(p>0)product(540,1020,'Ridge',p,{col:K.red,tint:'#fee2e2',rank:'1'});
  bigStat('~70%','of Ridge’s sales: direct, organic & branded search',540,1290,t,tr,K.red,90)},
// 11 LOOP COMPLETE
t=>{head(11,t);const sp=eio(pr(t,.4,Math.max(1.5,S[11].dur-1.6)));loop(540,1000,320,.1,t,-1,{spin:sp});
  const an=-Math.PI/2+Math.PI*2*sp;if(sp<.97){x.beginPath();x.arc(540+Math.cos(an)*320,1000+Math.sin(an)*320,20,0,7);x.fillStyle=BLUE;x.fill()}
  if(sp>.98)callout('YOUR PRODUCT: #1 ON THE NEXT SHORTLIST',540,1420,pr(t,.4+Math.max(1.5,S[11].dur-1.6),.4),BLUE)},
// 12 MEASUREMENT GAP
t=>{head(12,t);const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;rr(90,640,900,640,28,'#fff',null,0,true);text('Last-click report',130,700,28,K.ink,{w:800});text('Credit',950,700,24,K.sub,{al:'right',w:700});
  [['Last click before purchase','100%',BLUE],['Creator videos','0',K.red],['Reviews','0',K.red],['Brand searches it led to','0',K.red]].forEach(([n,v,col],j)=>{const py=780+j*120,a=eo(pr(t,.5+j*.25,.35));x.save();x.globalAlpha*=a;
    rr(130,py,820,96,18,j?'#fef2f2':'#eff6ff');text(n,160,py+48,30,K.ink,{w:700});text(v,920,py+48,34,col,{al:'right',w:800});x.restore()});x.restore()},
// 13 EASY VS HARD
t=>{head(13,t);const te=fw(13,'easy',0,1.5),th=fw(13,'Reviews',0,4.5);
  [['Easy to copy',['Quizzes','Support bots','Email flows','Shopping protocols'],te,90,K.sub,'#f8fafc'],['Hard to copy',['Reviews','Creators','Community','Brand recall'],th,560,GREEN,'#f0fdf4']].forEach(([n,items,tt,px,col,bg],c)=>{
    const k=eo(pr(t,tt-.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;rr(px,660,430,700,28,bg,col,c?4:2,true);text(n,px+40,720,32,col,{w:800});
    items.forEach((s,j)=>{const a=eo(pr(t,tt+.15*j,.3));x.save();x.globalAlpha*=a;rr(px+40,780+j*130,350,100,20,'#fff',K.line,2);text(s,px+70,830+j*130,28,K.ink,{w:700});x.restore()});
    if(c)text('What lasts',px+215,1320,26,GREEN,{al:'center',w:800,a:eo(pr(t,th+1,.4))});else text('Just keep up',px+215,1320,26,K.sub,{al:'center',w:800,a:eo(pr(t,tt+1,.4))});x.restore()})},
// 14 MAIN IDEA
t=>{head(14,t);loop(540,960,280,.1,t,-1,{spin:(t*.25)%1});const k=eo(pr(t,.6,.5));if(k>0){x.save();x.globalAlpha*=k;rr(140,1300,800,130,30,K.ink);text('Shopping is part of the product',540,1366,38,'#fff',{al:'center',w:800});x.restore()}},
// 15 OUTRO
t=>{const k=eo(pr(t,0,.35));x.save();x.globalAlpha*=k;const b=back(pr(t,0,.45));x.save();x.translate(540,820);x.scale(b,b);x.beginPath();x.arc(0,0,170,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle=K.blue;x.stroke();
  x.save();x.beginPath();x.arc(0,0,164,0,7);x.clip();const im=IMG.me;if(im&&im.width)x.drawImage(im,-164,-164,328,328);x.restore();x.restore();
  text('Zakariya',540,1080,72,K.ink,{al:'center',w:800});text('SEO & GEO',540,1150,32,K.sub,{al:'center',w:700});
  callout('FOLLOW FOR MORE SEO & GEO EXPLAINERS',540,1290,pr(t,.3,.35),K.blue);x.restore()},
];
const endCard=(si,lt)=>si===LAST;
function chromeTop(si,lt){if(endCard(si,lt))return;tagPill('AI SHOPPING',90,330,1,BLUE);
  const n=S.length-1;for(let i=0;i<n;i++){const px=990-(n-i)*28+8,f=si>i?1:si<i?0:cl(lt/S[si].dur);rr(px,324,22,8,4,'#d1d5db');if(f>0)rr(px,324,22*f,8,4,BLUE)}}
