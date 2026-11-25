// 🤖🤖 알파고 리그: 알파고만 8명씩 무작위로 앉혀 N판 대결하고, 판마다 사람별 기록(등수·탈락 시각·3/6/9분 인컴·타워·업그레이드·새 지출)을 남긴다
// 사용: node tools/sim/alphaleague.js 판수 출력.json [추가 알파고.json]
//  - 풀: AIP 중 alpha:1 전부(POOL=lab이면 실험실 알파고만). 추가 알파고.json = [{n,g,fav,fl}] (실험용, 판마다 FORCE=1이면 1명은 꼭 앉힘)
//  - 분석: tools/sim/alphaleague_an.py 출력.json
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [N0,OUT,EXF]=process.argv.slice(2),N=+N0||20,EX=EXF?JSON.parse(fs.readFileSync(EXF)):[],PAR=+(process.env.PAR||4);
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
(async()=>{const br=await chromium.launch();let left=N;const out=[];const errs=[];
 await Promise.all(Array.from({length:PAR},async()=>{const pg=await br.newPage();pg.setDefaultTimeout(0);pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));if(process.env.PATCH)await pg.evaluate(process.env.PATCH);
  while(left>0){left--;out.push(await pg.evaluate(([EX,POOL,FORCE])=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff='A';
   let pool=POOL==='ex'?[]:AIP.filter(a=>a.alpha&&(!a.ret||POOL==='all')&&(!a.labo||POOL==='lab'||POOL==='all')&&(POOL!=='lab'||a.lab||a.exp||a.v198)).map(a=>({n:a.n,g:a.g,fav:a.fav,fl:a.fl}));pool=pool.concat(EX);
   let cf=pool.slice().sort(()=>Math.random()-.5).slice(0,8);if(FORCE&&EX.length&&!cf.some(c=>EX.includes(c))){cf[0]=EX[Math.floor(Math.random()*EX.length)]}cf.sort(()=>Math.random()-.5);
   const gs=cf.map(c=>aiLearn({...mutG(c.g,0),tech:c.g.tech,tech2:c.g.tech2,fav:c.fav||{},efav:c.g.efav,pn:c.n,fl:c.fl||{}},0,c.n));gs.races=Array(8).fill(null);
   S=null;over=false;start(gs);const snap={};
   const take=p=>{const tw={},lv=[],lb={},SL=[];let tv=0,py=0,cc=0;p.grid.forEach((r,yy)=>r.forEach((t,xx)=>{if(!t||!t.bp||t.bp.id==='wall')return;tw[t.bp.id]=(tw[t.bp.id]||0)+1;lv.push(t.lv||1);(lb[t.bp.id]=lb[t.bp.id]||[0,0,0,0])[Math.min(4,t.lv||1)-1]++;if(t.bp.slow||t.bp.freeze)SL.push([cellX(xx,yy),cellY(yy),t.r||t.bp.r]);tv+=t.inv||t.bp.c;if(t.bp.pylon)py++;if(t.bp.cctv)cc++}));
    const sp={};for(const k in (p.spent||{}))sp[k]=Math.round(p.spent[k]);const pa=bfs(p.grid,COLS>>1,0)||[];let cv=0,ov=0;pa.forEach(q=>{const qx=cellX(q.x,q.y),qy=cellY(q.y),n=SL.filter(([x,y,r])=>Math.hypot(qx-x,qy-y)<=r).length;if(n){cv++;ov+=n}});const sf=p._sfN?+(p._sfS/p._sfN).toFixed(3):0;return{lb,slCov:pa.length?+(cv/pa.length).toFixed(3):0,slOv:cv?+(ov/cv).toFixed(2):0,slF:sf,inc:Math.round(p.income),gold:Math.round(p.gold),life:p.life,tv:Math.round(tv),tn:lv.length,lv:lv.length?+(lv.reduce((a,b)=>a+b,0)/lv.length).toFixed(2):0,py,cc,tw,sp,spT:Math.round(p.spT||0)}};
   const T=[180,360,540,720];let ti=0;
   let sfT=0;while(!over&&S.t<1800){step(.05);if(S.t-sfT>=5){sfT=S.t;S.pl.forEach(p=>{if(!p.alive)return;const E=p.units.filter(u=>u.owner!==p.id&&u.hp>0);if(E.length){p._sfS=(p._sfS||0)+E.filter(u=>u.slow>0||u.stun>0).length/E.length;p._sfN=(p._sfN||0)+1}})}if(ti<T.length&&S.t>=T[ti]){S.pl.forEach(p=>{(snap[p.id]=snap[p.id]||{})[T[ti]]=p.alive?take(p):null});ti++}S.pl.forEach(p=>{if(!p.alive&&!p._fin){p._fin=take(p)}})}
   const die=S.pl.map(p=>p.alive?1e9:p.dieT||0),rank=die.map(x=>1+die.filter(y=>y>x).length);
   return{t:Math.round(S.t),pl:S.pl.map((p,i)=>({n:cf[i].n,ex:EX.includes(cf[i])?1:0,seat:i,rank:rank[i],die:p.alive?null:Math.round(p.dieT||0),tech:p.tech,tech2:p.tech2,mz:p.mzName||null,snap:snap[p.id]||{},fin:p.alive?take(p):p._fin}))}},[EX,process.env.POOL||'',+(process.env.FORCE||0)]))
   ;if(out.length%10===0)console.error('…',out.length,'판')}}));
 fs.writeFileSync(OUT,JSON.stringify({games:out,errs:errs.slice(0,5)}));console.log('done',out.length,'판, 오류',errs.length);await br.close()})();
