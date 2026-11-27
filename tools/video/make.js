const {chromium}=require('playwright');const fs=require('fs');
// 🎬 짹짹 릴레이 디펜스 개발 쇼츠 영상 만들기 (1080×1920, 30fps)
// 사용법(저장소 맨 위 폴더에서): node tools/video/make.js        → 전체 촬영 + 소리 녹음
//                                node tools/video/make.js 3        → 3번 장면만 46프레임 미리보기
//                                node tools/video/make.js 3 full   → 3번 장면만 다시 찍기(전체 촬영 뒤 부분 수정용)
//                          그다음: python3 tools/video/mux.py     → tools/video/out/jjak_shorts.mp4
// 장면·자막은 아래 SC 표에서 바꿔요. 자세한 설명은 tools/video/README.md
const path=require('path'),{spawn:sp}=require('child_process');
const D=__dirname,ROOT=path.resolve(D,'../..'),OUT=path.join(D,'out'),PORT=+(process.env.PORT||8765);
fs.mkdirSync(path.join(OUT,'fr'),{recursive:true});
const FPS=30,ONLY=process.argv[2]?+process.argv[2]:null; // ONLY: 장면 번호만 미리보기(몇 프레임)
const SC=[
 {n:'hook',d:4,cap:['클로드<br><em>일주일 무료쿠폰</em>으로<br>만든 3D 게임','1인 개발 일지 🐦'],view:'game'},
 {n:'lobby',d:5,cap:['웃긴 새 영웅을<br><em>내 맘대로</em> 꾸미고','모자 · 안경 · 색 바꾸기'],view:'lobby'},
 {n:'dex',d:6,cap:['새 <em>52종</em> · 타워 <em>33종</em>','이름부터 웃긴 도감'],view:'dex'},
 {n:'evo',d:6,cap:['타워는 강화하면<br><em>진화</em>해요','새총 → 새권총 → 새개틀링건'],view:'game'},
 {n:'fx',d:6,cap:['화상 · 독 · 번개<br><em>연쇄 공격</em>','속성 2개 조합 스킬 발동!'],view:'game'},
 {n:'maze',d:6,cap:['AI는 <em>뱀 미로</em>를<br>짜고 버텨요 🐍','난이도별 미로 8종'],view:'game'},
 {n:'plaza',d:5,cap:['광장에서<br><em>수다</em>도 떨고','이모티콘 · 채팅'],view:'plaza'},
 {n:'net',d:4,cap:['<em>8인 온라인</em><br>대전까지!','방 코드로 친구 초대'],view:'net'},
 {n:'tl',d:6,cap:['업데이트 <em>30번</em> 넘게','v8.0 → v11.1'],view:'tl'},
 {n:'end',d:5,cap:['다음 목표:<br><em>구글 플레이</em> 출시 🚀','짹짹 릴레이 디펜스'],view:'lobby'}];
