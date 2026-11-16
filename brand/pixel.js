// 🦥 빌딩늘보 프로필 캐릭터 — 도트(픽셀) 버전
// 54×54 칸에 한 칸씩 칠하고, 테두리는 자동으로 둘러요. 다시 뽑기: node brand/render-pixel.js
// 콘셉트: 나뭇가지에 매달린 코딩 모르는 나무늘보 · 동그란 안경 · 발로 붙잡은 노트북 화면엔 "?" · 머리 위에도 "?"
function pixelSloth(o){o=o||{};const N=54,G=[...Array(N)].map(()=>Array(N).fill(null));
 const C={fur:'#9c7253',fur2:'#7d5a40',belly:'#b88e6b',face:'#f2dcbc',patch:'#4a2f1e',eye:'#111111',hi:'#ffffff',nose:'#2b1b12',
  frame:'#1f2937',lens:'#d6efff',claw:'#f6ead6',lap:'#a7adb8',lap2:'#7c8391',scr:'#38bdf8',scr2:'#7dd3fc',q:'#ffffff',blush:'#f4a3a8',OL:'#2b1b12'};
 const set=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<N&&y<N)G[y][x]=c};
 const ell=(cx,cy,rx,ry,c)=>{for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1)set(x,y,c)}};
 const rect=(x0,y0,w,h,c)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)set(x,y,c)};
 const ring=(cx,cy,r,c)=>{for(let y=Math.floor(cy-r-1);y<=cy+r+1;y++)for(let x=Math.floor(cx-r-1);x<=cx+r+1;x++){const d=Math.hypot(x-cx,y-cy);if(d<=r+.5&&d>=r-.6)set(x,y,c)}};
 const Q=['.###.','#...#','....#','...#.','..#..','.....','..#..'];const qm=(x0,y0,c)=>Q.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#')set(x0+x,y0+y,c)}));
 const line=(x0,y0,x1,y1,w,c)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0)*2);for(let i=0;i<=n;i++){const t=i/n;ell(x0+(x1-x0)*t,y0+(y1-y0)*t,w/2,w/2,c)}};
 const Q5=['.###.','#...#','...#.','..#..','.....','..#..'];const qm5=(x0,y0,c)=>Q5.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#')set(x0+x,y0+y,c)}));
 // 다리 → 노트북 잡기 (몸 뒤)
 line(21,40,19,46,4,C.fur);line(33,40,35,46,4,C.fur);
 // 몸
 ell(27,37,9,9,C.fur);ell(27,39,5.5,5.5,C.belly);
 // 팔: 나뭇가지에서 어깨까지 (팔·몸 경계는 자연스럽게 이어짐)
 line(13,11,19,31,4.4,C.fur);line(41,11,35,31,4.4,C.fur);
 line(14,13,18,27,1,C.fur2);line(40,13,36,27,1,C.fur2);
 // 노트북 (화면이 보이게, 발로 붙잡음)
 rect(17,45,20,8,C.lap);rect(19,46,16,6,C.scr);rect(19,46,16,1,C.scr2);rect(15,52,24,2,C.lap2);
 qm5(25,46,C.q);
 [[17,46],[19,45],[35,45],[37,46]].forEach(([x,y])=>set(x,y,C.claw));
 // 머리: 테두리 고리를 먼저 둘러 팔과 구분
 ell(27,23.5,10,9.5,C.OL);ell(27,23.5,9,8.5,C.fur);
 ell(27,25,7.5,6.4,C.face);
 // 눈 무늬
 ell(23,24,2.8,2,C.patch);ell(31,24,2.8,2,C.patch);
 // 동그란 안경
 ring(23,24,3,C.frame);ring(31,24,3,C.frame);set(27,23,C.frame);
 // 눈 + 반짝
 rect(22,24,2,2,C.eye);set(22,24,C.hi);rect(31,24,2,2,C.eye);set(31,24,C.hi);
 // 렌즈 반사
 set(21,22,C.lens);set(29,22,C.lens);
 // 코 · 입 · 볼
 rect(26,27,3,2,C.nose);set(26,27,'#6a4630');
 set(25,29,C.nose);set(26,30,C.nose);set(27,29,C.nose);set(28,30,C.nose);set(29,29,C.nose);
 set(20,27,C.blush);set(21,27,C.blush);set(33,27,C.blush);set(34,27,C.blush);
 // 머리 털 결
 set(24,16,C.fur2);set(27,15,C.fur2);set(30,16,C.fur2);
 // 머리 위 물음표
 qm(45,15,'#fde047');
 // ---- 테두리 자동 ----
 const out=G.map(r=>r.slice());for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(G[y][x])continue;
  const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const v=G[y+dy]&&G[y+dy][x+dx];return v});if(nb)out[y][x]=C.OL}
 // ---- 나뭇가지 (캐릭터 위에, 발톱이 걸치게) ----
 const BR='#6b4423',BR2='#8a5a33',LF='#4ade80',LF2='#16a34a';
 for(let x=0;x<N;x++){out[8][x]=C.OL;out[9][x]=BR2;out[10][x]=BR;out[11][x]=BR;out[12][x]=C.OL}
 [[4,6],[22,5],[32,6],[50,5]].forEach(([x,y])=>{for(let dy=-1;dy<=1;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)<3)out[y+dy][x+dx]=Math.abs(dx)+Math.abs(dy)===2?C.OL:(dy<0?LF:LF2)});
 // 손 발톱이 가지를 감싸게
 [[11,9],[13,9],[15,9],[39,9],[41,9],[43,9]].forEach(([x,y])=>{out[y][x]=C.claw;out[y+1][x]=C.claw;out[y-1][x]=C.OL});
 for(let x=11;x<=15;x++){out[11][x]=C.fur;out[12][x]=C.fur}for(let x=39;x<=43;x++){out[11][x]=C.fur;out[12][x]=C.fur}
 return{N,grid:out,bg:o.bg}}
// 캔버스에 그리기 (size: 출력 픽셀 크기)
function drawPixelSloth(x,size,bg){const P=pixelSloth({bg}),k=size/P.N;x.imageSmoothingEnabled=false;
 if(bg){x.fillStyle='#a5d8ff';x.fillRect(0,0,size,size);x.fillStyle='#c9e8ff';x.fillRect(0,size*.6,size,size*.4);
  const cl=(cx,cy)=>{x.fillStyle='#ffffff';[[0,0,6,2],[1,-1,4,1],[-1,1,8,1]].forEach(([dx,dy,w,h])=>x.fillRect((cx+dx)*k,(cy+dy)*k,w*k,h*k))};cl(3,20);cl(44,30);cl(8,40);
  // 바닥에 작은 빌딩들 (빌딩늘보의 꿈)
  [[2,44,6,10],[9,48,5,6],[40,46,5,8],[46,42,7,12]].forEach(([bx,by,w,h])=>{x.fillStyle='#2b1b12';x.fillRect((bx-1)*k,(by-1)*k,(w+2)*k,(h+2)*k);x.fillStyle='#f2b134';x.fillRect(bx*k,by*k,w*k,h*k);x.fillStyle='#fff6d6';
   for(let yy=by+1;yy<by+h-1;yy+=2)for(let xx=bx+1;xx<bx+w-1;xx+=2)x.fillRect(xx*k,yy*k,k,k)})}
 P.grid.forEach((row,y)=>row.forEach((c,xx)=>{if(c){x.fillStyle=c;x.fillRect(Math.floor(xx*k),Math.floor(y*k),Math.ceil(k),Math.ceil(k))}}))}
if(typeof module!=='undefined')module.exports={pixelSloth,drawPixelSloth};
