// 🧪 v20.8 조합×전략 학습(회의 B): 속성 조합 10개 × 전략 3개 = 30칸. 칸마다 부모·자식(변이)이 '한 리그'에 섞여 같은 조건으로 겨루고, 자식이 부모보다 평균 등수가 좋으면 바꿔 앉음
// 사용: node tools/sim/combolab.js 상태.json 세대 세대당판수     (상태 파일이 없으면 새로 시작, 있으면 이어서)
//  - 출발점: 모든 칸이 같은 기본 유전자(BASE 알파고, 기본 '알파 실험: 교훈 불바람 정석')에서 조합만 바꿔 시작 → 출발점이 같아야 조합끼리 공정 비교
//  - 전략: A 듬성 감속+인컴(slSp·slInc) · B 핵심 4성(upSel·upN·upLo·sv) · C 콤보 함정(m_cx·rpZ, 독+폭풍은 독바람 fl.dw)
//  - 결과: 상태.json의 slots[i] = {k:'조합-전략', n:이름, g, fav, fl, s:등수합, c:판수}. 검증용 ex 파일은 tools/sim/combolab_ex.py
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const [SF,GN0,K0]=process.argv.slice(2),GENS=+GN0||1,K=+K0||100,PAR=+(process.env.PAR||4),BASE=process.env.BASE||'알파 실험: 교훈 불바람 정석',DWB='알파 실험: 독바람 대장';
const STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();";
const TK=['fire','ice','thunder','wind','dark'],TN={fire:'화염',ice:'빙결',thunder:'뇌전',wind:'폭풍',dark:'독'};
const ST={A:{n:'듬성 감속',r:{slSp:[.5,1],slInc:[.4,1],upSel:[0,.45],rpPy:[.4,1],pyMax:[4,10]}},B:{n:'핵심 4성',r:{upSel:[.55,1],upN:[1,4],upLo:[1,2.6],sv:[.4,1],slSp:[0,.5],slInc:[0,.4]}},C:{n:'콤보 함정',r:{m_cx:[.7,1],rpZ:[.8,2],upSel:[0,.45],slSp:[0,.5],slInc:[0,.6]}}};
const DWK=['dwB','dwT','dwM','dwF','dwA','dwR','dwP','dwE','dwZ','dwPy','dwMz'];
const clampS=(g,st)=>{for(const k in ST[st].r){const[a,b]=ST[st].r[k];g[k]=Math.max(a,Math.min(b,g[k]??(a+b)/2))}return g};
const fixT=(g,i,j)=>{g.tech=i+.5;g.tech2=j+.5;return g};
(async()=>{const br=await chromium.launch();const pages=[];for(let i=0;i<PAR;i++){const pg=await br.newPage();pg.setDefaultTimeout(0);
  await pg.route('**/three.min.js',r=>r.fulfill({body:STUB,contentType:'application/javascript'}));await pg.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));await pg.route('**/*.glb',r=>r.abort());
  await pg.goto('file://'+root+'/index.html');await pg.waitForTimeout(300);await pg.addScriptTag({path:root+'/tools/sim/harness.js'});await pg.evaluate(()=>setTune({}));if(process.env.PATCH)await pg.evaluate(process.env.PATCH);pages.push(pg)}
 const GK=await pages[0].evaluate(()=>GK);const mut=(g,s)=>{const o={...g};for(const k in GK){const[a,b]=GK[k];if(o[k]==null)continue;o[k]=Math.max(a,Math.min(b,o[k]+(Math.random()+Math.random()+Math.random()-1.5)*2*s*(b-a)))}return o};
 let st=fs.existsSync(SF)?JSON.parse(fs.readFileSync(SF)):null;
 if(!st){const [B,D]=await pages[0].evaluate(([a,b])=>[AIP.find(x=>x.n===a),AIP.find(x=>x.n===b)].map(x=>x&&{g:mutG(x.g,0),fav:x.fav||{},fl:x.fl||{}}),[BASE,DWB]);if(!B)throw new Error('BASE 없음: '+BASE);
  const slots=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)for(const s of 'ABC'){let g=fixT({...B.g},i,j),fl={rp:1};if(s==='C'&&TK[i]==='wind'&&TK[j]==='dark'||s==='C'&&TK[i]==='dark'&&TK[j]==='wind'){DWK.forEach(k=>{if(D.g[k]!=null)g[k]=D.g[k]});fl={dw:1}}
   for(const k in ST[s].r){const[a,b]=ST[s].r[k];g[k]=a+Math.random()*(b-a)}slots.push({k:TK[i]+'+'+TK[j]+'-'+s,n:`알파 조합: ${TN[TK[i]]}+${TN[TK[j]]} ${ST[s].n}`,g,fav:B.fav,fl,s:0,c:0,i,j,st:s})}
  st={gen:0,games:0,slots,log:[],base:B.g}}
 const save=()=>fs.writeFileSync(SF,JSON.stringify(st));
 for(let G=0;G<GENS;G++){/* 후보 60명: 부모 30 + 자식 30 */const cand=[];st.slots.forEach((P,si)=>{cand.push({...P,si,par:1,gs:0,gc:0});const g=clampS(fixT(mut(P.g,.12),P.i,P.j),P.st);cand.push({...P,g,si,par:0,gs:0,gc:0,s:0,c:0})});
  /* 좌석: 모두 같은 횟수로 앉도록 차례대로 섞어 뽑기 */let q=[];const next8=()=>{const o=[];while(o.length<8){if(!q.length)q=cand.map((_,i)=>i).sort(()=>Math.random()-.5);const k=q.shift();if(!o.includes(k))o.push(k)}return o};
  let left=K;await Promise.all(pages.map(async pg=>{while(left>0){left--;const seat=next8();const cf=seat.map(k=>({n:cand[k].n,g:cand[k].g,fav:cand[k].fav,fl:cand[k].fl}));
   const rk=await pg.evaluate(cf=>{R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();diff='A';const gs=cf.map(c=>aiLearn({...mutG(c.g,0),tech:c.g.tech,tech2:c.g.tech2,fav:c.fav||{},pn:c.n,fl:c.fl||{}},0,c.n));gs.races=Array(8).fill(null);S=null;over=false;start(gs);
    while(!over&&S.t<1800)step(.05);const die=S.pl.map(p=>p.alive?1e9:p.dieT||0);return die.map(x=>1+die.filter(y=>y>x).length)},cf);
   seat.forEach((k,i)=>{cand[k].gs+=rk[i];cand[k].gc++});st.games++}}));
  /* 고르기: 부모는 지금까지 누적, 자식은 이번 세대만 */let sw=0;st.slots=st.slots.map((P,si)=>{const pa=cand[2*si],ch=cand[2*si+1];const ps=P.s+pa.gs,pc=P.c+pa.gc,pm=ps/Math.max(1,pc),cm=ch.gs/Math.max(1,ch.gc);
   if(ch.gc>=4&&cm<pm){sw++;return{...P,g:ch.g,s:ch.gs,c:ch.gc}}return{...P,s:ps,c:pc}});st.gen++;
  const by={};st.slots.forEach(P=>{const c=P.k.split('-')[0];(by[c]=by[c]||[]).push(P.s/Math.max(1,P.c))});
  const line=`세대 ${st.gen}: 자식 승계 ${sw}/30 · 누적 ${st.games}판 · 조합 평균 ${Object.entries(by).map(([c,v])=>c+' '+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2)).join(' / ')}`;st.log.push(line);console.log(line);save()}
 await br.close()})();
