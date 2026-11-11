# 새떼 주의보: 짹짹 디펜스 (옛 이름: 짹짹 릴레이 디펜스) — Claude 작업 메모

## 프로젝트 한 줄
- 게임 이름: **새떼 주의보: 짹짹 디펜스**(2026-11-10 변경, 홈 화면 짧은 이름 "새떼 주의보"). 저장소 이름은 그대로 jjak-relay-defense.
8명이 원형으로 이어 달리며 막는 3D 육각 타일 타워 디펜스 웹게임. 새(유닛)를 상대 진영으로 보내고 타워로 막는다. 빌드 도구 없는 순수 HTML/CSS/JS + Three.js r128(CDN).

## 사용자와 작업 방식
- **답변은 항상 한국어로.** 사용자는 주로 휴대폰으로 작업하고 테스트한다.
- 출시(구글 플레이) 관련은 사용자가 어려워함: 물어보면 `assets/store/RELEASE_CHECKLIST.md`의 '📍 지금 어디까지'와 '🧸 쉽게 이해하기'(도장 비유)를 바탕으로 **초보자 눈높이로 다시 설명**하고, 진행할 때마다 '지금 어디까지' 표를 갱신할 것.
- 바꾼 뒤에는 무엇이 달라졌는지 짧게 정리하고, 직접 화면으로 확인하지 못한 부분(3D 모양·이펙트)은 솔직히 말한다.
- 큰 변경 전에는 커밋으로 남겨 되돌릴 수 있게 한다.
- 로드맵: 유저별 커스텀 새 영웅 · 새 종류 계속 확장 · 광장(대화·이모티콘) · 나중에 유저 8인 온라인 대전 · 구글 플레이 출시.
- 홍보 영상은 나중에 Remotion(또는 HyperFrames)으로 게임 녹화 + 자막 트레일러를 만들기로 함. 지금은 보류.

## 📝 나중에 할 일 (사용자와 합의해 미뤄 둔 것)
- 🐣 마스코트 AI 등장(v12.3 완료): 로비(`aiLobby`·`#aib` 말풍선, 첫 방문 자기소개 `SV.aiIntro`, 누르면 한마디)·튜토리얼(첫 카드 자기소개 + 얼굴 `assets/ui/ai.png`)·게임 속보(조합 스킬 해금·탈락 `newsBird`)·광장(`aiPlazaAdd`, 내 영웅 근처를 따라다니며 생중계, 채팅에 'AI' 넣으면 대답)·결과 화면(`aiEnd`, 첫 우승 특별 대사). 대사는 `AIL`. 이름 개그: AI = 인공지능 아니고 **Avian Influencer**(조류 인플루언서), 짹튜브 「짹짹 뉴스」 구독자 800만 새. 개발자 계정 이름도 Avian Influencer.
- 🐦 고급 새 2종(v12.8 구현): `demcrane` 철거반장 두루미(4800·지상, `grab`: 6초마다 0.6초 멈춰 1.8칸 안 공격 타워를 집음 → `u.carry`·`t.carrier`, `t.dis=99`로 4.6초 이고 걸음(3D: 타워가 두루미 머리 위 0.62배, 원래 칸엔 `craneCone` 공사 고깔, 칸은 여전히 막힘) → `craneDrop`: Lv.2 이하면 두루미 2.6칸 안 빈칸 중 `allOK` + 모든 지상 새 bfs 길이 있는 칸으로 이동(새 위 0.6 안 칸 제외), 아니면 제자리 · 두루미가 죽으면 제자리. 온라인 손님 화면엔 이고 가는 모습은 안 보이고 옮긴 결과만 보임. 효율 0.55(타워 방해 효과는 수치에 안 잡힘), `LIFT`·`NECK`·`HEADX`는 온천 두루미와 같은 긴 다리 체형, 안전모·주황 조끼) · `archaeo` 시조새(5000·공중, `fossil`: 체력 50% 미만이 되면 `fossilLand` → 가까운 빈칸에 착지해 숨은 지상형 `archaeo_g`(분홍 털 빠진 몸)로 바꾸고 bfs 길 찾기, 1.8칸 안 타워 2초 기절). 효율 측정은 `tools/sim/unit_an.py`(archaeo_g 피해는 archaeo로 합산). 시조새는 사용자 요청으로 '나오면 멸망' 효율 2.3(펠리컨 1.37): 5500G·체력 8600·탈출 피해 21(5500G에서도 2.32). ⚠️ 체력은 효율에 거의 영향 없음(8600~10500 모두 1.65 근처, 착지 후 미로에서 갈림) → 효율 조절은 `dm`으로. AI가 공중 새를 잘 안 사서 측정할 땐 패치로 `fav:{archaeo:4}`를 줘서 표본을 늘림. 나머지 후보 18개는 `docs/bird_ideas.md`.
- 🎬 홍보 영상: 초안 완성(2026-11-10, 약 30초, 가로·세로). 만드는 법 `tools/trailer/README.md`(가상 시계 프레임 녹화 + 자막 PNG + ffmpeg + 칩튠). 다듬기는 나중에.
- 💰 수익 구조(단계별 안): v1.0 무료·광고 없음 → 사람이 모이면 보상형 광고(코인 2배) → 꾸미기 상점·광고 제거·후원 팩. 페이투윈·랜덤 뽑기는 안 함. 광고 넣으면 개인정보처리방침·데이터 보안 설문 수정.
- 📲 구글 플레이 출시: 단계별 안내 `assets/store/RELEASE_CHECKLIST.md`. ⚠️ assetlinks.json은 도메인 맨 위(`ddarkzi.github.io/.well-known/`)여야 해서 사용자 사이트 저장소 `DDarkZi.github.io`(만듦, `/home/user/ddarkzi.github.io`, 첫 페이지는 게임으로 이동, assetlinks에 업로드 키 지문 넣음(패키지 io.github.ddarkzi.jjakdefense), Play 앱 서명 키 지문은 아직). Play 앱 서명 키 SHA-256도 함께 넣기. 앱 아이콘 = 마스코트 AI(2026-11-10 교체, 원본 렌더는 ai_mascot.glb + 경고 빛줄기·새떼 실루엣 배경).
- 🧠 AI 밸런스 v12.2(2026-11-10) 끝: 스타일별 승률 고르게 맞춤(아래 '경제 밸런스' 참고). 새 성향을 넣으면 같은 방식으로 다시 시뮬.
- 🦤 Tripo로 만든 도도새 3D: 약관 확인함(2026-11-10, 2025-07-11판). **무료 사용자 결과물은 Tripo가 모든 권리를 가짐(5.2.1)** → 게임에 쓰지 않기로. 유료 사용자는 권리를 가짐(5.2.2). 쓰려면 유료 기간에 다시 생성하거나, 제한 없는 Hyper3D Rodin으로 만들기.

