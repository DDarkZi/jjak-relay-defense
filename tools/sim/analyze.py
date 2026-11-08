# 시뮬레이션 결과 분석: python3 tools/sim/analyze.py "out*.json"
import json,sys,statistics as st,glob,collections as C
fs=[]; [fs.extend(glob.glob(a)) for a in sys.argv[1:]]
R=[];[R.extend(json.load(open(f))) for f in fs]
R=[r for r in R if 'err' not in r]
for mode in ('normal','race'):
  G=[r for r in R if r['mode']==mode]
  if not G:continue
  T=[r['t'] for r in G];print(f"\n== {mode}: {len(G)}판  게임시간 평균 {st.mean(T)/60:.1f}분 중앙 {st.median(T)/60:.1f}분 (10%~90%: {sorted(T)[len(T)//10]/60:.1f}~{sorted(T)[len(T)*9//10]/60:.1f}분)  무승부 {sum(r['win']<0 for r in G)}")
  ups=[r['st'].get('up',0) for r in G if r.get('st')];print(f"  업그레이드/판 {st.mean(ups):.0f}" if ups and any(ups) else '')
  if mode=='race':
    app=C.Counter();win=C.Counter()
    for r in G:
      for p in r['pl']:app[p['race']]+=1
      if r['win']>=0:win[r['pl'][r['win']]['race']]+=1
    print('  종족 승률(기대 12.5%):',{k:f"{win[k]/app[k]*100:.1f}%" for k in app})
  app=C.Counter();win=C.Counter()
  for r in G:
    for p in r['pl']:app[p['tech']]+=1
    if r['win']>=0:win[r['pl'][r['win']]['tech']]+=1
  print('  첫 속성 승률:',{k:f"{win[k]/app[k]*100:.1f}%" for k in app})
  td=C.Counter();ti=C.Counter();tn=C.Counter();us=C.Counter();ue=C.Counter();un=C.Counter()
  for r in G:
    s=r.get('st') or {}
    td.update(s.get('td',{}));ti.update(s.get('ti',{}));tn.update(s.get('tn',{}));us.update(s.get('us',{}));ue.update(s.get('ue',{}));un.update(s.get('un',{}))
  if ti:
    eff={k:td[k]/ti[k] for k in ti if ti[k]>3000 and k!='wall' and k!='snack' and k!='cctv'}
    if eff:
      med=st.median(eff.values());print('  타워 효율(피해/골드, 중앙=1.00):')
      print('   '+'  '.join(f"{k}:{v/med:.2f}" for k,v in sorted(eff.items(),key=lambda a:-a[1])))
  if us:
    ef={k:ue[k]/us[k]*1000 for k in us if us[k]>5000}
    if ef:
      med=st.median(ef.values());print('  유닛 효율(탈출피해/1000골드, 중앙=1.00):')
      print('   '+'  '.join(f"{k}:{v/med:.2f}" for k,v in sorted(ef.items(),key=lambda a:-a[1])))
