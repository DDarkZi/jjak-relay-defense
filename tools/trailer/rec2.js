// 🎬 홍보 영상 2편(2026-11-17): 더 치열하게 · 웃긴 새 클로즈업 · 조합 스킬 4연발
// 사용: (저장소 루트에서 python3 -m http.server 8123) → 작업 폴더에서 THREE=three.min.js경로 node rec2.js [장면]
const {chromium}=require('playwright'),fs=require('fs');const ONLY=process.argv[2];
const THREE_P=process.env.THREE;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:432,height:768},deviceScaleFactor:2.5});const pg=await ctx.newPage();
 pg.on('pageerror',e=>console.log('ERR',String(e).slice(0,200)));
 if(THREE_P)await pg.route('**/three.min.js',r=>r.fulfill({path:THREE_P,contentType:'application/javascript'}));
 await pg.addInitScript(()=>{let vt=0,q=[],id=0;performance.now=()=>vt;window.requestAnimationFrame=f=>{q.push(f);return ++id};
  window.__tick=ms=>{vt+=ms;const a=q;q=[];a.forEach(f=>{try{f(vt)}catch(e){console.error(e)}})};
  localStorage.setItem('jjj_save_v1',JSON.stringify({coins:120,wins:3,hero:{id:'flamingo',name:'짹짹이'},tut:1,aiIntro:1}))});
 await pg.goto('http://localhost:8123/index.html?v='+Date.now());
 const tk=async n=>{for(let i=0;i<n;i++){await pg.evaluate(()=>__tick(1000/30));if(i%10==0)await pg.waitForTimeout(20)}};
 await tk(60);await pg.waitForTimeout(1500);await tk(20);await pg.evaluate(()=>{window.perfAdapt=()=>{}});
 const clip=async(dir,n,before)=>{fs.mkdirSync('sc/'+dir,{recursive:true});for(let i=0;i<n;i++){if(before)await pg.evaluate(before,i);await pg.evaluate(()=>__tick(1000/30));await pg.screenshot({path:`sc/${dir}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:92})}console.log('clip',dir,n)};
 await pg.evaluate(()=>{diff='X'});await pg.click('#go');await tk(10);
 await pg.evaluate(()=>{S.cdn=0;S.cdl=0;$('cdn').style.display='none';S.off=0;const me=S.pl[0];me.gold=4200;actTech(0,'fire');actTech(0,'thunder');
  window.__bird=(id,k,y,hm)=>{const u=spawn(S.pl[0],UB[id],k);if(y!==undefined)u.y=y;if(hm){u.hp*=hm;u.mh=u.hp}return u};
  const B=[['egg',1,3],['egg',3,3],['ember',5,3],['air',1,6],['static',3,6],['sun',5,6],['lava',2,9],['thunder',4,9],['plasma',3,12],['air',5,12],['egg',1,12],['ember',6,9]];
  B.forEach(([t,x,y])=>{me.gold+=1000;actBuild(0,x,y,t)});[[1,3,3],[3,3,1],[5,3,2],[3,6,3],[5,6,1],[3,12,2],[2,9,1],[4,9,2]].forEach(([x,y,n])=>{for(let i=0;i<n;i++){me.gold+=3000;actUpg(0,x,y)}});
  me.gold=2380;me.income=412;ui();window.__c0={p:Cam.position.clone()};});
 await tk(10);
 /* 카메라: 기본 위치(c0) 기준 확대 z배, 바라보는 곳 y(세계 좌표) */
 await pg.evaluate(()=>{window.__cam=(zm,ty,dx)=>{const c=__c0.p,lx=c.x+(dx||0);Cam.position.set(lx,ty-(BH/2-.4-(c.y))*zm,c.z*zm);Cam.lookAt(lx,ty,0)};
  window.__mob=(ids,hm,y0)=>ids.forEach((id,i)=>__bird(id,1+i%7,(y0??-.5)-(i%5)*.6,hm))});
 const MOB=['chick','turkey','duck','penguin','woodpecker','crow','eagle','owl','pigeon','humbee','flamingo','pirate','peacock','rooster','swan','kiwi','goose','parrot'];
 // 1) AI 속보 (훅)
 if(!ONLY||ONLY==='news'){await pg.evaluate(M=>{__mob(M.slice(0,10),3);newsBird('🚨 새떼 주의보 발령! 대피하세요!')},MOB);
  await clip('news',75,i=>{__cam(1-.25*i/75,BH/2-.4+1.5*(1-i/75))})}
 // 2) 치열한 새떼: 확대 카메라가 위에서 아래로 훑음
 if(!ONLY||ONLY==='swarm'){await pg.evaluate(M=>{S.pl[0].units.length=0;__mob(M,4,2);__mob(M.slice(0,12),4,5)},MOB);
  await clip('swarm',105,i=>{if(i%9===0)__mob(['woodpecker','penguin','chick','crow','flamingo','duck'].slice(0,3+(i/9|0)%3),4,-.3);__cam(.62,BH-3.2-i/105*6.5,Math.sin(i/30)*.6)})}
 // 3) 웃긴 새 클로즈업 (한 마리씩)
 const CU=async(name,id,lane,y,n,trig,at)=>{await pg.evaluate(([id,lane,y,trig,at])=>{window.__cf=null;S.pl[0].units.length=0;const u=__bird(id,lane,y,50);u.stun=0;if(at){u.x=cellX(at[0],at[1])+at[2];u.y=cellY(at[1])+at[3];u.path=null;u.pi=0;refreshPaths(S.pl[0])}window.__cu=u;for(const k in trig)u[k]=trig[k]},[id,lane,y,trig,at]);
  await clip(name,n,()=>{const u=__cu,m=um.get(u.id);if(!m)return;const p=m.getWorldPosition(new THREE.Vector3());const z=({ostrich:.9,demcrane:.9,flamingo:.7})[u.bp.id]||.45;
   const r=(m.rotation.z||0),fx=Math.sin(r),fy=-Math.cos(r);window.__cf=window.__cf||{x:fx,y:fy};__cf.x+=(fx-__cf.x)*.08;__cf.y+=(fy-__cf.y)*.08;const L=Math.hypot(__cf.x,__cf.y)||1;
   const D=u.bp.id==='demcrane'?6.8:4.6,Z=u.bp.id==='demcrane'?1.3:z;Cam.position.set(p.x+__cf.x/L*D+.5,p.y+__cf.y/L*D,p.z+3.0+Z);Cam.lookAt(p.x,p.y,p.z+Z)})};
 if(!ONLY||ONLY==='fla')await CU('fla','flamingo',5,2.2,42,{ac:.5});
 if(!ONLY||ONLY==='crane')await CU('crane','demcrane',3,2.0,75,{gk:.4},[3,3,.2,-1.0]);
 if(!ONLY||ONLY==='ost')await CU('ost','ostrich',2,1.0,42,{lp:.4});
 if(!ONLY||ONLY==='par')await CU('par','parrot',4,2.2,42,{sk:.3});
 // 4) 조합 스킬 4연발
 const SK=[['sk1','fire','thunder'],['sk2','fire','wind'],['sk3','ice','thunder'],['sk4','thunder','dark']];
 for(const [nm,a,c] of SK){if(ONLY&&ONLY!==nm&&ONLY!=='skill')continue;
  await pg.evaluate(([a,c,M])=>{const me=S.pl[0];me.units.length=0;me.tech=a;me.tech2=c;me.skU=1;me.skCD=0;M.forEach((id,i)=>__bird(id,1+i%7,2.5+(i%9)*1.05,6));ui()},[a,c,MOB.slice(0,16)]);
  await clip(nm,50,i=>{if(i===5){S.pl[0].skCD=0;actSkill(0);ui()}__cam(.86,BH/2-.6)})}
 // 5) 새 보내기
 if(!ONLY||ONLY==='send'){await pg.evaluate(()=>{const me=S.pl[0];me.tech='fire';me.tech2='thunder';ui()});await pg.click('#t2');await tk(6);
  await clip('send',60,i=>{if(i%7===3){const ids=['flamingo','ostrich','demcrane','pirate','parrot','pelican','archaeo','dodo','owl'];const me=S.pl[0],g=me.gold,b=UB[ids[((i/7)|0)%9]];me.gold+=9000;send(b);me.gold=Math.max(1800,g-b.c)}__cam(1,BH/2-.4)})}
 // 6) 8명 릴레이: 판을 휙휙 넘김
 if(!ONLY||ONLY==='ring')await clip('ring',66,i=>{if(i%11===0){view=(i/11|0)%7+1;S.pl.forEach((p,k)=>{if(k&&k===view&&p.units.length<8)['chick','duck','crow','penguin','eagle','flamingo','turkey'].forEach((id,j)=>{const u=spawn(p,UB[id],(k+1)%8);u.y=1+j*.8})});ui()}__cam(.9,BH/2-.4)});
 await b.close()})();
