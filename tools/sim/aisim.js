// 사용: node aisim.js 판수 출력.json 난이도 '패치 JS 코드' [normal|race]
const {chromium}=require('playwright'),fs=require('fs');const root=require('path').resolve(__dirname,'../..'),[n,outf,par,patch,mode]=process.argv.slice(2);
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
(async()=>{const b=await chromium.launch(),pg=await b.newPage();pg.setDefaultTimeout(0);
await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));
await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await pg.route('**/*.glb',r=>r.abort());
const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);
await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));
if(patch)await pg.evaluate(patch);
const res=await pg.evaluate(([n,dfx,md])=>{const out=[];for(let k=0;k<n;k++){R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();
 const ps=shuf(AIP.filter(a=>!a.hell||dfx==='X')).slice(0,8),gs=ps.map(p=>Object.assign({},p.g,{fav:p.fav,fl:p.fl}));gs.races=md==='race'?shuf(RK_KEYS.flatMap(k=>[k,k])).slice(0,8):Array(8).fill(null);
 S=null;over=false;diff=dfx;start(gs);S.st={td:{},ti:{},tn:{},us:{},un:{},ue:{},up:0};while(!over&&S.t<1800)step(.05);
 const al=S.pl.filter(p=>p.alive);out.push({t:Math.round(S.t),win:al.length===1?al[0].id:-1,ps:ps.map(p=>p.n),race:S.pl.map(p=>p.race),die:S.pl.map(p=>p.dieT?Math.round(p.dieT):null),kills:S.pl.map(p=>p.kills||0),inc:S.pl.map(p=>p.income),us:S.st.us,un:S.st.un,ue:S.st.ue})}return out},[+n,par||'N',mode||'normal']);
fs.writeFileSync(outf,JSON.stringify(res));console.log('done',res.length,errs.slice(0,3));await b.close()})();
