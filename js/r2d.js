// 🎨 짹짹 릴레이 디펜스 — 2D 화면 (비스듬한 쿼터뷰 캔버스)
// game.js 다음에 로드돼요. 게임 로직(step·AI·밸런스·온라인)은 그대로 쓰고, 게임 화면 그리기만 2D 캔버스로 바꿔요.
// 2D 전용 주소 2d.html 에서만 로드돼요 (index.html 은 3D 그대로).
// 그림 파일 넣기: img/2d/sprites.json 에 id를 적고 img/2d/u/<새id>.png · img/2d/t/<타워id>.png 를 넣으면 코드 그림 대신 그 그림을 써요.
(()=>{
document.documentElement.classList.add('v2d');

// ---------- 공통 도구 ----------
const OL='#1b1030',TAU=Math.PI*2;
const hx=n=>'#'+(n>>>0).toString(16).padStart(6,'0');
const mix=(n,m,f)=>{const a=[(n>>16)&255,(n>>8)&255,n&255],b=[(m>>16)&255,(m>>8)&255,m&255];return(Math.round(a[0]+(b[0]-a[0])*f)<<16)|(Math.round(a[1]+(b[1]-a[1])*f)<<8)|Math.round(a[2]+(b[2]-a[2])*f)};
const lt=(n,f)=>hx(mix(n,0xffffff,f)),dk=(n,f)=>hx(mix(n,0,f));
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const FONT='"Jua","Black Han Sans",system-ui,sans-serif';
function E(x,cx,cy,rx,ry,fill,lw,rot){x.beginPath();x.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,TAU);if(fill){x.fillStyle=fill;x.fill()}if(lw!==0){x.lineWidth=lw||5;x.strokeStyle=OL;x.stroke()}}
function Pn(x,pts,fill,lw){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(lw!==0){x.lineWidth=lw||5;x.lineJoin='round';x.strokeStyle=OL;x.stroke()}}
function L(x,pts,col,w,cap){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.lineCap=cap||'round';x.lineJoin='round';x.lineWidth=w+6;x.strokeStyle=OL;x.stroke();x.lineWidth=w;x.strokeStyle=col;x.stroke()}
function star(x,cx,cy,r,fill,lw){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,k=i%2?r*.48:r;p.push([cx+Math.cos(a)*k,cy+Math.sin(a)*k])}Pn(x,p,fill,lw)}
function emo(x,t,cx,cy,sz){x.save();x.font=`${sz}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(t,cx,cy);x.restore()}

// ---------- 🖼 그림 파일 슬롯 ----------
const IMG={u:{},t:{}};
fetch('img/2d/sprites.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{if(!j)return;['u','t'].forEach(k=>(j[k]||[]).forEach(id=>{const im=new Image();im.onload=()=>{IMG[k][id]=im;SPR.clear()};im.src=`img/2d/${k}/${id}.png`}))}).catch(()=>{});

// ---------- 🐦 새 그림 (정면 치비 스타일, 128×160 캔버스, 발끝 y=150) ----------
// s 몸 모양(r 둥근·b 뚱뚱·p 펭귄·o 타조) bk 부리(s 짧은·l 긴·h 갈고리·d 오리·p 앵무) cr 머리 장식 ey 눈(n 보통·a 화남·s 졸림·c 초롱) nk 목 길이 hd 머리 색 be 배 색 a 소품
const F={
 egg_legs:{s:'egg'},kiwi:{bk:'l',bc:0xe7d7b0,ey:'s',nw:1},chick:{cr:'tuft',ey:'c',bl:1},
 turkey:{s:'b',hd:0xe25555,tail:'fan',tc:[0x5b3a29,0x8a5a3c,0xd6a77a],a:['bowler'],wt:1},rooster:{cr:'comb',wt:1,tail:'sickle',tc:[0x1f2937,0x15803d]},
 pigeon:{be:0x8fa0b8,band:0x2dd4a0,ey:'s'},goose:{nk:.55,bc:0xf97316,ey:'a'},parrot:{bk:'p',bc:0xfacc15,cr:'plume',cc:0xef4444,hd:0x22c55e,wc:0x2563eb},
 crow:{ey:'a',bc:0x3f3f46,eyc:0xfacc15},pirate:{bk:'h',a:['pirate','patch']},duck:{bk:'d',hd:0x15803d,band:0xffffff,a:['tube','shades']},
 woodpecker:{bk:'l',bc:0x9ca3af,cr:'cap',cc:0xdc2626,be:0xf8fafc},seagull:{bc:0xfacc15,be:0xffffff,ey:'a'},swan:{nk:.8,bc:0xf97316,ey:'s'},
 penguin:{s:'p',be:0xffffff,bc:0xf59e0b,a:['scarf']},vampire:{ey:'a',eyc:0xef4444,a:['cape','fang'],cr:'ear',cc:0x450a0a},peacock:{tail:'peacock',cr:'plume',cc:0x0ea5e9,hd:0x1d4ed8},
 dodo:{s:'b',bk:'h',bc:0x9ca3af,ey:'s',a:['band']},falcon:{bk:'h',bc:0xfacc15,ey:'a',be:0xf5f5f4},albatross:{bc:0xfcd34d,be:0xffffff,ey:'s'},
 owl:{cr:'ear',ey:'big',bk:'h',bc:0xfacc15,be:0xfde68a},thunderbird:{cr:'bolt',cc:0xfde047,ey:'a',eyc:0xfde047},eagle:{bk:'h',bc:0xfacc15,hd:0xffffff,ey:'a'},
 phoenix:{cr:'flame',cc:0xfde047,ey:'a',aura:0xf97316,tail:'flame'},crocbird:{croc:1,bk:'l',bc:0xfbbf24},ostrich:{s:'o',nk:.9,hd:0xf0b9a8,a:['tutu','tiara'],ey:'c'},
 crane:{nk:.9,hd:0xffffff,cr:'cap',cc:0xdc2626,a:['legs','baby']},plasmabird:{cr:'flame',cc:0x60a5fa,aura:0xfb923c,ey:'a'},comet:{cr:'star',cc:0xfde047,tail:'flame',ey:'a'},
 plague:{bk:'mask',a:['hood'],ey:'a',eyc:0xa3e635},auroraowl:{cr:'ear',ey:'big',bk:'h',bc:0xfacc15,aura:0x67e8f9},blizgull:{bc:0xfacc15,be:0xffffff,a:['snowhat']},
 frostpeng:{s:'p',be:0xe0f2fe,bc:0x60a5fa,a:['scarf'],ey:'a'},stormeagle:{bk:'h',bc:0xfde047,hd:0xc7d2fe,ey:'a',cr:'bolt',cc:0xfde047},
 voltbat:{cr:'ear',cc:0x1f2937,ey:'a',eyc:0xfde047,a:['fang']},ghostcrow:{ey:'a',eyc:0x7dd3fc,ghost:1},
 hatch_chick:{cr:'tuft',ey:'c',bl:1,a:['shell','q']},hatch_fire:{cr:'tuft',ey:'c',bl:1,a:['shell','towel']},hatch_ice:{cr:'tuft',ey:'c',bl:1,a:['shell','cone']},
 hatch_thunder:{cr:'zap',ey:'c',bl:1,a:['shell']},hatch_wind:{cr:'tuft',ey:'c',bl:1,a:['shell','balloon']},hatch_dark:{cr:'tuft',ey:'s',bl:1,a:['shell','fart']},
 hatch_gold:{cr:'crown',cc:0xfde047,ey:'c',bl:1,a:['shell','sparkle']},hatch_dino:{ey:'a',a:['teeth','spines']},
 eggchief:{s:'b',cr:'comb',wt:1,a:['tophat','monocle','chain']},knight:{nk:.5,a:['helmet','legs'],ey:'a'},priest:{a:['halo','robe'],ey:'s'},
 berserk:{bk:'h',bc:0xfacc15,ey:'a',eyc:0xef4444,a:['horns']},warturkey:{s:'b',tail:'fan',tc:[0x7c2d12,0xb45309,0xfbbf24],wt:1,a:['helmet'],ey:'a'},
 bonecrow:{ey:'a',eyc:0xf43f5e,a:['skull']},lich:{cr:'ear',ey:'big',eyc:0xc084fc,a:['candle','hood']},shadowowl:{cr:'ear',ey:'big',eyc:0xfde047},
 mosscrane:{nk:.85,cr:'leaf',cc:0x84cc16,a:['legs']}};
const SPR=new Map();
function birdSpr(b,fr){const k=b.id+'|'+fr;let c=SPR.get(k);if(c)return c;c=mk(128,160);const x=c.getContext('2d');
 const im=IMG.u[b.id];if(im){const r=Math.min(128/im.width,160/im.height);x.drawImage(im,64-im.width*r/2,150-im.height*r,im.width*r,im.height*r)}else drawBird(x,b,fr);
 c._ay=150;SPR.set(k,c);return c}
function drawBird(x,b,fr){const f=F[b.id]||{},col=b.col,air=b.t==='A',sh=f.s||'r';
 const bc=f.bc!==undefined?f.bc:0xf59e0b,be=f.be!==undefined?f.be:mix(col,0xffffff,.45),wc=f.wc!==undefined?f.wc:mix(col,0,.18),hdc=f.hd!==undefined?f.hd:col;
 if(f.ghost)x.globalAlpha=.82;
 // 몸 치수
 let cx=64,cy=100,rx=34,ry=36;if(sh==='b'){rx=42;ry=36;cy=104}else if(sh==='p'){rx=30;ry=44;cy=96}else if(sh==='o'){rx=32;ry=26;cy=90}else if(sh==='egg'){rx=30;ry=38;cy=98}
 const nk=f.nk||0,lift=f.a&&f.a.includes('legs')?18:0;cy-=lift;
 let hX=64,hY=cy-ry*.35,hR=0;if(nk){hR=20;hY=cy-ry-nk*40}// 목 긴 새는 머리를 따로
 // 오라
 if(f.aura){const g=x.createRadialGradient(64,cy-10,8,64,cy-10,70);g.addColorStop(0,lt(f.aura,.3)+'cc');g.addColorStop(1,hx(f.aura)+'00');x.fillStyle=g;x.fillRect(0,0,128,160)}
 // 악어 (악어새)
 if(f.croc){E(x,64,138,56,16,'#4d7c0f');E(x,64,132,40,10,'#65a30d',3);[[36,124],[92,124]].forEach(e=>{E(x,e[0],e[1],7,7,'#fff',3);E(x,e[0],e[1],3,4,'#111',0)});for(let i=0;i<6;i++)Pn(x,[[22+i*15,142],[29+i*15,142],[25+i*15,150]],'#fff',2);cy-=18;hY-=18}
 // 꼬리
 if(f.tail==='fan'||f.tail==='peacock'){const n=f.tail==='peacock'?9:7,R=f.tail==='peacock'?62:50;for(let i=0;i<n;i++){const a=-Math.PI/2+(i-(n-1)/2)*(f.tail==='peacock'?.3:.34),tc=f.tc?f.tc[i%f.tc.length]:[0x0e7490,0x15803d,0x1d4ed8][i%3];
   const ex=64+Math.cos(a)*R,ey=cy-8+Math.sin(a)*R;E(x,(64+ex)/2,(cy-8+ey)/2,R*.52,12,hx(tc),4,a);if(f.tail==='peacock'){E(x,ex,ey,8,8,'#facc15',3);E(x,ex,ey,4,4,'#1d4ed8',0)}}}
 if(f.tail==='sickle'){L(x,[[90,cy-6],[112,cy-34],[106,cy-58]],hx(f.tc[0]),10);L(x,[[86,cy],[116,cy-16],[120,cy-40]],hx(f.tc[1]),9)}
 if(f.tail==='flame'){for(let i=0;i<3;i++)Pn(x,[[56+i*8,cy+10],[30+i*30,cy+44+i%2*8],[72+i*2,cy+18]],i%2?'#fde047':'#f97316',3)}
 // 날개 (나는 새: 뒤로 펼침, 2프레임)
 if(air&&!f.nw){const up=fr?-1:1;[-1,1].forEach(s=>{const bx=64+s*rx*.7,by=cy-6;const tip=[64+s*(rx+40),by-26*up-10];
   if(f.a&&f.a.includes('fang')||b.id==='voltbat'){Pn(x,[[bx,by-14],tip,[64+s*(rx+30),by+10-8*up],[64+s*(rx+16),by+4],[64+s*(rx+6),by+16]],hx(wc))}
   else{Pn(x,[[bx,by-16],[tip[0]-s*6,tip[1]-6],tip,[64+s*(rx+34),by-14*up+6],[64+s*(rx+24),by+2-6*up+12],[64+s*(rx+8),by+18]],hx(wc));
    L(x,[[64+s*(rx+8),by-2-8*up],[64+s*(rx+30),by-16*up]],lt(wc,.25),3,'round')}})}
 // 다리
 if(!air||f.croc){if(lift||sh==='o'){[-1,1].forEach(s=>L(x,[[64+s*10,cy+ry-4],[64+s*12,150-4]],f.a&&f.a.includes('helmet')?'#ef4444':'#f59e0b',5))}
  if(sh==='egg'){[-1,1].forEach(s=>{L(x,[[64+s*12,cy+ry-6],[64+s*14,146]],'#fff',8);for(let i=0;i<3;i++){x.fillStyle='#ef4444';x.fillRect(64+s*14-4,cy+ry+2+i*8,8,3)}})}
  if(!f.croc)[-1,1].forEach(s=>E(x,64+s*13,148,11,6,'#f59e0b',4))}
 // 긴 목
 if(nk){L(x,[[64,cy-ry*.6],[60,(cy-ry+hY)/2],[64,hY+8]],f.hd!==undefined&&b.id!=='eagle'?hx(hdc):hx(col),14)}
 // 몸통
 if(sh==='egg'){E(x,64,cy,rx,ry,'#fef3c7');L(x,[[40,cy-6],[50,cy+2],[60,cy-6],[70,cy+2],[80,cy-6],[88,cy+2]],'#fde68a',3)}
 else{E(x,cx,cy,rx,ry,hx(col));
  // 배
  x.save();x.beginPath();x.ellipse(cx,cy,rx-3,ry-3,0,0,TAU);x.clip();E(x,cx,cy+ry*.42,rx*.68,ry*.62,hx(be),0);x.restore();
  // 하이라이트
  E(x,cx-rx*.42,cy-ry*.45,rx*.18,ry*.12,'#ffffff66',0,-.5);
  // 접힌 날개
  if(!air&&!f.nw)[-1,1].forEach(s=>E(x,cx+s*(rx-4),cy+6,9,ry*.48,hx(wc),4,s*.25));
  // 무늬
  if(f.band!==undefined){x.save();x.beginPath();x.ellipse(cx,cy,rx-3,ry-3,0,0,TAU);x.clip();x.fillStyle=hx(f.band);x.fillRect(0,(nk?cy-ry:hY)+(nk?6:22),128,7);x.restore()}
  // 머리 색 (목 없는 새: 몸 위쪽을 칠함)
  if(f.hd!==undefined&&!nk){x.save();x.beginPath();x.ellipse(cx,cy,rx-2.5,ry-2.5,0,0,TAU);x.clip();E(x,cx,cy-ry*.62,rx*1.1,ry*.6,hx(hdc),0);x.restore();E(x,cx,cy,rx,ry,null)}}
 if(nk){hR=sh==='o'?18:20;E(x,hX,hY,hR,hR*.95,hx(hdc))}
 // 얼굴
 const fy=nk?hY:cy-ry*.36,fs=nk?.62:1,ex=nk?9:14;face(x,f,b,64,fy,fs,ex,bc);
 // 머리 장식
 const top=nk?hY-hR:cy-ry;crest(x,f,64,top);
 // 소품
 (f.a||[]).forEach(a=>acc(x,a,f,b,{cy,rx,ry,top,hY:fy,nk,hR}));
 x.globalAlpha=1;return{top,fy,fs,ex,cy,rx,ry}}
function face(x,f,b,cx,cy,s,ex,bc){const ey=f.ey||'n',eyc=f.eyc!==undefined?hx(f.eyc):'#111';
 if(f.bl){E(x,cx-ex-8*s,cy+12*s,7*s,4*s,'#fb7185aa',0);E(x,cx+ex+8*s,cy+12*s,7*s,4*s,'#fb7185aa',0)}
 [-1,1].forEach(d=>{const X=cx+d*ex,r=(ey==='big'?10:ey==='c'?7.5:6.5)*s;
  if(ey==='big'){E(x,X,cy,r+5*s,r+5*s,'#fff',3)}
  if(ey==='s'){x.beginPath();x.arc(X,cy+1,r,Math.PI*.1,Math.PI*.9);x.lineWidth=4*s;x.strokeStyle='#111';x.stroke()}
  else{E(x,X,cy,r*.85,r,eyc,0);E(x,X-r*.3,cy-r*.4,r*.32,r*.32,'#fff',0);if(ey==='c')E(x,X+r*.3,cy+r*.35,r*.15,r*.15,'#fff',0)}
  if(ey==='a'){L(x,[[X-d*9*s,cy-12*s],[X+d*7*s,cy-6*s]],'#111',2.5*s)}});
 const bk=f.bk||'s',c=hx(bc),by=cy+6*s;
 if(bk==='s')Pn(x,[[cx-8*s,by],[cx+8*s,by],[cx,by+12*s]],c,3.5);
 else if(bk==='l')Pn(x,[[cx-6*s,by],[cx+6*s,by],[cx,by+30*s]],c,3.5);
 else if(bk==='h'){Pn(x,[[cx-9*s,by-1],[cx+9*s,by-1],[cx+4*s,by+14*s],[cx,by+18*s],[cx-2*s,by+10*s]],c,3.5)}
 else if(bk==='p'){Pn(x,[[cx-11*s,by-3],[cx+11*s,by-3],[cx+6*s,by+16*s],[cx-1*s,by+22*s],[cx-4*s,by+10*s]],c,3.5)}
 else if(bk==='d'){E(x,cx,by+5*s,14*s,7*s,c,3.5)}
 else if(bk==='mask'){Pn(x,[[cx-10*s,by-6],[cx+10*s,by-6],[cx,by+34*s]],'#e7e5e4',3.5);E(x,cx-ex,cy,9*s,9*s,'#111',3);E(x,cx+ex,cy,9*s,9*s,'#111',3);E(x,cx-ex,cy,5*s,5*s,hx(f.eyc||0xa3e635),0);E(x,cx+ex,cy,5*s,5*s,hx(f.eyc||0xa3e635),0)}
 if(f.wt)E(x,cx+5*s,by+18*s,5*s,8*s,'#ef4444',3)}
function crest(x,f,cx,top){const c=f.cc!==undefined?hx(f.cc):'#fbbf24';switch(f.cr){
 case'tuft':[-6,0,6].forEach((d,i)=>L(x,[[cx+d*.6,top+4],[cx+d*1.6,top-10-(i===1?4:0)]],'#facc15',4));break;
 case'comb':[-10,0,10].forEach((d,i)=>E(x,cx+d,top-2-(i===1?5:0),8,10,'#ef4444',4));break;
 case'cap':x.save();x.beginPath();x.arc(cx,top+20,22,Math.PI*1.12,Math.PI*1.88);x.lineTo(cx,top+20);x.closePath();x.fillStyle=c;x.fill();x.lineWidth=4;x.strokeStyle=OL;x.stroke();x.restore();break;
 case'crown':Pn(x,[[cx-16,top+4],[cx-16,top-12],[cx-8,top-4],[cx,top-16],[cx+8,top-4],[cx+16,top-12],[cx+16,top+4]],c,4);break;
 case'ear':[-1,1].forEach(s=>Pn(x,[[cx+s*10,top+8],[cx+s*26,top-14],[cx+s*24,top+12]],f.cc!==undefined?c:dk(0x8a5a14,.2),4));break;
 case'plume':L(x,[[cx,top+4],[cx+4,top-14],[cx+12,top-22]],c,5);E(x,cx+13,top-24,6,6,c,3);break;
 case'flame':for(let i=0;i<3;i++)Pn(x,[[cx-12+i*12,top+6],[cx-8+i*12+(i-1)*4,top-22-(i===1?10:0)],[cx-2+i*12,top+6]],i===1?c:'#f97316',3.5);break;
 case'bolt':Pn(x,[[cx-4,top+4],[cx+8,top-10],[cx+1,top-10],[cx+8,top-24],[cx-8,top-6],[cx-1,top-6]],c,3.5);break;
 case'zap':for(let i=0;i<5;i++)L(x,[[cx-12+i*6,top+4],[cx-16+i*8,top-6],[cx-12+i*8,top-12]],'#fde047',3);break;
 case'star':star(x,cx,top-8,13,c,3.5);break;
 case'leaf':E(x,cx+6,top-8,8,15,c,3.5,.6);L(x,[[cx,top+2],[cx+10,top-16]],'#3f6212',1.5);break}}
function acc(x,a,f,b,o){const{cy,rx,ry,top,hY,nk,hR}=o,cx=64;switch(a){
 case'bowler':E(x,cx,top+3,26,6,'#1f2937',4);x.beginPath();x.arc(cx,top+2,17,Math.PI,0);x.closePath();x.fillStyle='#1f2937';x.fill();x.lineWidth=4;x.strokeStyle=OL;x.stroke();x.fillStyle='#7f1d1d';x.fillRect(cx-16,top-4,32,4);break;
 case'tophat':E(x,cx,top+2,26,6,'#111827',4);Pn(x,[[cx-15,top+1],[cx-15,top-30],[cx+15,top-30],[cx+15,top+1]],'#111827',4);x.fillStyle='#dc2626';x.fillRect(cx-14,top-8,28,6);break;
 case'pirate':Pn(x,[[cx-30,top+6],[cx-18,top-16],[cx,top-22],[cx+18,top-16],[cx+30,top+6],[cx,top]],'#111827',4);emo(x,'💀',cx,top-8,13);break;
 case'patch':L(x,[[cx-28,hY-14],[cx+28,hY+4]],'#111',2);E(x,cx+14*(nk?.62:1),hY,9,8,'#111',0);break;
 case'shades':Pn(x,[[cx-26,hY-6],[cx-2,hY-6],[cx-6,hY+6],[cx-22,hY+6]],'#111');Pn(x,[[cx+2,hY-6],[cx+26,hY-6],[cx+22,hY+6],[cx+6,hY+6]],'#111');break;
 case'tube':x.save();E(x,cx,cy+ry*.55,rx+12,13,'#f43f5e',5);for(let i=0;i<4;i++){const an=i*Math.PI/2+.4;E(x,cx+Math.cos(an)*(rx+6),cy+ry*.55+Math.sin(an)*9,6,5,'#fff',0)}x.restore();break;
 case'scarf':x.fillStyle='#ef4444';x.strokeStyle=OL;x.lineWidth=4;x.beginPath();x.roundRect?x.roundRect(cx-rx+4,hY+22,rx*2-8,10,5):x.rect(cx-rx+4,hY+22,rx*2-8,10);x.fill();x.stroke();Pn(x,[[cx+10,hY+30],[cx+20,hY+30],[cx+22,hY+52],[cx+12,hY+50]],'#ef4444',4);break;
 case'cape':x.globalCompositeOperation='destination-over';Pn(x,[[cx-rx,cy-ry*.6],[cx+rx,cy-ry*.6],[cx+rx+14,cy+ry+4],[cx-rx-14,cy+ry+4]],'#450a0a',4);x.globalCompositeOperation='source-over';break;
 case'fang':Pn(x,[[cx-6,hY+18],[cx-2,hY+18],[cx-4,hY+25]],'#fff',2);Pn(x,[[cx+2,hY+18],[cx+6,hY+18],[cx+4,hY+25]],'#fff',2);break;
 case'band':x.fillStyle='#a16207';x.fillRect(cx-rx+6,top+10,(rx-6)*2,7);x.strokeStyle=OL;x.lineWidth=3;x.strokeRect(cx-rx+6,top+10,(rx-6)*2,7);L(x,[[cx+rx-8,top+14],[cx+rx+6,top+4]],'#a16207',4);break;
 case'tutu':for(let i=0;i<7;i++)E(x,cx-30+i*10,cy+ry*.7,9,7,'#f9a8d4',3);break;
 case'tiara':Pn(x,[[cx-10,top+4],[cx-8,top-6],[cx-3,top],[cx,top-10],[cx+3,top],[cx+8,top-6],[cx+10,top+4]],'#e5e7eb',3);E(x,cx,top-4,2.5,2.5,'#f472b6',0);break;
 case'baby':E(x,cx+rx+2,cy-8,13,11,'#bfdbfe',3.5);E(x,cx+rx+2,cy-12,7,7,'#fde68a',3);break;
 case'hood':x.globalCompositeOperation='destination-over';E(x,cx,(nk?hY:cy-ry*.3),rx+8,ry*.95,'#1f2937',4);x.globalCompositeOperation='source-over';break;
 case'snowhat':E(x,cx,top+2,22,7,'#fff',4);Pn(x,[[cx-18,top+1],[cx,top-24],[cx+18,top+1]],'#3b82f6',4);E(x,cx+2,top-26,6,6,'#fff',3);break;
 case'shell':x.save();Pn(x,[[cx-rx-4,cy+8],[cx-rx+6,cy+2],[cx-rx+14,cy+10],[cx-10,cy+2],[cx,cy+10],[cx+10,cy+2],[cx+rx-14,cy+10],[cx+rx-6,cy+2],[cx+rx+4,cy+8],[cx+rx-2,cy+ry+4],[cx-rx+2,cy+ry+4]],'#fef3c7',4);x.restore();break;
 case'q':emo(x,'❓',cx+26,top-6,18);break;
 case'towel':E(x,cx-12,top+2,10,8,'#fbcfe8',3);E(x,cx+12,top+2,10,8,'#fbcfe8',3);E(x,cx,top+4,16,7,'#fbcfe8',3);break;
 case'cone':Pn(x,[[cx-12,top+4],[cx+12,top+4],[cx,top-22]],'#d97706',3.5);E(x,cx,top+2,14,7,'#fef3c7',3);break;
 case'balloon':L(x,[[cx+20,top+12],[cx+30,top-26]],'#94a3b8',1.5);E(x,cx+30,top-34,11,13,'#f472b6',3.5);break;
 case'fart':E(x,cx-rx-6,cy+ry-6,10,8,'#a3e63599',0);E(x,cx-rx-16,cy+ry-14,7,6,'#a3e63577',0);break;
 case'sparkle':star(x,cx-rx-2,top+4,8,'#fde047',3);star(x,cx+rx+2,cy,6,'#fde047',3);break;
 case'teeth':for(let i=0;i<4;i++)Pn(x,[[cx-12+i*6,hY+12],[cx-8+i*6,hY+12],[cx-10+i*6,hY+18]],'#fff',2);break;
 case'spines':for(let i=0;i<4;i++)Pn(x,[[cx-18+i*12,top+6],[cx-12+i*12,top-8],[cx-6+i*12,top+6]],'#facc15',3);break;
 case'monocle':E(x,cx+14,hY,9,9,null,3);L(x,[[cx+22,hY+4],[cx+26,hY+28]],'#fbbf24',1.5);break;
 case'chain':x.beginPath();x.arc(cx,cy-ry*.1,20,Math.PI*.15,Math.PI*.85);x.lineWidth=4;x.strokeStyle='#fbbf24';x.stroke();E(x,cx,cy+12,6,6,'#fbbf24',3);break;
 case'helmet':x.beginPath();x.arc(cx,(nk?hY:top+20),nk?hR+3:26,Math.PI,0);x.closePath();x.fillStyle='#94a3b8';x.fill();x.lineWidth=4;x.strokeStyle=OL;x.stroke();Pn(x,[[cx-3,(nk?hY-hR:top)-8],[cx+3,(nk?hY-hR:top)-8],[cx,(nk?hY-hR:top)-20]],'#ef4444',3);break;
 case'halo':E(x,cx,top-12,18,5,null,0);x.lineWidth=5;x.strokeStyle='#fde047';x.stroke();break;
 case'robe':x.save();x.beginPath();x.ellipse(cx,cy,rx-3,ry-3,0,0,TAU);x.clip();x.fillStyle='#fff';x.fillRect(cx-8,cy-ry,16,ry*2);x.fillStyle='#ef4444';x.fillRect(cx-3,cy+4,6,18);x.fillRect(cx-9,cy+10,18,6);x.restore();break;
 case'horns':[-1,1].forEach(s=>Pn(x,[[cx+s*12,top+6],[cx+s*30,top-16],[cx+s*20,top+10]],'#e7e5e4',3.5));break;
 case'skull':E(x,cx,cy+8,13,11,'#f5f5f4',3);E(x,cx-5,cy+7,3,3,'#111',0);E(x,cx+5,cy+7,3,3,'#111',0);break;
 case'candle':Pn(x,[[cx-5,top+2],[cx+5,top+2],[cx+5,top-16],[cx-5,top-16]],'#f5f5f4',3);E(x,cx,top-22,4,7,'#fde047',2);break}}

// ---------- 🏹 타워 그림 (128×176, 바닥 중심 y=158) ----------
const TCAT=id=>({egg:'sling',ballista:'sling',acorn:'cannon',spikes:'cannon',ice:'crystal',frost:'crystal',bliz:'crystal',aurora:'crystal',frostbane:'crystal',whiteout:'crystal',
 ember:'fire',lava:'fire',sun:'fire',pyre:'fire',firestorm:'fire',steam:'fire',plasma:'fire',static:'coil',thunder:'coil',storm:'coil',tempest:'coil',venomvolt:'coil',pylon:'pole',
 breeze:'fan',wind:'fan',twister:'fan',miasma:'fan',flu:'flask',acid:'flask',wall:'nest'})[id]||'turret';
function towerSpr(b,lv){const k='T'+b.id+'|'+lv;let c=SPR.get(k);if(c)return c;c=mk(128,176);const x=c.getContext('2d');
 const im=IMG.t[b.id];if(im){const r=Math.min(128/im.width,176/im.height);x.drawImage(im,64-im.width*r/2,150-im.height*r,im.width*r,im.height*r)}else drawTower(x,b,lv);c._ay=134;SPR.set(k,c);return c}
function drawTower(x,b,lv){const cat=TCAT(b.id),col=b.col,C=hx(col),cx=64,gy=146;
 if(cat==='nest'){E(x,cx,gy-14,50,22,'#8b5a2b');for(let i=0;i<9;i++){x.beginPath();x.ellipse(cx,gy-14,48-i%3*8,20-i%3*4,i*.35,Math.PI*.1,Math.PI*.9);x.lineWidth=3;x.strokeStyle=i%2?'#a16207':'#5b3a1a';x.stroke()}
  [[-14,-24],[10,-26],[-2,-18]].forEach(e=>E(x,cx+e[0],gy+e[1],10,12,'#fef3c7',3.5));return}
 // 받침대 (육각 돌판)
 const ph=[];for(let i=0;i<6;i++){const a=i*Math.PI/3;ph.push([cx+Math.cos(a)*50,gy-12+Math.sin(a)*20])}
 Pn(x,ph.map(p=>[p[0],p[1]+12]),'#4b5563',4);Pn(x,ph,'#9ca3af',4);Pn(x,ph.map(p=>[cx+(p[0]-cx)*.7,gy-12+(p[1]-gy+12)*.7]),'#d1d5db',0);
 const lvc=lv>=4?'#fbbf24':lv>=3?'#c4b5fd':lv>=2?'#93c5fd':null;if(lvc){x.lineWidth=4;x.strokeStyle=lvc;Pn(x,ph,null,0);x.beginPath();ph.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.stroke()}
 const top=gy-12;let em=[cx,top-58,18];// 엠블럼 위치
 switch(cat){
 case'sling':L(x,[[cx,top],[cx,top-40]],'#92400e',12);L(x,[[cx,top-36],[cx-22,top-70]],'#92400e',10);L(x,[[cx,top-36],[cx+22,top-70]],'#92400e',10);L(x,[[cx-22,top-66],[cx,top-56],[cx+22,top-66]],C,4);E(x,cx,top-56,9,9,'#fff',3.5);em=[cx,top-24,13];break;
 case'cannon':E(x,cx,top-14,30,20,'#57534e');x.save();x.translate(cx,top-30);x.rotate(-.5);Pn(x,[[-12,0],[12,0],[10,-48],[-10,-48]],C);E(x,0,-48,12,6,dk(col,.4),4);x.restore();[-1,1].forEach(s=>E(x,cx+s*26,top-8,10,13,'#422006',4));em=[cx,top-16,14];break;
 case'crystal':Pn(x,[[cx-14,top-6],[cx,top-86],[cx+14,top-6]],lt(col,.25));Pn(x,[[cx,top-86],[cx+14,top-6],[cx+4,top-6]],dk(col,.1),0);[[-28,-46],[28,-40],[-16,-34],[20,-30]].forEach(e=>Pn(x,[[cx+e[0]-8,top-4],[cx+e[0]+e[0]*.15,top+e[1]],[cx+e[0]+8,top-4]],lt(col,.5),3.5));em=[cx,top-30,13];break;
 case'fire':Pn(x,[[cx-30,top-40],[cx+30,top-40],[cx+20,top-6],[cx-20,top-6]],'#57534e');E(x,cx,top-40,30,9,'#292524',4);
  for(let i=0;i<5;i++){const fx=cx-20+i*10;Pn(x,[[fx-8,top-42],[fx+(i-2)*3,top-72-(i%2?0:16)],[fx+8,top-42]],i%2?'#fde047':C,3.5)}em=[cx,top-22,13];break;
 case'coil':L(x,[[cx,top],[cx,top-70]],'#78350f',9);for(let i=0;i<5;i++)E(x,cx,top-18-i*11,22-i*2.5,6,'#ea8a2b',3.5);E(x,cx,top-80,15,15,C);E(x,cx-5,top-85,5,5,'#ffffffcc',0);em=[cx,top-10,12];break;
 case'pole':L(x,[[cx,top],[cx,top-86]],'#78716c',9);L(x,[[cx-28,top-74],[cx+28,top-74]],'#57534e',7);[-24,24].forEach(d=>E(x,cx+d,top-80,5,7,'#e5e7eb',2.5));E(x,cx+10,top-90,10,8,'#a16207',3);E(x,cx+16,top-93,2,2,'#111',0);em=[cx,top-34,12];break;
 case'fan':L(x,[[cx,top],[cx,top-62]],'#f472b6',8);for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;x.save();x.translate(cx,top-66);x.rotate(a);Pn(x,[[0,0],[34,-8],[38,6],[0,4]],i%2?lt(col,.3):C,3.5);x.restore()}E(x,cx,top-66,7,7,'#fde68a',3);em=[cx,top-26,13];break;
 case'flask':E(x,cx,top-30,30,30,C);x.save();x.beginPath();x.ellipse(cx,top-30,27,27,0,0,TAU);x.clip();x.fillStyle=dk(col,.25);x.fillRect(0,top-26,128,40);x.restore();E(x,cx,top-30,30,30,null);
  Pn(x,[[cx-9,top-58],[cx+9,top-58],[cx+9,top-76],[cx-9,top-76]],lt(col,.4));E(x,cx,top-80,12,5,'#a16207',3.5);[[-10,-36,5],[8,-24,4],[2,-44,3]].forEach(e=>E(x,cx+e[0],top+e[1],e[2],e[2],'#ffffffaa',0));em=[cx,top-30,0];break;
 default:Pn(x,[[cx-24,top-4],[cx-20,top-58],[cx+20,top-58],[cx+24,top-4]],'#e7e5e4');x.fillStyle=lt(col,.6);x.fillRect(cx-20,top-24,40,6);
  Pn(x,[[cx-30,top-56],[cx,top-90],[cx+30,top-56]],C);for(let i=0;i<3;i++)Pn(x,[[cx-20+i*14,top-58],[cx-14+i*14,top-58],[cx-14+i*14,top-66],[cx-20+i*14,top-66]],'#e7e5e4',3);em=[cx,top-36,14]}
 if(em[2]){E(x,em[0],em[1],em[2],em[2],'#fff',3.5);emo(x,b.ic,em[0],em[1]+1,em[2]*1.25)}}

// ---------- 화면 배치 ----------
let cv=null,cx2=null,W=0,H=0,DPR=1,s=30,K=.78,ox=0,oy=0,bg=null,vtag=0,dirty=true;
const RIGHT=104;
const P=(x,y,z)=>[ox+x*s,oy+y*s*K-(z||0)*s];
function layout(){if(!cv)return;const el=$('cv'),w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
 DPR=Math.min(devicePixelRatio||1,2);W=w;H=h;cv.width=Math.round(w*DPR);cv.height=Math.round(h*DPR);cv.style.width=w+'px';cv.style.height=h+'px';
 const bw=COLS+.6,aw=Math.max(120,w-RIGHT-8);s=Math.min(aw/bw,(h-8)/(BH*.62+1.4));K=Math.max(.62,Math.min(.86,(h-1.4*s-8)/(BH*s)));
 ox=Math.max(4,(aw-(COLS+.5)*s)/2+4);oy=Math.max(1.1*s,(h-BH*K*s)/2+.4*s);dirty=true;SPR_SCALE.clear()}
const SPR_SCALE=new Map();
function drawBg(){bg=mk(cv.width,cv.height);const x=bg.getContext('2d');x.scale(DPR,DPR);
 // 들판
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5d9c4a');g.addColorStop(1,'#3f7a36');x.fillStyle=g;x.fillRect(0,0,W,H);
 let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let i=0;i<220;i++){const X=rnd()*W,Y=rnd()*H;x.strokeStyle=rnd()<.5?'#6fb556':'#36692d';x.lineWidth=1.5;x.beginPath();x.moveTo(X,Y);x.lineTo(X-2,Y-6);x.moveTo(X+2,Y);x.lineTo(X+3,Y-5);x.stroke()}
 for(let i=0;i<26;i++){const X=rnd()*W,Y=rnd()*H;E(x,X,Y,2.5,2.5,['#fde047','#fff','#f9a8d4'][i%3],0)}
 // 흙길 테두리 (보드 바닥)
 const [x0,y0]=P(-.15,-.1),[x1,y1]=P(COLS+.65,BH+.1);x.fillStyle='#00000033';x.beginPath();x.roundRect?x.roundRect(x0+4,y0+8,x1-x0,y1-y0+s*.25,14):x.rect(x0+4,y0+8,x1-x0,y1-y0);x.fill();
 x.fillStyle='#c9a46b';x.strokeStyle=OL;x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(x0,y0,x1-x0,y1-y0+s*.2,14):x.rect(x0,y0,x1-x0,y1-y0);x.fill();x.stroke();
 // 육각 타일
 const r=.56,th=s*.16;
 for(let rr=0;rr<ROWS;rr++)for(let c=0;c<COLS;c++){const X=cellX(c,rr),Y=cellY(rr),pts=[];for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;pts.push(P(X+Math.cos(a)*r*.95,Y+Math.sin(a)*r*.95))}
  const st=rr===0,ex=rr===ROWS-1,top=st?0x4ade80:ex?0xf87171:(rr+c)%2?0x86c95f:0x7bbf55,side=mix(top,0,.35);
  Pn(x,pts.map(p=>[p[0],p[1]+th]),hx(side),2);Pn(x,pts,hx(top),2);
  x.save();x.clip();E(x,pts[4][0]+s*.15,pts[4][1]+s*.12*K,s*.22,s*.1,'#ffffff30',0);x.restore();
  if(st||ex){const[cX,cY]=P(X,Y);x.fillStyle=st?'#14532d99':'#7f1d1d99';x.font=`bold ${Math.round(s*.34)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(st?'▼':'⚑',cX,cY)}}
 dirty=false}

