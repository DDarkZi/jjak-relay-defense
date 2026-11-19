/* 🦃 초반 인컴 오프닝 실험(vs7.js PATCH로 사용): window.OPEN_M = 0~7, 알파고 자리(window.__aSeat)에만 적용
   0 기준(그대로) · 1 칠면조 몰빵 · 2 해적 1 → 칠면조 · 3 알 타워 철거 → 칠면조 · 4 인컴 체감 앞당기기(2분 동안 가성비 새만)
   5 처치 보상 수비(싼 타워 2개 + 칠면조) · 6 해적갈매기 집중 · 7 다양한 가성비 새 섞기
   끝나는 조건: 1·2·3·6·7 = 목숨 80 이하 또는 인컴 400 이상 또는 180초 / 4 = 120초 / 5 = 180초 또는 목숨 80 이하 */
(()=>{const orig=aiTick;const MIX=['turkey','penguin','duck','egg_legs','kiwi','chick'];
 const buyAll=(p,ids)=>{let n=0,k=0;for(let g=0;g<300;g++){const id=ids[k%ids.length],b=UB[id];if(!b||!techOK(p,b)||p.gold<ucost(p,b)){k++;if(k>ids.length*2)break;continue}if(!buyOne(p,b))break;n++;if(ids.length>1)k++}return n};
 window.aiTick=aiTick=function(p){const M=window.OPEN_M|0;if(!M||p.id!==window.__aSeat||p.opDone)return orig(p);
  const t=S.t,done=M===4?t>=120:M===5?(t>=180||p.life<=80):(t>=180||p.life<=80||p.income>=400);if(done){p.opDone=1;return orig(p)}
  if(!p.opS){p.opS=1;
   if(M===3){const t0=p.grid[8]&&p.grid[8][3];if(t0&&t0.bp&&t0.bp.id==='egg'){p.gold+=Math.floor(t0.inv*refR(p));p.grid[8][3]=null;refreshPaths(p)}}
   if(M===2)buyAll(p,['pirate']);
   if(M===5){let k=0;for(const [x,y] of [[2,12],[4,12],[3,11],[1,11],[5,11],[3,13]]){if(k>=2)break;if(p.grid[y][x])continue;p.grid[y][x]={};const ok=allOK(p.grid);p.grid[y][x]=null;if(!ok)continue;actBuild(p.id,x,y,'egg');if(p.grid[y][x])k++}}}
  const ids=M===6?['pirate']:M===7||M===4?MIX:['turkey'];buyAll(p,ids)}})();