## 파일 구조
- `index.html` — 화면 마크업(로비, 모드 선택, 영웅 꾸미기, 광장, 게임, 도감, 설명, 결과)
- `css/style.css` — 전체 스타일 (로비·모드 카드·광장은 파일 뒤쪽)
- `js/net.js` — 8인 온라인 대전(베타). game.js 다음에 로드되는 클래식 스크립트, 전역 `NET`.
- `js/game.js` — 모든 로직이 하나의 클래식 스크립트 (전역 공유). 대략 순서:
  1. 데이터: `T`(타워), `U`(새), `RACE`(종족 4개), 이름표 `NM`, `BAL`(밸런스 상수, `/*BAL*/…/*BALEND*/` 사이), `DIFF`(난이도), `AIS`(AI 7성향 유전자, `/*AIS_BEGIN*/`)
  2. 게임 로직: `start(gs,p0h)`, `step(dt)`, 타워 공격 루프, `dmgU`, `spawn`, `escape`, AI(`aiTick`, `buildT`, `buyU`, `aiUp`)
  3. 3D: `birdMesh2/3`, `towerMesh3`, `sync3`
  4. `ART` 모듈(IIFE): 얼굴·소품·이펙트(`A.bird`, `A.shoot`, `A.smoke`, `A.crit`, `A.ignite` …). 새별 소품은 `accParts` 안의 `D` 객체, 움직이는 파츠는 `animSet`/`animAdd`
  5. 사운드 `SFX`, 도감(`dxOpen`, `cardU`, 테마 배경 `DXTH`)
  6. 로비·영웅 꾸미기·광장 (`// ---------- 🏠 로비` 아래, `heroMesh`, `plazaFrame`, `lobLoop`)
  7. 마지막에 `renderTitle()` 호출

