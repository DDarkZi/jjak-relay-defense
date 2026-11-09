# 짹짹 릴레이 디펜스 — Claude 작업 메모

## 프로젝트 한 줄
8명이 원형으로 이어 달리며 막는 3D 육각 타일 타워 디펜스 웹게임. 새(유닛)를 상대 진영으로 보내고 타워로 막는다. 빌드 도구 없는 순수 HTML/CSS/JS + Three.js r128(CDN).

## 사용자와 작업 방식
- **답변은 항상 한국어로.** 사용자는 주로 휴대폰으로 작업하고 테스트한다.
- 바꾼 뒤에는 무엇이 달라졌는지 짧게 정리하고, 직접 화면으로 확인하지 못한 부분(3D 모양·이펙트)은 솔직히 말한다.
- 큰 변경 전에는 커밋으로 남겨 되돌릴 수 있게 한다.
- 로드맵: 유저별 커스텀 새 영웅 · 새 종류 계속 확장 · 광장(대화·이모티콘) · 나중에 유저 8인 온라인 대전 · 구글 플레이 출시.

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
- 세이브: localStorage 키 `jjj_save_v1` (`SV` 객체: coins, wins, races, hero …). 해금 비용은 테스트용으로 0.
- 모드별 밸런스: `applyModeBal(k)`가 `start()` 때 `BAL.mode[normal|race]`의 `uh`(새 체력)·`td`(타워 공격력)·`as`(공격 간격) 배율을 적용. 원래 값은 `u.hp0`, `b.d0`, `b.cd0`.
- 타워 성격(자동 태그): 공격 간격 ≤0.8초 `rapid`(연사 가속, `BAL.rh/rs`), ≥1.5초 `heavy`(3타 치명타 `BAL.hcr` + 최대체력 `BAL.hmx`), 독 중첩(`addPois`, `BAL.pk/pmax/pdur`, 광역 독은 독연기 `p.clouds`), 화상(`u.bn/u.bv`, 쓰러지면 번짐 `BAL.bsp`).
- 공중 새 인컴은 `BAL.airInc`(0.8)배(데이터 로드 때 `u.inc`에 반영). 결과 표 `resultUI()`(#eres): 진영별 `p.kills`(막은 새)·`p.dealt`(준 피해)·`p.income`·`p.dieT`.
- 업그레이드 비용: `upc = c × BAL.upk × lv × (1 + BAL.upg × (lv-1))` × 종족 배율.
- `S.sim`일 때는 사운드·이펙트를 건너뛴다. 통계 훅은 `S.st`가 있을 때만 동작.
- 만화풍 전투 UI(v11.2): 상점 초상화 `thumbOne/shopThumbTick`(두 프레임에 하나, `DXC['s_…']`), 카드 등급 클래스 `tr-cm/rr/ep/lg`(`tierOf`), 피해 숫자 `dmgPop`(DOM `#dmgl`, `pfS>=2`면 끔), 격추 배너 `killBanner`(600G 이상·3초 간격), 타워 별 뱃지 `starTex`(Lv.2+), 새 외곽선은 ART `A.bird`에서 실제 몸통 크기로(`outl2_`). 3D 원본 백업 브랜치: `backup-3d-v11.1`.

## 테스트 · 밸런스 시뮬레이션
- 로컬 실행: `npx serve .` 후 브라우저로 열기 (파일 더블클릭도 대부분 동작).
- 시뮬레이션(3D 없이 로직만): `python3 tools/sim/run_sim.py normal 20 out_n.json` / `race` → `python3 tools/sim/analyze.py "out_*.json"`
  - 한 판에 약 5초. AI 8명 대전, 속성은 무작위.
  - 보는 지표: 평균 게임 시간, 종족 승률(기대 12.5%), 첫 속성 승률, 타워 효율(피해/투자 골드), 새 효율(탈출 피해/1000골드).
- 🧩 AI 미로(`MZ` 설계도 8종, `MZ_TIER` 난이도별, `mazeOrder`, `mzLen`): 숙련 넓은 가로 뱀 / 어려움 넓은 세로·대각선·빗살 / 헬 가로 뱀·홀수 줄 가로 뱀·혼합·세로 뱀. AI마다 좌우 반전 무작위. 완성 시 길 길이를 알 타워 유지/철거로 미리 계산해 더 긴 쪽이면 첫 미로 건설 때 (3,8) 알 타워 철거(`p.mzDem`). 빈 판 16칸 기준 길이: 가로 뱀 48·혼합 44·넓은 세로 42·세로 40·대각선 36·빗살 35·넓은 가로 30. 일반 AI 7명+미로 AI 1명 60판 우승률: 숙련 17%·어려움 22%·헬 32%(기대 12.5%).
- 2026-11-08 기준 결과(640판): 일반 모드 평균 11.8~12.4분, 종족 모드 11.0~11.5분, 종족 승률 10~18%(맹금 군단이 아직 약간 강함). 드물게 지어지는 조합 타워 효율은 표본이 적어 흔들림이 큼.

## 🌐 온라인 대전 구조 (js/net.js)
- **방장 주도**: 방장 기기만 `step()`을 돌려요. 손님은 명령만 보내고(`NET.cmd`), 방장이 0.1초마다 보내는 상태(`snap`)를 받아 그려요(`S.net==='guest'`면 `step` 대신 `NET.gtick`).
- **연결**: PeerJS 1.5.4(jsDelivr, 실패 시 cdnjs)를 온라인 메뉴를 열 때만 불러와요. 방 id는 `jjak-<5자리 코드>`. 주소에 `?net=local`을 붙이면 같은 브라우저 탭끼리 BroadcastChannel로 연결돼서 테스트할 수 있어요(`python3 -m http.server`로 열어야 해요).
- **자리 회전**: 손님 화면에서는 항상 자기가 0번. 방장 번호 i → 손님 k의 번호 `(i-k+8)%8`. `S.off`도 맞춰서 좌석 번호가 같게 보여요.
- **행동 함수는 플레이어 번호를 받아요**: `actSend/actBuild/actUpg/actDem/actTech/actSkill(pid,…)`. UI 함수(`send/cell/upg0/dem0/pickTech/useSkill0`)는 손님이면 `NET.cmd`, 아니면 `act*(0,…)`. 안내 문구는 `say(pid,msg)`(0번은 toast, 손님은 `NET.tell`).
- 손님이 나가면 그 자리를 AI가 이어받아요. 방장이 탈락해도 방장 기기는 게임을 끝까지 계산해요.
- 아직 안 되는 것: 종족 모드 온라인, 손님의 수상한 알 연구소, 실제 PeerJS 연결은 이 개발 환경에서 테스트 못 함(외부 접속 차단).
