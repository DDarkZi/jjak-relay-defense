# 새떼 주의보: 짹짹 디펜스 (옛 이름: 짹짹 릴레이 디펜스) — Claude 작업 메모

## 프로젝트 한 줄
- 게임 이름: **새떼 주의보: 짹짹 디펜스**(2026-11-10 변경, 홈 화면 짧은 이름 "새떼 주의보"). 저장소 이름은 그대로 jjak-relay-defense.
8명이 원형으로 이어 달리며 막는 3D 육각 타일 타워 디펜스 웹게임. 새(유닛)를 상대 진영으로 보내고 타워로 막는다. 빌드 도구 없는 순수 HTML/CSS/JS + Three.js r128(CDN).

## 사용자와 작업 방식
- 📚 **자세한 개발·실험 기록은 `docs/dev_history.md`** (CLAUDE.md는 한 줄 요약만 — 메시지마다 읽혀서 짧게 유지). 새 기록은 거기에 쓰고 여기엔 한 줄. 알파고 학습은 `docs/alphago_training.md`.
- **답변은 항상 한국어로.** 사용자는 주로 휴대폰으로 작업하고 테스트한다.
- 출시(구글 플레이) 관련은 사용자가 어려워함: 물어보면 `assets/store/RELEASE_CHECKLIST.md`의 '📍 지금 어디까지'와 '🧸 쉽게 이해하기'(도장 비유)를 바탕으로 **초보자 눈높이로 다시 설명**하고, 진행할 때마다 '지금 어디까지' 표를 갱신할 것.
- 바꾼 뒤에는 무엇이 달라졌는지 짧게 정리하고, 직접 화면으로 확인하지 못한 부분(3D 모양·이펙트)은 솔직히 말한다.
- 큰 변경 전에는 커밋으로 남겨 되돌릴 수 있게 한다.
- 로드맵: 유저별 커스텀 새 영웅 · 새 종류 계속 확장 · 광장(대화·이모티콘) · 나중에 유저 8인 온라인 대전 · 구글 플레이 출시.
- 홍보 영상은 나중에 Remotion(또는 HyperFrames)으로 게임 녹화 + 자막 트레일러를 만들기로 함. 지금은 보류.

## 📝 나중에 할 일 (사용자와 합의해 미뤄 둔 것)
- 🐣 마스코트 AI 등장 → 자세히 `docs/dev_history.md` [H1]
- 🐦 고급 새 2종 — 철거반장 두루미 `demcrane`(타워 들고 다님)·시조새 `archaeo`(체력 절반에 착지) → 자세히 `docs/dev_history.md` [H2]
- 🎬 홍보 영상: 초안 완성(2026-11-10, 약 30초, 가로·세로). 만드는 법 `tools/trailer/README.md`(가상 시계 프레임 녹화 + 자막 PNG + ffmpeg + 칩튠). 다듬기는 나중에.
- 💰 수익 구조 — 꾸미기 상품은 안 팖·영웅에 집중, 보상형 광고 하나(깃털 2배)만, 페이투윈·랜덤 뽑기 없음 → 자세히 `docs/dev_history.md` [H3]
- 🐣 유저 제작 영웅 — `CHERO` 제작 영웅(한 달 판매·깃털 500)·영웅 제작권 ₩5,000(`hero_make.html` 약관) → 자세히 `docs/dev_history.md` [H4]
- 📲 구글 플레이 출시: 단계별 안내 `assets/store/RELEASE_CHECKLIST.md`. ⚠️ assetlinks.json은 도메인 맨 위(`ddarkzi.github.io/.well-known/`)여야 해서 사용자 사이트 저장소 `DDarkZi.github.io`(만듦, `/home/user/ddarkzi.github.io`, 첫 페이지는 게임으로 이동, assetlinks에 업로드 키 지문 넣음(패키지 io.github.ddarkzi.jjakdefense), Play 앱 서명 키 지문은 아직). Play 앱 서명 키 SHA-256도 함께 넣기. 앱 아이콘 = 마스코트 AI(2026-11-10 교체, 원본 렌더는 ai_mascot.glb + 경고 빛줄기·새떼 실루엣 배경).
- 🧠 AI 밸런스 v12.2(2026-11-10) 끝: 스타일별 승률 고르게 맞춤(아래 '경제 밸런스' 참고). 새 성향을 넣으면 같은 방식으로 다시 시뮬.
- 🦤 Tripo로 만든 도도새 3D: 약관 확인함(2026-11-10, 2025-07-11판). **무료 사용자 결과물은 Tripo가 모든 권리를 가짐(5.2.1)** → 게임에 쓰지 않기로. 유료 사용자는 권리를 가짐(5.2.2). 쓰려면 유료 기간에 다시 생성하거나, 제한 없는 Hyper3D Rodin으로 만들기.

