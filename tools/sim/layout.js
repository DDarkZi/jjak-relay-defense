// 🧩 수비 배치 비교: 한 판의 AI 8명에게 배치(미로/직선 통로 꽉 채우기/대각선 통로 꽉 채우기)를 무작위로 나눠 주고 등수 비교
// 사용: node tools/sim/layout.js 판수 출력.json "A,X" [배치목록=maze,lane,dlane]
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [N0,OUT,DL,LL]=process.argv.slice(2),N=+N0||10,DS=(DL||'A,X').split(','),LAY=(LL||'maze,lane,dlane').split(',');
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
(async()=>{const br=await chromium.launch();const jobs=[];DS.forEach(d=>{for(let k=0;k<N;k++)jobs.push(d)});const res=[];
 await Promise.all([0,1,2,3].map(async()=>{const pg=await br.newPage();pg.setDefaultTimeout(0);await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);
  while(jobs.length){const d=jobs.shift();res.push(await pg.evaluate(([d,LAY])=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff=d;start();S.cdn=0;S.sim=true;const P0=S.pl[0];P0.ai=true;P0.cfg={...S.pl[1].cfg};P0.gold=S.pl[1].gold;P0.income=S.pl[1].income;
   const lay=Array.from({length:8},(_,i)=>LAY[i%LAY.length]).sort(()=>Math.random()-.5);S.pl.forEach((p,i)=>{if(lay[i]!=='maze')p.mzK=lay[i];else{const L=MZ_TIER[d];p.mzK=L[Math.floor(Math.random()*L.length)]}});
   S.st={td:{},ti:{},tn:{},us:{},un:{},ue:{},up:0};let l5=null;while(!over&&S.t<1800){step(.05);if(!l5&&S.t>=300)l5=S.pl.map(p=>{const pa=bfs(p.grid,COLS>>1,0);return pa?pa.length:0})}
   const die=S.pl.map(p=>p.alive?1e9:p.dieT||0),rank=die.map(x=>1+die.filter(y=>y>x).length);
   return{d,t:Math.round(S.t),pl:S.pl.map((p,i)=>({lay:lay[i],mz:p.mzK,rank:rank[i],inc:p.income,kills:p.kills||0,len:l5?l5[i]:0,dealt:Math.round(p.dealt||0),n:p.cfg&&p.cfg.pn,mT:p.mT||[],mIn:p.mIn||[],mLk:p.mLk||[],mInc:p.mInc||[],dieT:p.dieT||0}))}},[d,LAY]))}}));
 fs.writeFileSync(OUT,JSON.stringify(res));console.log('ok',res.length);await br.close()})();
