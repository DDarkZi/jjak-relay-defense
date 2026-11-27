// 🦥 빌딩늘보 마스코트 — 캔버스로 그려요 (게임 2D 그림처럼 굵은 테두리 치비 스타일)
// 사용: drawSloth(ctx, {bg:true|false}) — 1024×1024 기준 좌표. 다시 뽑기: node brand/render.js
function drawSloth(x,o){o=o||{};const OL='#2a1a12',TAU=Math.PI*2;
 const E=(cx,cy,rx,ry,f,lw,rot)=>{x.beginPath();x.ellipse(cx,cy,rx,ry,rot||0,0,TAU);if(f){x.fillStyle=f;x.fill()}if(lw!==0){x.lineWidth=lw||14;x.strokeStyle=OL;x.stroke()}};
 const P=(pts,f,lw)=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();if(f){x.fillStyle=f;x.fill()}if(lw!==0){x.lineWidth=lw||14;x.lineJoin='round';x.strokeStyle=OL;x.stroke()}};
 const RR=(X,Y,w,h,r,f,lw)=>{x.beginPath();x.roundRect(X,Y,w,h,r);if(f){x.fillStyle=f;x.fill()}if(lw!==0){x.lineWidth=lw||14;x.strokeStyle=OL;x.stroke()}};
 const FUR='#a9805e',FUR2='#8a6446',FACE='#f3dfc4',PATCH='#5b3b25',CREAM='#f8ecd8';
 if(o.bg){// 하늘 + 금빛 빌딩 + 동전
  const g=x.createLinearGradient(0,0,0,1024);g.addColorStop(0,'#9fdcff');g.addColorStop(1,'#e8f7ff');x.fillStyle=g;x.fillRect(0,0,1024,1024);
  [[60,520,150,420],[230,640,120,300],[700,600,130,340],[850,460,160,480]].forEach(([X,Y,w,h],i)=>{RR(X,Y,w,h+40,14,i%2?'#f6c453':'#f2b134',10);
   for(let r=0;r<Math.floor(h/70);r++)for(let c=0;c<Math.floor(w/45);c++)RR(X+16+c*45,Y+24+r*70,24,36,5,'#fff6d6',5)});
  x.fillStyle='#7cc96a';x.fillRect(0,900,1024,124);x.lineWidth=12;x.strokeStyle=OL;x.beginPath();x.moveTo(0,900);x.lineTo(1024,900);x.stroke();
  [[150,240,30],[880,250,26],[90,400,20]].forEach(([X,Y,r])=>{E(X,Y,r,r,'#fde047',9);x.fillStyle=OL;x.font=`900 ${r}px sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('₩',X,Y+2)});
 }
 // 그림자
 E(512,930,250,38,'#00000030',0);
 // 다리
 [-1,1].forEach(s=>{E(512+s*130,870,80,58,FUR2);for(let i=0;i<3;i++){x.beginPath();x.moveTo(512+s*(90+i*28),905);x.quadraticCurveTo(512+s*(84+i*28),940,512+s*(70+i*28),945);x.lineWidth=9;x.strokeStyle=CREAM;x.lineCap='round';x.stroke()}});
 // 몸
 E(512,690,235,240,FUR);
 x.save();x.beginPath();x.ellipse(512,690,224,229,0,0,TAU);x.clip();E(512,760,150,150,'#c49a74',0);x.restore();
 // 털 결
 [[380,600],[640,610],[420,800],[610,810]].forEach(([X,Y])=>{x.beginPath();x.moveTo(X-18,Y);x.quadraticCurveTo(X,Y-14,X+18,Y);x.lineWidth=7;x.strokeStyle=FUR2;x.stroke()});
 // 휴대폰 (게임 화면)
 x.save();x.translate(560,700);x.rotate(.12);RR(-78,-120,156,240,28,'#1f2a44');RR(-62,-100,124,192,16,'#7dd3fc',0);
 const sg=x.createLinearGradient(0,-100,0,92);sg.addColorStop(0,'#a5f3fc');sg.addColorStop(1,'#38bdf8');x.fillStyle=sg;x.beginPath();x.roundRect(-62,-100,124,192,16);x.fill();
 // 화면 속 병아리 + 육각 타일
 for(let i=0;i<3;i++){x.beginPath();for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;x.lineTo(-36+i*36+Math.cos(a)*18,60+Math.sin(a)*18)}x.closePath();x.fillStyle='#86c95f';x.fill();x.lineWidth=4;x.strokeStyle=OL;x.stroke()}
 E(0,-10,34,32,'#fde047',7);E(-11,-16,5,6,'#111',0);E(11,-16,5,6,'#111',0);P([[-7,-4],[7,-4],[0,6]],'#f97316',4);
 [-1,0,1].forEach(d=>{x.beginPath();x.moveTo(d*7,-42);x.lineTo(d*10,-54);x.lineWidth=5;x.strokeStyle='#facc15';x.stroke()});
 x.restore();
 // 팔 (휴대폰을 감싸 쥠)
 [[-1,330,560,452,720],[1,700,560,672,640]].forEach(([s,sx,sy,ex,ey])=>{x.beginPath();x.moveTo(sx,sy);x.quadraticCurveTo(sx+s*-30,ey+40,ex,ey);x.lineCap='round';x.lineWidth=96;x.strokeStyle=OL;x.stroke();x.lineWidth=72;x.strokeStyle=FUR;x.stroke();
  for(let i=0;i<3;i++){const cx=ex+s*-6+i*12*(s<0?1:-1),cy=ey-26+i*24;x.beginPath();x.moveTo(cx,cy);x.quadraticCurveTo(cx+s*-20,cy+2,cx+s*-24,cy+16);x.lineWidth=12;x.strokeStyle=OL;x.stroke();x.lineWidth=6;x.strokeStyle=CREAM;x.stroke()}});
 // 머리
 E(512,380,215,195,FUR);
 [[330,330],[700,340],[512,200]].forEach(([X,Y],i)=>{x.beginPath();x.moveTo(X-20,Y+6);x.quadraticCurveTo(X,Y-10,X+20,Y+6);x.lineWidth=7;x.strokeStyle=FUR2;if(i<2)x.stroke()});
 // 얼굴 가면
 x.beginPath();x.moveTo(330,410);x.bezierCurveTo(330,300,450,300,512,330);x.bezierCurveTo(574,300,694,300,694,410);x.bezierCurveTo(694,520,600,550,512,550);x.bezierCurveTo(424,550,330,520,330,410);x.closePath();x.fillStyle=FACE;x.fill();x.lineWidth=10;x.strokeStyle=OL;x.stroke();
 // 눈 무늬 + 눈
 [-1,1].forEach(s=>{E(512+s*92,412,70,40,PATCH,0,s*.38);E(512+s*96,410,24,27,'#111',0);E(512+s*88,399,9,9,'#fff',0);E(512+s*103,420,4.5,4.5,'#fff',0);E(512+s*132,470,30,17,'#fb7185aa',0)});
 // 코 · 입
 E(512,462,32,21,'#3b2416',8);E(503,456,9,5,'#ffffff88',0);
 x.beginPath();x.moveTo(470,495);x.quadraticCurveTo(492,520,512,500);x.quadraticCurveTo(532,520,554,495);x.lineWidth=8;x.lineCap='round';x.strokeStyle=OL;x.stroke();
 // 공사 안전모 (빌딩!)
 x.beginPath();x.moveTo(318,312);x.bezierCurveTo(318,140,706,140,706,312);x.closePath();x.fillStyle='#facc15';x.fill();x.lineWidth=14;x.strokeStyle=OL;x.stroke();
 RR(482,160,60,150,18,'#fde047',10);
 E(512,316,232,36,'#eab308');
 x.beginPath();x.ellipse(512,316,232,36,0,Math.PI*1.05,Math.PI*1.95);x.lineWidth=6;x.strokeStyle='#fff3a6';x.stroke();
 // 안전모 배지: 작은 빌딩
 RR(400,226,58,62,10,'#fff',8);[[410,240],[428,240],[410,260],[428,260]].forEach(([X,Y])=>RR(X,Y,12,12,3,'#38bdf8',0));
 x.save();x.beginPath();x.ellipse(436,220,40,16,-.3,Math.PI*1.1,Math.PI*1.7);x.lineWidth=10;x.strokeStyle='#ffffffaa';x.stroke();x.restore();
}
if(typeof module!=='undefined')module.exports={drawSloth};
