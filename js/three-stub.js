// 2d.html 전용: Three.js를 받지 않고 game.js를 돌리기 위한 빈 껍데기예요.
// game.js가 3D 물체를 만들거나 메서드를 불러도 아무 일도 안 하고 조용히 넘어가요. 실제 그리기는 js/r2d.js가 2D 캔버스로 해요.
(()=>{const f=function(){};let D;D=new Proxy(f,{get:(t,k)=>k===Symbol.toPrimitive?()=>0:k==='then'||k===Symbol.iterator?undefined:k==='length'?0:D,set:()=>true,apply:()=>D,construct:()=>D,has:()=>false});
 window.THREE=D;window.THREE_STUB=1})();