(async()=>{const srv=sp('python3',['-m','http.server',String(PORT)],{cwd:ROOT,stdio:'ignore'});await new Promise(r=>setTimeout(r,1200));
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
await p.addInitScript({path:path.join(D,'clock.js')});
await p.addInitScript(()=>{try{localStorage.setItem('jjj_save_v1',JSON.stringify({coins:12,wins:7,modeOK:1,races:['nest'],hero:{id:'chick',col:null,hat:'crown',face:'none',name:'짹짹이'}}))}catch(e){}});
// 인터넷에서 Three.js를 못 받는 환경이면 THREE_JS=<three.min.js 경로> 로 알려 주세요
if(process.env.THREE_JS)await p.route(/three\.min\.js/,r=>r.fulfill({path:process.env.THREE_JS,contentType:'application/javascript'}));
p.on('pageerror',e=>console.log('PE',e.message));
await p.goto(`http://localhost:${PORT}/index.html`);await p.waitForTimeout(2500);
await p.addScriptTag({path:path.join(D,'overlay.js')});
await p.evaluate(()=>{for(let i=0;i<20;i++)__adv(16.7)});
// ---- 준비: 게임 시작 + 내 판 꾸미기 + 3번 AI 뱀 미로 ----
await p.evaluate(()=>{start();S.cdn=0;S.cdl=0;$('cdn').style.display='none';$('toast').style.display='none';
 const me=S.pl[0];me.gold=1e7;me.tech='fire';me.tech2='thunder';
 const L=[[1,3,'egg'],[3,3,'acorn'],[5,3,'air'],[0,5,'ember'],[2,5,'thunder'],[4,5,'plasma'],[6,5,'sun'],[1,7,'static'],[5,7,'lava'],[0,9,'storm'],[2,9,'egg'],[4,9,'air'],[6,9,'ember'],[1,11,'pylon'],[3,11,'pylon'],[5,11,'pylon'],[2,13,'acorn'],[4,13,'thunder']];
 L.forEach(([x,y,id])=>actBuild(0,x,y,id));let j=0;me.grid.forEach((row,y)=>row.forEach((t,x)=>{if(t&&!(x===1&&y===3)){for(let k=0;k<j%3;k++)actUpg(0,x,y);j++}}));
 const q=S.pl[3];q.gold=0;q.grid.forEach((row,y)=>row.forEach((t,x)=>row[x]=null));
 [2,5,8,11].forEach((y,i)=>{for(let x=0;x<COLS;x++){if(i%2?x===0:x===COLS-1)continue;q.grid[y][x]=mkR(x%3===1?TB.ice:x%3===2?TB.egg:TB.wall,q);if(!allOK(q.grid))q.grid[y][x]=null}});
 [[0,4,'ember'],[6,7,'frost'],[0,10,'storm'],[6,13,'egg'],[3,14,'acorn']].forEach(([x,y,id])=>{q.grid[y][x]=mkR(TB[id],q);if(!allOK(q.grid))q.grid[y][x]=null});
 refreshPaths(q);window.__q=q.grid.flat().filter(Boolean).length;
 window.BIRDS=['chick','turkey','penguin','eagle','phoenix','ostrich','peacock','owl','parrot','swan','goose','dodo','rooster','duck','crocbird','pigeon','crow','woodpecker'];
 window.spawnSome=(pid,owner,k)=>{const u=UB[BIRDS[Math.floor(Math.random()*BIRDS.length)]];spawn(S.pl[pid],u,owner,u.hp*(k||4))};
 for(let i=0;i<14;i++){spawnSome(0,1);for(let k=0;k<10;k++)__adv(16.67)}});
console.log('snake towers',await p.evaluate(()=>__q));
const sounds=[];let gf=0,start=0;
const order=ONLY!==null?[ONLY]:SC.map((_,i)=>i);
for(const si of order){const s=SC[si],N=Math.round(s.d*FPS);start=SC.slice(0,si).reduce((a,c)=>a+Math.round(c.d*FPS),0);
 // 장면 들어가기
 await p.evaluate(([s,si])=>{const show=v=>{if(typeof lobMode!=='undefined'&&lobMode==='plaza')closePlaza();['dexm','plaza','netm','herom','modem'].forEach(id=>$(id).style.display='none');VO.tl(false);VO.end(false);
   paused=false;$('pz').textContent='⏸';if(v==='game'||v==='tl'){$('title').style.display='none';$('game').style.display='flex';resize()}else{$('game').style.display='none';$('title').style.display='flex'}};
  show(s.view);
  if(s.n==='hook'||s.n==='fx'){view=0;insp=null;ui()}
  if(s.n==='evo'){view=0;const me=S.pl[0];me.grid[3][1]=mkR(TB.egg,me);insp={x:1,y:3,t:me.grid[3][1]};ui()}
  if(s.n==='maze'){view=3;insp=null;sel=null;S.pl[3].units=[];ui()}
  if(s.n==='dex'){dxOpen()}
  if(s.n==='plaza'){openPlaza()}
  if(s.n==='net'){$('netm').style.display='flex';$('netA').style.display='none';$('netR').style.display='block';$('ncd').textContent='JJ7K2';$('nme').textContent=SV.hero.name;$('nst').textContent='친구를 기다리는 중…';$('ngo').style.display='block';$('netm').querySelector('.mhd').style.visibility='hidden';$('nme').parentNode.style.visibility='hidden'}
  if(s.n==='end'){SV.hero={id:'chick',col:null,hat:'crown',face:'shades',name:'짹짹이'};lobUI()}
 },[s,si]);
 if(s.n==='dex')await p.waitForTimeout(25000);
 if(s.n==='plaza')await p.evaluate(()=>{for(let i=0;i<3;i++)__adv(16.67)});
 for(let f=0;f<N;f++,gf++){const t=f/FPS,tt=start/FPS+t;
  const ev=await p.evaluate(([n,f,t,N,cap])=>{const ev=[];
   const k=Math.min(1,t/.35);VO.cap(cap[0],cap[1],k);
   VO.fade(f<5?1-f/5:f>N-5?(f-(N-5))/5:0);
   if((n==='hook'||n==='evo'||n==='fx')&&f%9===0)spawnSome(0,1,n==='fx'?6:4);
   if(n==='maze'&&f%6===0)spawnSome(3,0,10);
   if(n==='evo'&&f>0&&f%40===0&&f<170){const me=S.pl[0];actUpg(0,1,3);insp={x:1,y:3,t:me.grid[3][1]};ui();ev.push(['upgrade',{tower:'egg',lv:me.grid[3][1].lv}])}
   if(n==='fx'&&f===50){const me=S.pl[0];me.skU=1;me.skCD=0;actSkill(0);ui();const sk=skillOf(me);ev.push(['skill',{id:sk&&sk.id,mine:true}])}
   if(n==='lobby'&&f%38===0){const H=[{id:'chick',hat:'crown',face:'none',col:null},{id:'turkey',hat:'party',face:'shades',col:null},{id:'penguin',hat:'beanie',face:'pink',col:0x38bdf8},{id:'owl',hat:'halo',face:'mono',col:null}][Math.floor(f/38)%4];Object.assign(SV.hero,H);lobUI();if(f)ev.push(['tap',{}])}
   if(n==='dex'){const d=$('dexb');if(f===60){dxPage='t';dxRender()}d.scrollTop=(f<60?f:f-60)*9}
   if(n==='plaza'&&f===10){pzChat('안녕하세요! 같이 해요~')}
   if(n==='plaza'&&f===70&&PZ){pzSay(PZ.me,'🥳',1)}
   if(n==='net'){const names=[SV.hero.name,'깃털장인','구구구','AI 🤖','꽥꽥이','하늘산책','AI 🤖','삐약대장'],m=Math.min(8,1+Math.floor(f/12));
    $('nsl').innerHTML=names.map((nm,i)=>`<div class="nslot${i<m&&!/AI/.test(nm)?' on':''}${i===0?' me':''}"><i>${i+1}</i><b>${i<m?nm:'빈자리'}</b><small>${i===0?'👑 방장':i<m?(/AI/.test(nm)?'AI':'접속'):''}</small></div>`).join('')}
   if(n==='tl')VO.tl(true,t);
   if(n==='end'){VO.end(t>1.2,t)}
   __adv(16.67);__adv(16.67);return ev},[s.n,f,t,N,s.cap]);
  ev.forEach(e=>sounds.push({n:e[0],a:e[1],t:tt}));
  if(s.n==='end'&&f===0)sounds.push({n:'win',a:{},t:tt});
  await p.screenshot({path:`${OUT}/fr/f${String(start+f).padStart(5,'0')}.jpg`,type:'jpeg',quality:90});
  if(ONLY!==null&&process.argv[3]!=='full'&&f>=Math.min(N-1,45))break}
 console.log('scene done',s.n,new Date().toISOString())}
if(ONLY===null)fs.writeFileSync(path.join(OUT,'sounds.json'),JSON.stringify(sounds));
// ---- 소리: 게임의 오리지널 칩튠 BGM + 효과음을 오프라인으로 녹음 ----
if(ONLY===null){const total=SC.reduce((a,c)=>a+c.d,0)+1;
 const wav=async(js,sec,name)=>{const b64=await p.evaluate(async([js,sec])=>{const ctx=new OfflineAudioContext(2,Math.ceil(44100*sec),44100);SFX._attach(ctx);eval(js);const buf=await ctx.startRendering();SFX._attach(null);
  const n=buf.length,dv=new DataView(new ArrayBuffer(44+n*4)),w=(o,s)=>{for(let i=0;i<s.length;i++)dv.setUint8(o+i,s.charCodeAt(i))};w(0,'RIFF');dv.setUint32(4,36+n*4,true);w(8,'WAVE');w(12,'fmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,2,true);dv.setUint32(24,44100,true);dv.setUint32(28,176400,true);dv.setUint16(32,4,true);dv.setUint16(34,16,true);w(36,'data');dv.setUint32(40,n*4,true);
  const L=buf.getChannelData(0),R=buf.getChannelData(1);for(let i=0;i<n;i++){dv.setInt16(44+i*4,Math.max(-1,Math.min(1,L[i]))*32767,true);dv.setInt16(46+i*4,Math.max(-1,Math.min(1,R[i]))*32767,true)}
  let s='';const u=new Uint8Array(dv.buffer);for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s)},[js,sec]);fs.writeFileSync(path.join(OUT,name),Buffer.from(b64,'base64'))};
 await wav('SFX._bgm('+total+',1)',total,'bgm.wav');
 for(const [i,s] of sounds.entries())await wav(`SFX.play(${JSON.stringify(s.n)},${JSON.stringify(s.a)})`,s.n==='win'?4:2,`sfx${i}.wav`);
 console.log('audio done',sounds.length)}
await b.close();srv.kill()})();
