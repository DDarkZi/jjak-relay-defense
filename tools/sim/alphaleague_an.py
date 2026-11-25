"""알파고 리그 분석: python3 tools/sim/alphaleague_an.py 결과.json [이전결과.json]
- 알파고별 평균 등수·우승률, 속성 조합·미로별 등수
- 상위(1~2등) vs 하위(7~8등)의 3·6·9분 인컴·타워 가치·업그레이드·새 지출·저금
- 등수와 각 수치의 상관(스피어만), 앞자리(나에게 새를 보내는 사람)의 공격량과 내 등수
"""
import json, sys
from collections import defaultdict
def load(f): return json.load(open(f))['games']
G = load(sys.argv[1])
def rk(xs):
    s = sorted(range(len(xs)), key=lambda i: xs[i]); r = [0]*len(xs)
    for k, i in enumerate(s): r[i] = k
    return r
def spear(a, b):
    if len(a) < 5: return 0
    ra, rb = rk(a), rk(b); n = len(a); ma = sum(ra)/n; mb = sum(rb)/n
    c = sum((x-ma)*(y-mb) for x, y in zip(ra, rb)); va = sum((x-ma)**2 for x in ra)**.5; vb = sum((y-mb)**2 for y in rb)**.5
    return c/(va*vb) if va and vb else 0
print(f'판 수 {len(G)} · 평균 게임 길이 {sum(g["t"] for g in G)/len(G)/60:.1f}분')
# 1) 알파고별
by = defaultdict(list)
for g in G:
    for p in g['pl']: by[p['n']].append(p['rank'])
print('\n== 알파고별 (3판 이상) 평균 등수 · 우승 · 판')
rows = sorted([(sum(v)/len(v), n, sum(1 for x in v if x == 1), len(v)) for n, v in by.items() if len(v) >= 3])
for a, n, w, c in rows: print(f'{a:4.2f}  우승 {w:2d}/{c:2d}  {n}')
# 2) 속성 조합 / 미로
for key, name in [(lambda p: '+'.join(sorted([p['tech'] or '-', p['tech2'] or '-'])), '속성 조합'), (lambda p: p['mz'] or '-', '미로')]:
    d = defaultdict(list)
    for g in G:
        for p in g['pl']: d[key(p)].append(p['rank'])
    print(f'\n== {name}별 평균 등수 (5번 이상)')
    for a, k, c in sorted([(sum(v)/len(v), k, len(v)) for k, v in d.items() if len(v) >= 5]): print(f'{a:4.2f} ({c:3d}) {k}')
# 3) 상위 vs 하위 시점별
def val(p, t, k):
    s = p['snap'].get(str(t))
    return None if s is None else s[k]
print('\n== 상위(1~2등) vs 하위(7~8등) — 시점별 평균 (살아 있는 사람만)')
for t in [180, 360, 540]:
    for k in ['inc', 'tv', 'lv', 'tn', 'py', 'spT', 'gold', 'life']:
        top = [val(p, t, k) for g in G for p in g['pl'] if p['rank'] <= 2 and val(p, t, k) is not None]
        bot = [val(p, t, k) for g in G for p in g['pl'] if p['rank'] >= 7 and val(p, t, k) is not None]
        if top and bot: print(f'{t//60}분 {k:5s}  상위 {sum(top)/len(top):9.1f}   하위 {sum(bot)/len(bot):9.1f}')
# 4) 상관(6분 시점): 값이 클수록 등수가 좋은가(음수 = 좋음)
print('\n== 6분 시점 수치와 등수의 상관 (음수일수록 "많을수록 잘함")')
for k in ['inc', 'tv', 'lv', 'tn', 'py', 'spT', 'gold', 'life', 'cc']:
    xs, ys = [], []
    for g in G:
        for p in g['pl']:
            v = val(p, 360, k)
            if v is not None: xs.append(v); ys.append(p['rank'])
    print(f'{k:5s} {spear(xs, ys):+.2f}  (n={len(xs)})')
# 5) 새·타워 지출 비중: 상위 vs 하위 (6분)
for k, name in [('sp', '새 지출'), ('tw', '타워 개수')]:
    top, bot = defaultdict(float), defaultdict(float); nt = nb = 0
    for g in G:
        for p in g['pl']:
            s = p['snap'].get('360')
            if not s: continue
            tot = sum(s[k].values()) or 1
            if p['rank'] <= 2:
                nt += 1
                for u, v in s[k].items(): top[u] += v/tot
            elif p['rank'] >= 7:
                nb += 1
                for u, v in s[k].items(): bot[u] += v/tot
    if nt and nb:
        keys = sorted(set(top) | set(bot), key=lambda u: -(abs(top[u]/nt - bot[u]/nb)))[:10]
        print(f'\n== 6분 {name} 비중 차이 큰 것 (상위 % / 하위 %)')
        for u in keys: print(f'{u:12s} {top[u]/nt*100:5.1f} / {bot[u]/nb*100:5.1f}')
# 6) 앞자리 공격량(나에게 새를 보내는 사람의 6분 새 지출)과 내 등수
xs, ys = [], []
for g in G:
    pl = g['pl']
    for i, p in enumerate(pl):
        prev = pl[(i-1) % 8]; s = prev['snap'].get('360')
        if s: xs.append(s['spT']); ys.append(p['rank'])
print(f'\n== 앞자리의 6분 새 지출 ↔ 내 등수 상관 {spear(xs, ys):+.2f} (양수면 앞자리가 많이 보낼수록 내가 불리)')
# 7) 탈락 시각
dies = sorted(p['die'] for g in G for p in g['pl'] if p['die'])
if dies: print(f'\n== 탈락 시각: 첫 탈락 중앙 {sorted(min(p["die"] for p in g["pl"] if p["die"]) for g in G if any(p["die"] for p in g["pl"]))[len(G)//2]/60:.1f}분, 전체 중앙 {dies[len(dies)//2]/60:.1f}분')
# 8) 실험용(ex) 성적
ex = [p['rank'] for g in G for p in g['pl'] if p.get('ex')]
if ex: print(f'\n== 실험용 알파고 평균 등수 {sum(ex)/len(ex):.2f} · 우승 {sum(1 for x in ex if x == 1)}/{len(ex)} (기대값 4.5 · 12.5%)')
