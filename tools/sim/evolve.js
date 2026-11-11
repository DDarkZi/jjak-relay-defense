// 🤖 알파고 모드용 자기 대국 진화: 후보 AI 1명 + 실제 AI 풀 7명(어려움)으로 8인전을 반복해 등수로 점수 → 상위 유전자 교배·돌연변이
// 사용: node tools/sim/evolve.js 상태.json 세대수 [판수/후보=8] [개체수=14]   (이어서 돌리면 상태 파일에서 계속)
// 마지막 결과: 상태.json 의 best(가장 강한 유전자)·hist(세대별 점수)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [stf,G0,K0,P0]=process.argv.slice(2);const OLD=process.env.OLD?JSON.parse(fs.readFileSync(process.env.OLD)):null,SELF=+(process.env.SELF||0),GENS=+G0||3,K=+K0||8,POP=+P0||14,PAR=4,DK='X';
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
const FAVK=['pelican','phoenix','archaeo','duck','kiwi','egg_legs','humbee','ghostcrow','crane','peacock','ostrich','eagle'];
const PAGEFN=`window.evalCand=function(cand,dk,seat,opp){opp=opp||[];R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff=dk;
 const pool=AIP.filter(a=>!a.hell||dk==='X'||dk==='Z').sort(()=>Math.random()-.5);const gs=[];let j=0;
 let o=0;for(let i=0;i<8;i++){if(i===seat){gs.push(JSON.parse(JSON.stringify(cand)));continue}if(o<opp.length){gs.push(JSON.parse(JSON.stringify(opp[o++])));continue}const a=pool[j++%pool.length];gs.push({...mutG(a.g,.07),tech:a.g.tech,tech2:a.g.tech2,fav:a.fav,fl:a.fl})}
 gs.races=Array(8).fill(null);S=null;over=false;start(gs);while(!over&&S.t<1800)step(.05);
 const L=S.pl.slice().sort((a,b)=>(b.alive-a.alive)||((b.dieT||1e9)-(a.dieT||1e9)));const rk=L.findIndex(p=>p.id===seat);return{sc:7-rk,win:rk===0?1:0,t:S.t}}`;
const rnd=(a,b)=>a+Math.random()*(b-a);
/* 성향별 진화(ARCH=이름): 성향의 핵심 유전자 범위를 고정해서 그 성격 안에서만 최강을 찾음 */
const ARCHS={inc:{inc0:[85,140],incRate:[45,60],uShare:[.65,1]},def:{def8:[1.05,1.3],tw0:[6,14],inc0:[30,60]},rush:{uShare:[.78,1],uTier:[.8,1],rush:[150,260],keep:[100,200],inc0:[30,70]},air:{uAir:[.78,1]},up:{upAgg:[.6,1],upMax:[3,4]}};
const AC=process.env.ARCH?ARCHS[process.env.ARCH]:null;
function clampA(g){if(!AC)return g;for(const k in AC){const[a,b]=AC[k];const v=g[k]??(a+b)/2;g[k]=v<a||v>b?a+Math.random()*(b-a):v}return g}
async function mutate(pg,c,s){return clampA(await pg.evaluate(([c,s,FK])=>{const g=mutG(c,s);g.tech=c.tech;g.tech2=c.tech2;if(Math.random()<s*1.5)g.tech=Math.random()*5;if(Math.random()<s*1.5)g.tech2=Math.random()*5;
  const fl={...(c.fl||{})};for(const k of ['scout','kz','jug'])if(Math.random()<s)fl[k]=fl[k]?0:1;g.fl=fl;const fv={...(c.fav||{})};for(const k of FK){if(Math.random()<s*2)fv[k]=Math.max(0,Math.min(2.5,(fv[k]||0)+(Math.random()-.5)*1.2))}g.fav=fv;return g},[c,s,FAVK]))}
