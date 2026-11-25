// 📊 종합 리포트 시뮬: 실제 게임과 같은 방식(난이도별 AI 성향 뽑기 + aiLearn)으로 AI 8명 대전
// PATCH='BAL.eggCap=0' 처럼 패치 JS를 줄 수 있음
// 사용: node tools/sim/report.js 판수(난이도마다) 출력.json "M,H,X,Z,A" [teach]
//  teach를 주면 각 판에서 무작위 4명은 안 배운 AI(learn 0) → 배운 쪽/안 배운 쪽 등수 비교
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [N0,OUT,DL,MODE]=process.argv.slice(2),N=+N0||10,DS=(DL||'M,H,X,Z,A').split(','),TEACH=MODE==='teach'||MODE==='ab',AB=MODE==='ab',PAR=+(process.env.PAR||4);
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
(async()=>{const br=await chromium.launch();const jobs=[];DS.forEach(d=>{for(let k=0;k<N;k++)jobs.push(d)});const res=[];let done=0;const errs=[];
 await Promise.all(Array.from({length:PAR},async()=>{const pg=await br.newPage();pg.setDefaultTimeout(0);pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));if(process.env.PATCH)await pg.evaluate(process.env.PATCH);
  while(jobs.length){const d=jobs.shift();const r=await pg.evaluate(([d,TEACH,AB,ABK])=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff=d;const D=DIFF[d];
    /* start()의 성향 뽑기와 같은 규칙 */
    const cf=(d==='A'?AIP.filter(a=>a.alpha&&!a.ret).sort((x,y)=>(y.a3||0)-(x.a3||0)):AIP.filter(a=>(!a.hell||d==='X'||d==='Z')&&!a.aonly)).sort(()=>Math.random()-.5);if(d==='Z')cf.sort((a,b)=>(b.hell&&!b.alpha?1:0)-(a.hell&&!a.alpha?1:0));
    {const seen=new Set(),A1=[],A2=[];cf.forEach(c=>{if(!c.alpha){A1.push(c);return}const k=Math.floor(c.g.tech??9)+'-'+Math.floor(c.g.tech2??9);(seen.has(k)?A2:A1).push(c);seen.add(k)});cf.splice(0,cf.length,...A1,...A2)}
    const pick=cf.slice(0,8).sort(()=>Math.random()-.5),un=new Set(TEACH?[0,1,2,3,4,5,6,7].sort(()=>Math.random()-.5).slice(0,4):[]);
    const gs=pick.map((c,i)=>{const g=aiLearn({...mutG(c.g,.07),tech:c.g.tech,tech2:c.g.tech2,fav:c.fav,efav:c.g.efav,pn:c.n,fl:c.fl},c.alpha||(un.has(i)&&!AB)?0:D.learn||0,c.n);if(AB&&ABK[0]==='flex'){if(un.has(i)){g.fl={...(g.fl||{})};delete g.fl.flex}else{g.fl={...(g.fl||{}),flex:1};Object.assign(g,FLEX_SK)}}else if(AB&&un.has(i)){for(const k of ABK)g[k]=0}/* ABK=flex: 4명만 유동 수비 */return g});/* ab: 4명은 새 수비 기능 끔 */gs.races=Array(8).fill(null);
    S=null;over=false;start(gs);/* start(gs)는 sim이라 돈이 D.g/D.i, 체력 배율 uh도 그대로 */S.st={td:{},ti:{},tn:{},us:{},un:{},ue:{},up:0};while(!over&&S.t<1800)step(.05);
    const al=S.pl.filter(p=>p.alive),die=S.pl.map(p=>p.alive?1e9:p.dieT||0),rank=die.map(x=>1+die.filter(y=>y>x).length);
    const GKK=Object.keys(GK);
    return{d,t:Math.round(S.t),win:al.length===1?al[0].id:-1,pl:S.pl.map((p,i)=>({n:pick[i].n,alpha:!!pick[i].alpha,hell:!!pick[i].hell,tch:AB?!un.has(i):!un.has(i)&&!pick[i].alpha&&(D.learn||0)>0,tech:p.tech,tech2:p.tech2||p.tech2plan,rank:rank[i],inc:p.income,kills:p.kills||0,egg:p.egg||0,g:Object.fromEntries(GKK.map(k=>[k,+(+p.cfg[k]||0).toFixed(3)]))})),us:S.st.us,un:S.st.un,ue:S.st.ue,td:S.st.td,ti:S.st.ti,tn:S.st.tn,wsw:S.st.wsw||0,tsw:S.st.tsw||0,up:S.st.up||0,rep:S.st.rep||0,crane:(S.st.un.demcrane||0),gold:S.pl.map(p=>Math.round(p.gold))}},[d,TEACH,AB,(process.env.ABK||'wrep,tswap,adapt').split(',')]);
   res.push(r);done++;if(done%10===0)console.error('done',done,'/',DS.length*N)}}));
 fs.writeFileSync(OUT,JSON.stringify(res));console.log('ok',res.length,'errors',errs.length,errs.slice(0,3));await br.close()})();
