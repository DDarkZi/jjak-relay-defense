// 🎓 알파고 노하우 전수 실험: 8인전에서 4명은 '배운 AI'(운영 유전자를 알파고 평균 쪽으로 learn만큼 섞음), 4명은 그대로 → 배운 쪽 우승률(기대 50%)
// 사용: node tools/sim/teach.js 판수 learn(0~1) 알파평균.json
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [N0,L0,MF]=process.argv.slice(2),N=+N0||20,LEARN=+L0||1,AM=JSON.parse(fs.readFileSync(MF));
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
(async()=>{const br=await chromium.launch();let win=0,tot=0,sc=0;const per=Math.ceil(N/4);
 await Promise.all([0,1,2,3].map(async()=>{const pg=await br.newPage();pg.setDefaultTimeout(0);await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));
  await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));
  for(let k=0;k<per;k++){const r=await pg.evaluate(([AM,L])=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff='M';const pool=AIP.filter(a=>!a.hell).sort(()=>Math.random()-.5);const gs=[],taught=[];
    for(let i=0;i<8;i++){const a=pool[i];const g={...mutG(a.g,.07),tech:a.g.tech,tech2:a.g.tech2,fav:a.fav,fl:a.fl};const t=i%2===0;if(t)for(const k in AM)g[k]=g[k]+(AM[k]-g[k])*L;taught.push(t);gs.push(g)}
    gs.races=Array(8).fill(null);S=null;over=false;start(gs);while(!over&&S.t<1800)step(.05);const L2=S.pl.slice().sort((a,b)=>(b.alive-a.alive)||((b.dieT||1e9)-(a.dieT||1e9)));
    return{w:taught[L2[0].id]?1:0,sc:L2.reduce((s,p,rk)=>s+(taught[p.id]?7-rk:0),0)/4}},[AM,LEARN]);win+=r.w;sc+=r.sc;tot++}}));
 console.log(`learn ${LEARN}: ${tot}판 · 배운 AI 쪽 우승 ${(win/tot*100).toFixed(0)}% (기대 50%) · 배운 AI 평균 점수 ${(sc/tot).toFixed(2)} (기대 3.5)`);await br.close()})();
