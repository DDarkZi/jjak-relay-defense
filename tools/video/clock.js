// 가상 시계: rAF·performance.now를 직접 돌려 프레임마다 일정한 시간으로 찍어요
(()=>{let T=1000;const q=[];const pn=performance.now.bind(performance);
performance.now=()=>T;window.requestAnimationFrame=cb=>{q.push(cb);return q.length};window.cancelAnimationFrame=()=>{};
window.__adv=ms=>{T+=ms;const c=q.splice(0);c.forEach(f=>{try{f(T)}catch(e){console.log('raf err',e&&e.message)}})};window.__T=()=>T})();