- ✅ **새 개편 묶음 v13.1** → 자세히 `docs/dev_history.md` [H6]

- 🧱 **벽 업그레이드·조합 벽 아이디어** → 자세히 `docs/dev_history.md` [H7]

## 파일 구조
- `index.html` — 3D 버전 화면 마크업 / `2d.html` — 2D 버전(같은 마크업 + `js/r2d.js`, `manifest-2d.webmanifest`)
  - 마크업 구성(로비, 모드 선택, 영웅 꾸미기, 광장, 게임, 도감, 설명, 결과)
- `css/style.css` — 전체 스타일 (로비·모드 카드·광장은 파일 뒤쪽)
- `js/r2d.js` — 🖼 2D 화면(비스듬한 쿼터뷰 캔버스). game.js 다음에 로드. 2D 모드일 때만 `init3/resize/sync3/beam/beamU/skFx`를 바꿔치기하고, `ART`의 게임용 이펙트(shoot·die·crit…)를 2D로 돌려요. 로직은 3D와 공유. **2D 전용 주소 `2d.html`에서만 로드**(index.html은 3D 전용). 2d.html은 index.html 복사본 + r2d.js 한 줄이라 index.html 마크업을 바꾸면 2d.html도 같이 바꿔야 해요. 세이브는 둘이 공유. 2d.html은 Three.js 대신 `js/three-stub.js`(아무것도 안 하는 빈 THREE)를 불러오고, r2d.js가 로비(`lobbyFrame`)·영웅 꾸미기(`heroSpr`, 모자·얼굴 `heroDeco2`)·광장(`pzBuild/pzBird/plazaFrame`)·도감 사진(`dxThumbs`)까지 2D 캔버스로 바꿔요. 그래서 2D에서 새 3D 코드를 직접 부르는 기능을 추가하면 2D용도 같이 만들어야 해요. 새 모양 표 `F`, 타워 분류 `TCAT`. 그림 파일은 `img/2d/`(README 참고, `sprites.json`에 id 등록).
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
- 🤖 **알파고 모드** — `tools/sim/evolve.js` 자기 대국 진화 → `ALPHA`, 난이도 A=🤖알파고 → 자세히 `docs/dev_history.md` [H9]
- 🎓 **알파고 2차 학습·가르치기** → 자세히 `docs/dev_history.md` [H10]
- 🎓 **성향별 알파고** → 자세히 `docs/dev_history.md` [H11]
- 🏴‍☠️ **해적 선장 성향** → 자세히 `docs/dev_history.md` [H12]
- ☠️⚡ **독뇌전 배치법·알파 독뇌전** → 자세히 `docs/dev_history.md` [H13]
- 🔥 **알파 불사조 테러**(2026-11-11 사용자 전략): `ARCH=fire`(화염 고정·tech2는 화염 말고·uShare .72~1·uTier .75~1·keep 100~300·불사조 fav≥2) 3세대 328판: 평균 4.6→5.3~5.6, 챔피언 화염+폭풍(uShare .91, 불사조 2). AIP '알파 불사조 테러', 이름에 증기·플라즈마·화염폭풍·역병(화염 조합) AI는 이 운영을 배움. 🎨 알파 성향 뽑기(어려움·헬·알파고)는 속성 조합이 안 겹치는 것부터(빙결+폭풍 몰림 방지) → 알파고 모드에 독뇌전·화염폭풍·빙결화염·화염뇌전이 매 판 섞여 나옴.
- 🎨 **속성 조합 10개 알파고** → 자세히 `docs/dev_history.md` [H14]
- 💰 **AI 돈 보너스 축소 + 3세대 알파고** → 자세히 `docs/dev_history.md` [H15]
- 🔧 **배운 AI 게임 시간·대형 새·두루미 길 뚫기** → 자세히 `docs/dev_history.md` [H16]
- 🎚 난이도(2026-11-11 사용자 요청 '한 단계씩 내리고 헬보다 어려운 것 추가, 쉬움 없앰'): **내부 키는 그대로, 이름만 이동** — N=🐣쉬움(옛 일반)·M=🐥일반(옛 숙련, 기본값 `diff='M'`)·H=🐓숙련(옛 어려움)·X=🦅어려움(옛 헬, 지능형 AI 섞임)·**Z=🔥헬(새로 만듦: g950·i70·tick.5·im1.25·uh1.15, 지능형 3종 꼭 포함, 미로 X와 같음)**. 옛 E(쉬움) 삭제. AI끼리 시뮬 평균: X 9.7분·Z 8.3분(48판). 메모·시뮬 기록의 옛 이름(헬=X 등)은 이전 기준이니 주의.
- 🛡 보호막 → 자세히 `docs/dev_history.md` [H17]
- 🏞 광장 → 자세히 `docs/dev_history.md` [H18]
- 🎨 새 재질 상자 → 자세히 `docs/dev_history.md` [H19]
- 🎨 팀 표시: 지상 새의 팀 색 목 고리는 사용자 요청으로 뺌(2026-11-11, '디자인을 망침'). 남은 팀 색은 공중 새 날개 끝·꼬리 깃(`birdMesh2`의 `oc`). → 대신 **새 체력바 색 = 보낸 사람 팀 색**(`PC[u.owner]`, 길이가 체력, 보호막이면 흰색 쪽으로 밝힘, sync3).
- 새 좌표계: 새는 **-y 방향**을 바라보고 z가 위. 몸통 중심 (0,0,0.26), 머리 (0,-0.3,0.46) 반지름 0.15(부엉이 0.2, 병아리 0.17), 타조만 키가 큼(z0 0.6, 머리 z 1.3).
- 🐥 게임 속 미니 영웅 → 자세히 `docs/dev_history.md` [H20]
- 🌐 8인 대전 = 일반 모드만. 방장이 방에서 AI 난이도 선택(`#ndif`, lobby 메시지 `diff`, 손님은 보기만). 🏰 종족 모드는 베타로 따로: 모드 카드 베타 표시, 누르면 종족 선택 창 `#racem`.
- 🪶 영웅 해금: `HERO_FREE`=병아리·튜브 오리·황제펭귄 무료, 나머지 `heroPrice`(새 가격 <300:10·<700:20·<2000:30·그 이상 50🪶), `SV.heroes`, `heroOwn`. **`HERO_ALL_OPEN=true`(테스트 기간 전부 열림) → 출시 때 false로**. 꾸미기에서 잠긴 새는 구경 가능, 닫으면 마지막 보유 영웅으로 되돌림(`hOwned`).
- 세이브: localStorage 키 `jjj_save_v1` (`SV` 객체: coins, wins, races, hero …). 종족 해금 30코인(종족 모드 자체 해금은 0, 첫 종족 무료). 깃털(코인)은 우승 때 난이도별 쉬움N2·일반M3·숙련H4·어려움X6·헬Z10, 진 판도 등수대로 2~4등 2개·5~8등 1개(`rewardUI`, 등수=탈락 순간 살아 있는 수+1, `S.rwd`로 한 판 한 번). 🎨 꾸미기(색·모자·얼굴 `HATS/FACES/HCOL`·`heroDeco`)는 2026-11-11 사용자 요청으로 완전히 삭제 — 영웅 = 새 종류 + 이름(`SV.hero={id,name}`, 온라인 hello도 `{id}`만).
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
- 🎞 pixelfx 시트(`PXS`, 2026-11-11) — `PXS.play(id,x,BH-y,z,{sc,delay,add,loop})`, 시트 추가 `tools/pfx/add.py`, 사용법 `tools/pfx/README.md` → 자세히 `docs/dev_history.md` [H22]
- 픽셀 이펙트 `PFX`(game.js 끝, pixelfx 방식을 참고해 직접 구현, 외부 코드 실행·복사 없음): 작은 캔버스에 점을 찍어 NearestFilter 스프라이트로 띄움. `PFX.strike(x,y,z,delay)`=플라즈마 낙뢰 시제품, `sync3`에서 `PFX.update(dt)`. 다른 조합 스킬은 아직 기존 파티클(`A.skill`).
- 💬 말하는 새(도도·앵무, `talk`): 끝까지 가는 동안 진행 25·50·75%에서 한 마디씩 3번(1.6초), 화면 동시 최대 3개(`sync3.tA`). 타조는 말 안 함(피루엣만).
- 🗞 뉴스새 마스코트 'AI'(NPC, 조류 인플루언서) → 자세히 `docs/dev_history.md` [H23]
- 🪴 꿀꺽 파리지옥(`flytrap`, 독 속성 3번째, 260G, 지상 전용, cd1.4): 머리 수=레벨(최대 3)만큼 지상 새를 물어 `u.stun`·`u.held`로 1.6초(Lv3+ 1.8초, 체력 2000+ 새는 절반) 묶고 독. Lv.4는 체력 12% 이하면 꿀꺽(`A.gulp`). 이펙트 `A.vine`(덩굴 줄기)·`PFX 'chomp'`(픽셀 턱, `play(...,dur)`로 길이 맞춤). 박쥐 둥지는 공용 타워로 옮김. 90판 시뮬: 피해 효율 0.68(묶기가 본업), 독 첫 속성 승률 11.6%.
- 🔢 피해 숫자 `dmgPop`: 치명타 또는 최대 체력 12%(최소 60) 이상만, 90ms 간격. ⚠️ 한 줄 코드 중간에 `//` 주석을 넣으면 뒤 코드가 다 주석이 됨(두 번 버그 남) — `/* */`를 쓰거나 줄을 바꿀 것.
- 만화풍 전투 UI(v11.2): 상점 초상화 `thumbOne/shopThumbTick`(두 프레임에 하나, `DXC['s_…']`), 카드 등급 클래스 `tr-cm/rr/ep/lg`(`tierOf`), 피해 숫자 `dmgPop`(DOM `#dmgl`, `pfS>=2`면 끔), 격추 배너 `killBanner`(600G 이상·3초 간격), 타워 별 뱃지 `starTex`(Lv.2+), 새 외곽선은 ART `A.bird`에서 실제 몸통 크기로(`outl2_`). 3D 원본 백업 브랜치: `backup-3d-v11.1`.

