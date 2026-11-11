# 🎞 pixelfx 효과 가져오기
pixelfx(https://github.com/patch-gg/pixelfx, MIT)의 픽셀 아트 효과 244개 중에서 골라 게임에 넣는 방법.

1. pixelfx 받기: `git clone https://github.com/patch-gg/pixelfx` (또는 Claude Code 플러그인 `pixelfx@pixelfx`의 폴더)
2. 고르기: `node tools/list.mjs 불꽃 같은 영어 단어`로 찾고 `node tools/render.mjs <id>`로 미리보기(`records/<id>/contact.png`)
3. 가져오기: `python3 tools/pfx/add.py <pixelfx 폴더> <id...>`
   - 30fps → 15fps, 빈 테두리 잘라내기, 256색 PNG → 보통 원본의 1/5~1/15 크기
   - `assets/pfx/<분류>_<이름>.png` + `assets/pfx/sheets.json` + `js/pfx_sheets.js`(게임이 읽는 목록) 자동 갱신
4. 게임에서 재생: `PXS.play('<id>', x, BH-y, z, {sc:크기, delay:초, add:빛 섞기, loop:true})` → 돌려받은 값으로 `PXS.stop(a)`
   - 같은 효과는 그림을 한 번만 올리고 여러 개를 동시에 재생해요(`S.sim`이면 재생 안 함).
- 라이선스: `assets/pfx/LICENSE-pixelfx.txt`(MIT 전문 + Sprite Fusion·Hollow Crown 출처). pixelfx의 글꼴은 MIT가 아니라 쓰지 않음.

## 직접 만든 효과
- `tools/pfx/custom/<분류>/<이름>.js`: pixelfx 방식으로 새로 만든 효과(예: `nature/toxic-gas` 둥근 독가스). 가져오려면 pixelfx 폴더의 `src/fx/<분류>/`에 복사한 뒤 add.py 실행.
