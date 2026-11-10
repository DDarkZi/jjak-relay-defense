// 녹화 공통: 가상 시계로 rAF를 직접 돌림
const {chromium}=require('playwright'),fs=require('fs');const SP=__dirname+'/..';
exports.open=async(W=432,H=768,DSF=2.5)=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:W,height:H},deviceScaleFactor:DSF});const pg=await ctx.newPage();
 pg.on('pageerror',e=>console.log('ERR',String(e).slice(0,200)));
 await pg.route('**/three.min.js',r=>r.fulfill({path:SP+'/three/package/build/three.min.js',contentType:'application/javascript'}));
 await pg.addInitScript(()=>{let vt=0,q=[],id=0;const rp=performance.now.bind(performance);performance.now=()=>vt;
  window.requestAnimationFrame=f=>{q.push(f);return ++id};window.__tick=ms=>{vt+=ms;const a=q;q=[];a.forEach(f=>{try{f(vt)}catch(e){console.error(e)}})};});
 await pg.goto('http://localhost:8123/index.html?v='+Date.now());
 for(let i=0;i<40;i++){await pg.evaluate(()=>__tick(50));await pg.waitForTimeout(60)}
 await pg.evaluate(()=>{window.perfAdapt=()=>{}});
 const cdp=await ctx.newCDPSession(pg);
 return {b,pg,cdp};};
let FN=0;
exports.clip=async(pg,dir,n,before)=>{fs.mkdirSync(dir,{recursive:true});for(let i=0;i<n;i++){if(before)await pg.evaluate(before,i);await pg.evaluate(()=>__tick(1000/30));await pg.screenshot({path:`${dir}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:92})}};
exports.ff=async(pg,sec,sp=4)=>{await pg.evaluate(s=>{spd=s},sp);const n=Math.ceil(sec/(0.1*sp));for(let i=0;i<n;i++)await pg.evaluate(()=>__tick(100));await pg.evaluate(()=>{spd=1})};
