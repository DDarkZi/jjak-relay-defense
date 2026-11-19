# 분 단위 수비 통계: python3 tools/sim/minute_an.py layout결과.json
# 배치 계열(가로·세로·혼합)별로 분마다 타워 수·막은 비율(1-샌 새/들어온 새)·인컴, 그리고 상위 2등 안 AI의 분별 타워 수(=학습할 목표 곡선)
import json,sys,collections as C,statistics as st
R=json.load(open(sys.argv[1]))
FAM={'hsnake':'가로','snake2':'가로(2줄)','snake3':'가로(3줄)','vsnake':'세로','wvsnake':'세로','mix':'혼합','hvmix':'혼합(두께)','snake23':'가로(2·3줄)','mixlane':'혼합','lane':'통로','dlane':'통로'}
by=C.defaultdict(lambda:C.defaultdict(lambda:{'t':[],'in':0,'lk':0,'inc':[]}));top=C.defaultdict(list);rk=C.defaultdict(list)
for g in R:
  for p in g['pl']:
    f=FAM.get(p['mz'],p['mz']);rk[f].append(p['rank'])
    for m in range(12):
      if m<len(p['mT']) and p['mT'][m] is not None:
        d=by[f][m];d['t'].append(p['mT'][m]);d['inc'].append((p['mInc'][m] if m<len(p['mInc']) else 0) or 0)
        d['in']+=(p['mIn'][m] if m<len(p['mIn']) and p['mIn'][m] else 0);d['lk']+=(p['mLk'][m] if m<len(p['mLk']) and p['mLk'][m] else 0)
        if p['rank']<=2:top[m].append(p['mT'][m])
for f in by:
  print(f'== {f}  평균 등수 {st.mean(rk[f]):.2f} (n={len(rk[f])})')
  for m in range(11):
    d=by[f].get(m)
    if not d or not d['t']:continue
    print(f"  {m}분: 타워 {st.mean(d['t']):4.1f} · 막은 비율 {100*(1-d['lk']/max(1,d['in'])):5.1f}% · 인컴 {st.mean(d['inc']):6.0f} · 표본 {len(d['t'])}")
print('== 1·2등 AI의 분별 타워 수(학습 목표)');print([round(st.median(top[m]),1) for m in range(11) if top[m]])