async function cross(pg,a,b){return clampA(await pg.evaluate(([a,b])=>{const g=crossG(a,b);g.tech=Math.random()<.5?a.tech:b.tech;g.tech2=Math.random()<.5?a.tech2:b.tech2;g.fl=Math.random()<.5?{...a.fl}:{...b.fl};const fv={};for(const k of new Set([...Object.keys(a.fav||{}),...Object.keys(b.fav||{})]))fv[k]=Math.random()<.5?(a.fav||{})[k]||0:(b.fav||{})[k]||0;g.fav=fv;return g},[a,b]))}
(async()=>{const br=await chromium.launch();const pages=[];
 for(let i=0;i<PAR;i++){const pg=await br.newPage();pg.setDefaultTimeout(0);await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));
  await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));await pg.evaluate(PAGEFN);pages.push(pg)}
 let st=fs.existsSync(stf)?JSON.parse(fs.readFileSync(stf)):null;
 if(!st){/* 시작 개체: 실제 AI 풀의 좋은 성향 + 지능형 + 무작위 변형 */const seeds=await pages[0].evaluate(()=>AIP.map(a=>({...a.g,fav:a.fav||{},fl:a.fl||{},n:a.n})));
  const pick=seeds.sort(()=>Math.random()-.5).slice(0,POP-4);const hell=seeds.filter(s=>s.fl&&(s.fl.scout||s.fl.kz||s.fl.jug));const pop=[...pick,...hell];
  while(pop.length<POP)pop.push(await mutate(pages[0],pick[pop.length%pick.length],.25));st={gen:0,pop:pop.map(g=>{delete g.n;return clampA(g)}),hist:[],best:null,games:0,arch:process.env.ARCH||null}}
 if(process.env.VAL){/* 검증: 개체마다 실제 AI 풀하고만 VAL판 → 우승률·평균 점수 순위 */const N=+process.env.VAL,tasks=[];st.pop.forEach((c,ci)=>{for(let k=0;k<N;k++)tasks.push([ci,k%8])});const res=st.pop.map(()=>({s:0,n:0,w:0}));let ti=0;
  await Promise.all(pages.map(async pg=>{while(ti<tasks.length){const [ci,seat]=tasks[ti++];try{const opp=OLD?OLD.slice().sort(()=>Math.random()-.5).slice(0,7):[];const r=await pg.evaluate(([c,dk,s,op])=>evalCand(c,dk,s,op),[st.pop[ci],process.env.DK||DK,seat,opp]);res[ci].s+=r.sc;res[ci].n++;res[ci].w+=r.win}catch(e){}}}));
  st.val=res.map((r,i)=>({i,f:+(r.s/r.n).toFixed(2),w:+(r.w/r.n).toFixed(2)})).sort((a,b)=>b.w-a.w||b.f-a.f);console.log(JSON.stringify(st.val));fs.writeFileSync(stf,JSON.stringify(st));await br.close();return}
 for(let G=0;G<GENS;G++){const tasks=[];st.pop.forEach((c,ci)=>{for(let k=0;k<K;k++)tasks.push([ci,k%8])});const res=st.pop.map(()=>({s:0,n:0,w:0}));let ti=0;
  await Promise.all(pages.map(async pg=>{while(ti<tasks.length){const [ci,seat]=tasks[ti++];try{const opp=SELF?st.pop.filter((_,k)=>k!==ci).sort(()=>Math.random()-.5).slice(0,SELF):[];const r=await pg.evaluate(([c,dk,s,op])=>evalCand(c,dk,s,op),[st.pop[ci],DK,seat,opp]);res[ci].s+=r.sc;res[ci].n++;res[ci].w+=r.win}catch(e){}}}));
  st.games+=tasks.length;const fit=res.map((r,i)=>({i,f:r.n?r.s/r.n:0,w:r.n?r.w/r.n:0}));fit.sort((a,b)=>b.f-a.f);
  /* 이전 챔피언은 점수 평균을 누적(운 제거) */const top=fit[0];st.hist.push({gen:st.gen,best:+top.f.toFixed(2),bw:+top.w.toFixed(2),avg:+(fit.reduce((s,x)=>s+x.f,0)/fit.length).toFixed(2)});
  st.best=st.pop[top.i];console.log(`세대 ${st.gen}: 최고 ${top.f.toFixed(2)}(우승 ${(top.w*100).toFixed(0)}%) 평균 ${st.hist.at(-1).avg} · 누적 ${st.games}판`);
  const elite=fit.slice(0,5).map(x=>st.pop[x.i]);const next=[...elite];const s=Math.max(.04,.18*Math.pow(.85,st.gen));
  while(next.length<POP){const pg=pages[0];if(Math.random()<.5){const a=elite[Math.floor(Math.random()*elite.length)],b=elite[Math.floor(Math.random()*elite.length)];next.push(await mutate(pg,await cross(pg,a,b),s*.6))}else next.push(await mutate(pg,elite[Math.floor(Math.random()*elite.length)],s))}
  st.pop=next;st.gen++;fs.writeFileSync(stf,JSON.stringify(st))}
 await br.close()})();
