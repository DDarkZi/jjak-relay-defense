// 🌐 8인 온라인 대전 (베타)
// 방식: 방장(호스트) 기기 하나가 게임 전체를 계산하고, 손님은 명령만 보내고 화면 상태를 받아 그려요.
// 연결: PeerJS(무료 공개 중개 서버로 서로 찾은 뒤 기기끼리 직접 연결). 서버 비용·가입 없음.
// 테스트: 주소에 ?net=local 을 붙이면 같은 브라우저의 탭끼리 BroadcastChannel로 연결돼요.
// 자리 번호: 손님 화면에선 항상 자기가 0번이 되도록 돌려서(회전) 기존 1인용 화면 코드를 그대로 써요.
const NET=(()=>{
 const CODE_CH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',HZ=.1;
 const st={role:null,code:'',tr:null,slots:[],me:-1,started:false,gview:{},cid2slot:{},slot2cid:{},acc:0,ended:false,lost:false,lastView:0,nameT:0,tok:{},myTok:'',lastG:{},bytes:0,retry:0,glane:{},lc:{},lastLane:-2};
 const ICE={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun.cloudflare.com:3478']},{urls:['turn:eu-0.turn.peerjs.com:3478','turn:us-0.turn.peerjs.com:3478'],username:'peerjs',credential:'peerjsp'}]};// 직접 연결이 안 되면 PeerJS 무료 중계(TURN)로
 const UIX={};U.forEach((u,i)=>UIX[u.id]=i);const TIX={};T.forEach((t,i)=>TIX[t.id]=i);
 const myHello=()=>{let ic='🐥',n='짹짹이',hero=null;try{ic=hInfo(SV.hero.id).ic;n=SV.hero.name||n;const h=SV.hero;hero={id:h.id}}catch(e){}return{nick:String(n).slice(0,10),ic,hero}};
 const rot=(i,k)=>((i-k)%8+8)%8;// 방장 번호 i → 손님 k 화면의 번호

 // ---------- 연결(트랜스포트) ----------
 function loadPeer(cb,err){if(window.Peer)return cb();const src=['https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js','https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js'];let i=0;
  const tryOne=()=>{if(i>=src.length)return err('연결 도구를 불러오지 못했어요. 인터넷을 확인해 주세요');const s=document.createElement('script');s.src=src[i++];s.onload=()=>window.Peer?cb():tryOne();s.onerror=tryOne;document.head.appendChild(s)};tryOne()}
 const local=/[?&]net=local/.test(location.search);
 function hostT(code,h,pre){pre=pre||'jjak-';
  if(local){const bc=new BroadcastChannel(pre+code);bc.onmessage=e=>{const m=e.data;if(m.to!=='H')return;if(m.k==='open')h.join(m.from);else if(m.k==='close')h.leave(m.from);else h.msg(m.from,m.d)};setTimeout(h.ready,0);
   return{send:(cid,d)=>bc.postMessage({to:cid,from:'H',k:'d',d}),close:()=>{try{bc.postMessage({to:'*',from:'H',k:'close'});bc.close()}catch(e){}}}}
  const conns={};let peer=null;const o={send:(cid,d)=>{const c=conns[cid];if(c&&c.open)try{c.send(d)}catch(e){}},close:()=>{try{peer&&peer.destroy()}catch(e){}}};
  loadPeer(()=>{peer=new Peer(pre+code,{debug:0,config:ICE});peer.on('open',()=>h.ready());peer.on('error',e=>h.err(e&&e.type==='unavailable-id'?'taken':(e&&e.type)||'error'));
   peer.on('connection',c=>{c.on('open',()=>{conns[c.peer]=c;h.join(c.peer)});c.on('data',d=>h.msg(c.peer,d));c.on('close',()=>{delete conns[c.peer];h.leave(c.peer)});c.on('error',()=>{})})},m=>h.err(m));
  return o}
 function guestT(code,h,pre){pre=pre||'jjak-';
  if(local){const id='G'+Math.random().toString(36).slice(2,8),bc=new BroadcastChannel(pre+code);bc.onmessage=e=>{const m=e.data;if(m.to===id)h.msg(m.d);else if(m.to==='*'&&m.k==='close')h.close()};
   addEventListener('pagehide',()=>{try{bc.postMessage({to:'H',from:id,k:'close'})}catch(e){}});
   setTimeout(()=>{bc.postMessage({to:'H',from:id,k:'open'});h.ready()},50);return{send:d=>bc.postMessage({to:'H',from:id,k:'d',d}),close:()=>{try{bc.postMessage({to:'H',from:id,k:'close'});bc.close()}catch(e){}}}}
  let peer=null,c=null;const o={send:d=>{if(c&&c.open)try{c.send(d)}catch(e){}},close:()=>{try{peer&&peer.destroy()}catch(e){}}};
  addEventListener('pagehide',()=>{try{peer&&peer.destroy()}catch(e){}});
  loadPeer(()=>{peer=new Peer({debug:0,config:ICE});peer.on('error',e=>h.err(e&&e.type==='peer-unavailable'?'noroom':(e&&e.type)||'error'));
   peer.on('open',()=>{c=peer.connect(pre+code,{reliable:true,serialization:'json'});const to=setTimeout(()=>{if(!c.open)h.slow&&h.slow()},12000);c.on('open',()=>{clearTimeout(to);h.ready()});c.on('data',d=>h.msg(d));c.on('close',()=>h.close());c.on('error',()=>{})})},m=>h.err(m));
  return o}

 // ---------- 로비 화면 ----------
 const $n=id=>document.getElementById(id);
 function panel(which){$n('netA').style.display=which==='a'?'':'none';$n('netR').style.display=which==='r'?'':'none'}
 function status(m){$n('nst').textContent=m||''}
 /* 🤖 AI 난이도: 방장만 바꿀 수 있고 손님은 보기만 */
 function renderDiff(){const b=$n('ndif');if(!b)return;const host=st.role==='host',k=st.role==='guest'?(st.diff||'N'):diff;
  b.innerHTML=Object.keys(DIFF).map(x=>`<button data-k="${x}" class="${x===k?'on':''}"${host?'':' disabled'}>${DIFF[x].n.replace(' ','<br>')}</button>`).join('');
  $n('ndd').textContent=(host?'':'방장이 정해요 · ')+DIFF[k].d}
 function renderSlots(){renderDiff();const box=$n('nsl');if(!box)return;box.innerHTML='';for(let i=0;i<8;i++){const s=st.slots[i],d=document.createElement('div');d.className='nslot'+(s&&s.kind!=='ai'?' on':'')+(i===st.me?' me':'');
   d.innerHTML=`<i>${i+1}</i><b></b><small></small>`;d.querySelector('b').textContent=s&&s.kind!=='ai'?`${s.ic} ${s.nick}`:`🤖 AI·${DIFF[st.role==='guest'?(st.diff||'N'):diff].n.split(' ').pop()}`;d.querySelector('small').textContent=s&&s.kind==='host'?'👑 방장':i===st.me?'나':'';box.append(d)}
  const n=st.slots.filter(s=>s&&s.kind!=='ai').length;$n('ngo').style.display=st.role==='host'?'':'none';$n('ngo').textContent=`▶ 게임 시작 (${n}명 + AI ${8-n})`;
  if(st.role==='guest')status('방장이 게임을 시작하기를 기다리는 중…')}
 function open(){ovl('netm',1);panel('a');status('');const q=new URLSearchParams(location.search).get('room');if(q&&!st.role){$n('ncode').value=q.toUpperCase();}
  const h=myHello();$n('nme').textContent=`${h.ic} ${h.nick}`}
 function close(){leave();ovl('netm',0)}
 function inviteURL(){const u=new URL(location.href);u.searchParams.set('room',st.code);return u.toString()}

 // ---------- 방장 ----------
 function host(){if(st.role)return;st.role='host';st.code=Array.from({length:5},()=>CODE_CH[Math.floor(Math.random()*CODE_CH.length)]).join('');
  st.slots=Array(8).fill(null);st.slots[0]=Object.assign({kind:'host'},myHello());st.me=0;st.started=false;st.ended=false;
  panel('r');$n('ncd').textContent=st.code;status('방을 여는 중…');renderSlots();
  st.tr=hostT(st.code,{ready:()=>status('친구에게 방 코드나 초대 링크를 보내 주세요! 📌 방장은 게임 내내 앱을 화면에 켜 두세요(방장 폰이 게임을 유지해요)'),err:e=>{if(e==='taken'){leave();return host()}status('⚠️ 연결 오류: '+e+' (잠시 후 다시 시도해 주세요)')},
   join:cid=>{},leave:cid=>hLeave(cid),msg:(cid,d)=>hMsg(cid,d)})}
 function hBroadcastLobby(){Object.keys(st.cid2slot).forEach(cid=>st.tr.send(cid,{t:'lobby',slots:st.slots,you:st.cid2slot[cid],tok:st.tok[st.cid2slot[cid]],code:st.code,diff}));renderSlots()}
 function hMsg(cid,d){if(!d||!d.t)return;
  if(d.t==='hello'&&d.rejoin&&st.started){const i=d.slot|0,p=S&&S.pl[i];if(i<1||i>7||st.tok[i]!==d.rejoin||st.slot2cid[i]||!p){st.tr.send(cid,{t:'full',m:'다시 들어갈 수 없어요 (게임이 끝났거나 자리가 없어요)'});return}
   st.cid2slot[cid]=i;st.slot2cid[i]=cid;delete st.lastG[cid];if(p.alive&&p.ai){p.ai=false;p.cfg=null;p.name=p.name.replace(/ 🤖$/,'')}st.gview[i]=i;
   st.tr.send(cid,{t:'start',k:i,hoff:S.off,names:S.pl.map(q=>q.name),diff,re:1});toast(`📶 ${st.slots[i].nick} 님이 다시 연결됐어요`);return}
  if(d.t==='hello'){if(st.started){st.tr.send(cid,{t:'full',m:'이미 시작한 방이에요'});return}if(st.cid2slot[cid]!=null)return;let i=st.slots.findIndex((s,j)=>j>0&&!s);if(i<0){st.tr.send(cid,{t:'full',m:'방이 꽉 찼어요 (8명)'});return}
   st.slots[i]={kind:'guest',nick:String(d.nick||'손님').slice(0,10),ic:String(d.ic||'🐦').slice(0,4),hero:heroSafe(d.hero)};st.cid2slot[cid]=i;st.slot2cid[i]=cid;st.tok[i]=Math.random().toString(36).slice(2,10);hBroadcastLobby();if(!S)toast(`👋 ${st.slots[i].nick} 님이 들어왔어요`);return}
  const pid=st.cid2slot[cid];if(pid==null||!S||S.net!=='host')return;
  if(d.t==='view'){if(d.v>=0&&d.v<8)st.gview[pid]=d.v;return}
  if(d.t==='lane'){st.glane[pid]=d.v>=0&&d.v<8?d.v:null;return}
  if(d.t==='cmd'&&d.c){const c=d.c;try{if(c.a==='send')actSend(pid,String(c.b));else if(c.a==='build')actBuild(pid,c.x|0,c.y|0,String(c.t));else if(c.a==='upg')actUpg(pid,c.x|0,c.y|0);
   else if(c.a==='dem')actDem(pid,c.x|0,c.y|0);else if(c.a==='tech')actTech(pid,String(c.k));else if(c.a==='skill')actSkill(pid)}catch(e){console.log(e)}}}
 function hLeave(cid){const i=st.cid2slot[cid];if(i==null)return;delete st.cid2slot[cid];delete st.slot2cid[i];delete st.lastG[cid];
  if(!st.started){st.slots[i]=null;hBroadcastLobby();return}
  const p=S&&S.pl[i];if(p&&p.alive){const a=AIS[Math.floor(Math.random()*AIS.length)];p.cfg=Object.assign({},a.g);p.ai=true;p.aiT=0;if(!p.tech)p.tech=TK[Math.floor(Math.random()*5)];if(!p.tech2plan)p.tech2plan=TK[(TK.indexOf(p.tech)+1)%5];if(!/ 🤖$/.test(p.name))p.name+=' 🤖';toast(`📴 ${st.slots[i].nick} 님 연결이 끊겨 AI가 대신해요 (다시 들어오면 돌려줘요)`)}}
 function hStart(){if(st.role!=='host'||st.started)return;st.started=true;ovl('netm',0);gameMode='normal';start();S.net='host';
  for(let i=1;i<8;i++){const s=st.slots[i];if(!s||s.kind!=='guest')continue;const p=S.pl[i];p.cfg=null;p.ai=false;p.gold=500;p.income=30;p.tech=null;p.tech2=null;p.tech2plan=null;p.name=`${(i+S.off)%8+1}번 ${s.ic}${s.nick}`;p.hero=s.hero||heroRand();st.gview[i]=i}
  ui();Object.keys(st.cid2slot).forEach(cid=>{const k=st.cid2slot[cid];st.tr.send(cid,{t:'start',k,hoff:S.off,names:S.pl.map(p=>p.name),heroes:S.pl.map((p,i)=>S.pl[(i+k)%8].hero),diff})})}
 const gridEnc=p=>{const o=[];p.grid.forEach((r,y)=>r.forEach((t,x)=>{if(t)o.push([y*COLS+x,TIX[t.bp.id],t.lv,t.d,Math.round(t.r*100),t.dis>0?1:0,t.inv])}));return o};
 function snap(k){const pl=Array(8);S.pl.forEach(p=>{pl[rot(p.id,k)]=[Math.floor(p.gold),p.income,Math.round(p.life),p.alive?1:0,p.tech||'',p.tech2||'',p.skU?1:0,Math.ceil(p.skCD||0),p.boost>0?1:0,p.reveal>0?1:0,p.dieT?Math.round(p.dieT):0,Math.round(p.dealt||0),p.kills||0]});
  const vb=st.gview[k]??k,v=S.pl[vb],hid=u=>u.bp.stealth&&u.y<BH*u.bp.stealth&&!(v.reveal>0)&&!u.seen;
  const us=v.units.map(u=>[u.id,UIX[u.bp.id],Math.round(u.x*100),Math.round(u.y*100),Math.round(Math.max(0,u.hp)/u.bp.hp*1000),rot(u.owner,k),(u.sh>0?1:0)|(u.fl>0?2:0)|(u.gr>0?4:0)|(u.stun>0?8:0)|(u.slow>0?16:0)|(u.bn>0?32:0)|((u.pois>0||u.ps>0)?64:0)|(u.hit>0?128:0)|(hid(u)?0:256)|(u.amp>0?512:0)].concat(u.col?[u.col]:[]));
  const g={},cid=st.slot2cid[k],L=st.lastG[cid]||(st.lastG[cid]={}),full=st.nameT<=0,addG=(b,p)=>{const e=gridEnc(p),js=JSON.stringify(e);if(full||L[b]!==js){g[rot(b,k)]=e;L[b]=js}};addG(vb,v);if(vb!==k)addG(k,S.pl[k]);
  /* 미니맵: 내 새가 가 있는 판(또는 고른 판)의 타워·새 위치를 0.3초마다 */
  let ln=null;st.lc[k]=(st.lc[k]||0)+1;if(st.lc[k]%3===1){const cnt={};S.pl.forEach(p=>{if(p.alive&&p.id!==k){const n=p.units.filter(u=>u.owner===k).length;if(n)cnt[p.id]=n}});const ids=Object.keys(cnt).map(Number),pk=st.glane[k];
   let lb=pk!=null&&S.pl[pk]&&S.pl[pk].alive&&(cnt[pk]||!ids.length)?pk:null;if(lb==null)lb=ids.length?ids.sort((a,b)=>cnt[b]-cnt[a])[0]:nextAlive(k);
   if(lb!=null){addG(lb,S.pl[lb]);const rc=o2=>{const r={};Object.keys(o2).forEach(i=>r[rot(+i,k)]=o2[i]);return r},E={},K={};for(let i=0;i<8;i++){const q=k*8+i;if(S.escA&&S.escA[q])E[i]=S.escA[q];if(S.klA&&S.klA[q])K[i]=S.klA[q]}
    ln={b:rot(lb,k),c:rc(cnt),e:rc(E),k:rc(K),u:S.pl[lb].units.map(u=>[Math.round(u.x*20),Math.round(u.y*20),u.owner===k?1:0,Math.round(Math.max(0,u.hp)/u.bp.hp*100),u.bp.t==='A'&&!(u.gr>0)?1:0])}}}
  const o={t:'s',T:Math.round(S.t*10)/10,c:Math.round(S.cdn*10)/10,i:Math.round(S.inc*10)/10,v:rot(vb,k),pl,g,u:us,eg:S.pl[k].egg||0,vz:visitorsOf(vb).map(j=>rot(j,k))};if(ln)o.ln=ln;if(st.nameT<=0)o.n=S.pl.map((p,i)=>S.pl[(i+k)%8].name);return o}
 function htick(dt){if(!st.tr||!st.started)return;st.acc+=dt;const hz=Object.keys(st.cid2slot).length>=4?.15:HZ;/* 손님이 많으면 조금 덜 자주(방장 폰 업로드 줄이기) */if(st.acc<hz)return;st.acc=0;st.nameT-=HZ;Object.keys(st.cid2slot).forEach(cid=>{const k=st.cid2slot[cid];try{const o=snap(k);st.bytes+=JSON.stringify(o).length;st.tr.send(cid,o)}catch(e){}});if(st.nameT<=0)st.nameT=2}
 function hOver(w){if(st.ended||st.role!=='host')return;st.ended=true;Object.keys(st.cid2slot).forEach(cid=>st.tr.send(cid,{t:'end',w:w<0?-1:rot(w,st.cid2slot[cid])}))}
 function tell(pid,m){const cid=st.slot2cid[pid];if(cid&&st.tr)st.tr.send(cid,{t:'msg',m})}

 // ---------- 손님 ----------
 function join(){if(st.role)return;const code=String($n('ncode').value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length!==5)return status('방 코드 5자리를 입력해 주세요');
  st.role='guest';st.code=code;st.ended=false;st.lost=false;panel('r');$n('ncd').textContent=code;status('방에 연결하는 중…');st.slots=Array(8).fill(null);renderSlots();
  st.myTok='';st.retry=0;gConnect(false)}
 function gConnect(re){const code=st.code;
  st.tr=guestT(code,{ready:()=>{if(re){st.tr.send(Object.assign({t:'hello',rejoin:st.myTok,slot:st.k},myHello()));return}status('들어가는 중…');st.tr.send(Object.assign({t:'hello'},myHello()))},msg:d=>gMsg(d),
   slow:()=>{if(re)return;status('⏳ 연결이 오래 걸려요… 방장 화면이 켜져 있는지 확인하고, 안 되면 와이파이↔데이터를 바꿔 다시 들어와 보세요')},
   close:()=>gLost(),
   err:e=>{if(re||(S&&S.net==='guest'&&st.myTok))return gLost();status(e==='noroom'?'⚠️ 그런 방이 없어요. 코드를 확인해 주세요':'⚠️ 연결 오류: '+e+' (와이파이↔데이터를 바꿔 보세요)');st.role=null;try{st.tr&&st.tr.close()}catch(x){}st.tr=null}})}
 /* 게임 중 끊기면 3초마다 최대 6번 다시 연결해요. 그동안 내 자리는 AI가 잠깐 대신해요 */
 function gLost(){if(!S||S.net!=='guest'){if(!S)status('📴 방이 닫혔어요');return}if(st.ended||st.lost)return;
  try{st.tr&&st.tr.close()}catch(e){}st.tr=null;if(st.retry>=6||!st.myTok){st.ended=true;endLocal('📴','방장과 연결이 끊겼어요');return}
  st.retry++;toast(`📶 연결이 끊겼어요… 다시 연결하는 중 (${st.retry}/6)`);setTimeout(()=>{if(!st.ended&&S&&S.net==='guest')gConnect(true)},3000)}
 function endLocal(ic,h){over=true;$n('eT').textContent=ic;$n('eH').textContent=h;$n('eP').textContent='';$n('ew').innerHTML='';$n('spec').style.display='none';$n('end').style.display='flex'}
 function gMsg(d){if(!d||!d.t)return;
  if(d.t==='lobby'){st.slots=d.slots;st.me=d.you;if(d.tok)st.myTok=d.tok;if(d.diff)st.diff=d.diff;renderSlots();return}
  if(d.t==='full'){if(S&&S.net==='guest'){st.ended=true;try{st.tr.close()}catch(e){}st.tr=null;endLocal('📴',d.m);return}status('⚠️ '+d.m);try{st.tr.close()}catch(e){}st.tr=null;st.role=null;return}
  if(d.t==='start')return gStart(d);
  if(!S||S.net!=='guest')return;
  if(d.t==='s')return gApply(d);
  if(d.t==='msg')return toast(d.m);
  if(d.t==='end'){st.ended=true;const w=d.w;if(w===0)return finish(true);if(w>=0&&(S.spec||st.lost))return specEnd(S.pl[w]);if(w>=0){endLocal('👀',`${S.pl[w].name} 우승!`)}else endLocal('🏁','게임 종료')}}
 function gStart(d){st.k=d.k;if(d.re&&S&&S.net==='guest'){st.retry=0;S.pl.forEach(p=>{p.units=[]});toast('📶 다시 연결됐어요!');return}try{heroReset()}catch(e){}diff=d.diff||'M';gameMode='normal';applyModeBal('normal');EGG.n=0;ovl('netm',0);
  S={t:0,inc:0,kills:0,dealt:0,off:(d.hoff+d.k)%8,sim:false,cdn:5,lm:1,pl:[],net:'guest'};techPend=null;
  for(let i=0;i<8;i++)S.pl.push({id:i,name:d.names[(i+d.k)%8],hero:d.heroes?heroSafe(d.heroes[i]):heroRand(),tech:null,tech2:null,race:null,skU:0,skCD:0,boost:0,reveal:0,color:PC[i],gold:500,income:30,ai:i>0,life:100,alive:true,grid:Array.from({length:ROWS},()=>Array(COLS).fill(null)),units:[],cfg:null,dealt:0});
  sel=null;insp=null;view=0;st.lastView=0;paused=false;over=false;spd=1;document.querySelector('footer').style.opacity='';$n('pz').textContent='⏸';$n('sp').textContent='1x';$n('end').style.display='none';
  $n('title').style.display='none';$n('game').style.display='flex';if(!R)init3();resize();ui();lanePick=null;try{laneFit()}catch(e){}try{$n('t1').onclick&&$n('t1').onclick()}catch(e){}S.cdl=6;cdnUI();sfx('start');toast('🌐 온라인 대전 시작! 카운트다운 동안 속성을 골라요')}
 function gGrid(p,arr){const seen=new Set();arr.forEach(([ci,ti,lv,dd,r,dis,inv])=>{const x=ci%COLS,y=(ci/COLS)|0,b=T[ti];seen.add(ci);let t=p.grid[y][x];if(!t||t.bp!==b){t=mkR(b,p);p.grid[y][x]=t}t.lv=lv;t.d=dd;t.r=r/100;t.dis=dis?1:0;t.inv=inv});
  p.grid.forEach((row,y)=>row.forEach((t,x)=>{if(t&&!seen.has(y*COLS+x))row[x]=null}))}
 function gApply(d){S.vz=d.vz||[];S.t=d.T;S.cdn=d.c;S.inc=d.i;if(d.eg!=null&&d.eg!==EGG.n){const m=EGGM.find(m=>m.n===d.eg);EGG.n=d.eg;if(m&&d.eg>0){sfx('unlock',{k:m.k});toast(`${m.ic} 해금! ${m.t} — ${m.d}`)}}if(d.n)d.n.forEach((n,i)=>S.pl[i].name=n);
  d.pl.forEach((a,i)=>{const p=S.pl[i];[p.gold,p.income,p.life]=a;p.alive=!!a[3];p.tech=a[4]||null;p.tech2=a[5]||null;p.skU=a[6];p.skCD=a[7];p.boost=a[8]?1:0;p.reveal=a[9]?1:0;if(a[10])p.dieT=a[10];p.dealt=a[11]||0;p.kills=a[12]||0});
  Object.keys(d.g).forEach(i=>gGrid(S.pl[+i],d.g[i]));
  const v=d.v,p=S.pl[v],old=new Map(p.units.map(u=>[u.id,u])),nu=[];
  d.u.forEach(([id,bi,x,y,hp,ow,f,col])=>{const b=U[bi];let u=old.get(id);if(!u){u={id,bp:b,x:x/100,y:y/100,owner:ow,col:col||0};}else old.delete(id);
   u.bp=b;u.tx=x/100;u.ty=y/100;u.hp=hp/1000*b.hp;u.owner=ow;u.sh=f&1?1:0;u.fl=f&2?1:0;u.gr=f&4?1:0;u.stun=f&8?1:0;u.slow=f&16?1:0;u.bn=f&32?1:0;u.pois=f&64?1:0;u.ps=0;u.hit=f&128?.05:0;u.seen=!!(f&256);u.amp=f&512?1:0;u.col=col||0;nu.push(u)});
  if(v===view)old.forEach(u=>{if(u.hp/u.bp.hp<.3&&u.ty<EY-.6){artFx('die',{u,col:u.bp.col,air:u.bp.t==='A'});sfx('die',{unit:u.bp.id})}});
  const lb0=S.laneNet?S.laneNet.b:-1;S.pl.forEach((q,i)=>{if(i!==v&&i!==lb0)q.units=[]});p.units=nu;
  if(d.ln){S.laneNet=d.ln;S.esc=d.ln.e;S.kl=d.ln.k;const lb=d.ln.b;if(lb!==v){S.pl.forEach((q,i)=>{if(i!==v&&i!==lb)q.units=[]});S.pl[lb].units=d.ln.u.map(a=>({x:a[0]/20,y:a[1]/20,owner:a[2]?0:9,hp:a[3],bp:{hp:100,t:a[4]?'A':'G'},gr:0}))}}
  if(!S.pl[0].alive&&!st.lost&&!st.ended){st.lost=true;finish(false)}}
 function gtick(dt){if(!S)return;if(view!==st.lastView){st.lastView=view;st.tr&&st.tr.send({t:'view',v:(view+st.k)%8})}
  if(lanePick!==st.lastLane){st.lastLane=lanePick;st.tr&&st.tr.send({t:'lane',v:lanePick==null?-1:(lanePick+st.k)%8})}
  const p=S.pl[view],k=Math.min(1,dt*10);p.units.forEach(u=>{if(u.tx==null)return;u.x+=(u.tx-u.x)*k;u.y+=(u.ty-u.y)*k});
  // 손님 화면용 연출: 사거리 안의 새를 향해 타워가 쏘는 모습(실제 피해 계산은 방장이 해요)
  p.grid.forEach((row,y)=>row.forEach((t,x)=>{if(!t||!t.d||t.bp.pylon||t.bp.snack||t.dis>0)return;t.gc=(t.gc||Math.random()*t.bp.cd)-dt;if(t.gc>0)return;const cx=cellX(x,y),cy=cellY(y);let tg=null,my=-1;
   for(const u of p.units){const ty=u.gr>0?'G':u.fl>0?'A':u.bp.t;if((t.bp.t&&t.bp.t!==ty)||!u.seen)continue;if(Math.hypot(u.x-cx,u.y-cy)<=t.r&&u.y>my){my=u.y;tg=u}}
   if(!tg){t.gc=.2;return}t.gc=t.bp.cd;beam(cx,BH-cy,tg,t.bp.col);sfx('shoot',{tower:t.bp.id});artFx('shoot',{tower:t.bp.id,x:cx,y:BH-cy,tx:tg.x,ty:BH-tg.y,air:tg.bp.t==='A',col:t.bp.col,b:t.bp})}))}
 function cmd(c){if(st.tr)st.tr.send({t:'cmd',c})}

 // ---------- 공통 ----------
 function leave(){try{if(st.role==='guest'&&st.tr)st.tr.close();if(st.role==='host'&&st.tr)st.tr.close()}catch(e){}
  Object.assign(st,{role:null,code:'',tr:null,slots:[],me:-1,started:false,gview:{},cid2slot:{},slot2cid:{},acc:0,ended:false,lost:false,tok:{},myTok:'',lastG:{},bytes:0,retry:0,glane:{},lc:{},lastLane:-2});if($n('netm'))panel('a')}
 function bind(){if(!$n('netm'))return;$n('ndif').onclick=e=>{const b=e.target.closest('button');if(!b||st.role!=='host'||st.started)return;setDiff(b.dataset.k);hBroadcastLobby()};$n('nmk').onclick=host;$n('njoin').onclick=join;$n('ngo').onclick=hStart;$n('nx').onclick=close;
  $n('ncode').addEventListener('keydown',e=>{if(e.key==='Enter')join()});
  $n('ncopy').onclick=async()=>{const url=inviteURL(),txt=`🚨 새떼 주의보: 짹짹 디펜스 같이 해요! 방 코드: ${st.code}\n${url}`;try{if(navigator.share){await navigator.share({title:'새떼 주의보: 짹짹 디펜스',text:txt,url});return}}catch(e){}
   try{await navigator.clipboard.writeText(txt);toast('📋 초대 링크를 복사했어요')}catch(e){prompt('초대 링크를 복사해 주세요',url)}};
  const nb=$n('netb');if(nb)nb.onclick=e=>{e.stopPropagation();ovl('modem',0);open()};
  if(new URLSearchParams(location.search).get('room'))setTimeout(open,400)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
 /* 원형 지도에 첫 글자를 띄우기 위한 사람 자리 닉네임(내 자리는 YOU라 제외) */
 function nick(i){if(!st.started&&!(S&&S.net==='guest'))return null;const hi=st.role==='guest'?(i+st.k)%8:i,s=st.slots[hi];return i!==0&&s&&s.kind!=='ai'?s.nick:null}
 /* 🏞 광장도 같은 연결 도구를 써요(방 id 앞머리만 jjpz-) */
 const newCode=()=>Array.from({length:5},()=>CODE_CH[Math.floor(Math.random()*CODE_CH.length)]).join('');
 return{open,cmd,tell,htick,gtick,nick,over:hOver,leave,pzHost:(c,h)=>hostT(c,h,'jjpz-'),pzGuest:(c,h)=>guestT(c,h,'jjpz-'),newCode,get role(){return st.role},_st:st,_drop:()=>{try{st.tr&&st.tr.close()}catch(e){}gLost()}}})();
