# 🎬 개발 쇼츠 영상 만들기

실제 3D 게임(`index.html`)을 브라우저에서 돌리면서 한 프레임씩 찍고, 게임에 들어 있는 오리지널 칩튠 BGM·효과음을 녹음해 세로 쇼츠(1080×1920, 30fps MP4)로 만들어요.

## 필요한 것
- Node.js + Playwright(Chromium), Python 3, ffmpeg

## 만들기 (저장소 맨 위 폴더에서)
```bash
node tools/video/make.js          # 전체 촬영 + 소리 녹음 (약 20분)
python3 tools/video/mux.py        # → tools/video/out/jjak_shorts.mp4
```
- `node tools/video/make.js 3` : 3번 장면만 46프레임 미리보기 (`tools/video/out/fr/`에서 확인)
- `node tools/video/make.js 3 full` : 전체 촬영 뒤 3번 장면만 다시 찍기 → 다시 `mux.py`
- Three.js를 인터넷에서 못 받는 환경이면 `THREE_JS=<three.min.js 경로>`, 포트가 겹치면 `PORT=8790`을 앞에 붙여요.
- 결과물(`out/`)은 커밋하지 않아요.

## 고치는 곳
- **장면·자막·길이**: `make.js` 맨 위 `SC` 표 (`d` 초, `cap` [큰 자막, 노란 작은 자막], `<em>`은 노란 글씨)
- **장면별 연출**: `make.js`의 "장면 들어가기"(시작할 때 한 번)와 프레임 루프(`if(n==='…')`)
- **자막 모양·업데이트 기록 목록·구독 버튼**: `overlay.js` (`TL` 배열이 업데이트 기록)
- `clock.js`: 가상 시계. 촬영이 느려도 영상은 정확히 30fps로 부드럽게 나와요.

## 주차별 개발 일지 영상 만들 때
1. 주가 끝나면 태그를 남겨요: `git tag week1` → `git push origin week1`
2. 그 주 커밋 보기: `git log --since=2026-11-08 --until=2026-11-15 --format='%ad %s' --date=short`
3. `SC` 표의 자막을 그 주 내용으로 바꾸고, 예전 화면이 필요하면 `git worktree add ../w1 week1`로 그 시점 코드를 따로 꺼내 촬영해요.

## 주의
- 촬영용 연출이 들어가요: 골드 999만, 새 체력 4~10배, 3번 AI 진영에 직접 깐 뱀 미로, 8인 방 참가자 이름은 가짜예요.