// ---------- 효과 (2D) ----------
const FX=[],TXT=[],PRJ=[];
const add=(a,o)=>{if(a.length>220)a.shift();a.push(o)};
function burst(x,y,z,col,n,sp,life,sz,grav){for(let i=0;i<n;i++){const a=Math.random()*TAU,v=sp*(.4+Math.random()*.8);add(FX,{x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:(Math.random()*.8+.4)*sp,t:0,L:life*(.6+Math.random()*.6),c:col,r:sz*(.6+Math.random()*.6),g:grav===undefined?3:grav})}}
function ring(x,y,col,R,life,w){add(FX,{ring:1,x,y,c:col,R,t:0,L:life,w:w||3})}
function text(x,y,z,t,col,sz,life){add(TXT,{x,y,z,t,c:col,sz:sz||1,t0:0,L:life||.9})}
const zOf=u=>u.bp.t==='A'&&!(u.gr>0)?1.05:u.fl>0?.6:0;
const H2D={
 shoot(a){const sx=a.x,sy=BH-a.y,tx=a.tx,ty=BH-a.ty;if(a.tower==='snack'){burst(sx,sy,.8,'#f59e0b',6,1.6,.5,.07);return}
  const self=a.b&&a.b.self;if(self){ring(sx,sy,hx(a.col),Math.min(2.2,(a.b.r||2)),.45,4);return}
  add(PRJ,{x0:sx,y0:sy,z0:.85,x1:tx,y1:ty,z1:a.air?1.05:.25,t:0,L:Math.min(.22,.06+Math.hypot(tx-sx,ty-sy)*.035),c:hx(a.col),b:a.b,sp:a.b&&a.b.splash})},
 crit(a){const u=a.u;text(u.x,u.y,zOf(u)+.9,'치명!','#fde047',1.2,.8);burst(u.x,u.y,zOf(u)+.3,'#fde047',8,2.2,.35,.06,0)},
 die(a){const u=a.u,z=zOf(u);burst(u.x,u.y,z+.3,hx(a.col),10,1.8,.6,.1);burst(u.x,u.y,z+.3,'#ffffff',6,1.2,.5,.08,0);ring(u.x,u.y,'#ffffffcc',.6,.35,3)},
 evolve(a){const x=a.x,y=BH-a.y;ring(x,y,'#fde047',1.1,.7,5);burst(x,y,.8,'#fde047',16,2,.8,.08,1);text(x,y,1.6,'⬆ Lv.'+a.lv,'#fde047',1.1,1.1)},
 hatch(a){const u=a.u;burst(u.x,u.y,.3,'#fef3c7',10,1.5,.5,.09)},
 lay(a){const u=a.u;burst(u.x,u.y,.2,'#fef3c7',5,1,.4,.07)},
 pop(a){const u=a.u;ring(u.x,u.y,'#bae6fd',.8,.35,4);burst(u.x,u.y,.6,'#e0f2fe',8,2,.4,.07,0)},
 revive(a){const u=a.u;ring(u.x,u.y,'#f97316',1.2,.7,6);burst(u.x,u.y,.4,'#fde047',14,2,.7,.09,-1);text(u.x,u.y,1.4,'부활!','#fb923c',1.1,1)},
 ignite(a){const u=a.u;burst(u.x,u.y,zOf(u)+.2,'#f97316',5,1,.4,.07,-2)},
 leak(a){flash('#ef4444',.35)},
 smoke(a){const x=a.x,y=BH-a.y;burst(x,y,.2,'#4ade80',8,a.r*.8,.7,.14,-.5)},
 wire(a){},
 skill(a){flash(hx(a.col1),.5);ring((COLS+.5)/2,BH/2,hx(a.col2),4,.8,8)},
 unlock(a){flash('#fde047',.3)},
 update(){},init(){}};
