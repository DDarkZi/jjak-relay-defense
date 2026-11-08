// 밸런스 시뮬레이션용 함수 (페이지에 주입해서 사용)
// sim1(mode): AI 8명 한 판, simN(n,mode): n판, setTune(J): 수치 배율 실험
function setTune(J){J=J||{};const bal=J.bal||{};for(const k in bal){if(k==='mode'){for(const m in bal.mode)Object.assign(BAL.mode[m],bal.mode[m])}else BAL[k]=bal[k]}
 for(const b of T){if(b.dO==null){b.dO=b.d0!=null?b.d0:b.d;b.cdO=b.cd0!=null?b.cd0:b.cd}const o=(J.tw||{})[b.id]||{};b.d0=Math.round(b.dO*(o.d||1));b.cd0=+(b.cdO*(o.cd||1)).toFixed(3);b.d=b.d0;b.cd=b.cd0}
 for(const u of U){if(u.hO==null){u.hO=u.hp0!=null?u.hp0:u.hp;u.sO=u.sh0!=null?u.sh0:(u.shield||0)}const o=(J.un||{})[u.id]||{};u.hp0=Math.round(u.hO*(o.hp||1));u.sh0=Math.round(u.sO*(o.hp||1));u.hp=u.hp0}
 return 'ok'}
function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function sim1(mode,dt){dt=dt||.05;R=R||__mk();Sc=Sc||__mk();Cam=Cam||__mk();
 const order=shuf([0,1,2,3,4,5,6,Math.floor(Math.random()*7)]);const gs=order.map(i=>Object.assign({},AIS[i].g,{tech:Math.random()*5,tech2:Math.random()*5}));
 gs.races=mode==='race'?shuf(RK_KEYS.flatMap(k=>[k,k])).slice(0,8):Array(8).fill(null);
 S=null;over=false;diff='N';start(gs);S.st={td:{},ti:{},tn:{},us:{},un:{},ue:{},up:0};
 while(!over&&S.t<1800)step(dt);
 const al=S.pl.filter(p=>p.alive);
 return{mode,t:Math.round(S.t),win:al.length===1?al[0].id:-1,pl:S.pl.map(p=>({ai:order[p.id],race:p.race,tech:p.tech,tech2:p.tech2,die:p.dieT?Math.round(p.dieT):null,inc5:p.inc5||0})),st:S.st}}
function simN(n,mode){const r=[];for(let i=0;i<n;i++){try{r.push(sim1(mode))}catch(e){r.push({err:e.message+' '+(e.stack||'').split('\n')[1]})}}return r}
