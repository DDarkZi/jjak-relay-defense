"""조합×전략 실험 분석: python3 tools/sim/combolab_an.py 리그.json ex40.json
- 조합별: 전략 A/B/C(학습)·기준(새 전략 끔) 평균 등수, 8분 안 탈락, 3분 인컴, 6분 타워 가치
- 전략별: 조합 안에서 기준과 짝지어 비교(몇 조합에서 더 좋았나)
- 배치: 감속 겹침(slOv)·덮은 길(slCov)·느려진 비율(slF)과 등수 상관
- 업그레이드: 9분에 4성 타워 수·4성 비율(전략 B가 실제로 '핵심만' 했나), 독 타워 레벨
- 현재 알파고(ex 아닌 사람)가 있으면 그들과 비교
"""
import json, sys
from collections import defaultdict
G = json.load(open(sys.argv[1]))['games']
EX = {e['n']: e['k'] for e in json.load(open(sys.argv[2]))}
TN = {'fire': '화염', 'ice': '빙결', 'thunder': '뇌전', 'wind': '폭풍', 'dark': '독'}
SN = {'A': '듬성 감속', 'B': '핵심 4성', 'C': '콤보 함정', '0': '기준'}
def cname(c): return '+'.join(TN[x] for x in c.split('+'))
def av(l): return sum(l) / len(l) if l else float('nan')
def rk(xs):
    s = sorted(range(len(xs)), key=lambda i: xs[i]); r = [0] * len(xs)
    for k, i in enumerate(s): r[i] = k
    return r
def spear(a, b):
    if len(a) < 5: return 0
    ra, rb = rk(a), rk(b); n = len(a); ma = sum(ra) / n; mb = sum(rb) / n
    c = sum((x - ma) * (y - mb) for x, y in zip(ra, rb)); va = sum((x - ma) ** 2 for x in ra) ** .5; vb = sum((y - mb) ** 2 for y in rb) ** .5
    return c / (va * vb) if va and vb else 0
P = [p for g in G for p in g['pl']]
def snap(p, t, k):
    s = p['snap'].get(str(t)); return None if not s else s.get(k)
by = defaultdict(list)
for p in P:
    k = EX.get(p['n'])
    by[k if k else 'old'].append(p)
print(f'판 {len(G)} · 평균 {av([g["t"] for g in G])/60:.1f}분')
combos = sorted({k.split('-')[0] for k in EX.values()})
print('\n== 조합별 평균 등수 (A 듬성 감속 / B 핵심 4성 / C 콤보 함정 / 기준) · 학습 3명 평균 · 8분 안 탈락 · 3분 인컴 · 6분 타워 가치')
rows = []
for c in combos:
    tr = [p for s in 'ABC' for p in by.get(c + '-' + s, [])]
    cell = [f"{av([p['rank'] for p in by.get(c+'-'+s, [])]):.2f}({len(by.get(c+'-'+s, []))})" for s in 'ABC0']
    early = av([1 if p['die'] and p['die'] < 480 else 0 for p in tr]) * 100
    rows.append((av([p['rank'] for p in tr]), c, cell, early, av([x for p in tr if (x := snap(p, 180, 'inc')) is not None]), av([x for p in tr if (x := snap(p, 360, 'tv')) is not None]), len(tr)))
for a, c, cell, e, inc, tv, n in sorted(rows):
    print(f'{cname(c):6s} 학습 {a:.2f} (n={n}) | ' + ' / '.join(cell) + f' | 탈락 {e:3.0f}% | 인컴 {inc:5.0f} | 가치 {tv:6.0f}')
print('\n== 전략별 (모든 조합) 평균 등수 · 기준보다 좋았던 조합 수')
for s in 'ABC0':
    L = [p['rank'] for c in combos for p in by.get(c + '-' + s, [])]
    win = sum(1 for c in combos if by.get(c + '-' + s) and by.get(c + '-0') and av([p['rank'] for p in by[c + '-' + s]]) < av([p['rank'] for p in by[c + '-0']]))
    print(f'{SN[s]:6s} {av(L):.2f} (n={len(L)})' + (f' · 기준보다 좋음 {win}/{len(combos)}' if s != '0' else ''))
print('\n== 배치·감속과 등수 상관 (6분·9분, 음수 = 클수록 잘함)')
for t in (360, 540):
    for k in ['slOv', 'slCov', 'slF', 'tv', 'lv', 'py', 'inc']:
        xs, ys = [], []
        for p in P:
            v = snap(p, t, k)
            if v is not None: xs.append(v); ys.append(p['rank'])
        print(f'{t//60}분 {k:5s} {spear(xs, ys):+.2f} (n={len(xs)})')
print('\n== 전략별 9분 모습: 4성 타워 수 · 4성 비율 · 감속 겹침 · 덮은 길 · 느려진 비율 · 전봇대')
for s in 'ABC0':
    L = [p for c in combos for p in by.get(c + '-' + s, []) if p['snap'].get('540')]
    n4 = [sum(v[3] for v in p['snap']['540']['lb'].values()) for p in L]
    tn = [max(1, sum(sum(v) for v in p['snap']['540']['lb'].values())) for p in L]
    print(f'{SN[s]:6s} 4성 {av(n4):4.1f}개 · {av([a/b for a, b in zip(n4, tn)])*100:3.0f}% · 겹침 {av([p["snap"]["540"]["slOv"] for p in L]):.2f} · 길 {av([p["snap"]["540"]["slCov"] for p in L])*100:3.0f}% · 느림 {av([p["snap"]["540"]["slF"] for p in L])*100:3.0f}% · 전봇대 {av([p["snap"]["540"]["py"] for p in L]):.1f} (n={len(L)})')
print('\n== 서브 속성 타워 9분 평균 레벨·개수 (살아 있는 학습 알파고)')
for tid in ['breeze', 'wind', 'twister', 'ice', 'frost', 'bliz', 'flu', 'acid', 'flytrap', 'whiteout', 'miasma', 'frostbane', 'tempest', 'venomvolt', 'pylon']:
    c = [0, 0, 0, 0]; m = 0
    for k, L in by.items():
        if k == 'old': continue
        for p in L:
            s = p['snap'].get('540')
            if s and tid in s['lb']:
                m += 1
                for i in range(4): c[i] += s['lb'][tid][i]
    if sum(c): print(f'{tid:10s} 평균 Lv {sum((i+1)*c[i] for i in range(4))/sum(c):.2f} · 4성 비율 {c[3]/sum(c)*100:3.0f}% · 가진 사람당 {sum(c)/m:.1f}개')
if by.get('old'):
    print('\n== 지금 알파고(기존) vs 학습 30명')
    o = by['old']; t = [p for k, L in by.items() if k != 'old' and not k.endswith('-0') for p in L]
    print(f'기존 {av([p["rank"] for p in o]):.2f} (n={len(o)}) · 학습 30명 {av([p["rank"] for p in t]):.2f} (n={len(t)})')
    d = defaultdict(list)
    for p in P: d[p['n']].append(p['rank'])
    print('상위 15:')
    for a, n, c in sorted((av(v), n, len(v)) for n, v in d.items() if len(v) >= 4)[:15]: print(f'  {a:.2f} ({c}) {n}')
