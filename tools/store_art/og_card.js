const {chromium}=require('playwright'),fs=require('fs');const SP=process.argv[2],R=process.argv[3];
const b64=f=>fs.readFileSync(f).toString('base64');
const ka=b64(R+'/assets/store/keyart.png'),U=id=>'data:image/webp;base64,'+b64(R+'/assets/units/'+id+'.webp');
const html=`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jua&display=swap"><style>
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;position:relative;font-family:Jua,sans-serif;background:#1c1240}
.bg{position:absolute;inset:0;background:url(data:image/png;base64,${ka}) center/cover;filter:saturate(1.1)}
.sh{position:absolute;inset:0;background:linear-gradient(90deg,#1c1240 0%,#2b1a66ee 38%,#3b1f8a99 58%,#3b1f8a22 80%,transparent 100%)}
.l{position:absolute;left:56px;top:40px;width:640px}
h1{margin:0;font:400 104px/1.02 'Black Han Sans';color:#ffd43b;-webkit-text-stroke:12px #140b33;paint-order:stroke fill;text-shadow:0 9px 0 #140b33;letter-spacing:1px}
.sir{display:inline-block;background:#dc2626;color:#fff;border:4px solid #140b33;border-radius:12px;padding:4px 14px 0;font:400 26px "Black Han Sans";box-shadow:0 5px 0 #140b33;margin-bottom:10px}.sub{display:inline-block;margin-top:10px;background:#dc2626;color:#fff;border:5px solid #140b33;border-radius:14px;padding:4px 18px 0;font:400 44px "Black Han Sans";box-shadow:0 6px 0 #140b33;transform:rotate(-2deg)}.t{margin-top:16px;font-size:35px;color:#fff;text-shadow:0 3px 0 #140b33}
.t b{color:#7dd3fc;font-weight:400}
.bd{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px;width:600px}
.bd span{background:#fff;color:#1c1240;border:4px solid #140b33;border-radius:99px;padding:6px 18px 4px;font-size:27px;box-shadow:0 5px 0 #140b33}
.cta{position:absolute;left:56px;bottom:46px;background:linear-gradient(#ffd43b,#f59e0b);color:#140b33;border:5px solid #140b33;border-radius:22px;padding:10px 28px 6px;font:400 36px 'Black Han Sans';box-shadow:0 7px 0 #140b33}
.c{position:absolute;width:250px;height:250px;border-radius:30px;border:7px solid #fff;box-shadow:0 12px 0 #140b33,0 18px 40px #0009;background-size:cover}
.n{position:absolute;left:50%;bottom:-24px;transform:translateX(-50%);white-space:nowrap;background:#140b33;color:#fde68a;border-radius:99px;padding:5px 16px 3px;font-size:24px;border:3px solid #fff}
</style></head><body><div class="bg"></div><div class="sh"></div>
<div class="l"><div class="sir">🚨 AI 속보</div><h1>새떼 주의보</h1><div class="sub">짹짹 디펜스</div><div class="t">8명이 이어 달리는 <b>새떼 타워 디펜스</b></div>
<div class="bd"><span>🐦 이상한 새 55종</span><span>🏹 타워 42종</span><span>✨ 조합 스킬 10종</span><span>👥 8인 대전</span></div></div>
<div class="cta">▶ 설치 없이 바로 플레이</div>
<div class="c" style="left:672px;top:258px;transform:rotate(-12deg);background-image:url(${U('dodo')})"><div class="n">각설이 도도새</div></div>
<div class="c" style="left:948px;top:300px;width:236px;height:236px;transform:rotate(11deg);background-image:url(${U('parrot')})"><div class="n">욕쟁이 앵무새</div></div>
<div class="c" style="left:800px;top:52px;width:280px;height:280px;transform:rotate(-2deg);background-image:url(${U('ostrich')})"><div class="n">발레리나 타조</div></div>
</body></html>`;
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:630}});await pg.setContent(html,{waitUntil:'networkidle'}).catch(()=>{});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(400);
await pg.screenshot({path:SP+'/og_new2.png'});await b.close()})();
