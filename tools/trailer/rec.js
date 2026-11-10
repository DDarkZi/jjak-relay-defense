const R=require('./rt.js');const ONLY=process.argv[2];
(async()=>{const {b,pg}=await R.open();const tk=n=>pg.evaluate(n=>{for(let i=0;i<n;i++)__tick(1000/30)},n);
await pg.evaluate(()=>{SV.hero={id:'chick',col:null,hat:'crown',face:'none',name:'짹짹이'};SV.tut=1;svSave()});
// 로비 장면 먼저
if(!ONLY||ONLY==='lobby'){await tk(20);await R.clip(pg,'sc/lobby',75)}
await pg.click('#go');await tk(10);
await pg.evaluate(()=>{S.cdn=0;S.cdl=0;$('cdn').style.display='none';S.off=0;const me=S.pl[0];me.gold=4200;actTech(0,'fire');actTech(0,'thunder');
 window.__R=(a,b)=>a+Math.random()*(b-a);window.__bird=(id,k,y)=>{const u=spawn(S.pl[0],UB[id],k);if(y!==undefined)u.y=y;return u};});
await tk(30);
// 3) 웃긴 새 클로즈업: 한 마리씩 단독
if(!ONLY||ONLY==='fun'){await pg.evaluate(()=>{window.__keep=S.pl[0].units.slice()});
 await R.clip(pg,'sc/fun',128,i=>{const ids=['ostrich','dodo','parrot','crocbird'],k=Math.floor(i/32);
  if(i%32===0){window.__cf=null;S.pl[0].units.length=0;const u=__bird(ids[k],[3,2,4,3][k],.9);u.hp*=50;u.max=u.hp;u.spd0=u.spd;window.__cu=u;if(u.bp.talk){u.tkN=3;u.tkI=[0,0,0,0][k];u.tkT=S.t+2}}
  const u=__cu,m=um.get(u.id);if(!m)return;const p=m.getWorldPosition(new THREE.Vector3());const z=({ostrich:.9,dodo:.75})[u.bp.id]||.45;
  const r=(m.rotation.z||0),fx=Math.sin(r),fy=-Math.cos(r);window.__cf=window.__cf||{x:fx,y:fy};__cf.x+=(fx-__cf.x)*.08;__cf.y+=(fy-__cf.y)*.08;const L=Math.hypot(__cf.x,__cf.y)||1;Cam.position.set(p.x+__cf.x/L*4.8+.4,p.y+__cf.y/L*4.8,p.z+3.2+z);Cam.lookAt(p.x,p.y,p.z+z)});
 await pg.evaluate(()=>{S.pl[0].units.length=0;__keep.forEach(u=>S.pl[0].units.push(u))})}
await pg.evaluate(()=>{resize()});
// 1) 타워 짓기 (미로가 생김)
const B=[['egg',1,3],['egg',3,3],['ember',5,3],['air',1,6],['static',3,6],['sun',5,6],['lava',2,9],['thunder',4,9],['plasma',3,12],['air',5,12],['egg',1,12],['ember',6,9]];
await pg.evaluate(B=>{window.__B=B},B);
if(!ONLY||ONLY==='build'){await R.clip(pg,'sc/build',100,i=>{if(i%8===2&&i/8<12){const [t,x,y]=window.__B[Math.floor(i/8)];const me=S.pl[0],g=me.gold;me.gold+=9000;actBuild(0,x,y,t);me.gold=g-[130,150,170][i%3];ui()}})}
await pg.evaluate(B=>{window.__B=B},B);
await pg.evaluate(B=>{const me=S.pl[0];B.forEach(([t,x,y])=>{if(!me.grid[y][x]){me.gold+=1000;actBuild(0,x,y,t)}});
 [[1,3,3],[3,3,1],[5,3,2],[3,6,3],[5,6,1],[3,12,2],[2,9,1],[4,9,2]].forEach(([x,y,n])=>{for(let i=0;i<n;i++){me.gold+=3000;actUpg(0,x,y)}});me.gold=2380;ui()},B);
// 2) 새떼 몰려옴
await pg.evaluate(()=>{['chick','turkey','duck','penguin','woodpecker','crow','eagle','owl','pigeon','humbee','chick','duck','penguin','turkey','crow','pigeon','peacock','chick'].forEach((id,i)=>__bird(id,1+i%7,-.5-(i%5)*.6))});
await tk(45);
if(!ONLY||ONLY==='swarm')await R.clip(pg,'sc/swarm',90,i=>{if(i%12===0)['woodpecker','penguin','chick'].forEach((id,k)=>__bird(id,1+((i/12+k*3)|0)%7,-.5))});
// 4) 뉴스새 AI 속보
await pg.evaluate(()=>{['chick','duck','penguin','crow','pigeon','eagle'].forEach((id,i)=>__bird(id,1+i,-.5-i*.3));newsBird('🚨 새떼 주의보! 30초 뒤 피해 2배!')});
if(!ONLY||ONLY==='news')await R.clip(pg,'sc/news',105);
// 5) 조합 스킬
await pg.evaluate(()=>{const me=S.pl[0];me.tech2='thunder';me.skU=1;me.skCD=0;['eagle','turkey','owl','penguin','duck','crow','humbee','chick'].forEach((id,i)=>__bird(id,1+i%7,3+i*.7));ui()});
await tk(10);
if(!ONLY||ONLY==='skill')await R.clip(pg,'sc/skill',90,i=>{if(i===8){S.pl[0].skCD=0;actSkill(0);ui()}});
// 6) 유닛 보내기
await pg.click('#t2');await tk(6);
if(!ONLY||ONLY==='send')await R.clip(pg,'sc/send',90,i=>{if(i%10===4){const ids=['eagle','ostrich','parrot','dodo','owl','crocbird','peacock','penguin'];const me=S.pl[0],g=me.gold,b=UB[ids[((i/10)|0)%8]];me.gold+=9000;send(b);me.gold=Math.max(1800,g-b.c)}});
// 7) 8명 릴레이: 시점 돌리기
if(!ONLY||ONLY==='ring')await R.clip(pg,'sc/ring',90,i=>{if(i%22===0){view=(i/22|0)+1;S.pl.forEach((p,k)=>{if(k&&k===view&&!p.units.length)['chick','duck','crow','penguin','eagle'].forEach((id,j)=>{const u=spawn(p,UB[id],(k+1)%8);u.y=1+j})});ui()}});
await b.close()})();
