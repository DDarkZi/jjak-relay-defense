// 👤 사람 재생 봇: 알파고 플레이 기록(jjak_rec_*.json)의 행동을 같은 시간에 그대로 실행(돈이 모자라거나 칸이 막혔으면 될 때까지 대기)
// 사용: node tools/sim/human/replay.js 기록.json [판수/기록=4] [난이도=A]  → 재생 봇 등수(사람 실제 등수와 비교)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../..');
const [RF,K0,DK]=process.argv.slice(2),K=+K0||4,D=DK||'A';const recs=JSON.parse(fs.readFileSync(RF)).recs;
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
const PAGE=`window.replayGame=function(rec,dk){R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff=dk;start();S.cdn=0;S.sim=true;const me=S.pl[0];me.ai=false;me.cfg=null;
 const q=rec.ev.slice();let miss=0;const run=e=>{const a=e[1],g0=me.gold,inc0=me.income,lv=a==='u'&&me.grid[e[3]]&&me.grid[e[3]][e[2]]&&me.grid[e[3]][e[2]].lv;
  if(a==='b'){actBuild(0,e[2],e[3],e[4]);return!!me.grid[e[3]][e[2]]&&me.grid[e[3]][e[2]].bp.id===e[4]}
  if(a==='u'){actUpg(0,e[2],e[3]);const t=me.grid[e[3]][e[2]];return!t||t.lv>lv||t.lv>=4}
  if(a==='d'){actDem(0,e[2],e[3]);return true}
  if(a==='s'){actSend(0,e[2]);return me.gold<g0||!UB[e[2]]}
  if(a==='t'){actTech(0,e[2]);return me.tech===e[2]||me.tech2===e[2]}
  if(a==='ku'||a==='k'){actSkill(0);return true}return true};
 while(!over&&S.t<1800){step(.05);if(!me.alive)continue;let n=0;while(q.length&&q[0][0]<=S.t&&n<40){if(run(q[0])){q.shift();n++}else{if(S.t-q[0][0]>90){q.shift();miss++}break}}}
 const L=S.pl.slice().sort((a,b)=>(b.alive-a.alive)||((b.dieT||1e9)-(a.dieT||1e9)));return{rank:L.indexOf(me)+1,t:Math.round(S.t),left:q.length,miss,lk:me.lkN||0,inc5:(me.mInc||[])[5]||null}}`;
(async()=>{const b=await chromium.launch();const jobs=[];recs.forEach((r,i)=>{for(let k=0;k<K;k++)jobs.push(i)});const res=[];
 await Promise.all([0,1,2,3].map(async()=>{const pg=await b.newPage();pg.setDefaultTimeout(0);await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/*.glb',r=>r.abort());await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.evaluate(PAGE);if(process.env.PATCH)await pg.evaluate(process.env.PATCH);/* PATCH='JS' 비교 실험용 */
  while(jobs.length){const i=jobs.shift();const r=await pg.evaluate(([rec,d])=>replayGame(rec,d),[recs[i],D]);r.i=i;res.push(r)}}));
 recs.forEach((r,i)=>{const R=res.filter(x=>x.i===i);console.log(`기록${i+1}(실제 ${r.res.rank}등 ${Math.round(r.res.t/60)}분) → 재생 ${R.map(x=>x.rank).join(',')}등 · 놓친 새 ${R.map(x=>x.lk).join(',')} · 못한 행동 ${R.map(x=>x.miss+x.left).join(',')}`)});
 const m=a=>a.reduce((x,y)=>x+y,0)/a.length;console.log('재생 평균 등수',m(res.map(x=>x.rank)).toFixed(2),'우승',res.filter(x=>x.rank===1).length+'/'+res.length);await b.close()})();
