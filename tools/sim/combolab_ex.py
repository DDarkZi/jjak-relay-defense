"""조합 실험 상태 → 검증용 알파고 목록: python3 tools/sim/combolab_ex.py 상태.json 학습.json [기준.json]
학습.json = 30칸의 현재 부모(학습 결과), 기준.json = 조합마다 '같은 출발 유전자 + 새 전략 끔'(대조군 10명)"""
import json, sys
st = json.load(open(sys.argv[1]))
out = [{'n': s['n'], 'g': s['g'], 'fav': s['fav'], 'fl': s['fl'], 'k': s['k']} for s in st['slots']]
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False)
if len(sys.argv) > 3:
    base = {}
    for s in st['slots']:
        c = s['k'].split('-')[0]
        if c in base: continue
        g = dict(st.get('base') or s['g']); g['tech'] = s['g']['tech']; g['tech2'] = s['g']['tech2']
        for k in ['slSp', 'slInc', 'upSel']: g[k] = 0
        base[c] = {'n': s['n'].rsplit(' ', 2)[0].replace('알파 조합:', '알파 조합 기준:'), 'g': g, 'fav': s['fav'], 'fl': {'rp': 1}, 'k': c + '-0'}
    json.dump(out + list(base.values()), open(sys.argv[3], 'w'), ensure_ascii=False)
print(len(out), 'ok')
