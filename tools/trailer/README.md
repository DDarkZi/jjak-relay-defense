# 홍보 영상(트레일러) 만들기

게임을 가상 시계(requestAnimationFrame 직접 돌리기)로 한 프레임씩 찍어 30fps로 부드럽게 녹화해요. 자막과 엔딩 카드는 HTML로 그리고, ffmpeg로 합쳐요. 배경음악은 `music.py`가 직접 만든 칩튠, 효과음은 `assets/sfx`(Kenney CC0)예요.

1. `python3 -m http.server 8123` (저장소 루트에서)
2. `rt.js`의 three.min.js 경로를 내 환경에 맞추기(없으면 route 줄 삭제 → CDN 사용)
3. `node rec.js` → `sc/<장면>/0000.jpg…` (장면만 다시: `node rec.js fun`)
4. `node caps.js` (자막 PNG·엔딩 카드, `../mag_0.png` = 마스코트 렌더)
5. `python3 music.py` → `bgm.wav`
6. `python3 compose.py` → `out/trailer_16x9.mp4`, `out/trailer_vertical_9x16.mp4`

장면 순서: 새떼 몰려옴 → AI 속보 → 타워 짓기 → 이상한 새 클로즈업(타조·도도·앵무·악어새) → 조합 스킬 → 새 보내기 → 8명 릴레이 → 로비 영웅 → 엔딩 카드 (약 30초)

## 2편(2026-11-17): 더 치열하고 웃기게
`rec2.js`(THREE 환경변수로 three.min.js 경로) → `caps2.js` → `ST=2.5 END=23.57 python3 music.py` → `compose2.py` (모두 같은 작업 폴더에서 실행)
장면: AI 속보 → 치열한 새떼(확대 카메라가 위→아래로 훑음) → 웃긴 새 클로즈업(플라맹독 퉤 · 철거반장 두루미 타워 들기 · 발레리나 타조 점프 · 욕쟁이 앵무새 삐-) → 조합 스킬 4연발(플라즈마 낙뢰·화염 폭풍·절대영도·신경독 전류) → 새 보내기 → 8명 릴레이 → 엔딩 카드 (약 27.6초)
