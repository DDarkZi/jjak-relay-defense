// 영상 전용 자막·전환 오버레이 (게임 코드는 건드리지 않음)
window.VO=(()=>{const st=document.createElement('style');st.textContent=`
#vcap{position:fixed;left:0;right:0;top:92px;z-index:99990;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;font-family:"Black Han Sans","Jua",sans-serif}
#vcap b{display:block;font-weight:400;font-size:34px;line-height:1.15;color:#fff;text-align:center;padding:0 14px;text-shadow:-3px -3px 0 #12082b,0px -4px 0 #12082b,3px -3px 0 #12082b,4px 0px 0 #12082b,3px 3px 0 #12082b,0px 4px 0 #12082b,-3px 3px 0 #12082b,-4px 0px 0 #12082b,-2px -4px 0 #12082b,2px -4px 0 #12082b,4px -2px 0 #12082b,4px 2px 0 #12082b,2px 4px 0 #12082b,-2px 4px 0 #12082b,-4px 2px 0 #12082b,-4px -2px 0 #12082b,0 8px 0 #12082b}
#vcap b em{font-style:normal;color:#fde047}
#vcap small{font-family:"Jua",sans-serif;font-size:17px;color:#12082b;background:#fde047;border:3px solid #12082b;border-radius:99px;padding:3px 14px;box-shadow:0 4px 0 #12082b}
#vfade{position:fixed;inset:0;z-index:99995;background:#000;opacity:0;pointer-events:none}
#vtl{position:fixed;inset:0;z-index:99980;display:none;background:radial-gradient(ellipse at 50% 20%,#3b2a8f,#120f33 75%);font-family:"Jua",sans-serif;color:#fff;padding:178px 26px 0;box-sizing:border-box;overflow:hidden}
#vtl .r{display:flex;gap:12px;align-items:center;margin-bottom:6px;opacity:0;transform:translateX(-30px)}
#vtl .r i{font-style:normal;font-family:"Black Han Sans";color:#12082b;background:#fde047;border:3px solid #12082b;border-radius:10px;padding:2px 8px;font-size:15px;min-width:52px;text-align:center;box-shadow:0 3px 0 #12082b}
#vtl .r span{font-size:19px;text-shadow:0 2px 0 #000}
#vend{position:fixed;left:0;right:0;bottom:120px;z-index:99990;display:none;justify-content:center}
#vend span{font-family:"Black Han Sans";font-size:22px;color:#fff;background:#ef4444;border:4px solid #12082b;border-radius:16px;padding:10px 22px;box-shadow:0 6px 0 #12082b}`;
document.head.append(st);
const cap=document.createElement('div');cap.id='vcap';const fd=document.createElement('div');fd.id='vfade';const tl=document.createElement('div');tl.id='vtl';const en=document.createElement('div');en.id='vend';en.innerHTML='<span>🔔 구독하고 같이 만들어요!</span>';
document.body.append(tl,cap,fd,en);
const TL=[['v8.0','8인 원형 릴레이 AI 대전 시작'],['v9.0','육각 타일 맵 · 6방향 길찾기'],['v9.1','속성 5종 · 새 9종 추가'],['v9.4','카드 도감 · 웃긴 이름'],['v9.5','효과음 · 칩튠 배경음악'],['v9.11','타워 진화 · 난이도 5단계'],['v10.0','오리지널 종족 4종'],['v10.4','탈락해도 관전하기'],['v10.6','부화 병아리 8종'],['v10.8','8인 온라인 대전 (베타)'],['v10.9','앱 아이콘 · 홈 화면 설치'],['v11.1','AI 뱀 미로 8종']];
tl.innerHTML=TL.map(([v,t])=>`<div class="r"><i>${v}</i><span>${t}</span></div>`).join('');
let last='';
return{cap(h,sub,k){const key=h+'|'+sub;if(key!==last){last=key;cap.innerHTML=h?`<b>${h}</b>${sub?`<small>${sub}</small>`:''}`:''}
  const s=k<1?(.6+.55*k- .15*Math.max(0,k-.7)/.3):1;cap.style.transform=`scale(${Math.min(1.15,k<.7?.6+k*.79:1.15-(k-.7)*.5)})`;if(k>=1)cap.style.transform='scale(1)';cap.style.opacity=Math.min(1,k*3)},
 fade(a){fd.style.opacity=a},
 tl(on,t){tl.style.display=on?'block':'none';if(!on)return;[...tl.children].forEach((r,i)=>{const k=Math.max(0,Math.min(1,(t-i*.33)/.25));r.style.opacity=k;r.style.transform=`translateX(${(1-k)*-30}px)`})},
 end(on,t){en.style.display=on?'flex':'none';if(on)en.firstChild.style.transform=`scale(${1+.06*Math.sin(t*8)})`}}})();
