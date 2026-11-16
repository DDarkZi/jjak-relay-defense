// 🦥 Day 1 첫 게시물 카드뉴스 (1080×1350 × 5장) 만들기: node brand/posts/day1/make.js
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const D=__dirname,img=f=>'data:image/png;base64,'+fs.readFileSync(path.join(D,'src',f)).toString('base64');
const V1=img('v1_glasses.png'),V2=img('v2_claude.png'),V3=img('v3_final.png');
const CSS=`
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;overflow:hidden;font-family:"Jua",sans-serif;color:#2b1b12;
 background:#a5d8ff;position:relative}
.sky:before,.sky:after{content:"";position:absolute;width:132px;height:24px;background:#fff;box-shadow:24px -24px 0 -0px #fff,48px -24px 0 #fff,-24px 24px 0 #fff,0 24px 0 #fff,24px 24px 0 #fff,48px 24px 0 #fff,72px 24px 0 #fff,96px 24px 0 #fff,120px 24px 0 #fff,144px 24px 0 #fff}
.sky:before{top:120px;left:70px}.sky:after{top:1080px;right:240px}
.ground{position:absolute;left:0;right:0;bottom:0;height:64px;background:#6b4423;border-top:12px solid #2b1b12;box-shadow:inset 0 12px 0 #8a5a33}
.tag{position:absolute;top:56px;left:60px;font-family:"Black Han Sans";font-size:40px;background:#fde047;border:8px solid #2b1b12;padding:6px 22px;box-shadow:8px 8px 0 #2b1b12}
.num{position:absolute;top:60px;right:60px;font-family:"Press Start 2P",monospace;font-size:26px;color:#2b1b12;opacity:.7}
.h{font-family:"Black Han Sans";font-size:92px;line-height:1.15;text-align:center;letter-spacing:-1px}
.h em{font-style:normal;color:#fff;-webkit-text-stroke:0;text-shadow:6px 0 #2b1b12,-6px 0 #2b1b12,0 6px #2b1b12,0 -6px #2b1b12,6px 6px #2b1b12,-6px -6px #2b1b12,6px -6px #2b1b12,-6px 6px #2b1b12,0 12px #2b1b12}
.p{font-size:46px;line-height:1.5;text-align:center}
.box{background:#fffaf0;border:10px solid #2b1b12;box-shadow:12px 12px 0 #2b1b12}
.pix{image-rendering:pixelated}
.handle{font-family:"Black Han Sans";font-size:44px}
`;
const wrap=(n,inner)=>`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jua&family=Press+Start+2P&display=swap"><style>${CSS}</style></head><body><div class="sky"></div><div class="num">${n}/5</div>${inner}</body></html>`;
const cards=[
// 1. 표지
wrap(1,`<div class="tag">DAY 1</div>
<div style="position:absolute;top:170px;left:0;right:0" class="h">코딩 모르는<br><em>나무늘보</em>가<br>인스타를 만들었다</div>
<img src="${V3}" class="pix box" style="position:absolute;left:230px;top:600px;width:620px;height:620px">
<div class="ground"></div>`),
// 2. 아이디 탄생
wrap(2,`<div class="tag">아이디 탄생기</div>
<div style="position:absolute;top:180px;left:60px;right:60px;display:flex;flex-direction:column;gap:30px;font-size:44px">
 <div style="align-self:flex-end;max-width:760px" class="box"><div style="padding:22px 30px">🦥 Tree null vo</div></div>
 <div style="align-self:flex-start;max-width:860px;background:#e0f2fe" class="box"><div style="padding:22px 30px">🤖 null은 프로그래밍에서<br>'값이 없음'이라는 뜻인데요… (진지)</div></div>
 <div style="align-self:flex-end;max-width:760px" class="box"><div style="padding:22px 30px">🦥 나무늘보</div></div>
 <div style="align-self:flex-start;max-width:860px;background:#e0f2fe" class="box"><div style="padding:22px 30px">🤖 아!!! 😳</div></div>
</div>
<div style="position:absolute;bottom:150px;left:0;right:0" class="h" ><span style="font-size:84px">Tree + null + vo<br>= <em>나무늘보</em> 🦥</span></div>`),
// 3. 캐릭터 탄생기
wrap(3,`<div class="tag">캐릭터 탄생기</div>
<div style="position:absolute;top:170px;left:0;right:0" class="h"><span style="font-size:76px">AI한테 늘보를<br>그려 달라고 했더니</span></div>
<div style="position:absolute;top:470px;left:50px;right:50px;display:flex;justify-content:space-between;align-items:flex-start">
 ${[[V1,'① 첫 시안','안경 쓴…곰?'],[V2,'② 다시 그림','진짜 늘보 무늬'],[V3,'③ 최종','제미나이가 다듬음']].map(([s,a,b],i)=>`<div style="width:300px;text-align:center"><img src="${s}" class="pix box" style="width:290px;height:290px"><div style="font-family:'Black Han Sans';font-size:44px;margin-top:26px">${a}</div><div style="font-size:36px;margin-top:6px">${b}</div></div>`).join('')}
</div>
<div style="position:absolute;top:640px;left:340px;font-size:60px">▶</div><div style="position:absolute;top:640px;left:690px;font-size:60px">▶</div>
<div style="position:absolute;bottom:150px;left:60px;right:60px" class="p">잔머리 두 가닥이랬는데<br>세 가닥이 나온 건 비밀 🤫</div>
<div class="ground"></div>`),
// 4. 목표와 현재
wrap(4,`<div class="tag">늘보의 목표</div>
<div style="position:absolute;top:170px;left:0;right:0" class="h">언젠가<br><em>빌딩늘보</em> 🏢</div>
<div class="box" style="position:absolute;top:450px;left:110px;right:110px;padding:34px 54px;font-size:46px;line-height:1.6">
 <div>💻 코딩 실력 <b style="float:right">0</b></div>
 <div>💰 수익 <b style="float:right">0원</b></div>
 <div>👥 팔로워 <b style="float:right">0명</b></div>
 <div>🤖 무기 <b style="float:right">AI</b></div>
 <div style="margin-top:22px;font-size:36px">빌딩까지 진행도</div>
 <div style="height:46px;border:8px solid #2b1b12;background:#fff;margin-top:8px"><div style="width:1%;height:100%;background:#fde047"></div></div>
 <div style="font-size:32px;text-align:right;margin-top:4px">0.0001% 🦥</div>
</div>
<div style="position:absolute;bottom:60px;left:0;right:0" class="p">AI로 게임 · 앱 · 영상 · 3D 캐릭터를<br>만들어서 수익을 내 볼 거예요</div>`),
// 5. 마무리
wrap(5,`<div class="tag">약속</div>
<div style="position:absolute;top:190px;left:0;right:0" class="h">느려도<br><em>매주</em> 올라와요</div>
<img src="${V3}" class="pix box" style="position:absolute;left:300px;top:560px;width:480px;height:480px">
<div style="position:absolute;top:1100px;left:0;right:0;text-align:center"><span class="handle" style="background:#fde047;border:8px solid #2b1b12;padding:8px 28px;box-shadow:8px 8px 0 #2b1b12">팔로우하고 같이 지켜봐 주세요 🦥</span></div>
<div style="position:absolute;bottom:40px;left:0;right:0;text-align:center;font-family:'Black Han Sans';font-size:40px;opacity:.8">@tree_null.vo</div>`)];
(async()=>{const b=await chromium.launch(),p=await b.newPage({viewport:{width:1080,height:1350}});
 for(const [i,h] of cards.entries()){await p.setContent(h,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  await p.screenshot({path:path.join(D,`card${i+1}.png`)});console.log('card',i+1)}
 await b.close()})();
