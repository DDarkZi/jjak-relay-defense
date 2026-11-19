# 새별 효율: 산 횟수, 쓴 골드, 탈출 피해/1000골드 (사용: python3 unit_an.py 폴더 태그 [id들])
import json,sys,glob,collections as C
D,tag=sys.argv[1],sys.argv[2];ids=sys.argv[3].split(',') if len(sys.argv)>3 else None
R=[];[R.extend(json.load(open(f))) for f in glob.glob(f'{D}/{tag}_*.json')]
us=C.Counter();un=C.Counter();ue=C.Counter()
for r in R:
  for k,v in (r.get('us') or {}).items():us[k]+=v
  for k,v in (r.get('un') or {}).items():un[k]+=v
  for k,v in (r.get('ue') or {}).items():ue['archaeo' if k=='archaeo_g' else k]+=v
rows=sorted(us,key=lambda k:-ue[k]/max(1,us[k]))
print(f'[{tag}] {len(R)}판 · 새별 효율(탈출 피해/1000G)')
for k in rows:
  if ids and k not in ids:continue
  if us[k]<3000:continue
  print(f'  {k:12s} 구매 {un[k]:5d}회  골드 {us[k]:9d}  효율 {ue[k]/us[k]*1000:6.2f}')
