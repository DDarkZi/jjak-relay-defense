// 🏆 속성 조합 리그: 조합별 알파고(arch_cXY.json의 best) 10명 중 8명씩 무작위 8인전 → 조합별 우승률·평균 등수
// 사용: node tools/sim/league.js 상태폴더 판수
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [DIR,N0]=process.argv.slice(2),N=+N0||100;const C=['c01','c02','c03','c04','c12','c13','c14','c23','c24','c34'];
const G=C.map(c=>JSON.parse(fs.readFileSync(`${DIR}/arch_${c}.json`)).best);
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
(async()=>{const br=await chromium.launch();const R=C.map(()=>({n:0,w:0,rk:0}));let done=0;
 await Promise.all([0,1,2,3].map(async()=>{const pg=await br.newPage();pg.setDefaultTimeout(0);await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));
  await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));
  while(done<N){done++;const pick=C.map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,8);
   const rk=await pg.evaluate(gs=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff='X';gs=JSON.parse(JSON.stringify(gs));gs.races=Array(8).fill(null);S=null;over=false;start(gs);while(!over&&S.t<1800)step(.05);
    const L=S.pl.slice().sort((a,b)=>(b.alive-a.alive)||((b.dieT||1e9)-(a.dieT||1e9)));return L.map(p=>p.id)},pick.map(i=>G[i]));
   rk.forEach((seat,r)=>{const ci=pick[seat];R[ci].n++;R[ci].rk+=r+1;if(r===0)R[ci].w++})}}));
 const NM={c01:'🔥화염+❄️빙결',c02:'🔥화염+⚡뇌전',c03:'🔥화염+🌪️폭풍',c04:'🔥화염+☠️독',c12:'❄️빙결+⚡뇌전',c13:'❄️빙결+🌪️폭풍',c14:'❄️빙결+☠️독',c23:'⚡뇌전+🌪️폭풍',c24:'⚡뇌전+☠️독',c34:'🌪️폭풍+☠️독'};
 C.map((c,i)=>({c,nm:NM[c],w:R[i].w/R[i].n,rk:R[i].rk/R[i].n,n:R[i].n})).sort((a,b)=>a.rk-b.rk).forEach((r,i)=>console.log(`${i+1}위 ${r.nm}  우승 ${(r.w*100).toFixed(0)}%  평균 ${r.rk.toFixed(2)}등  (${r.n}판 출전)`));await br.close()})();
