"""pixelfx 효과를 게임용 스프라이트 시트로 가져오기.
사용: python3 tools/pfx/add.py <pixelfx 폴더> <효과 id...>   예: python3 tools/pfx/add.py ~/pixelfx holy/feather-burst spawn/poof
- pixelfx(MIT, https://github.com/patch-gg/pixelfx)의 tools/render.mjs --sheet로 시트를 뽑고,
- 프레임을 절반(30→15fps)으로 줄이고 256색 PNG로 줄여 assets/pfx/<분류>_<이름>.png 로 저장,
- js/pfx_sheets.js(효과 목록)를 다시 만들어요. 게임에서는 PXS.play('holy/feather-burst', x, y, z)로 재생.
"""
import json, math, os, subprocess, sys
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'assets', 'pfx'); META = os.path.join(OUT, 'sheets.json')
px, ids = os.path.abspath(sys.argv[1]), sys.argv[2:]
meta = json.load(open(META)) if os.path.exists(META) else {}
for fid in ids:
    cat, name = fid.split('/')
    subprocess.run(['node', 'tools/render.mjs', fid, '--sheet'], cwd=px, check=True, stdout=subprocess.DEVNULL)
    src = os.path.join(px, 'records', cat, name)
    m = json.load(open(os.path.join(src, name + '.json')))['meta']['pixelfx']
    im = Image.open(os.path.join(src, name + '.png')).convert('RGBA')
    fw, fh = m['frameSize']; n = m['frames']; step = 2 if m['fps'] >= 24 else 1
    frames = [im.crop(((k % m['columns']) * fw, (k // m['columns']) * fh, (k % m['columns']) * fw + fw, (k // m['columns']) * fh + fh)) for k in range(0, n, step)]
    # 모든 프레임에서 그림이 있는 영역만 남겨 크기 줄이기
    bb = None
    for f in frames:
        b = f.getbbox()
        if b: bb = b if not bb else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    bb = bb or (0, 0, fw, fh); frames = [f.crop(bb) for f in frames]; cw, ch = bb[2] - bb[0], bb[3] - bb[1]
    cols = max(1, min(len(frames), int(math.ceil(math.sqrt(len(frames) * ch / max(1, cw)))))); rows = int(math.ceil(len(frames) / cols))
    sheet = Image.new('RGBA', (cols * cw, rows * ch))
    for k, f in enumerate(frames): sheet.paste(f, ((k % cols) * cw, (k // cols) * ch))
    fn = f'{cat}_{name}.png'
    sheet.quantize(256, method=Image.Quantize.FASTOCTREE).save(os.path.join(OUT, fn), optimize=True)
    meta[fid] = dict(f='assets/pfx/' + fn, n=len(frames), fps=m['fps'] / step, loop=m['loop'], cols=cols, rows=rows, fw=cw, fh=ch,
                     px=m['pivot'][0] - bb[0], py=m['pivot'][1] - bb[1], ofw=fw)
    print(f'{fid}: {len(frames)}프레임 {cw}x{ch} → {os.path.getsize(os.path.join(OUT, fn)) // 1024}KB')
json.dump(meta, open(META, 'w'), ensure_ascii=False, indent=1)
open(os.path.join(ROOT, 'js', 'pfx_sheets.js'), 'w').write('// tools/pfx/add.py가 만드는 파일(직접 고치지 마세요). pixelfx 효과 시트 목록\nconst PFXS_META=' + json.dumps(meta, ensure_ascii=False) + ';\n')
