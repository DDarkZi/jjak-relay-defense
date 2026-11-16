// 🦥 빌딩늘보 마스코트 PNG 뽑기: node brand/render.js
// → brand/sloth_profile.png (1080, 배경 있음 · 인스타 프로필용) · brand/sloth_mascot.png (1024, 투명 배경)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch(),p=await b.newPage();
 await p.setContent('<canvas id="c" width="1024" height="1024"></canvas>');await p.addScriptTag({path:path.join(__dirname,'sloth.js')});
 for(const [name,bg,size] of [['sloth_profile.png',true,1080],['sloth_mascot.png',false,1024]]){
  const url=await p.evaluate(([bg,size])=>{const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.scale(size/1024,size/1024);drawSloth(x,{bg});return c.toDataURL('image/png')},[bg,size]);
  fs.writeFileSync(path.join(__dirname,name),Buffer.from(url.split(',')[1],'base64'));console.log('saved',name)}
 await b.close()})();