let FL=null;function flash(c,L){FL={c,t:0,L}}
// ART 함수 중 게임 화면용만 2D로 바꿔요(도감·로비용 bird/tower는 그대로)
if(typeof ART!=='undefined')Object.keys(H2D).forEach(k=>{const o=ART[k];ART[k]=a=>{if(S&&!S.sim)return H2D[k](a||{});if(o)return o(a)}});
beam=function(){};
beamU=function(a,b,col){if(S&&!S.sim)add(PRJ,{x0:a.x,y0:a.y,z0:zOf(a)+.3,x1:b.x,y1:b.y,z1:zOf(b)+.3,t:0,L:.12,c:hx(col),zap:1})};
skFx=function(){};
// 피해 숫자: dmgU를 감싸서 보는 진영의 새가 맞으면 숫자를 모아 띄워요
{const o=dmgU;dmgU=function(u,d){const r=o(u,d);if(u._v===vtag&&S&&!S.sim&&r>0)u._dn=(u._dn||0)+r;return r}}

// ---------- 3D 함수 바꿔치기 ----------
init3=function(){const el=$('cv');el.innerHTML='';cv=mk(10,10);cv.style.display='block';cv.style.touchAction='manipulation';el.append(cv);cx2=cv.getContext('2d');
 Sc=new THREE.Scene();// 화면에는 안 그리지만 game.js가 가끔 넣는 3D 물체를 받아줘요
 R={setPixelRatio(){},render(){},setSize(){},domElement:cv};
 // game.js의 원래 resize가 불려도 오류가 안 나게 빈 카메라를 둬요(원래 터치 처리는 아래 capture 단계에서 막아요)
 if(!Cam)Cam={aspect:1,position:{set(){}},lookAt(){},updateProjectionMatrix(){}};layout()};
