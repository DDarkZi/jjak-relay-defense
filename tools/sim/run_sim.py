"""AI 8명 시뮬레이션 실행기.
사용법: python3 tools/sim/run_sim.py normal 20 out.json [tune.json]
- Playwright(Chromium) 필요: pip install playwright && playwright install chromium
- 3D는 필요 없어서 three.js를 가짜(Proxy)로 바꿔 끼우고 게임 로직만 빠르게 돌립니다.
"""
import json,sys,time,pathlib
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[2]
mode,n,outf=sys.argv[1],int(sys.argv[2]),sys.argv[3]
tune=open(sys.argv[4]).read() if len(sys.argv)>4 else '{}'
STUB="const __mk=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?(()=>0):__mk(),apply:()=>__mk(),construct:()=>__mk(),set:()=>true});window.THREE=__mk();"
res=[];t0=time.time()
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page();pg.set_default_timeout(0)
    pg.route("**/three.min.js",lambda r:r.fulfill(body=STUB,content_type="application/javascript"))
    pg.route("**/fonts.googleapis.com/**",lambda r:r.fulfill(body="",content_type="text/css"))
    pg.goto((root/'index.html').as_uri());pg.wait_for_timeout(300)
    pg.add_script_tag(path=str(root/'tools/sim/harness.js'))
    pg.evaluate('t=>setTune(JSON.parse(t))',tune)
    for i in range(n):
        res+=json.loads(pg.evaluate(f"JSON.stringify(simN(1,'{mode}'))"))
        if i%10==9:print(i+1,'판',round(time.time()-t0),'초',flush=True)
    b.close()
json.dump(res,open(outf,'w'));print('완료',len(res),'판',round(time.time()-t0),'초')