## 테스트 · 밸런스 시뮬레이션
- 로컬 실행: `npx serve .` 후 브라우저로 열기 (파일 더블클릭도 대부분 동작).
- 시뮬레이션(3D 없이 로직만): `python3 tools/sim/run_sim.py normal 20 out_n.json` / `race` → `python3 tools/sim/analyze.py "out_*.json"`
  - 한 판에 약 5초. AI 8명 대전, 속성은 무작위.
  - 보는 지표: 평균 게임 시간, 종족 승률(기대 12.5%), 첫 속성 승률, 타워 효율(피해/투자 골드), 새 효율(탈출 피해/1000골드).
- 🧩 AI 미로(`MZ` 설계도 8종, `MZ_TIER` 난이도별, `mazeOrder`, `mzLen`): 숙련 넓은 가로 뱀 / 어려움 넓은 세로·대각선·빗살 / 헬 가로 뱀·홀수 줄 가로 뱀·혼합·세로 뱀. AI마다 좌우 반전 무작위. 완성 시 길 길이를 알 타워 유지/철거로 미리 계산해 더 긴 쪽이면 첫 미로 건설 때 (3,8) 알 타워 철거(`p.mzDem`). 빈 판 16칸 기준 길이: 가로 뱀 48·혼합 44·넓은 세로 42·세로 40·대각선 36·빗살 35·넓은 가로 30. 일반 AI 7명+미로 AI 1명 60판 우승률: 숙련 17%·어려움 22%·헬 32%(기대 12.5%).
- 🧠 AI 성향 풀 `AIP`(AIS 아래) — `AIP` 성향 풀(속성 조합 10×성향 + 특수), `fav`=좋아하는 새 → 자세히 `docs/dev_history.md` [H24]
- 2026-11-08 기준 결과(640판): 일반 모드 평균 11.8~12.4분, 종족 모드 11.0~11.5분, 종족 승률 10~18%(→ v12.4에서 고르게 맞춤). 드물게 지어지는 조합 타워 효율은 표본이 적어 흔들림이 큼.

