// 🦥 도트 프로필 캐릭터 PNG 뽑기: node brand/render-pixel.js
// → brand/pixel_profile.png (1080, 배경 있음 · 인스타 프로필용) · brand/pixel_sloth.png (1080, 투명 배경)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch(),p=await b.newPage();await p.setContent('<body></body>');await p.addScriptTag({path:path.join(__dirname,'pixel.js')});
 for(const [name,bg] of [['pixel_profile.png',true],['pixel_sloth.png',false]]){
  const url=await p.evaluate(bg=>{const c=document.createElement('canvas');c.width=c.height=1080;drawPixelSloth(c.getContext('2d'),1080,bg);return c.toDataURL('image/png')},bg);
  fs.writeFileSync(path.join(__dirname,name),Buffer.from(url.split(',')[1],'base64'));console.log('saved',name)}
 await b.close()})();