## 꼭 알아둘 규칙
- 새 좌표계: 새는 **-y 방향**을 바라보고 z가 위. 몸통 중심 (0,0,0.26), 머리 (0,-0.3,0.46) 반지름 0.15(부엉이 0.2, 병아리 0.17), 타조만 키가 큼(z0 0.6, 머리 z 1.3).
- 세이브: localStorage 키 `jjj_save_v1` (`SV` 객체: coins, wins, races, hero …). 종족 해금 30코인(종족 모드 자체 해금은 0, 첫 종족 무료). 코인은 승리 때만(난이도별 E2·N3·M4·H6·X8).
- 모드별 밸런스: `applyModeBal(k)`가 `start()` 때 `BAL.mode[normal|race]`의 `uh`(새 체력)·`td`(타워 공격력)·`as`(공격 간격) 배율을 적용. 원래 값은 `u.hp0`, `b.d0`, `b.cd0`.
- 타워 성격(자동 태그): 공격 간격 ≤0.8초 `rapid`(연사 가속, `BAL.rh/rs`), ≥1.5초 `heavy`(3타 치명타 `BAL.hcr` + 최대체력 `BAL.hmx`), 독 중첩(`addPois`, `BAL.pk/pmax/pdur`, 광역 독은 독연기 `p.clouds`), 화상(`u.bn/u.bv`, 쓰러지면 번짐 `BAL.bsp`).
- 3D 게임판 타일: `assets/hex3d/*.glb`(Kenney Hexagon Kit CC0, 지형 16종 + `Textures/colormap.png`, 라이선스 사본 포함), 로더 `js/vendor/GLTFLoader.js`(three r128 examples). ART `loadHex3`/`hex3Ready`/`hex3Theme`: 모델 로드 후 기존 젤리 타일·림 숨김, 모델별 InstancedMesh, 타일 두께만큼 내려 윗면=0. 테마 = 좌석 `((view+S.off)%8)%5` → `HX3_TH`(풀밭·사막·바위산·흙·바닷가 섬).
- 효과음: `assets/sfx/*.ogg`(Kenney Interface/Impact/RPG Audio/Music Jingles, CC0, 31개 400KB, 라이선스 사본 포함). SFX의 `SMP`(이벤트→파일 목록)·`SVOL`(볼륨)·`SGAP`(최소 간격)·`SLAYER`(합성음과 같이)로 매핑, 첫 소리 때 `smpLoad`, 못 불러오면 기존 합성음. 타워 발사음·배경음악은 합성음 유지.
- 공중 새 인컴은 `BAL.airInc`(0.8)배(데이터 로드 때 `u.inc`에 반영). 결과 표 `resultUI()`(#eres): 진영별 `p.kills`(막은 새)·`p.dealt`(준 피해)·`p.income`·`p.dieT`.
- 💰 경제 밸런스(v12.2): 처치 보상 `BAL.kr`(0.2 = 새 가격의 20%), 새 전송 인컴 배율 `BAL.ui`(0.9, `gainInc` 안에서 곱함 — u.inc에 곱하고 반올림하면 싼 새가 안 깎여서 결과가 달라짐). 안정형 `upAgg` 0.8→0.65(업그레이드 과소비가 약한 원인이었음).
  - 시뮬(일반, 160판씩, 기대 12.5%): 이전 이자형 18·안정형 7·밸런스 14·특수 10% → 지금 3회 평균 이자형 12·안정형 12·밸런스 14·특수 11%, 평균 15분. 종족 모드 11.6분.
  - 종족전(v12.4): `tools/sim/run_race.sh`(실제 성향 풀 AIP + 종족 무작위. 옛 harness simN은 옛 AIS 7개라 실제와 다름). 맹금 새 가격 uc .92→.95·타워 가격 tc 1.12→1.16, 숲 사거리 tr .4→.5, 둥지 타워 가격 tc .92→.88. 160판×2 평균: 맹금 13·황혼 13·둥지 12·숲 12%(이전 맹금 16~19·숲 6~9%), 평균 14분. 맹금의 힘은 '싼 새'에서 나와서 새 체력·약탈금을 줄여도 거의 안 변했음. 종족 하나당 표본 오차 ±2% 정도라 한 번 결과로 판단하지 말 것.
  - 시도했지만 버린 것: 처치 보상만 올리기(모두 부자 → 게임만 짧아짐), 완벽 수비 보너스(8인전에선 거의 못 받음), 안정형 위기 기준 낮추기(효과 없음).
  - 실험 도구: `tools/sim/run_styles.sh 태그 40 "패치 JS"` (aisim.js 4개 병렬 160판 약 6분 → aian.py가 스타일별 승률·생존·처치·인컴 출력, Node Playwright 사용)
- 한국어 조사 `jo(단어,'을','를')`(받침 보고 고름) — '을(를)' 같은 표기 대신 쓰기.
- 🚫 종족 금지(`RACE[k].ban`, 예: 숲 지킴이=칠면조·도도새·다람쥐 대포): `banOf`/`banMsg`. 상점에선 숨기지 않고 `.rban` 잠금 카드(⚠️ `.ban`은 게임 안내 배너 클래스라 쓰면 안 됨). 종족 선택 화면 `#rd`·도감에도 표시.
- 업그레이드 비용: `upc = c × BAL.upk × lv × (1 + BAL.upg × (lv-1))` × 종족 배율.
- `S.sim`일 때는 사운드·이펙트를 건너뛴다. 통계 훅은 `S.st`가 있을 때만 동작.
- 🦴 병아리 영웅은 Blender로 뼈대·애니메이션(idle·walk·flap)을 넣은 `assets/models/chick_anim.glb`(사용자 컴퓨터의 Claude Code+Blender 5.x에서 제작). 복제는 `skinClone`(그냥 clone하면 뼈 공유), 크기는 `skinBox`, 재생은 `heroClip`(걸으면 walk·서 있으면 idle·5~9초마다 flap). ⚠️ 뼈대 GLB는 위치·가중치를 quantize하지 말 것(크기 계산이 깨짐) — `--pattern "{NORMAL,TEXCOORD_0}"`만. 클라우드 세션에서 컴퓨터 폴더 연결은 이 계정에서 아직 안 됨(2026-11-10).
- AI 3D 영웅 모델: Hyper3D Rodin으로 만든 GLB를 gltf-transform+meshoptimizer로 1.2만 면·512 JPEG·quantize로 줄여 `assets/models/`에. `HGLB`(키·모자/안경 위치)·`hglbGet`·`heroMeshAI`, 로비·꾸미기·광장 영웅에만(게임판은 기존 모델). 약관 메모 `art_src/models/README.md`(Rodin은 상업 이용 제한 없음, ChatAvatar는 개인용만).
- 🎞 pixelfx 시트(`PXS`, 2026-11-11): Claude Code 플러그인 `pixelfx@pixelfx`(MIT) 설치함. `tools/pfx/add.py`로 효과를 15fps·256색 시트로 가져와 `assets/pfx/`·`js/pfx_sheets.js`(index.html에서 game.js 앞에 로드), `PXS.play(id,x,BH-y,z,{sc,delay,add,loop})`. 사용법 `tools/pfx/README.md`. `fit`=가로 몇 칸 크기, `PXS.some(id,새들,n,o)`·`PXS.towers(id,p,n,o)`·`PXS.has(id)`. 색 바꾸기는 add.py에 `id@{"palette":[...]}`. 붙인 곳(사용자 선택 2026-11-11): 시조새 착지=impacts/ground-slam · 화염 폭풍=fire/flame-pillar(새 8마리 위) · 폭풍의 눈=nature/tornado(타워 4개 위 3초) · 빙결 순간(0.15초 간격)·절대영도 풀릴 때=ice/ice-shatter · 광역 독구름 `p.clouds`=nature/toxic-gas(사용자 요청 '둥근 가스'로 직접 만든 효과, 원본 `tools/pfx/custom/nature/toxic-gas.js`) · 플라즈마 낙뢰=lightning/lightning-strike(없으면 옛 `PFX.strike`). 6개 합 564KB.
- 픽셀 이펙트 `PFX`(game.js 끝, pixelfx 방식을 참고해 직접 구현, 외부 코드 실행·복사 없음): 작은 캔버스에 점을 찍어 NearestFilter 스프라이트로 띄움. `PFX.strike(x,y,z,delay)`=플라즈마 낙뢰 시제품, `sync3`에서 `PFX.update(dt)`. 다른 조합 스킬은 아직 기존 파티클(`A.skill`).
- 💬 말하는 새(도도·앵무, `talk`): 끝까지 가는 동안 진행 25·50·75%에서 한 마디씩 3번(1.6초), 화면 동시 최대 3개(`sync3.tA`). 타조는 말 안 함(피루엣만).
- 🗞 뉴스새 마스코트 'AI'(NPC, 조류 인플루언서): **드론 메카 병아리**. 정식 3D `assets/models/ai_mascot.glb`(Hyper3D Rodin, 341면·52KB, 원본·시안 `art_src/mascot/`) — `aiMascotGet`(게임 시작 때 미리 불러옴)·`aiMascotMesh`(사이렌 빛 + 프로펠러 4곳 회전 잔상 `blurTex`), 못 불러오면 코드 모델 `mechaChickMesh`. `newsBird(txt)`·`newsUpd`(sync3)·`bannerTex`('AI 속보 · 짹짹 뉴스'). 카메라 쪽으로 숙여(rotation.x -1.05) 얼굴을 보이며 현수막을 끌고 판을 가로지름. 6분30초·8분30초 '30초 뒤 피해 N배!' 예고 + 7·9분 '돌파'.
- 🪴 꿀꺽 파리지옥(`flytrap`, 독 속성 3번째, 260G, 지상 전용, cd1.4): 머리 수=레벨(최대 3)만큼 지상 새를 물어 `u.stun`·`u.held`로 1.6초(Lv3+ 1.8초, 체력 2000+ 새는 절반) 묶고 독. Lv.4는 체력 12% 이하면 꿀꺽(`A.gulp`). 이펙트 `A.vine`(덩굴 줄기)·`PFX 'chomp'`(픽셀 턱, `play(...,dur)`로 길이 맞춤). 박쥐 둥지는 공용 타워로 옮김. 90판 시뮬: 피해 효율 0.68(묶기가 본업), 독 첫 속성 승률 11.6%.
- 🔢 피해 숫자 `dmgPop`: 치명타 또는 최대 체력 12%(최소 60) 이상만, 90ms 간격. ⚠️ 한 줄 코드 중간에 `//` 주석을 넣으면 뒤 코드가 다 주석이 됨(두 번 버그 남) — `/* */`를 쓰거나 줄을 바꿀 것.
- 만화풍 전투 UI(v11.2): 상점 초상화 `thumbOne/shopThumbTick`(두 프레임에 하나, `DXC['s_…']`), 카드 등급 클래스 `tr-cm/rr/ep/lg`(`tierOf`), 피해 숫자 `dmgPop`(DOM `#dmgl`, `pfS>=2`면 끔), 격추 배너 `killBanner`(600G 이상·3초 간격), 타워 별 뱃지 `starTex`(Lv.2+), 새 외곽선은 ART `A.bird`에서 실제 몸통 크기로(`outl2_`). 3D 원본 백업 브랜치: `backup-3d-v11.1`.

## 테스트 · 밸런스 시뮬레이션
- 로컬 실행: `npx serve .` 후 브라우저로 열기 (파일 더블클릭도 대부분 동작).
- 시뮬레이션(3D 없이 로직만): `python3 tools/sim/run_sim.py normal 20 out_n.json` / `race` → `python3 tools/sim/analyze.py "out_*.json"`
  - 한 판에 약 5초. AI 8명 대전, 속성은 무작위.
  - 보는 지표: 평균 게임 시간, 종족 승률(기대 12.5%), 첫 속성 승률, 타워 효율(피해/투자 골드), 새 효율(탈출 피해/1000골드).
- 🧩 AI 미로(`MZ` 설계도 8종, `MZ_TIER` 난이도별, `mazeOrder`, `mzLen`): 숙련 넓은 가로 뱀 / 어려움 넓은 세로·대각선·빗살 / 헬 가로 뱀·홀수 줄 가로 뱀·혼합·세로 뱀. AI마다 좌우 반전 무작위. 완성 시 길 길이를 알 타워 유지/철거로 미리 계산해 더 긴 쪽이면 첫 미로 건설 때 (3,8) 알 타워 철거(`p.mzDem`). 빈 판 16칸 기준 길이: 가로 뱀 48·혼합 44·넓은 세로 42·세로 40·대각선 36·빗살 35·넓은 가로 30. 일반 AI 7명+미로 AI 1명 60판 우승률: 숙련 17%·어려움 22%·헬 32%(기대 12.5%).
- 🧠 AI 성향 풀 `AIP`(AIS 아래): 속성 조합 10 × 이자형(인컴 투자)·안정형(수비)·밸런스형 30종 + 수상한 알·공작새 치유·올인 타이밍·중장갑 러시·특수 조류 조련사·미로 설계자. 스타일은 폭풍 전략가 유전자를 바탕으로 조금씩 기울임(극단값은 AI끼리 독식). `fav`=좋아하는 새 가중치(buyU). 헬 전용 지능형(`hell:1`, `fl`): 정찰 카운터(`scoutOf`, 다음 사람 대공·광역·CCTV 보고 송출), 킬존 설계자(미로 후보 중 길 덮는 칸에 감속·광역), 재배치 미로(`jugTick`, 깊이 들어온 지상 새 길을 벽으로 막았다 5초 뒤 철거). 매 판 `start()`에서 무작위 7개. 시뮬(스크래치 aisim2.js 방식, 일반 120판): 스타일 13~14%·안정형 8%, 평균 14.8분(예전 11.2분은 수익 스노우볼이 57% 독식해서 짧았던 것). 헬 지능형 12~18%.
- 2026-11-08 기준 결과(640판): 일반 모드 평균 11.8~12.4분, 종족 모드 11.0~11.5분, 종족 승률 10~18%(→ v12.4에서 고르게 맞춤). 드물게 지어지는 조합 타워 효율은 표본이 적어 흔들림이 큼.

## 🌐 온라인 대전 구조 (js/net.js)
- **방장 주도**: 방장 기기만 `step()`을 돌려요. 손님은 명령만 보내고(`NET.cmd`), 방장이 0.1초마다 보내는 상태(`snap`)를 받아 그려요(`S.net==='guest'`면 `step` 대신 `NET.gtick`).
- **연결**: PeerJS 1.5.4(jsDelivr, 실패 시 cdnjs)를 온라인 메뉴를 열 때만 불러와요. 방 id는 `jjak-<5자리 코드>`. 주소에 `?net=local`을 붙이면 같은 브라우저 탭끼리 BroadcastChannel로 연결돼서 테스트할 수 있어요(`python3 -m http.server`로 열어야 해요).
- **자리 회전**: 손님 화면에서는 항상 자기가 0번. 방장 번호 i → 손님 k의 번호 `(i-k+8)%8`. `S.off`도 맞춰서 좌석 번호가 같게 보여요.
- **행동 함수는 플레이어 번호를 받아요**: `actSend/actBuild/actUpg/actDem/actTech/actSkill(pid,…)`. UI 함수(`send/cell/upg0/dem0/pickTech/useSkill0`)는 손님이면 `NET.cmd`, 아니면 `act*(0,…)`. 안내 문구는 `say(pid,msg)`(0번은 toast, 손님은 `NET.tell`).
- 손님이 나가면 그 자리를 AI가 이어받아요. 방장이 탈락해도 방장 기기는 게임을 끝까지 계산해요.
- v12.6 보강(1단계): `ICE`(구글·클라우드플레어 STUN + PeerJS 무료 TURN eu/us — 한국에서 멀어 중계 시 지연 있음). 재연결: 방장이 자리마다 `st.tok` 발급(lobby 메시지 `tok`) → 손님이 끊기면 `gLost`가 3초마다 최대 6번 `gConnect(true)`로 `hello{rejoin,slot}` → 방장이 토큰 맞으면 자리 되돌림(그동안 AI 대리, 이름 끝 🤖) → `start{re:1}`이면 손님은 상태 유지한 채 스냅샷만 다시 받음. 타워 배치는 바뀔 때만 보냄(`st.lastG`, 2초마다 전체). 손님 4명+면 0.15초 간격. 스냅샷 ≈1.7KB(새 50마리) → 손님 7명 약 80KB/s. 테스트: `?net=local` 창 여러 개 + `NET._drop()`(손님 끊김 흉내), `NET._st.bytes`.
- ⚠️ 방장 앱이 백그라운드로 가면(화면 끔·다른 앱) 게임이 멈춤 → 방 만들 때 안내 문구로만 대응. 방장이 나가면 게임 끝(방장 이전은 3단계 서버 때).
- v12.7: 손님 알 연구 — `eggN(p)`/`eggHasP(p,k)`(0번=EGG.n, 온라인 사람 손님=`p.egg`, AI=0으로 AI 밸런스 그대로), 스냅샷 `eg`로 손님 EGG.n 동기화. 손님 미니맵 — 0.3초마다 `ln{b,c,e,k,u}`(내 새가 간 판의 새 위치·판별 진행 수·탈출 `S.escA`·격추 `S.klA`, 키 owner*8+판) + 그 판 타워 배치, 손님이 미니맵 판을 바꾸면 `{t:'lane'}`. 원형 지도 사람 자리 = `NET.nick(i)` 첫 글자(노란색).
- ✅ 실제 기기 연결 확인(2026-11-11, 사용자: PC 방장 + 폰 손님 2인 대전 성공).
- 아직 안 되는 것: 종족 모드 온라인, 손님의 수상한 알 연구소. 3명 이상·모바일 데이터·재연결(비행기 모드)은 실제 기기로 아직 확인 전.
