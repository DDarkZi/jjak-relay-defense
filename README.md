# 🐦 짹짹 릴레이 디펜스

8명이 원형으로 이어 달리는 3D 릴레이 타워 디펜스 웹게임.

- 육각 타일 위에 타워를 지어 막고, 새를 보내 상대 진영을 뚫어요.
- 일반 모드 / 종족 모드(둥지 연합·맹금 군단·황혼 결사·숲의 수호자), 난이도 5단계
- 내 새 영웅 꾸미기, 광장(대화·이모티콘), 도감

## 실행
```bash
npx serve .
```
브라우저에서 열면 바로 플레이할 수 있어요. 빌드 과정은 없습니다.

## GitHub Pages로 폰에서 테스트
Settings → Pages → Branch: `main`, 폴더 `/ (root)` → 저장하면 `https://<아이디>.github.io/<저장소>/` 주소가 생겨요.

## 폴더
- `index.html` · `css/style.css` · `js/game.js`
- `tools/sim/` — 밸런스 시뮬레이션 (Playwright)
- `CLAUDE.md` — Claude Code 작업 메모
