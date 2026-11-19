// 👥 사람 재생 봇 7명 + 알파고 1명: 알파고가 '사람들' 사이에서 몇 등 하는지
// 사용: node tools/sim/human/vs7.js 기록.json [판수=24] [난이도=A]   (PATCH='JS' 가능)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../..');
const [RF,N0,DK]=process.argv.slice(2),N=+N0||24,D=DK||'A';const recs=JSON.parse(fs.readFileSync(RF)).recs;
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
const PAGE=`window.vs7=function(R7,dk,aSeat){R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff=dk;start();S.cdn=0;S.sim=true;
 const H=[];let k=0;S.pl.forEach((p,i)=>{if(i===aSeat){if(!p.cfg){/* 0번 자리는 원래 사람 → 알파고 성향 하나를 붙임 */const c=AIP.filter(a=>a.alpha&&a.hum)[Math.floor(Math.random()*8)]||AIP.find(a=>a.alpha);p.ai=true;p.cfg={...mutG(c.g,.07),tech:c.g.tech,tech2:c.g.tech2,fav:c.fav,pn:c.n,fl:c.fl};p.name=c.n;p.aiT=0}return}
  p.ai=false;p.cfg=null;H.push({p,q:R7[k++].ev.slice()})});
 const run=(p,e)=>{const id=p.id,a=e[1],g0=p.gold,lv=a==='u'&&p.grid[e[3]]&&p.grid[e[3]][e[2]]&&p.grid[e[3]][e[2]].lv;
  if(a==='b'){actBuild(id,e[2],e[3],e[4]);return!!p.grid[e[3]][e[2]]&&p.grid[e[3]][e[2]].bp.id===e[4]}
  if(a==='u'){actUpg(id,e[2],e[3]);const t=p.grid[e[3]][e[2]];return!t||t.lv>lv||t.lv>=4}
  if(a==='d'){actDem(id,e[2],e[3]);return true}
  if(a==='s'){actSend(id,e[2]);return p.gold<g0||!UB[e[2]]}
  if(a==='t'){actTech(id,e[2]);return p.tech===e[2]||p.tech2===e[2]}
  if(a==='ku'||a==='k'){actSkill(id);return true}return true};
 while(!over&&S.t<1800){step(.05);for(const h of H){if(!h.p.alive)continue;let n=0;while(h.q.length&&h.q[0][0]<=S.t&&n<40){let ok;try{ok=run(h.p,h.q[0])}catch(e){ok=true}/* 그 자리에서 못 하는 행동(전용 새 등)은 건너뜀 */if(ok){h.q.shift();n++}else{if(S.t-h.q[0][0]>90)h.q.shift();break}}}}
 const A=S.pl[aSeat],L=S.pl.slice().sort((a,b)=>(b.alive-a.alive)||((b.dieT||1e9)-(a.dieT||1e9)));return{rank:L.indexOf(A)+1,n:A.cfg&&A.cfg.pn||A.name,t:Math.round(S.t),inc3:(A.mInc||[])[3]||0}}`;
(async()=>{const b=await chromium.launch();const jobs=[];for(let i=0;i<N;i++)jobs.push(i);const res=[];
 await Promise.all([0,1,2,3].map(async()=>{const pg=await b.newPage();pg.setDefaultTimeout(0);pg.on('pageerror',e=>console.log('ERR',String(e).slice(0,150)));await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/*.glb',r=>r.abort());await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.evaluate(PAGE);if(process.env.PATCH)await pg.evaluate(process.env.PATCH);
  while(jobs.length){const i=jobs.shift();const sh=recs.slice().sort(()=>Math.random()-.5),R7=Array.from({length:7},(_,k)=>sh[k%sh.length]);/* 기록이 7판보다 적으면 돌려 씀 */const r=await pg.evaluate(([R7,d,s])=>vs7(R7,d,s),[R7,D,1+i%7]);res.push(r)}}));
 const m=a=>a.reduce((x,y)=>x+y,0)/a.length,cnt=[0,0,0,0,0,0,0,0];res.forEach(r=>cnt[r.rank-1]++);
 console.log('알파고 평균 등수',m(res.map(r=>r.rank)).toFixed(2),'(기대 4.5) · 우승',cnt[0]+'/'+res.length,'· 등수 분포',cnt.join(' '),'· 3분 인컴 평균',Math.round(m(res.map(r=>r.inc3))),'· 게임',(m(res.map(r=>r.t))/60).toFixed(1)+'분');
 const by={};res.forEach(r=>{(by[r.n]=by[r.n]||[]).push(r.rank)});Object.entries(by).forEach(([k,v])=>console.log(' ',k,v.length+'판',m(v).toFixed(2)+'등'));await b.close()})();
