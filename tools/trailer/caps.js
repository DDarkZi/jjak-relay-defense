const {chromium}=require('playwright'),fs=require('fs');
const C=[['swarm','🚨 새떼 주의보 발령!','하늘을 뒤덮은 새떼가 몰려온다','#ffd23a'],
['news','📢 AI 속보!','마스코트 AI가 위기를 알려요','#ff6b6b'],
['build','타워를 세워 막아라','타워 42종 · 5가지 속성','#ffd23a'],
['fun','웃긴 새 55종','발레 타조 · 각설이 도도 · 욕쟁이 앵무','#ff8fc0'],
['skill','조합 스킬 💥','속성 2개를 섞으면 필살기','#7ce7ff'],
['send','새를 보내 공격!','보낼수록 수입이 쑥쑥','#9dff7a'],
['ring','8명 릴레이 대전','최후의 1인이 되어라','#c4b5fd'],
['lobby','나만의 영웅 새','모자 · 표정 · 이름까지','#ffb347']];
const FONT=`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jua&display=swap">`;
const T=(t,c,fs)=>`<div style="font-family:'Black Han Sans';font-size:${fs}px;color:${c};-webkit-text-stroke:${fs/7}px #1a0f33;paint-order:stroke fill;text-shadow:0 ${fs/10}px 0 #1a0f33;line-height:1.1">${t}</div>`;
const S=(t,fs)=>`<div style="display:inline-block;margin-top:14px;font-family:Jua;font-size:${fs}px;color:#fff;background:#1a0f33d9;border:4px solid #fff;border-radius:999px;padding:8px 30px 4px">${t}</div>`;
(async()=>{const b=await chromium.launch();const pg=await b.newPage();fs.mkdirSync('cap',{recursive:true});
for(const [k,t,s,c] of C){
 await pg.setViewportSize({width:1080,height:1920});
 await pg.setContent(`<html><head>${FONT}</head><body style="margin:0;background:transparent"><div style="position:absolute;top:${k==="fun"?1030:170}px;left:10px;width:870px;text-align:center">${T(t,c,t.length>9?92:104)}${S(s,40)}</div></body></html>`,{waitUntil:'networkidle'});
 await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:`cap/v_${k}.png`,omitBackground:true});
 await pg.setViewportSize({width:1920,height:1080});
 await pg.setContent(`<html><head>${FONT}</head><body style="margin:0;background:transparent"><div style="position:absolute;top:0;bottom:0;left:60px;width:1060px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">${T(t,c,124)}${S(s,52)}</div></body></html>`,{waitUntil:'networkidle'});
 await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:`cap/h_${k}.png`,omitBackground:true})}
// 엔딩 카드
const img=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
const mas=img('../mag_0.png');
const end=(w,h)=>`<html><head>${FONT}</head><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;background:radial-gradient(circle at 50% 35%,#6a4be0,#1c1240 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
<img src="${mas}" style="width:${h>w?560:400}px;margin-bottom:-20px">
<div style="font-family:Jua;font-size:${h>w?54:44}px;color:#fff;background:#dc2626;border:5px solid #000;border-radius:14px;padding:6px 22px 0;margin-bottom:18px">🚨 AI 속보</div>
${T('새떼 주의보','#ffd23a',w>h?150:170)}
<div style="display:inline-block;font-family:'Black Han Sans';font-size:${h>w?84:72}px;color:#fff;background:#dc2626;border:6px solid #000;border-radius:18px;padding:4px 34px 0;margin-top:16px;transform:rotate(-2deg);box-shadow:0 8px 0 #000">짹짹 디펜스</div>
<div style="margin-top:46px;font-family:Jua;font-size:${h>w?58:48}px;color:#1a0f33;background:#ffd23a;border:5px solid #000;border-radius:999px;padding:14px 48px 8px;box-shadow:0 8px 0 #000">▶ 설치 없이 바로 플레이</div></body></html>`;
for(const [n,w,h] of [['v',1080,1920],['h',1920,1080]]){await pg.setViewportSize({width:w,height:h});await pg.setContent(end(w,h).replace(/color:undefined/,'color:#ffd23a'),{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:`cap/${n}_end.png`})}
await b.close()})();