resize=function(){layout()};
new ResizeObserver(()=>layout()).observe($('cv'));
cv=null;
document.querySelector('main').addEventListener('pointerdown',e=>{if(!e.target.closest||!e.target.closest('#cv'))return;e.stopPropagation();if(!S||over||!cv)return;const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
 const c=nearCell((px-ox)/s,(py-oy)/(s*K));if(c.d<.62)cell(c.x,c.y)},true);

// ---------- 매 프레임 그리기 ----------
let pathT=0,path=null,lastSel=null;
const shad=(x,y,w)=>{const[a,b]=P(x,y);E(cx2,a,b,w*s,w*s*.42*K,'#00000040',0)};
function drawSprite(c,x,y,z,w,flip,alpha,sq){const[a,b]=P(x,y,z),dw=w*s,dh=dw*c.height/c.width,x2=cx2;x2.save();x2.translate(a,b);if(flip)x2.scale(-1,1);if(sq)x2.scale(1+sq,1-sq);if(alpha!==undefined)x2.globalAlpha=alpha;
 x2.drawImage(c,-dw/2,-dh*(c._ay||150)/c.height,dw,dh);x2.restore()}
const tintC=new Map();function tint(c,col){const k=col;let m=tintC.get(c);if(!m){m={};tintC.set(c,m)}if(m[k])return m[k];const t=mk(c.width,c.height),x=t.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,t.width,t.height);t._ay=c._ay;return m[k]=t}
sync3=function(dt){if(!cv||!S)return;if(dirty||!bg)drawBg();const x=cx2,p=S.pl[view],t=S.t;vtag=(vtag+1)%1e6||1;
 x.setTransform(1,0,0,1,0,0);x.drawImage(bg,0,0);x.setTransform(DPR,0,0,DPR,0,0);
 // 바닥: 독구름 · CCTV · 선택 범위
 (p.clouds||[]).forEach(c=>{const[a,b]=P(c.x,c.y);const al=Math.min(1,c.life/.6)*.35;x.fillStyle=`rgba(74,222,128,${al})`;x.beginPath();x.ellipse(a,b,c.r*s,c.r*s*K,0,0,TAU);x.fill()});
 p.grid.forEach((row,yy)=>row.forEach((tw,xx)=>{if(!tw||!tw.bp.cctv)return;const[a,b]=P(cellX(xx,yy),cellY(yy));x.strokeStyle='#a78bfa88';x.setLineDash([6,5]);x.lineWidth=2;x.beginPath();x.ellipse(a,b,tw.r*s,tw.r*s*K,0,0,TAU);x.stroke();x.setLineDash([])}));
 if(insp&&view===0&&insp.t.r){const[a,b]=P(cellX(insp.x,insp.y),cellY(insp.y));x.fillStyle='#38bdf822';x.strokeStyle='#38bdf8';x.lineWidth=2;x.beginPath();x.ellipse(a,b,insp.t.r*s,insp.t.r*s*K,0,0,TAU);x.fill();x.stroke()}
 // 길 안내 (타워 고를 때)
 pathT-=dt;if(sel!==lastSel||pathT<=0){lastSel=sel;pathT=.5;path=view===0&&sel?bfs(p.grid,COLS>>1,0):null}
 if(path){x.fillStyle='#38bdf8';path.forEach((q,i)=>{if(i%2)return;const[a,b]=P(cellX(q.x,q.y),cellY(q.y));E(x,a,b,s*.08,s*.08*K,'#38bdf8',0)})}
 // 그릴 것 모으기 → 화면 아래쪽(앞)일수록 나중에
 const D=[];
 p.grid.forEach((row,yy)=>row.forEach((tw,xx)=>{if(tw)D.push({k:0,y:cellY(yy),tw,xx,yy})}));
 (p.snacks||[]).forEach(sn=>D.push({k:2,y:sn.y,sn}));
 p.units.forEach(u=>{u._v=vtag;D.push({k:1,y:u.y+(zOf(u)>.9?.01:0),u,air:zOf(u)>.9})});
 D.sort((a,b)=>(a.air?1:0)-(b.air?1:0)||a.y-b.y);
 for(const d of D){
  if(d.k===0){const tw=d.tw,X=cellX(d.xx,d.yy),Y=cellY(d.yy),sc=1+(tw.lv-1)*.1,sh=tw.dis>0?Math.sin(t*30)*.04:0;
   drawSprite(towerSpr(tw.bp,Math.min(4,tw.lv)),X+sh,Y,0,1.15*sc);
   if(insp&&insp.t===tw){const[a,b]=P(X,Y);x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();x.ellipse(a,b,s*.5,s*.5*K,0,0,TAU);x.stroke()}
   if(tw.lv>1&&tw.bp.id!=='wall'){const[a,b]=P(X+.3,Y,1.15*sc);star(x,a,b,s*.17,tw.lv>=4?'#fbbf24':'#fde047',1.5);x.fillStyle=OL;x.font=`bold ${Math.round(s*.18)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(tw.lv,a,b+1)}
   if(tw.dis>0){const[a,b]=P(X,Y,1.2);emo(x,'💫',a,b,s*.3)}}
  else if(d.k===2){const[a,b]=P(d.sn.x,d.sn.y);emo(x,'🍤',a,b-s*.08,s*.32)}
  else drawUnit(d.u,t,p)}
 // 전깃줄
 (p.wires||[]).forEach(w=>{const[a,b]=P(w.x1,w.y1,1.05),[c2,d2]=P(w.x2,w.y2,1.05);x.strokeStyle='#292524';x.lineWidth=2;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo((a+c2)/2,(b+d2)/2+s*.15,c2,d2);x.stroke();
  x.strokeStyle=w.m>=2.5?'#f43f5e':w.m>=1.75?'#fb923c':'#fde047';x.globalAlpha=.3+.3*Math.abs(Math.sin(t*9));x.lineWidth=4;x.stroke();x.globalAlpha=1});
 // 발사체
 for(let i=PRJ.length-1;i>=0;i--){const q=PRJ[i];q.t+=dt;const k=Math.min(1,q.t/q.L),X=q.x0+(q.x1-q.x0)*k,Y=q.y0+(q.y1-q.y0)*k,Z=q.z0+(q.z1-q.z0)*k+Math.sin(k*Math.PI)*(q.zap?0:.3);
  const[a,b]=P(X,Y,Z);if(q.zap){const[a0,b0]=P(q.x0,q.y0,q.z0),[a1,b1]=P(q.x1,q.y1,q.z1);x.strokeStyle=q.c;x.lineWidth=3;x.beginPath();x.moveTo(a0,b0);for(let j=1;j<5;j++)x.lineTo(a0+(a1-a0)*j/5+(Math.random()-.5)*s*.3,b0+(b1-b0)*j/5+(Math.random()-.5)*s*.3);x.lineTo(a1,b1);x.stroke()}
  else{E(x,a,b,s*.11,s*.11,q.c,2);E(x,a-s*.03,b-s*.03,s*.04,s*.04,'#fff',0)}
  if(q.t>=q.L){PRJ.splice(i,1);if(!q.zap){if(q.sp)ring(q.x1,q.y1,q.c,q.sp,.35,3);burst(q.x1,q.y1,q.z1,q.c,4,1.4,.25,.06,0)}}}
 // 파티클 · 고리
 for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t+=dt;if(f.t>=f.L){FX.splice(i,1);continue}const k=f.t/f.L;
  if(f.ring){const[a,b]=P(f.x,f.y);x.globalAlpha=1-k;x.strokeStyle=f.c;x.lineWidth=f.w*(1-k)+1;x.beginPath();x.ellipse(a,b,f.R*s*(.3+k*.7),f.R*s*K*(.3+k*.7),0,0,TAU);x.stroke();x.globalAlpha=1;continue}
  f.x+=f.vx*dt;f.y+=f.vy*dt;f.vz-=f.g*dt;f.z=Math.max(0,f.z+f.vz*dt);const[a,b]=P(f.x,f.y,f.z);x.globalAlpha=1-k*k;E(x,a,b,f.r*s*(1-k*.5),f.r*s*(1-k*.5),f.c,0);x.globalAlpha=1}
 // 피해 숫자 모으기
 p.units.forEach(u=>{u._dt=(u._dt||0)-dt;if(u._dn>0&&u._dt<=0){u._dt=.3;text(u.x+(Math.random()-.5)*.3,u.y,zOf(u)+.9,Math.round(u._dn),'#fff',.8,.7);u._dn=0}});
 x.textAlign='center';x.textBaseline='middle';
 for(let i=TXT.length-1;i>=0;i--){const q=TXT[i];q.t0+=dt;if(q.t0>=q.L){TXT.splice(i,1);continue}const k=q.t0/q.L,[a,b]=P(q.x,q.y,q.z+k*.6),fs=Math.round(s*.36*q.sz*(k<.15?.7+k*2:1));
  x.globalAlpha=k>.7?(1-k)/.3:1;x.font=`${fs}px ${FONT}`;x.lineWidth=Math.max(2,fs*.18);x.strokeStyle=OL;x.strokeText(q.t,a,b);x.fillStyle=q.c;x.fillText(q.t,a,b);x.globalAlpha=1}
 if(FL){FL.t+=dt;if(FL.t>=FL.L)FL=null;else{x.globalAlpha=(1-FL.t/FL.L)*.35;x.fillStyle=FL.c;x.fillRect(0,0,W,H);x.globalAlpha=1}}
 if(S.cdn>0||!p.alive){x.fillStyle='#0004';if(!p.alive)x.fillRect(0,0,W,H)}
 lanePanel(dt)};
function drawUnit(u,t,p){const x=cx2,b=u.bp,air=b.t==='A'&&!(u.gr>0),z=air?1.05+Math.sin(t*4+u.id)*.05:u.fl>0?.6+Math.sin(t*5)*.05:0;
 const sz=.74*(b.id==='crocbird'?1.2:.7+Math.min(.9,b.hp/3500)),hop=air?0:Math.abs(Math.sin(t*9+u.id))*.07;
 const st=b.stealth&&u.y<BH*b.stealth&&!u.seen;
 // 그림자 + 팀 색 고리
 shad(u.x,u.y,sz*(air?.3:.42));if(!air){const[a,c]=P(u.x,u.y);x.strokeStyle=PC[u.owner];x.lineWidth=2.5;x.globalAlpha=st?.3:.9;x.beginPath();x.ellipse(a,c,sz*.36*s,sz*.36*s*.45*K,0,0,TAU);x.stroke();x.globalAlpha=1}
 const fr=air?(Math.sin(t*14+u.id)>0?1:0):0;let c=birdSpr(b,fr);
 const flash=u.hit>0?'#ffffff':u.bn>0?'#f97316':u.stun>0?'#93c5fd':(u.pois>0||u.ps>0)?'#22c55e':u.amp>0?'#bef264':null;
 const al=st?.3:undefined,flip=Math.sin(u.x*1.7)>.6&&false;
 drawSprite(c,u.x,u.y,z+hop,sz,flip,al,air?0:Math.sin(t*9+u.id)*.04);
 if(flash){const tc=tint(c,flash);drawSprite(tc,u.x,u.y,z+hop,sz,flip,(u.hit>0?.7:.3)*(st?.3:1),air?0:Math.sin(t*9+u.id)*.04)}
 if(u.fl>0){const[a,c2]=P(u.x,u.y,z+sz*.55);E(x,a,c2,sz*.62*s,sz*.62*s,'#bae6fd55',0);x.strokeStyle='#e0f2fe';x.lineWidth=2;x.stroke();E(x,a-sz*.25*s,c2-sz*.25*s,sz*.08*s,sz*.08*s,'#fff',0)}
 if(u.stun>0){const[a,c2]=P(u.x,u.y,z+sz*1.15);emo(x,'💫',a,c2,s*.26)}
 // 말풍선
 if(b.talk){const ph=(t*.5+u.id*1.37)%b.talk.length,i=Math.floor(ph);if(ph-i<.72){const[a,c2]=P(u.x,u.y,z+sz*1.25+.25),tx=b.talk[i];x.font=`${Math.round(s*.26)}px ${FONT}`;const w=x.measureText(tx).width+s*.3;
   x.fillStyle='#fff';x.strokeStyle=OL;x.lineWidth=2;x.beginPath();x.roundRect?x.roundRect(a-w/2,c2-s*.2,w,s*.4,s*.15):x.rect(a-w/2,c2-s*.2,w,s*.4);x.fill();x.stroke();x.fillStyle='#111';x.textAlign='center';x.textBaseline='middle';x.fillText(tx,a,c2)}}
 // 체력바
 const r=Math.max(0,Math.min(1,u.hp/b.hp)),[a,c2]=P(u.x,u.y,z+sz*1.08+.1),bw=Math.max(s*.5,sz*s*.75),bh=Math.max(3,s*.09);
 x.fillStyle=OL;x.fillRect(a-bw/2-1,c2-1,bw+2,bh+2);x.fillStyle='#3f3f46';x.fillRect(a-bw/2,c2,bw,bh);
 x.fillStyle=u.sh>0?'#38bdf8':r>.4?'#22c55e':r>.2?'#facc15':'#ef4444';x.fillRect(a-bw/2,c2,bw*r,bh);
 if(u.owner===0&&view!==0){const[a2,c3]=P(u.x,u.y,z+sz*1.08+.32);x.fillStyle='#fde047';x.font=`${Math.round(s*.2)}px ${FONT}`;x.textAlign='center';x.fillText('▼',a2,c3)}}

// =====================================================================
// 🏠 로비 · 🎨 영웅 꾸미기 · 🏞 광장 · 📖 도감 그림 — 전부 2D (Three.js 없이)
// =====================================================================
// 영웅 그림: 몸 색 바꾸기 + 모자·얼굴 소품
const HSPR=new Map();
function heroSpr(cfg){const k=JSON.stringify([cfg.id,cfg.col,cfg.hat,cfg.face]);let c=HSPR.get(k);if(c)return c;
 const b0=UB[cfg.id]||UB.chick,b=cfg.col!=null?Object.assign({},b0,{col:cfg.col}):b0;c=mk(256,340);const x=c.getContext('2d');x.scale(2,2);x.translate(0,10);
 let m;const im=IMG.u[b0.id];if(im){const r=Math.min(128/im.width,160/im.height);x.drawImage(im,64-im.width*r/2,150-im.height*r,im.width*r,im.height*r);m={top:20,fy:60,fs:1,ex:14}}else m=drawBird(x,b,1);
 heroDeco2(x,cfg,m);c._ay=320;HSPR.set(k,c);return c}
function heroDeco2(x,cfg,m){const cx=64,t=m.top,fy=m.fy,s=m.fs,ex=m.ex;
 switch(cfg.hat){
 case'crown':Pn(x,[[cx-17,t+4],[cx-19,t-14],[cx-9,t-5],[cx,t-18],[cx+9,t-5],[cx+19,t-14],[cx+17,t+4]],'#facc15',4);E(x,cx,t-1,4,4,'#ef4444',2);break;
 case'beanie':x.beginPath();x.arc(cx,t+12,25,Math.PI,0);x.closePath();x.fillStyle='#ef4444';x.fill();x.lineWidth=4;x.strokeStyle=OL;x.stroke();Pn(x,[[cx-27,t+6],[cx+27,t+6],[cx+27,t+15],[cx-27,t+15]],'#f8fafc',4);E(x,cx,t-14,7,7,'#f8fafc',3.5);break;
 case'cap':x.beginPath();x.arc(cx,t+12,24,Math.PI,0);x.closePath();x.fillStyle='#2563eb';x.fill();x.lineWidth=4;x.strokeStyle=OL;x.stroke();E(x,cx+6,t+13,24,6,'#1d4ed8',4);E(x,cx,t-12,4,4,'#fde047',2.5);break;
 case'party':Pn(x,[[cx-14,t+4],[cx,t-34],[cx+14,t+4]],'#a855f7',4);L(x,[[cx-9,t-8],[cx+6,t-4]],'#fde047',3);E(x,cx,t-36,6,6,'#fde047',3);break;
 case'ribbon':Pn(x,[[cx+14,t+4],[cx+2,t-8],[cx+2,t+12]],'#f472b6',3.5);Pn(x,[[cx+14,t+4],[cx+26,t-8],[cx+26,t+12]],'#f472b6',3.5);E(x,cx+14,t+4,5,5,'#ec4899',3);break;
 case'flower':for(let i=0;i<5;i++){const a=i*TAU/5;E(x,cx+16+Math.cos(a)*7,t+2+Math.sin(a)*7,6,6,'#f9a8d4',2.5)}E(x,cx+16,t+2,4.5,4.5,'#fde047',2.5);break;
 case'halo':E(x,cx,t-14,20,6,null,0);x.lineWidth=7;x.strokeStyle=OL;x.stroke();x.lineWidth=4;x.strokeStyle='#fde047';x.stroke();break;
 case'horns':[-1,1].forEach(d=>Pn(x,[[cx+d*8,t+6],[cx+d*24,t-14],[cx+d*20,t+8]],'#dc2626',3.5));break}
 const r=9*s+1;
 if(cfg.face==='shades'){[-1,1].forEach(d=>Pn(x,[[cx+d*ex-r,fy-r*.6],[cx+d*ex+r,fy-r*.6],[cx+d*ex+r*.8,fy+r*.6],[cx+d*ex-r*.8,fy+r*.6]],'#111827',3));L(x,[[cx-ex+r,fy-r*.3],[cx+ex-r,fy-r*.3]],'#111827',2)}
 else if(cfg.face==='pink'){[-1,1].forEach(d=>E(x,cx+d*ex,fy,r,r*.8,'#f43f5ecc',3));L(x,[[cx-ex+r,fy],[cx+ex-r,fy]],'#be123c',2)}
 else if(cfg.face==='mono'){E(x,cx+ex,fy,r,r,null,0);x.lineWidth=3;x.strokeStyle='#facc15';x.stroke();L(x,[[cx+ex+r*.7,fy+r*.7],[cx+ex+r,fy+r*2.6]],'#facc15',1.2)}}

// 📖 도감 사진: 3D 사진 대신 2D 그림을 찍어 넣어요
const shot2=(c,n)=>{const o=mk(200,200),x=o.getContext('2d'),h=180,w=h*c.width/c.height;if(n>1){[[-48,8,.8],[48,8,.8],[0,18,.9]].slice(0,n).forEach(([dx,dy,k])=>x.drawImage(c,100-w*k/2+dx,190-h*k+dy-18,w*k,h*k))}else x.drawImage(c,100-w/2,190-h,w,h);return o.toDataURL()};
dxThumbs=function(){if(DXC.done)return;try{U.forEach(u=>{DXC['u_'+u.id]=shot2(birdSpr(u,0),Math.min(3,u.count||1))});
 T.forEach(t=>{for(let lv=1;lv<=(t.id==='wall'?1:4);lv++)DXC[lv===1?'t_'+t.id:'t_'+t.id+'_'+lv]=shot2(towerSpr(t,lv),1)})}catch(e){console.log(e)}DXC.done=1};

// 공용 2D 캔버스 (로비·꾸미기·광장이 돌려 써요)
let LX=null,LDPR=1;
lobAttach=function(host){if(!LR){const c=mk(10,10);LR={domElement:c,_w:0,_h:0};LX=c.getContext('2d');
  c.addEventListener('pointerdown',e=>{if(lobMode!=='plaza'||!PZ)return;const r=c.getBoundingClientRect(),q=pzInv(e.clientX-r.left,e.clientY-r.top),d=Math.hypot(q[0],q[1]),k=d>7.4?7.4/d:1;PZ.me.tx=q[0]*k;PZ.me.ty=q[1]*k;PZ.me.go=1})}
 if(LR.domElement.parentNode!==host)host.prepend(LR.domElement);LR._w=0};
function lfit(){const c=LR.domElement,el=c.parentNode;if(!el)return false;const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return false;LDPR=Math.min(devicePixelRatio||1,2);
 if(LR._w!==w||LR._h!==h){LR._w=w;LR._h=h;c.width=Math.round(w*LDPR);c.height=Math.round(h*LDPR)}LX.setTransform(LDPR,0,0,LDPR,0,0);LX.clearRect(0,0,w,h);return true}
function drawAt(x,c,px,py,h,flip,rot){const w=h*c.width/c.height;x.save();x.translate(px,py);if(rot)x.rotate(rot);if(flip)x.scale(-1,1);x.drawImage(c,-w/2,-h*(c._ay||150)/c.height,w,h);x.restore()}
lobbyFrame=function(t){if(!lfit())return;const x=LX,W=LR._w,H=LR._h,hero=lobMode==='hero';
 const cx=W/2,base=hero?H*.86:H*.72,pr=Math.min(W*.42,hero?150:190);
 if(!hero){const g=x.createRadialGradient(cx,base-pr*.9,10,cx,base-pr*.9,pr*1.6);g.addColorStop(0,'#c4b5fd55');g.addColorStop(1,'#c4b5fd00');x.fillStyle=g;x.beginPath();x.ellipse(cx,base-pr*.8,pr*1.05,pr*1.5,0,0,TAU);x.fill()}
 // 받침대
 const ry=pr*.28;x.lineWidth=4;E(x,cx,base+ry*.55,pr*1.02,ry,'#b45309',4);x.fillStyle='#d97706';x.fillRect(cx-pr*1.02,base,pr*2.04,ry*.55);x.strokeStyle=OL;x.beginPath();x.moveTo(cx-pr*1.02,base);x.lineTo(cx-pr*1.02,base+ry*.55);x.moveTo(cx+pr*1.02,base);x.lineTo(cx+pr*1.02,base+ry*.55);x.stroke();
 E(x,cx,base,pr*1.02,ry,'#f59e0b',4);E(x,cx,base,pr*.86,ry*.8,'#fde68a',0);E(x,cx,base,pr*.4,ry*.32,'#00000033',0);
 const c=heroSpr(SV.hero),h=(hero?H*.72:Math.min(H*.5,pr*1.7))*(SV.hero.id==='ostrich'?1.05:1),hop=Math.abs(Math.sin(t*2.2))*h*.03;
 drawAt(x,c,cx,base-hop,h,Math.sin(t*.35)>0,Math.sin(t*1.4)*.05)};
// 🏞 광장 (위에서 비스듬히 본 동그란 잔디 광장)
const PK=.62;let PZV={cx:0,cy:0,sc:30};
const pzP=(x,y,z)=>{const W=LR._w,H=LR._h;return[W/2+(x-PZV.cx)*PZV.sc,H*.52-(y-PZV.cy)*PZV.sc*PK-(z||0)*PZV.sc]};
function pzInv(px,py){const W=LR._w,H=LR._h;return[(px-W/2)/PZV.sc+PZV.cx,-(py-H*.52)/(PZV.sc*PK)+PZV.cy]}
pzBird=function(cfg,name,me){const el=document.createElement('div');el.className='pb';el.innerHTML=`<div class="bb" style="display:none"></div><div class="pn${me?' me':''}"></div>`;el.lastChild.textContent=name;$('plo').append(el);
 const a=Math.random()*TAU,r=me?0:2+Math.random()*4;return{c:heroSpr(cfg),cfg,el,bb:el.firstChild,name,me,air:UB[cfg.id].t==='A',x:Math.cos(a)*r,y:Math.sin(a)*r-(me?2.6:0),tx:0,ty:0,wait:Math.random()*3,say:0,ph:Math.random()*9,fl:false}};
pzBuild=function(){PZ={b:[],t:0,nt:2,log:[]};PZ.me=pzBird(SV.hero,SV.hero.name,1);PZ.b.push(PZ.me);
 const pool=heroPool();for(let i=0;i<7;i++){const u=pool[Math.floor(Math.random()*pool.length)];PZ.b.push(pzBird({id:u.id,col:Math.random()<.35?HCOL[1+Math.floor(Math.random()*12)]:null,hat:HATS[Math.floor(Math.random()*HATS.length)][0],face:Math.random()<.3?FACES[1+Math.floor(Math.random()*3)][0]:'none'},NICKS[(i*5+Math.floor(Math.random()*12))%12]+'_'+(100+Math.floor(Math.random()*900)),0))}
 $('pzn').textContent=`👥 ${PZ.b.length}명 · 지금은 AI 친구들 (온라인 준비 중)`};
const TREES=[...Array(7)].map((_,i)=>{const a=i*TAU/7+.3;return[Math.cos(a)*6.6,Math.sin(a)*6.6,i%2]});
plazaFrame=function(t,dt){if(!PZ)pzBuild();if(!lfit())return;const x=LX,W=LR._w,H=LR._h;PZ.t+=dt;PZ.nt-=dt;
 if(PZ.nt<=0){PZ.nt=2.5+Math.random()*3;const b=pzNpc();Math.random()<.55?pzSay(b,PZL[Math.floor(Math.random()*PZL.length)]):pzSay(b,EMO[Math.floor(Math.random()*EMO.length)],1)}
 const me=PZ.me;if(me.c!==heroSpr(SV.hero))me.c=heroSpr(SV.hero);
 PZV.sc=Math.min(W/8.5,H/7);PZV.cx+=(me.x*.85-PZV.cx)*Math.min(1,dt*4);PZV.cy+=(me.y*.85-PZV.cy)*Math.min(1,dt*4);const sc=PZV.sc;
 // 땅
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3f7a36');g.addColorStop(1,'#2f5f2a');x.fillStyle=g;x.fillRect(0,0,W,H);
 const ell=(r,f,lw)=>{const[a,b]=pzP(0,0);E(x,a,b,r*sc,r*sc*PK,f,lw)};
 {const[a,b]=pzP(0,0);E(x,a,b+sc*.25,8.2*sc,8.2*sc*PK,'#2a5224',0)}ell(8.2,'#8cc765',3);ell(4.1,'#e8d9a8',0);ell(3.3,'#8cc765',0);ell(1.9,'#f5ecd0',0);
 // 분수
 {const[a,b]=pzP(0,0);E(x,a,b+sc*.12,1.3*sc,1.3*sc*PK,'#a8a29e',3);E(x,a,b,1.2*sc,1.2*sc*PK,'#d6d3d1',3);E(x,a,b,1.02*sc,1.02*sc*PK,'#38bdf8',0);
  for(let i=0;i<3;i++){const k=((t*.6+i/3)%1);x.globalAlpha=1-k;E(x,a,b,(.3+k*.7)*sc,(.3+k*.7)*sc*PK,null,0);x.lineWidth=2;x.strokeStyle='#e0f2fe';x.stroke();x.globalAlpha=1}}
 // 새·나무 모아서 앞뒤 순서대로
 const D=[];TREES.forEach(tr=>D.push({y:tr[1],tr}));D.push({y:0,fo:1});
 for(const b of PZ.b){if(!b.me){b.wait-=dt;if(b.wait<=0&&!b.go){const a=Math.random()*TAU,r=2+Math.random()*5;b.tx=Math.cos(a)*r;b.ty=Math.sin(a)*r;b.go=1;b.wait=3+Math.random()*5}}
  b.walk=false;if(b.go){const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);if(d<.06)b.go=0;else{const sp=(b.me?2.6:1.3)*dt,k=Math.min(1,sp/d);b.x+=dx*k;b.y+=dy*k;b.walk=true;if(Math.abs(dx)>.02)b.fl=dx>0}}
  if(b.say>0){b.say-=dt;if(b.say<=0)b.bb.style.display='none'}D.push({y:b.y,b})}
 D.sort((p,q)=>q.y-p.y);
 for(const d of D){if(d.fo){const[a,b]=pzP(0,0);L(x,[[a,b],[a,b-sc*.9]],'#d6d3d1',sc*.2);E(x,a,b-sc*.95,sc*.4,sc*.14,'#d6d3d1',3);E(x,a,b-sc*1.2,sc*.17,sc*.17,'#7dd3fc',3);continue}
  if(d.tr){const[a,b]=pzP(d.tr[0],d.tr[1]);E(x,a,b,sc*.5,sc*.2,'#00000033',0);L(x,[[a,b],[a,b-sc*.5]],'#92400e',sc*.16);Pn(x,[[a-sc*.6,b-sc*.4],[a,b-sc*1.7],[a+sc*.6,b-sc*.4]],d.tr[2]?'#16a34a':'#22c55e',3);Pn(x,[[a-sc*.45,b-sc*1.1],[a,b-sc*2.1],[a+sc*.45,b-sc*1.1]],'#4ade80',3);continue}
  const b=d.b,z=b.air?.55+Math.sin(t*2+b.ph)*.08:(b.walk?Math.abs(Math.sin(t*12+b.ph))*.06:0),[a,c]=pzP(b.x,b.y),hh=sc*(b.cfg.id==='ostrich'?2.1:1.6);
  E(x,a,c,sc*.32,sc*.12,'#00000040',0);if(b.me){x.strokeStyle='#fde047';x.lineWidth=2.5;E(x,a,c,sc*.38,sc*.15,null,0);x.stroke()}
  drawAt(x,b.c,a,c-z*sc,hh,b.fl,b.walk?Math.sin(t*12+b.ph)*.08:0);
  b.el.style.left=a+'px';b.el.style.top=(c-z*sc-hh*.95)+'px';b.el.style.display='flex'}};
window.R2D={birdSpr,towerSpr,SPR,heroSpr};// 디버그·그림 확인용
})();
