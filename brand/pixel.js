// 🦥 빌딩늘보 프로필 캐릭터 — 도트(픽셀) 버전 v2
// 54×54칸에 한 칸씩 칠하고, 테두리는 자동으로 둘러요. 다시 뽑기: node brand/render-pixel.js
// 콘셉트: 두 손으로 나뭇가지에 매달린 나무늘보 · 나무늘보 얼굴 무늬(눈가 줄무늬) · 머리 위 잔머리 두 가닥
//         · 아래 가지에 놓인 노트북을 발로 타닥타닥 치며 개발 중 · 머리 옆 "?" (코딩 모름)
function pixelSloth(){const N=54,G=[...Array(N)].map(()=>Array(N).fill(null));
 const C={fur:'#9c7253',fur2:'#7d5a40',fur3:'#b48663',belly:'#bb9472',face:'#f3dfc0',stripe:'#3f2718',eye:'#0d0d0d',hi:'#ffffff',nose:'#2b1b12',
  claw:'#f6ead6',lap:'#b4bac6',lap2:'#868d9b',key:'#5b6270',scr:'#1e293b',blush:'#f2a1a6',OL:'#2b1b12'};
 const set=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<N&&y<N)G[y][x]=c};
 const ell=(cx,cy,rx,ry,c,rot)=>{const r=rot||0,cs=Math.cos(r),sn=Math.sin(r),R=Math.max(rx,ry)+1;
  for(let y=Math.floor(cy-R);y<=cy+R;y++)for(let x=Math.floor(cx-R);x<=cx+R;x++){const dx=x-cx,dy=y-cy,u=(dx*cs+dy*sn)/rx,v=(-dx*sn+dy*cs)/ry;if(u*u+v*v<=1)set(x,y,c)}};
 const rect=(x0,y0,w,h,c)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)set(x,y,c)};
 const line=(x0,y0,x1,y1,w,c)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0)*2);for(let i=0;i<=n;i++){const t=i/n;ell(x0+(x1-x0)*t,y0+(y1-y0)*t,w/2,w/2,c)}};
 const Q=['.###.','#...#','...#.','..#..','.....','..#..'];const qm=(x0,y0,c)=>Q.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#')set(x0+x,y0+y,c)}));
 // ---- 노트북 (아래 가지 위에 놓임, 화면엔 코드 줄) ----
 rect(12,36,30,10,C.lap);rect(14,37,26,8,C.scr);
 [[15,38,6,'#4ade80'],[15,40,4,'#f472b6'],[15,42,7,'#7dd3fc'],[15,44,3,'#fde047'],[33,38,6,'#7dd3fc'],[34,40,5,'#4ade80'],[32,42,7,'#f472b6'],[34,44,4,'#4ade80']].forEach(([x,y,w,c])=>rect(x,y,w,1,c));
 rect(9,46,36,4,C.lap);rect(9,49,36,1,C.lap2);
 for(let y=46;y<=48;y++)for(let x=11+(y%2);x<=42;x+=2)set(x,y,C.key);
 // ---- 몸 ----
 ell(27,31,8.5,8,C.fur);ell(27,33,5,5,C.belly);
 // 다리 → 발로 키보드 타닥타닥
 line(22,36,19,44,4,C.fur);line(32,36,35,44,4,C.fur);
 [[17,46],[19,46],[21,46],[33,46],[35,46],[37,46]].forEach(([x,y])=>{set(x,y,C.claw);set(x,y-1,C.claw)});
 // ---- 팔: 두 손으로 위 가지를 꽉 ----
 line(13,6,19,27,4.4,C.fur);line(41,6,35,27,4.4,C.fur);
 line(14,9,18,23,1,C.fur2);line(40,9,36,23,1,C.fur2);
 // ---- 머리 (테두리 고리로 팔과 구분) ----
 ell(27,20,10,9.2,C.OL);ell(27,20,9,8.2,C.fur);
 ell(27,14.5,6,2.4,C.fur3);// 정수리 밝은 털
 // 잔머리 두 가닥 (살짝 말린 모양)
 [[25,11],[24,10],[23,9],[22,9]].forEach(([x,y])=>set(x,y,C.fur));
 [[29,11],[30,10],[31,9],[32,9]].forEach(([x,y])=>set(x,y,C.fur));
 // 얼굴 가면
 ell(27,21.5,7.6,6.4,C.face);
 // 나무늘보 눈가 줄무늬 (눈에서 바깥 아래로 흘러내림)
 ell(21.6,21.8,3.6,1.7,C.stripe,-0.5);ell(32.4,21.8,3.6,1.7,C.stripe,0.5);
 // 눈 + 반짝
 rect(22,20,2,2,C.eye);set(22,20,C.hi);rect(31,20,2,2,C.eye);set(31,20,C.hi);
 // 코 · 입 · 볼
 ell(27,24.3,1.9,1.2,C.nose);set(26,24,'#6a4630');
 set(25,26,C.nose);set(26,27,C.nose);set(27,26,C.nose);set(28,27,C.nose);set(29,26,C.nose);
 set(20,25,C.blush);set(34,25,C.blush);
 // 머리 옆 물음표 (코딩 모름)
 qm(45,11,'#fde047');
 // 타닥타닥 효과선
 [[15,43],[14,42],[39,43],[40,42]].forEach(([x,y])=>set(x,y,'#ffffff'));
 // ---- 테두리 자동 ----
 const out=G.map(r=>r.slice());for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(G[y][x])continue;
  if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>G[y+dy]&&G[y+dy][x+dx]&&G[y+dy][x+dx]!=='#ffffff'))out[y][x]=C.OL}
 // ---- 위 가지 (발톱이 걸치게) · 아래 가지 (노트북 받침) ----
 const BR='#6b4423',BR2='#8a5a33',LF='#4ade80',LF2='#16a34a';
 const branch=(y0)=>{for(let x=0;x<N;x++){out[y0][x]=out[y0][x]||C.OL;[[1,BR2],[2,BR],[3,BR]].forEach(([d,c])=>{if(!out[y0+d][x]||out[y0+d][x]===C.OL)out[y0+d][x]=c});out[y0+4][x]=C.OL}};
 branch(2);branch(49);
 const leaf=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-2;dx<=2;dx++){const m=Math.abs(dx)+Math.abs(dy);if(m<3&&y+dy>=0)out[y+dy][x+dx]=m===2?C.OL:(dy<0?LF:LF2)}};
 [[4,1],[22,1],[34,1],[50,1]].forEach(([x,y])=>leaf(x,y));[[3,48],[50,48]].forEach(([x,y])=>leaf(x,y));
 // 손 발톱이 위 가지를 감싸게
 [[11,3],[13,3],[15,3],[39,3],[41,3],[43,3]].forEach(([x,y])=>{out[y][x]=C.claw;out[y+1][x]=C.claw;out[y-1][x]=C.OL});
 for(let x=11;x<=15;x++){out[5][x]=C.fur;out[6][x]=C.fur}for(let x=39;x<=43;x++){out[5][x]=C.fur;out[6][x]=C.fur}
 return{N,grid:out}}
// 캔버스에 그리기 (size: 출력 픽셀 크기, bg: 하늘 배경)
function drawPixelSloth(x,size,bg){const P=pixelSloth(),k=size/P.N;x.imageSmoothingEnabled=false;
 if(bg){x.fillStyle='#a5d8ff';x.fillRect(0,0,size,size);x.fillStyle='#c4e6ff';x.fillRect(0,size*.55,size,size*.45);
  const cl=(cx,cy)=>{x.fillStyle='#ffffff';[[0,0,6,2],[1,-1,4,1],[-1,1,8,1]].forEach(([dx,dy,w,h])=>x.fillRect((cx+dx)*k,(cy+dy)*k,w*k,h*k))};cl(2,16);cl(45,30);cl(4,34)}
 P.grid.forEach((row,y)=>row.forEach((c,xx)=>{if(c){x.fillStyle=c;x.fillRect(Math.floor(xx*k),Math.floor(y*k),Math.ceil(k),Math.ceil(k))}}))}
if(typeof module!=='undefined')module.exports={pixelSloth,drawPixelSloth};
