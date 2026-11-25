// 🧪 콤보 실험실: 정해 둔 수비 배치(타워 조합)에 정해 둔 새 무리를 보내 '얼마나 오래 붙잡고, 얼마나 잡고, 얼마나 새는지' 잰다
// 사용: node tools/sim/combo.js 설정.json [반복=4] > 결과.json
// 설정.json = {defs:{이름:{tech:'wind',tech2:'dark',lay:'snake'|'fork',towers:[['wind',3,2],...] /* [타워,개수,레벨,뒤에서부터=1] 앞줄부터 */}}, waves:{이름:[['duck',6],['peacock',2]] /* [새,마리] 섞어서 0.6초 간격 */}}
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [CF,N0]=process.argv.slice(2),CFG=JSON.parse(fs.readFileSync(CF)),N=+N0||4;
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
const jobs=[];for(const d in CFG.defs)for(const w in CFG.waves)for(let k=0;k<N;k++)jobs.push([d,w]);
(async()=>{const br=await chromium.launch();const out=[];const errs=[];
 await Promise.all([0,1,2,3].map(async()=>{const pg=await br.newPage();pg.setDefaultTimeout(0);pg.on('pageerror',e=>errs.push(String(e)));
  await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);
  while(jobs.length){const [dn,wn]=jobs.shift();out.push(await pg.evaluate(([D,W,dn,wn])=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff='M';
   start();S.cdn=0;S.sim=true;S.pl.forEach(p=>{p.ai=false;p.cfg=null});const me=S.pl[0];me.tech=D.tech||null;me.tech2=D.tech2||null;me.gold=1e9;me.life=1e6;
   /* 배치 칸 목록(앞줄부터) */const C=COLS;let cells=[];
   if((D.lay||'snake')==='snake'){[2,4,6,8,10,12,14].forEach((y,r)=>{const g=r%2?0:C-1;for(let x=0;x<C;x++)if(x!==g)cells.push([x,y])})}
   else{for(const ys of [[1,2,3,4,5],[8,9,10,11,12]])for(const y of ys)for(let x=1;x<C-1;x++)cells.push([x,y])}
   let cost=0,i=0,j=cells.length-1;const g0=me.gold;me.sawSt=1;
   for(const [id,n,lv,bk] of D.towers)for(let k=0;k<n;k++){const c=bk?cells[j--]:cells[i++];if(!c)break;actBuild(0,c[0],c[1],id);const t=me.grid[c[1]][c[0]];if(!t||t.bp.id!==id)continue;for(let l=1;l<(lv||1);l++)actUpg(0,c[0],c[1])}
   for(;i<=j;i++){const c=cells[i];if(!me.grid[c[1]][c[0]]){me.grid[c[1]][c[0]]=mkR(TB.wall,me)}}if(typeof refreshPaths==='function')refreshPaths(me);
   cost=g0-me.gold;
   /* 새 보내기 계측 */let leakDm=0,leakN=0,kill=0,dw=0,dn2=0,sent=0,gold=0;const oe=window.escape;window.escape=function(p,u){if(p.id===0){leakDm+=u.bp.dm;leakN++;u._esc=1}return oe.apply(this,arguments)};
   const q=[];for(const [id,n,ov] of W){const b0=U.find(u=>u.id===id),b=ov?{...b0,...ov}:b0;/* ov: 능력 바꿔 보기 예) {flock:0} */for(let k=0;k<n;k++)q.push(b)}q.sort(()=>Math.random()-.5);
   const seen=new Set();let nt=0;
   while(S.t<400){if(q.length&&S.t>=nt){const b=q.shift();for(let c=cntOf(b);c>0;c--)spawn(me,b,1);sent++;gold+=b.c;nt=S.t+.6}
    step(.05);
    for(const u of me.units)if(!seen.has(u)){seen.add(u);u._t0=S.t}
    for(const u of seen)if(!me.units.includes(u)){seen.delete(u);dw+=S.t-u._t0;dn2++;if(!u._esc)kill++}
    if(!q.length&&!me.units.length)break}
   window.escape=oe;
   return{d:dn,w:wn,cost,sent,gold,kill,all:dn2,leakN,leakDm,dwell:dn2?dw/dn2:0,end:S.t}},[CFG.defs[dn],CFG.waves[wn],dn,wn]))}}));
 await br.close();
 const agg={};for(const r of out){const k=r.d+' | '+r.w,a=agg[k]||(agg[k]={d:r.d,w:r.w,n:0,cost:r.cost,gold:r.gold,kill:0,all:0,leakDm:0,dwell:0});a.n++;a.kill+=r.kill;a.all+=r.all;a.leakDm+=r.leakDm;a.dwell+=r.dwell}
 const rows=Object.values(agg).map(a=>({d:a.d,w:a.w,cost:a.cost,gold:a.gold,killP:+(a.kill/a.all*100).toFixed(1),leakDm:+(a.leakDm/a.n).toFixed(1),dwell:+(a.dwell/a.n).toFixed(1)}));
 console.log(JSON.stringify({rows,errs:errs.slice(0,5)},null,0).replace(/\},\{/g,'},\n{'));
})();
