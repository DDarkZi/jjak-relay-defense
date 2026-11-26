// 📘 v21.0 사람 설계도 학습: 11-25 독+폭풍 1등 판 두루미 전 배치(HB_BOOK A·B)를 출발점으로, 콤보 점수(cS 늪·과자·파리지옥 · cB 비눗방울·회오리·전봇대 · cK 넉백+독 · cP 길 덮기)·설계도 따르기(hbN·hbU·hbX)를 학습
// 사용: node tools/sim/hblab.js 상태.json 세대 세대당판수   · 판마다 학습 후보 4명 + 지금 알파고(알파고 판 22명) 4명
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [SF,GN0,K0]=process.argv.slice(2),GENS=+GN0||1,K=+K0||80,PAR=+(process.env.PAR||4),BASE=process.env.BASE||'알파 실험: 독바람 대장',NS=+(process.env.NS||8);
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
const HK=['hbN','hbU','hbX','cS','cB','cK','cP'];
(async()=>{const br=await chromium.launch();const pages=[];for(let i=0;i<PAR;i++){const pg=await br.newPage();pg.setDefaultTimeout(0);
  await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));pages.push(pg)}
 const GK=await pages[0].evaluate(()=>GK);const mut=(g,s)=>{const o={...g};for(const k in GK){const[a,b]=GK[k];if(o[k]==null)continue;const ss=HK.includes(k)?s*2:s;/* 배치 유전자는 더 크게 */o[k]=Math.max(a,Math.min(b,o[k]+(Math.random()+Math.random()+Math.random()-1.5)*2*ss*(b-a)))}o.tech=g.tech;o.tech2=g.tech2;return o};
 const POOL=await pages[0].evaluate(()=>AIP.filter(a=>a.alpha&&!a.ret&&!a.labo).map(a=>({n:a.n,g:a.g,fav:a.fav||{},fl:a.fl||{}})));
 let st=fs.existsSync(SF)?JSON.parse(fs.readFileSync(SF)):null;
 if(!st){const B=POOL.find(x=>x.n===BASE)||(await pages[0].evaluate(n=>{const a=AIP.find(x=>x.n===n);return a&&{n:a.n,g:a.g,fav:a.fav||{},fl:a.fl||{}}},BASE));if(!B)throw new Error('BASE 없음');
  const slots=[];/* BOOKS='C:2.5:1.5:3,D:1.5:3.5:3' = 설계도:주속성:보조속성:칸 수 (없으면 독바람 A·B) */const BK=(process.env.BOOKS||'A:4.5:3.5:4,B:4.5:3.5:4').split(',').map(s=>s.split(':'));let i=0;
  for(const[bk,t1,t2,nn]of BK)for(let j=0;j<+nn;j++,i++){const g={...B.g,tech:+t1,tech2:+t2,hbT:bk==='B'?.8:.2,hbN:1,hbU:j%4<2?1:.3,hbX:j%2?.2:0,cS:Math.random()*2,cB:Math.random()*2,cK:Math.random()*2,cP:.5+Math.random()};
   slots.push({k:bk+i,n:`알파 설계도 ${bk}${j+1}`,g,fav:B.fav,fl:{hb:1,hbk:bk},s:0,c:0})}
  st={gen:0,games:0,slots,log:[]}}
 const save=()=>fs.writeFileSync(SF,JSON.stringify(st));
 for(let G=0;G<GENS;G++){const cand=[];st.slots.forEach((P,si)=>{cand.push({...P,si,gs:0,gc:0,w:0});cand.push({...P,g:mut(P.g,.1),si,gs:0,gc:0,w:0})});
  let q=[];const next4=()=>{const o=[];while(o.length<4){if(!q.length)q=cand.map((_,i)=>i).sort(()=>Math.random()-.5);const k=q.shift();if(!o.includes(k))o.push(k)}return o};
  const pst={};let left=K;await Promise.all(pages.map(async pg=>{while(left>0){left--;const seat=next4(),opp=POOL.slice().sort(()=>Math.random()-.5).slice(0,4);
   const cf=[...seat.map(k=>({n:cand[k].n,g:cand[k].g,fav:cand[k].fav,fl:cand[k].fl})),...opp].sort(()=>Math.random()-.5);
   const rk=await pg.evaluate(cf=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff='A';const gs=cf.map(c=>aiLearn({...mutG(c.g,0),tech:c.g.tech,tech2:c.g.tech2,fav:c.fav||{},pn:c.n,fl:c.fl||{}},0,c.n));gs.races=Array(8).fill(null);S=null;over=false;start(gs);
    while(!over&&S.t<1800)step(.05);const die=S.pl.map(p=>p.alive?1e9:p.dieT||0);return die.map(x=>1+die.filter(y=>y>x).length)},cf);
   cf.forEach((c,i)=>{const k=seat.find(k=>cand[k].n===c.n&&cand[k].g===c.g);if(k!=null){cand[k].gs+=rk[i];cand[k].gc++;if(rk[i]===1)cand[k].w++}else{const o=pst[c.n]=pst[c.n]||[0,0];o[0]+=rk[i];o[1]++}});st.games++}}));
  let sw=0;st.slots=st.slots.map((P,si)=>{const pa=cand[2*si],ch=cand[2*si+1];const ps=P.s+pa.gs,pc=P.c+pa.gc,pm=ps/Math.max(1,pc),cm=ch.gs/Math.max(1,ch.gc);
   if(ch.gc>=6&&cm<pm){sw++;return{...P,g:ch.g,s:ch.gs,c:ch.gc}}return{...P,s:ps,c:pc}});st.gen++;
  const om=Object.values(pst).reduce((a,v)=>[a[0]+v[0],a[1]+v[1]],[0,0]);const dw=['알파 실험: 독바람 대장','알파 실험: 독바람 2호'].map(n=>pst[n]?(pst[n][0]/pst[n][1]).toFixed(2)+'('+pst[n][1]+')':'-');
  const line=`세대 ${st.gen}: 승계 ${sw}/${st.slots.length} · 누적 ${st.games}판 · 설계도 후보 평균 ${(cand.reduce((a,c)=>a+c.gs,0)/Math.max(1,cand.reduce((a,c)=>a+c.gc,0))).toFixed(2)} · 상대 알파고 평균 ${(om[0]/om[1]).toFixed(2)} · 독바람 대장/2호 ${dw.join(' / ')} · 칸 `+st.slots.map(P=>P.k+' '+(P.s/Math.max(1,P.c)).toFixed(2)).join(' ');
  st.log.push(line);console.log(line);save()}
 await br.close()})();