## 🎬 개발 쇼츠 영상 (tools/video)
- `node tools/video/make.js` → `python3 tools/video/mux.py` 로 3D 게임을 찍어 세로 쇼츠 MP4를 만들어요(README 참고). 장면·자막은 `make.js`의 `SC` 표. 게임 함수 이름(`start`, `actBuild`, `dxOpen`, `openPlaza` 등)을 직접 부르니, 이름을 바꾸면 영상 스크립트도 같이 고쳐야 해요.
- 사용자는 나중에 주차별(1주차·2주차) 개발 일지 영상도 원해요. 주 끝에 `weekN` 태그를 남기면 좋아요.
- 🦥 **빌딩늘보 인스타(@tree_null.vo) 관련 기록은 별도 저장소 `DDarkZi/tree-null-vo`** (개발 일지 `devlog/`, 프로필 캐릭터 `brand/`, 게시물 `posts/`). 일지는 그쪽에 써요.
- ✅ 2026-11-17 사용자가 이 게임을 늘보 이야기에 넣었어요: 신입 **화캉스늘보**(게임 개발 부서, 화장실 근무)가 만드는 게임 『새떼 주의보: 짹짹 디펜스』. 늘보 세계에서는 **지금 만들어지는 중**이라, 이 저장소 `git log`를 순서대로 한 단계씩 꺼내 **2일마다 1편** 릴스로 보여줘요(자막에 정확한 날짜는 안 씀). 계획서: `DDarkZi/tree-null-vo`의 `reels/jjak-devlog/PLAN.md`.
- 영상 자막·마지막 화면을 늘보 콘셉트로 바꾸는 건 **사용자와 같이 보고 정하기로 함 — 먼저 수정하지 말 것.**
- `brand/`의 안전모 마스코트(`sloth.js`)는 게임용 연습 시안이에요.

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
- 🥚 **알 단단해지기 + 종합 리포트** → 자세히 `docs/dev_history.md` [H26]
- ❄️🌪 **약한 타워 공격력 1.3배**(2026-11-15 사용자 요청, v13.9): 얼음 알 d15→20·산들 풍차 14→18·비눗방울 기계 30→39·눈폭풍 소용돌이 6→8. ⚠️ 시뮬 검증은 사용자 요청으로 나중에 몰아서(report.js로 효율 4.1·3.3·4.5·5.0이 얼마나 오르는지·빙결/폭풍 등수 확인).
- 🤖 **v14.0 AI 개편·특수 알파고 6종** → 자세히 `docs/dev_history.md` [H27]
- 🏁 **결과 화면 v14.1**(2026-11-15): `endBtnDelay()`(finish·specEnd 끝에서 호출) — again·home·spec 버튼 visibility hidden 4초 + `#ewait` '⏳ N초 뒤 버튼이 나와요'. 💰 `p.earn` = 인컴 틱 + 처치 보상 + 약탈(loot) + CCTV 벌금(시작 돈·철거 환급 제외), 결과 표 '💰 총 획득' 열 + `#eP` 요약. 온라인 손님은 스냅샷 pl 배열 13번째 값으로 받음.
- 🧠 **v14.2 똑똑한 수비** → 자세히 `docs/dev_history.md` [H28]
- 🦉 **v14.3 CCTV·미로 수정** → 자세히 `docs/dev_history.md` [H29]
- 🧱 **v14.4 수비 배치 다양화** → 자세히 `docs/dev_history.md` [H30]
- 🧠 **v14.5 상황 판단·실패 학습·유동 수비** → 자세히 `docs/dev_history.md` [H31]
- 🏗 **v14.6 두루미 대응·AI 타워 한도** → 자세히 `docs/dev_history.md` [H32]
- 🏴‍☠️ **v14.7 북극해적갈매기 재디자인** → 자세히 `docs/dev_history.md` [H33]
- 🥚 **v14.8 알·부화**(2026-11-17 사용자 요청): 부화 조건 판 중간(u.y>BH*.45, 미로에서 거의 못 감) → 보낸 지 `BAL.hatchT`(2)초(`u.ha` 누적). 알 보너스 상한 없앰(`eggCap` 1e9, 1개마다 +1 계속). 부화 병아리 최대 체력 = 병아리 기본 + 알 보너스(`u.eb`)×`BAL.eggHatchK`(2), 남은 비율 그대로. 속성 2개면 `hatchOf`가 부화마다 둘 중 무작위. 시험: 알 160개 → 알 체력 342, 아이스 병아리 최대 684+320.
- 🧱 **v14.9 빈칸 채우기 수정** → 자세히 `docs/dev_history.md` [H34]
- 🐣 **v15.0 부화 6초·찌릿 병아리**(2026-11-17 사용자 요청): `BAL.hatchT` 2→6초. 찌릿 병아리(hatch_thunder) `zap`(타워 마비) 삭제, 속도 1.8→2.4(부화 병아리 중 가장 빠름, 맥반석 2.0), 기절 면역은 유지.
- 🔒 **v15.1 종족 모드·상점 닫기**(2026-11-17 사용자 요청): `RACE_OPEN=false`·`SHOP_OPEN=false`(game.js SHOP_ITEMS 위). 종족 모드 카드는 `#mode` 밖 '✓ 선택 완료' 버튼 아래 `#raceb`(회색·disabled·'준비 중'), setMode('race')·tryStart가 막고 일반 모드로. 상점은 버튼 '준비 중'·disabled, openShop 안내, shopBuy 막음(shopRestore 지급은 그대로). 다시 열려면 두 값을 true로.
- 🦇 **v15.2 박쥐 둥지 삭제**(2026-11-17 사용자 요청): T 배열에서 `bat` 항목만 뺌(그림 TD.bat·발사체·NM·EVO는 id로 걸린 것이라 남겨 둠, 쓰이지 않음). AI는 pickTower가 T에서 고르므로 자동으로 안 지음(시뮬 6판 오류 0·bat 0). 독 속성 새 아이디어(흡혈박쥐새 대체 후보: 피토휘·포자 메추라기·약사 황새)는 사용자 선택 대기.
- 🦩 **v15.3 플라맹독** → 자세히 `docs/dev_history.md` [H35]
- 🧱 **v15.4 후반 헛손질 수정** → 자세히 `docs/dev_history.md` [H36]
- 💀 **v15.5 탈락 판 통과** → 자세히 `docs/dev_history.md` [H37]
- 🧬 **v15.6 알파고 5세대 학습** → 자세히 `docs/dev_history.md` [H38]
- 🖼 **스토어 이미지 다시 뽑기** → 자세히 `docs/dev_history.md` [H39]
- 🎬 **홍보 영상 2편**(2026-11-17 사용자 요청 '더 웃기고 재밌게, 치열한 장면·특수효과·새가 잘 보이고 스킬 효과'): `tools/trailer/rec2.js`·`caps2.js`·`compose2.py` + `music.py`에 ST·END 환경변수. 27.6초, 세로 1080×1920·가로 1920×1080(영상 파일은 저장소에 안 넣음, 스크래치 tr/out). 두루미 클로즈업은 카메라 거리 6.8(가까우면 머리 위 타워가 잘림), 들고 가는 타워는 별 뱃지 정도만 보임. 마스코트 엔딩 카드는 assets/ui/ai.png(256px라 작게 씀).
- 🎯 **v15.7 초반 배치(opening)** → 자세히 `docs/dev_history.md` [H40]
- 📼 **v15.8 알파고 플레이 기록** → 자세히 `docs/dev_history.md` [H41]
- 🤖 **알파고 원칙**(2026-11-18 사용자 확정): **알파고는 공평하게(사람과 같은 돈, 보너스 없음) 학습으로만 강해진다.** 사람에게 약하다고 돈 보너스로 해결하지 말 것. 👤 사람 기록 5판(사용자, 알파고 5전 5승) 분석: 알 대량(279~600)·업글 0~183·벽 거의 0·출구 쪽 공격 타워 줄 등 판마다 달랐고 공통은 '3분 뒤 거의 안 뚫림'. AI에게 알 몰아 보내기(fav egg 3·6)를 시키면 4.58→5.08→5.67등, 사람형 미로(hbot: 벽 없는 공격 타워 줄 가로 뱀을 아래부터)는 A 5.03 vs 3.97·X 4.67 vs 4.33으로 더 약해짐(코드 되돌림) → 한 가지 비법이 아니라 상황 대응. 도구: `tools/sim/human/replay.js 기록.json 판수 난이도`(기록을 같은 시간에 그대로 재생하는 봇, 돈 부족·막힘이면 90초까지 대기) → 5판 기록 재생 봇이 알파고 7명 상대 **20판 중 9승·평균 3.45등**(기록5만 7~8등) = 좋은 스파링 상대. `evolve.js`에 `HUM=기록.json HUMK=판당 재생 봇 수`(evalCand가 후보가 아닌 자리를 사람 재생 봇으로, P.ai=false·cfg=null로 act*(h,…) 실행) — POP 6 1세대 시험 동작 확인. ⚠️ POP<5면 SEEDA 시작 개체가 비어 오류(pick=POP-4). 다음: 사용자 기록 4판 더(총 9판, 게임은 최근 10판 보관이라 다음 내보내기 파일에 다 들어 있음) → HUM 진화로 알파고 학습 → 재생 봇 상대 승률·실제 사람 판으로 검증.
- 📱 **v15.9 폰 조작 1차** → 자세히 `docs/dev_history.md` [H43]
- 📱 **v16.0 폰 조작 2차** → 자세히 `docs/dev_history.md` [H44]
- 🗺 **v16.1 설치 안내·관전 미니맵** → 자세히 `docs/dev_history.md` [H45]
- 🧑‍🤝‍🧑 **v16.2 알파고 사람 기록 학습** → 자세히 `docs/dev_history.md` [H46]
- 🛡💸 **안전 송출 실험** → 자세히 `docs/dev_history.md` [H47]
- ⏱ **v16.3 알파고 행동 수**(2026-11-18 사용자 요청 '분당 77번'): `DIFF.A.tick` .4→.3 + `DIFF.A.act`=2(aiTick 루프 기본 횟수 `DIFF[diff].act||1`). 측정(apm.js 6~8판): 기준 57~58 → act2 69 · act2+tick.3 72·67 · act3+tick.3 62 · tick.2/.25 67~68 → **약 70에서 멈춤(돈이 바닥나 할 일이 없어서, 판단 횟수는 병목 아님)**. 77+로 가려면 싼 새를 여러 번 나눠 보내는 등 전략 변화가 필요. 재생 봇 28판: 우승 1·5.07등(기준 1·5.32, 강도 그대로).
- 👤 **사람형 단계 수비·꾹 누르기 실험** → 자세히 `docs/dev_history.md` [H48]
- 👆 **v16.4 알파고 꾹 누르기 = 남는 돈 전부** → 자세히 `docs/dev_history.md` [H49]
- 👥 **사람 7 + 알파고 1 시뮬** → 자세히 `docs/dev_history.md` [H50]
- 🧬 **알파고 학습 판 수 표시** → 자세히 `docs/dev_history.md` [H51]
- 🪺 **개발 회의 팀 스킬**(2026-11-19 사용자 요청, affaan-m/everything-claude-code dev-team(MIT) 방식 참고): 저장소 `.claude/skills/jjak-meeting/SKILL.md` — A 도입 결정 회의(플레이어 대표·통계 검증관·밸런스 디자이너·개발QA, 3명 이상 같은 걱정이면 보류, 알파고 원칙) · B 알파고 성장 연구팀(학습 설계자·사람 분석가·실험 설계자·데이터 담당 → 실험 계획표). 팀원은 Agent 병렬·분석만, 종합·결정·기록은 메인. 결정할 때만 열기(비용).
- 🗳 **첫 도입 결정 회의** → 자세히 `docs/dev_history.md` [H52]
- 💸 **분당 새 송출 금액(사람 vs 알파고)** → 자세히 `docs/dev_history.md` [H53]
- 🧬 **연구팀 회의** → 자세히 `docs/dev_history.md` [H54]
- 📘 **알파고 학습 정리 문서**(2026-11-19 사용자 요청 '나중에 늘보스튜디오에 줄 것'): `docs/alphago_training.md`(원칙·AI 구조·유전자 표·학습 이력 표·실패 교훈·사람 vs 알파고 수치·도구·회의·다음 할 일). **새 학습·검증을 할 때마다 이 문서의 '학습 이력'과 총 판 수를 함께 고칠 것.** 개인정보(이메일 등) 넣지 말 것.
- 🧪 **업글 시작·4단계 학습 → 미적용** → 자세히 `docs/dev_history.md` [H55]
- 🦃 **초반 인컴 오프닝 7종 비교** → 자세히 `docs/dev_history.md` [H56]
- 🦃 **v16.6 알파고 오프닝 8종** → 자세히 `docs/dev_history.md` [H57]
- 🔬 **연구팀 회의** → 자세히 `docs/dev_history.md` [H58]
- 📋 **v16.7 기록 보강·알 원인 확인·광역 타워 회의** → 자세히 `docs/dev_history.md` [H59]
- 🥚 **v16.8 알 대응·감속 선호 유전자** → 자세히 `docs/dev_history.md` [H60]
