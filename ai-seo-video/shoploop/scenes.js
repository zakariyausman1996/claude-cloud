// ---------- Shopping is part of the product (Growth Memo, Kevin Indig) ----------
const LAST=S.length-1,BLUE=K.blue,GREEN=K.green,AMB=K.amber,PURP='#7c3aed',RED=K.red;
function fw(i,w,n=0,fb=0){const ws=Array.isArray(w)?w:[w];for(const q of ws){const m=S[i].words.filter(o=>o.w.toLowerCase().replace(/[^a-z0-9.'-]/g,'')===q.toLowerCase());if(m[n]||m[0])return (m[n]||m[0]).t-S[i].start}return fb}
const HEADS=['Is your product on the AI shortlist?','Are shoppers really using AI to shop?','Do shoppers look beyond that list?','Does the top spot matter?',
 'How does AI decide who makes the list?','Where do those signals come from?','Stage 1: Can AI read your products?','Stage 2: How do you convert fewer visits?',
 'Stage 3: Is your unboxing worth sharing?','Stage 4: Why chase the second purchase?','Stage 5: Do shoppers ask for you by name?','Why do most brands underfund this?',
 "What's the main idea?",''];
const NOSLIDE={6:1,7:1,8:1,9:1,10:1};
function head(i,t,sz0=58){let sz=sz0,lines=wrap(HEADS[i],sz,800,900);if(lines.length>2){sz=48;lines=wrap(HEADS[i],sz,800,900)}const lh=sz*1.16;
  lines.forEach((l,j)=>{const k=eo(pr(t,.05+j*.1,.4));text(l,90,430+j*lh+(1-k)*24,sz,K.ink,{a:k,w:800,max:3000})});return 430+lines.length*lh}
// count-up number
const cu=(v,t,t0,dec=0,dur=.9)=>(v*eio(pr(t,t0,dur))).toFixed(dec);
function src(s,px,py,a=1,al='left'){text('Source: '+s,px,py,22,K.sub,{w:600,a,al,max:3000})}
// ---- product icons
function shoe(col){x.fillStyle=col;x.beginPath();x.moveTo(-62,14);x.lineTo(-60,-22);x.quadraticCurveTo(-56,-40,-36,-38);x.lineTo(-12,-18);x.quadraticCurveTo(22,-4,52,2);
  x.quadraticCurveTo(70,6,68,18);x.lineTo(-62,18);x.closePath();x.fill();rr(-64,14,134,12,6,'#334155');x.strokeStyle='#fff';x.lineWidth=3;
  for(let i=0;i<3;i++){x.beginPath();x.moveTo(-30+i*12,-26+i*5);x.lineTo(-22+i*12,-18+i*5);x.stroke()}}
function wallet(col){rr(-56,-36,112,72,12,col);rr(8,-16,52,32,10,'#ffffff55');x.beginPath();x.arc(30,0,6,0,7);x.fillStyle='#fff';x.fill()}
function product(cx,cy,label,a=1,o={}){if(a<=0)return;x.save();x.globalAlpha*=a;x.translate(cx,cy);const s=o.s??1;x.scale(s,s);
  rr(-110,-120,220,240,22,o.ghost?'#f8fafc':'#fff',o.hl??(o.ghost?null:K.line),o.hl?4:2,!o.ghost);
  if(o.ghost){x.save();x.setLineDash([8,8]);rr(-110,-120,220,240,22,null,'#94a3b8',3);x.restore()}
  rr(-85,-98,170,118,16,o.ghost?'#eef2f6':(o.tint??'#eef2ff'));x.save();x.translate(0,-40);(o.icon==='wallet'?wallet:shoe)(o.ghost?'#cbd5e1':(o.col??'#6366f1'));x.restore();
  text(label,0,52,24,o.ghost?K.mute:K.ink,{al:'center',w:800,max:3000});if(o.rank)badge(o.rank,-92,-102,1,o.hl??BLUE);x.restore()}
function chat(px,py,w,a,q,shown,o={}){if(a<=0)return;x.save();x.globalAlpha*=a;rr(px,py,w,190,30,'#fff',null,0,true);sparkle(px+44,py+48,16,BLUE);text('AI shopping assistant',px+74,py+49,24,K.sub,{w:700});
  rr(px+30,py+86,w-60,64,32,o.hl?'#fef2f2':'#f1f5f9',o.hl??null,o.hl?3:0);text(q.slice(0,shown),px+60,py+119,28,o.hl?RED:K.ink,{w:o.hl?800:600,max:3000});x.restore()}
function statCard(px,py,w,h,num,label,source,t,t0,col=BLUE){const k=eo(pr(t,t0-.15,.45));if(k<=0)return;x.save();x.globalAlpha*=k;x.translate((1-k)*-40,0);
  rr(px,py,w,h,28,'#fff',null,0,true);text(num(),px+50,py+100,104,col,{w:800,max:3000});
  wrap(label,30,700,w-100).forEach((l,j)=>text(l,px+50,py+185+j*38,30,K.ink,{w:700,max:3000}));src(source,px+50,py+h-34);x.restore()}
function action(s,py,t,t0,col=GREEN){const a=eo(pr(t,t0-.15,.4));if(a<=0)return;x.save();x.globalAlpha*=a;x.translate((1-a)*-50,0);rr(90,py,900,104,22,'#fff',col,3,true);
  let fs=30;font(fs,800);while(x.measureText(s).width>770&&fs>20){fs--;font(fs,800)}text(s,130,py+53,fs,K.ink,{w:800,max:3000});x.restore();checkMark(940,py+52,24,pr(t,t0,.35),col)}
function fly(s,x0,y0,x1,y1,p,col){if(p<=0||p>=1)return;const e=eio(p);chip(s,lerp(x0,x1,e),lerp(y0,y1,e),Math.min(1,p*4)*(1-cl((p-.8)/.2)),col,'#fff',26)}

// ---- the 5-stage loop
const STEPS=[['Visible',BLUE],['Convert',GREEN],['Unbox',AMB],['Repeat',PURP],['Brand',RED]];
const LC=[540,1010],LR=290;
const nodeXY=i=>{const an=-Math.PI/2+i*Math.PI*2/5;return [LC[0]+Math.cos(an)*LR,LC[1]+Math.sin(an)*LR]};
function drawLoop(t,o={}){const nodesA=o.nodesA??1,done=o.done??-1,active=o.active??-1;
  x.lineWidth=6;x.strokeStyle='#e2e8f0';x.beginPath();x.arc(LC[0],LC[1],LR,0,7);x.stroke();
  if(o.spin!==undefined){x.strokeStyle=BLUE;x.beginPath();x.arc(LC[0],LC[1],LR,-Math.PI/2,-Math.PI/2+Math.PI*2*o.spin);x.stroke()}
  const ca=o.centerA??1;if(ca>0){x.save();x.globalAlpha*=ca;const pu=o.pulse?1+.05*Math.sin(t*6):1;x.translate(LC[0],LC[1]);x.scale(pu,pu);x.beginPath();x.arc(0,0,LR*.42,0,7);x.fillStyle='#fff';x.fill();
    x.lineWidth=5;x.strokeStyle=BLUE;x.stroke();sparkle(0,-58,16,BLUE);text('AI',0,-12,34,BLUE,{al:'center',w:800});text('Shortlist',0,28,34,BLUE,{al:'center',w:800});x.restore()}
  STEPS.forEach(([n,col],i)=>{const k=typeof nodesA==='function'?nodesA(i):nodesA;if(k<=0)return;const [nx,ny]=nodeXY(i),on=i===active,isDone=i<=done;
    x.save();x.translate(nx,ny);const s=back(k)*(on?1+.06*Math.sin(t*7):1);x.scale(s,s);x.beginPath();x.arc(0,0,66,0,7);x.fillStyle=on||isDone?col:'#fff';x.fill();x.lineWidth=5;x.strokeStyle=col;x.stroke();
    text(String(i+1),0,-16,32,on||isDone?'#fff':col,{al:'center',w:800});text(n,0,20,22,on||isDone?'#fff':col,{al:'center',w:800});x.restore();
    if(isDone){const ck=typeof o.checkA==='function'?o.checkA(i):1;checkMark(nx+48,ny-48,20,ck,GREEN)}})}
// stage screen: loop -> tick previous -> zoom into this node -> content
function stage(si,k,t,content){const col=STEPS[k][1],[nx,ny]=nodeXY(k),zp=eio(pr(t,.6,.7));head(si,t);
  if(zp<1){x.save();x.beginPath();x.rect(0,560,W,980);x.clip();x.globalAlpha*=1-zp;x.translate(nx,ny);x.scale(1+3.2*zp,1+3.2*zp);x.translate(-nx,-ny);
    drawLoop(t,{done:k-1,active:k,checkA:i=>i===k-1?pr(t,.05,.35):1});x.restore()}
  const ca=eo(pr(t,1,.45));if(ca<=0)return;x.save();x.globalAlpha*=ca;x.translate(540,1000);const s=.94+.06*ca;x.scale(s,s);x.translate(-540,-1000);
  rr(90,575,250,62,31,col);text((k+1)+' · '+STEPS[k][0].toUpperCase(),215,607,26,'#fff',{al:'center',w:800,ls:2});content(t);x.restore()}

const SC=[
// 0 HOOK
t=>{head(0,t,66);text('Based on Growth Memo by Kevin Indig',90,585,24,K.sub,{w:700,a:eo(pr(t,.4,.4))});
  const q='best running shoes',sh=Math.floor(cl((t-.4)/.9)*q.length);chat(90,640,900,eo(pr(t,.3,.4)),q,sh);
  [['Brand A','#6366f1'],['Brand B','#0ea5e9'],['Brand C','#f97316']].forEach(([n,c],j)=>product(240+j*300,1030,n,eo(pr(t,1.2+j*.12,.4)),{rank:String(j+1),col:c}));
  const y=eo(pr(t,1.7,.5));if(y>0){product(540,1340,'Your product',y,{ghost:1,s:.8});text('?',635,1262,60,K.mute,{al:'center',w:800,a:y})}},
// 1 39% (Adobe) + the shortlist
t=>{head(1,t);const t39=fw(1,'39',0,.2),tl=fw(1,'short',0,4);const k=back(pr(t,t39,.5));
  if(k>0){x.save();x.translate(540,690);x.scale(k,k);text(cu(39,t,t39)+'%',0,0,130,BLUE,{al:'center',w:800});x.restore()}
  text('of US consumers have used AI for shopping',540,775,30,K.ink,{al:'center',w:700,a:eo(pr(t,t39+.2,.4))});src('Adobe',540,820,eo(pr(t,t39+.3,.4)),'center');
  const s=eo(pr(t,tl-.2,.45));if(s>0){x.save();x.globalAlpha*=s;rr(140,880,800,530,28,'#fff',null,0,true);sparkle(186,932,16,BLUE);text('AI shortlist',214,933,26,K.sub,{w:800});x.restore();
    [['Brand A','#6366f1'],['Brand B','#0ea5e9'],['Brand C','#f97316']].forEach(([n,c],j)=>product(310+j*230,1160,n,eo(pr(t,tl+j*.12,.4)),{s:.85,rank:String(j+1),col:c}))}},
// 2 88% (AI Mode study) + 93% (ChatGPT study)
t=>{head(2,t);const t8=fw(2,'88',0,2),t9=fw(2,'93',0,5);
  statCard(90,600,900,330,()=>cu(88,t,t8)+'%','accepted the AI Mode shortlist as-is','Growth Memo AI Mode study',t,t8);
  statCard(90,965,900,370,()=>cu(93,t,t9)+'%','of ChatGPT shopping sessions had no meaningful click-out','ChatGPT shopping study, via Profound',t,t9);
  const b=pr(t,fw(2,'click-out',0,7)-.1,.4);if(b>0){chip('Visit website',800,1400,b,K.sub,'#fff',26);crossBadge(915,1372,pr(t,fw(2,'click-out',0,7)+.25,.35),22)}},
// 3 74% vs 10% (AI Mode study)
t=>{head(3,t);const t7=fw(3,'74',0,1.5),t1=fw(3,'10',0,4);const k=eo(pr(t,.2,.45));if(k<=0)return;x.save();x.globalAlpha*=k;rr(90,600,900,640,28,'#fff',null,0,true);
  [['Top-ranked product',74,t7,BLUE,700],['Rank 3 and below',10,t1,K.mute,950]].forEach(([n,v,tt,col,py])=>{const g=eio(pr(t,tt-.1,.9)),w=Math.max(72,800*v/100*g);text(n,140,py,32,K.ink,{w:800});
    rr(140,py+40,800,72,36,'#eef2f6');rr(140,py+40,w,72,36,col);text(cu(v,t,tt-.1)+'% picked it',140+w+18,py+77,30,col===K.mute?K.sub:col,{w:800})});
  src('Growth Memo AI Mode study',140,1195);x.restore();callout('SO HOW DOES AI DECIDE?',540,1340,pr(t,fw(3,'decide',0,7)-.3,.4),BLUE)},
// 4 Ahrefs correlations + IAB Australia 59%
t=>{head(4,t);const ty=fw(4,'YouTube',0,3),td=fw(4,'domain',0,6),t5=fw(4,'59',0,9);const k=eo(pr(t,.2,.45));if(k>0){x.save();x.globalAlpha*=k;
  rr(90,600,900,560,28,'#fff',null,0,true);text('Link to visibility in Google’s AI Overviews',130,650,26,K.sub,{w:700});
  [['YouTube mentions',.7,'Strong link',ty,BLUE],['Brand mentions',.7,'Strong link',ty+.5,BLUE],['Domain Rating',.3,'Weak link',td,K.mute]].forEach(([n,v,lab,tt,col],j)=>{const py=720+j*125,g=eio(pr(t,tt-.1,.7)),w=Math.max(44,600*v*g);
    text(n,130,py,30,K.ink,{w:800});rr(130,py+28,600,40,20,'#eef2f6');rr(130,py+28,w,40,20,col);text(lab+' ('+v.toFixed(1)+')',950,py+48,26,col===K.mute?K.sub:col,{al:'right',w:800,a:g})});
  src('Ahrefs',130,1120);x.restore()}
  const c=eo(pr(t,t5-.15,.45));if(c>0){x.save();x.globalAlpha*=c;rr(90,1195,900,250,28,K.blueS,BLUE,3);text(cu(59,t,t5)+'%',140,1290,96,BLUE,{w:800});
    text('of AI shoppers trust AI more when they’ve',380,1270,27,K.ink,{w:700});text('seen the brand advertised elsewhere',380,1308,27,K.ink,{w:700});src('IAB Australia',380,1360);x.restore()}},
// 5 signals from customers -> the loop
t=>{head(5,t);const tr=fw(5,'reviews',0,2),tv=fw(5,'videos',0,2.6),tb=fw(5,'searches',0,3.2),tk=fw(5,['five-stage','five'],0,5);
  drawLoop(t,{nodesA:i=>pr(t,tk-.2+i*.13,.45),centerA:eo(pr(t,.2,.45)),pulse:t>tr&&t<tk});
  [['Reviews',tr,200],['Videos',tv,540],['Brand searches',tb,880]].forEach(([n,tt,cx])=>fly(n,cx,620,LC[0],LC[1],pr(t,tt-.15,1.1),BLUE))},
// 6 STAGE 1: visible
t=>stage(6,0,t,t=>{[['Fill in every feed field','feed'],['Collect verified reviews','reviews'],['Answer the real questions buyers ask','questions']].forEach(([s,w],j)=>action(s,680+j*130,t,fw(6,w,0,4+j),BLUE));
  const f=eo(pr(t,fw(6,'feed',0,4)-.1,.4));if(f>0){x.save();x.globalAlpha*=f;rr(90,1080,900,380,28,'#fff',null,0,true);text('Product feed',130,1130,26,K.sub,{w:800});
    ['Title','Price','Images','Availability','Reviews'].forEach((n,j)=>{const g=eio(pr(t,fw(6,'feed',0,4)+j*.25,.5)),py=1175+j*54;text(n,130,py,26,K.ink,{w:700});rr(330,py-12,520,24,12,'#eef2f6');rr(330,py-12,520*g,24,12,BLUE);if(g>.98)checkMark(900,py,14,1,GREEN)});x.restore()}}),
// 7 STAGE 2: convert (RevenueHunt)
t=>stage(7,1,t,t=>{const tq=fw(7,'quizzes',0,3),t3=fw(7,'2.75',0,5.5);
  x.save();rr(90,680,470,620,28,'#fff',GREEN,3,true);text('Product quiz',130,735,24,K.sub,{w:800});text('What’s your skin type?',130,795,30,K.ink,{w:800});
  ['Dry','Oily','Combination'].forEach((o,j)=>{const sel=j===2&&t>tq+.6;rr(130,845+j*110,390,86,20,sel?'#dcfce7':'#f8fafc',sel?GREEN:K.line,sel?3:2);text(o,160,888+j*110,28,K.ink,{w:700})});
  rr(130,1190,390,70,35,t>tq+1?GREEN:'#e5e7eb');text('See my match',325,1226,26,'#fff',{al:'center',w:800});x.restore();
  const a=back(pr(t,tq,.5));if(a>0){x.save();x.translate(790,800);x.scale(a,a);text('~'+cu(5,t,tq)+'%',0,0,100,GREEN,{al:'center',w:800});x.restore();text('of quiz takers buy',790,870,28,K.ink,{al:'center',w:700,a:eo(pr(t,tq+.2,.4))})}
  const b=back(pr(t,t3-.1,.5));if(b>0){x.save();x.translate(790,1060);x.scale(b,b);text(cu(2.75,t,t3-.1,2)+'×',0,0,100,GREEN,{al:'center',w:800});x.restore();text('the usual rate',790,1130,28,K.ink,{al:'center',w:700,a:eo(pr(t,t3+.1,.4))})}
  src('RevenueHunt',790,1200,eo(pr(t,tq+.4,.4)),'center')}),
// 8 STAGE 3: unbox (Ryder)
t=>stage(8,2,t,t=>{const t19=fw(8,'19',0,3),tm=fw(8,'mentions',0,6.5),trv=fw(8,'review',0,8.5);
  x.save();rr(100,670,340,600,40,K.ink);rr(118,710,304,500,22,'#fef3c7');const ob=eio(pr(t,1.2,1.2));
  rr(180,1010,180,120,10,'#d6a76c');x.save();x.translate(180,1010);x.rotate(-ob*.7);rr(0,-26,180,26,8,'#c08a4e');x.restore();if(ob>.5){sparkle(270,960,30*eo((ob-.5)*2),AMB);sparkle(215,920,18*eo((ob-.5)*2),AMB)}
  x.beginPath();x.arc(150,745,10,0,7);x.fillStyle=Math.sin(t*6)>0?RED:'#fecaca';x.fill();text('REC',168,746,20,RED,{w:800});rr(140,1170,260,10,5,'#e5e7eb');rr(140,1170,260*cl((t-1)/(S[8].dur-1)),10,5,RED);x.restore();
  const a=back(pr(t,t19-.1,.5));if(a>0){x.save();x.translate(740,780);x.scale(a,a);text(cu(19,t,t19-.1)+'%',0,0,110,AMB,{al:'center',w:800});x.restore()}
  const la=eo(pr(t,t19+.2,.4));['say gift-like packaging gets','them to post photos or videos'].forEach((l,j)=>text(l,740,870+j*38,27,K.ink,{al:'center',w:700,a:la}));src('Ryder, 1,300 US shoppers',740,960,la,'center');
  fly('Video mention → AI visibility',270,1000,740,1100,pr(t,tm-.3,1.2),AMB);if(t>tm+.9)chip('Video mention → AI visibility',740,1100,pr(t,tm+.85,.2),AMB,'#fff',26);
  action('Ask for a review 1–2 weeks after delivery',1310,t,trv,AMB)}),
// 9 STAGE 4: repeat (Gorgias)
t=>stage(9,3,t,t=>{const t21=fw(9,'21',0,2),t44=fw(9,'44',0,3.5),tr=fw(9,'reminders',0,6);
  rr(90,670,900,590,28,'#fff',null,0,true);text('Repeat customers are…',130,720,26,K.sub,{w:700});
  [['of customers',21,t21,320],['of revenue',44,t44,760]].forEach(([n,v,tt,cx])=>{const g=eio(pr(t,tt-.1,.8)),h=380*v/44*g;rr(cx-110,1140-h,220,h,18,PURP);text(cu(v,t,tt-.1)+'%',cx,1140-h-36,52,PURP,{al:'center',w:800,a:g});text(n,cx,1180,28,K.ink,{al:'center',w:800})});
  src('Gorgias, 12,000+ merchants',540,1228,1,'center');
  action('Reorder reminders: half of 2nd purchases come within 30 days',1290,t,tr,PURP);src('Growth Memo',130,1425,eo(pr(t,tr,.4)))}),
// 10 STAGE 5: brand (Ridge) -> loop closes
t=>{const tb=fw(10,'back',0,9)-.4,out=eo(pr(t,tb,.4));
  if(out<1){x.save();x.globalAlpha*=1-out;stage(10,4,t,t=>{const tq=fw(10,'question',0,2.5),tr=fw(10,'Ridge',0,4),t70=fw(10,'70',0,7);
    const sw=t>tr-.1,q=sw?'Ridge wallet':'best minimalist wallet',sh=sw?q.length:Math.floor(cl((t-1.1)/1)*q.length);chat(90,670,900,1,q,sh,sw?{hl:RED}:{});
    if(sw)text('was: “best minimalist wallet”',540,900,24,K.sub,{al:'center',w:700,a:eo(pr(t,tr,.4))});
    product(540,1080,'Ridge',eo(pr(t,tr+.1,.45)),{icon:'wallet',col:'#1f2937',tint:'#fee2e2',hl:RED,rank:'1',s:.9});
    const a=back(pr(t,t70-.1,.5));if(a>0){x.save();x.translate(540,1290);x.scale(a,a);text('~'+cu(70,t,t70-.1)+'%',0,0,96,RED,{al:'center',w:800});x.restore()}
    const la=eo(pr(t,t70+.2,.4));text('of Ridge’s sales: direct, organic and branded search',540,1365,27,K.ink,{al:'center',w:700,a:la});src('Ridge’s CMO (podcast estimate)',540,1408,la,'center')});x.restore()}
  if(out>0){head(10,t);const z=eio(pr(t,tb,.8)),[nx,ny]=nodeXY(4);x.save();x.beginPath();x.rect(0,560,W,980);x.clip();x.globalAlpha*=out;x.translate(nx,ny);const s=lerp(4,1,z);x.scale(s,s);x.translate(-nx,-ny);
    drawLoop(t,{done:4,pulse:true,checkA:i=>i===4?pr(t,tb+.5,.35):1});x.restore();callout('BACK ON THE NEXT SHORTLIST',540,1430,pr(t,tb+.8,.4),BLUE)}},
// 11 underfunded + what lasts
t=>{head(11,t);const tq=fw(11,'Quizzes',0,4),th=fw(11,'Reviews',0,7);const k=eo(pr(t,.2,.45));if(k>0){x.save();x.globalAlpha*=k;rr(90,590,900,330,28,'#fff',null,0,true);
  text('Last-click report',130,640,28,K.ink,{w:800});text('Gets credit?',950,640,24,K.sub,{al:'right',w:700});
  [['Last click before purchase','✓',GREEN],['Creator videos','—',RED],['Reviews','—',RED],['Brand searches','—',RED]].forEach(([n,v,col],j)=>{const py=700+j*54,a=eo(pr(t,.5+j*.2,.3));text(n,130,py,26,K.ink,{w:700,a});text(v,940,py,30,col,{al:'right',w:800,a})});x.restore()}
  [['Easy to copy',['Quizzes','Support bots','Email flows','Shopping protocols'],tq,90,K.sub,'#f8fafc','Just keep up'],['Hard to copy',['Reviews','Creators','Community','Brand recall'],th,560,GREEN,'#f0fdf4','What lasts']].forEach(([n,items,tt,px,col,bg,foot],c)=>{
    const a=eo(pr(t,tt-.2,.45));if(a<=0)return;x.save();x.globalAlpha*=a;rr(px,950,430,520,28,bg,col,c?4:2,true);text(n,px+40,1005,30,col,{w:800});
    items.forEach((s,j)=>{const b=eo(pr(t,tt+.12*j,.3));x.save();x.globalAlpha*=b;rr(px+40,1045+j*88,350,72,18,'#fff',K.line,2);text(s,px+66,1081+j*88,26,K.ink,{w:700});x.restore()});
    text(foot,px+215,1440,26,col,{al:'center',w:800,a:eo(pr(t,tt+.8,.4))});x.restore()})},
// 12 MAIN IDEA
t=>{head(12,t);drawLoop(t,{done:4,spin:(t*.3)%1,nodesA:1});const k=eo(pr(t,.6,.5));if(k>0){x.save();x.globalAlpha*=k;rr(140,1360,800,110,30,K.ink);text('Shopping is part of the product',540,1416,38,'#fff',{al:'center',w:800});x.restore()}},
// 13 OUTRO
t=>{const k=eo(pr(t,0,.35));x.save();x.globalAlpha*=k;const b=back(pr(t,0,.45));x.save();x.translate(540,820);x.scale(b,b);x.beginPath();x.arc(0,0,170,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle=K.blue;x.stroke();
  x.save();x.beginPath();x.arc(0,0,164,0,7);x.clip();const im=IMG.me;if(im&&im.width)x.drawImage(im,-164,-164,328,328);x.restore();x.restore();
  text('Zakariya',540,1080,72,K.ink,{al:'center',w:800});text('SEO & GEO',540,1150,32,K.sub,{al:'center',w:700});
  callout('FOLLOW FOR MORE SEO & GEO EXPLAINERS',540,1290,pr(t,.3,.35),K.blue);x.restore()},
];
const endCard=(si,lt)=>si===LAST;
function chromeTop(si,lt){if(endCard(si,lt))return;tagPill('AI SHOPPING',90,330,1,BLUE);
  const n=S.length-1;for(let i=0;i<n;i++){const px=990-(n-i)*32+8,f=si>i?1:si<i?0:cl(lt/S[si].dur);rr(px,324,26,8,4,'#d1d5db');if(f>0)rr(px,324,26*f,8,4,BLUE)}}
