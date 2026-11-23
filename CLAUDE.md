# 새떼 주의보: 짹짹 디펜스 — Claude 작업 수첩 (핵심만)

> 2026-11-20 다이어트: 이 파일은 **매번 꼭 알아야 할 규칙만** 둬요. 지난 실험·버전별 기록 전문은 `docs/history.md`(옛 CLAUDE.md 그대로), 알파고 학습은 `docs/alphago_training.md`, 새 디자인은 `docs/design/README.md`. 필요할 때 그 파일을 grep/읽어서 쓸 것.

## 프로젝트
- 게임 이름 **새떼 주의보: 짹짹 디펜스**(짧은 이름 "새떼 주의보", 저장소는 jjak-relay-defense). 8명이 원형으로 이어진 3D 육각 타일 타워 디펜스 웹게임. 새(유닛)를 다음 사람 판으로 보내고 타워로 막음. 빌드 도구 없는 순수 HTML/CSS/JS + Three.js r128(CDN). 구글 플레이(TWA) 출시 준비 중.
- 로드맵: 유저 제작 영웅 · 새 종류 확장 · 광장 · 8인 온라인 대전 · 출시. 홍보 영상은 `tools/trailer/`.

## 사용자와 일하는 방식
- **답은 항상 한국어로, 초보자 눈높이로.** 사용자는 주로 휴대폰으로 작업·테스트.
- 바꾼 뒤엔 달라진 점을 짧게 정리하고, **폰 화면으로 확인 못 한 것(3D 모양·이펙트)은 솔직히** 말하기.
- 큰 변경 전엔 커밋으로 되돌릴 지점 남기기.
- 변경을 끝내면: ① `index.html` 업데이트 내역 맨 위에 `<li><b>vX.Y</b> …</li>` ② **`docs/history.md` 맨 아래 '🆕 이후 기록'에 한 줄 메모**(CLAUDE.md엔 새 규칙일 때만) ③ 작업 브랜치에 push + `git push origin HEAD:main`.
- 디자인(날개·꼬리·소품)을 바꾸면 `docs/design/README.md` 표 + 전후 비교 그림 추가.
- 알파고 학습·검증을 하면 `docs/alphago_training.md` 학습 이력·총 판 수와 `DIFF.A.d`('지금까지 N판 학습', 지금 17,646) 갱신. 검증 판은 안 셈.
- 출시 질문은 `assets/store/RELEASE_CHECKLIST.md`의 '📍 지금 어디까지'·'🧸 쉽게 이해하기'(도장 비유)로 쉽게 설명하고 표 갱신.
- 회의가 필요하면 `.claude/skills/jjak-meeting`(A 도입 결정·B 알파고 연구·C 디자인 팀). 결정할 때만 열기(비용).
- 🔒 보안: 서명 키(signing.keystore)·비밀번호는 받지도 요청하지도 않기. 사용자 이메일 등 개인정보는 외부·문서에 넣지 않기. MCP·플러그인은 공식 저장소 것만. 커밋 메시지에 모델 이름 넣지 않기.

## 🤖 알파고 원칙 (사용자 확정)
- **알파고는 사람과 같은 돈(보너스 없음)으로, 학습으로만 강해진다.** 약하다고 돈 보너스로 해결하지 말 것.
- 사람 기록(`REC`, 알파고 난이도 판만, localStorage `jjj_rec_v1` 20판)을 받아 `tools/sim/human/`(replay.js·vs7.js·openings.js)로 학습·검증. 학습용/검증용 기록을 나눠 과적합 확인(처음 보는 기록에서도 좋아져야 도입).

## 파일 구조
- `index.html` 화면 마크업(로비·모드·영웅·광장·게임·도감·설명·결과·업데이트 내역) · `css/style.css`
- `js/game.js` — 모든 로직(클래식 스크립트, 전역 공유). 순서: 데이터(`T` 타워·`U` 새·`NM` 이름표·`BAL` 밸런스 `/*BAL*/…/*BALEND*/`·`DIFF`·`AIS`/`AIP` AI 성향·`ALPHA*`) → 게임 로직(`start`, `step`, `dmgU`, `spawn`, `escape`, AI `aiTick`·`buildT`·`buyU`·`aiUp`·`pickTower`) → 3D(`birdMesh2/3`, `towerMesh3`, `sync3`) → `ART` IIFE(`A.bird`, 새별 소품 `accParts`의 `D`, 소품 상자 `PROP`(accGeo 바로 위)) → `SFX`·도감 → 로비·영웅·광장 → `renderTitle()`.
- `js/net.js` 8인 온라인(PeerJS, 방장 주도) · `js/pfx_sheets.js` 픽셀 이펙트 시트(`PXS`) · `js/vendor/GLTFLoader.js`
- `assets/` hex3d 타일(Kenney CC0)·sfx(Kenney CC0)·models(Rodin GLB)·pfx·store · `tools/sim/` 시뮬 · `docs/` 기록

