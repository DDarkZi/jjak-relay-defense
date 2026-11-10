const {chromium}=require('playwright');const SP=process.argv[2];
const L=[['s2_battle','타워를 세워 막아라!','육각 타일 위 3D 타워 디펜스','#ffcf3a'],['s3_kill','이상한 새 55종 출동','발레리나 타조부터 악어새까지','#ff7aa8'],
['s4_units','새를 보내 상대를 공격!','보낼수록 인컴이 쑥쑥','#6fe0ff'],['s5_result','8명 중 최후의 1인','원형으로 이어 달리는 릴레이 대전','#9dff7a'],['s1_lobby','나만의 영웅 새 꾸미기','모자·표정·이름까지 내 맘대로','#ffb347'],['s6_codex','개성 만점 새 도감','새마다 웃긴 사연이 있어요','#c4b5fd']];
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
for(const [i,[f,t,s,c]] of L.entries()){await pg.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jua&display=swap"></head>
<body style="margin:0;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(circle at 50% 0%,#5b3fc4,#1c1240 70%);font-family:'Black Han Sans',sans-serif;text-align:center">
<div style="padding-top:70px;font-size:104px;color:${c};-webkit-text-stroke:10px #1a0f33;paint-order:stroke fill;text-shadow:0 10px 0 #1a0f33">${t}</div>
<div style="margin-top:18px;font-family:Jua,sans-serif;font-size:54px;color:#fff">${s}</div>
<img src="data:image/png;base64,${require("fs").readFileSync(SP+"/store/"+f+".png").toString("base64")}" style="position:absolute;left:115px;top:390px;width:850px;height:1511px;border-radius:44px;border:10px solid #fff;box-shadow:0 20px 50px #0008;object-fit:cover;object-position:top">
</body></html>`,{waitUntil:'networkidle'}).catch(()=>{});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(300);
await pg.screenshot({path:`${SP}/store/final/0${i+1}_${f}.png`})}await b.close()})();