## 꼭 지킬 코딩 규칙·함정
- ⚠️ 한 줄 코드 중간에 `//` 주석 금지(뒤 코드가 다 주석이 됨, 버그 2번) → `/* */` 쓰기.
- 새 좌표계: 새는 **-y 방향**을 보고 z가 위. 몸통 (0,0,.26), 머리 (0,-.3,.46) 반지름 .15(부엉이 .2·병아리 .17), 타조만 큼.
- 한국어 조사는 `jo(단어,'을','를')`. `.ban`은 안내 배너 클래스(종족 금지 카드는 `.rban`).
- `S.sim`이면 사운드·이펙트 건너뜀, 통계 훅은 `S.st` 있을 때만.
- 소품: `PROP.xxx()`는 원점=붙는 점, `_rb`(둥근 상자)·`_ol`(검은 외곽선)·`_fin`(noStone) 사용, `A.bird`의 `put(...)` 블록에서 붙임(눈 위치 `EY`·`EW`, 날개 끝 `wingTip`). 날개 몸 메시는 'wb', 덮깃만 'cv'(조합 새 색칠용). 팀 색 부품은 `userData.noStone`. 환경맵이 없어 metalness 높이면 어둡고 emissive 세면 하얘짐.
- 밸런스 배율은 `applyModeBal`(원래 값 `u.hp0`·`b.d0`·`b.cd0`). 업그레이드 비용 `upc = c × BAL.upk × lv × (1 + BAL.upg × (lv-1))`.
- 난이도 내부 키 ↔ 이름: N 쉬움 · M 일반 · H 숙련 · X 어려움 · Z 헬 · A 🤖알파고(사람과 같은 돈). 옛 기록의 이름은 예전 기준이니 주의.
- 스위치: `HERO_ALL_OPEN=true`(테스트 기간 영웅 전부 열림, 출시 때 false) · `RACE_OPEN=false`(종족 모드 닫음) · `SHOP_OPEN=false`(상점 닫음).
- 세이브 localStorage `jjj_save_v1`(`SV`: coins=깃털, hero{id,name}, diff, 설정들).

## 테스트 방법
- 로컬: `python3 -m http.server 8123`(또는 `npx serve .`). 온라인 테스트는 `?net=local` 창 여러 개.
- Playwright: 크로미움 내장. **서비스워커가 three CDN을 직접 받으므로 `serviceWorkers:'block'`** 필요. 3D 렌더는 `--use-gl=swiftshader`. 이 컨테이너엔 한글 시스템 글꼴이 없어 PIL로 한글을 그리면 깨짐 → 브라우저(Noto Sans KR)로 렌더.
- 시뮬(3D 없이): `tools/sim/report.js 판수 out.json "M,H,X,Z,A"` → `report_an.py`(속성·새·타워·성향 등수), 성향 진화 `tools/sim/evolve.js`(ARCH·HUM·SEEDN 등 환경변수, 자세한 건 docs/alphago_training.md), 사람 기록 대결 `tools/sim/human/vs7.js`. 표본 오차가 크니 한 번 결과로 판단하지 말 것.
- 도감 캡처 다시 뽑기 `tools/codex/cap.js`.

## 🌐 온라인 대전 요약 (js/net.js)
- 방장 기기만 `step()`, 손님은 명령(`NET.cmd`)만 보내고 0.1초 스냅샷을 그림. 손님 화면에선 자기가 0번(번호 회전 `(i-k+8)%8`).
- 행동 함수는 플레이어 번호를 받음: `actSend/actBuild/actUpg/actDem/actTech/actSkill(pid,…)`, UI 함수는 손님이면 `NET.cmd`. 안내는 `say(pid,msg)`.
- 손님이 나가면 AI가 대신, 재연결 토큰 있음. 방장 앱이 백그라운드로 가면 게임 멈춤. 일반 모드만(종족 모드 온라인 X).

## 📝 미뤄 둔 일 (자세한 내용은 docs/history.md 검색)
- 1200G 지상 새: 후보는 `docs/bird_ideas.md`(팀 회의 10종 + 예전 안). 폭주 로드러너는 디자인 시안까지(게임 미반영). **사용자 결정(11-20): 나중에 인스타 릴스로 시청자에게 새 아이디어를 받아 보기**(릴스 대본·투표 문구는 그때 준비).
- 새 알파고 10종을 aiLearn 선생님으로 배정(teach 검증) · AI끼리 게임 시간이 길어짐(후반 마무리 조정) · 사람 기록 약 20판 모이면 학습/검증 나눠 재시험(stgUp 등).
- 중반 긴장감 아이디어(v18.5 회의, 사용자 '나중에 한 번 더 고민'): ① 철새 대이동 예고 이벤트(6분쯤, 8명 모두 같은 무리) ③ Lv4 업그레이드 비용 소폭 상향(upg .2→.25). ②후반 탈출 피해 증가는 미정.
- 너프 후보: 알파 칠면조 철거, 해적갈매기 쏠림. 조정 후보: 악어새(돈 많이 쓰고 효율 낮음), 커피 올빼미 약함, 업그레이드 효율.
- 벽 업그레이드·조합 벽 아이디어(사용자 '더 고민') · 새 재질 후보 10종(사용자 허락 후) · 수익 구조 3단계(보상형 광고 1개 → 깃털 판매, 페이투윈·뽑기 안 함).
- 출시: assetlinks에 Play 앱 서명 키 지문 추가 남음(`DDarkZi.github.io` 저장소). Tripo 무료 생성 모델은 쓰지 않음(권리 문제), Rodin은 OK.
