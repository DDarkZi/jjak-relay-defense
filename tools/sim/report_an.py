# report.js 결과 분석: python3 tools/sim/report_an.py 결과.json [비교.json]
import json,sys,re,statistics as st,collections as C
src=open('js/game.js',encoding='utf8').read()
NM={m[0]:m[1] for m in re.findall(r"\{id:'(\w+)'[^\n]*?\bn:'([^']+)'",src)}
TKN={'fire':'🔥화염','ice':'❄️빙결','thunder':'⚡뇌전','wind':'🌪폭풍','poison':'☠️독','dark':'☠️독'}
R=json.load(open(sys.argv[1]));B=json.load(open(sys.argv[2])) if len(sys.argv)>2 else None
def pr(*a):print(*a)
pr('판수',len(R))
for d in sorted(set(g['d'] for g in R)):
  G=[g for g in R if g['d']==d];pr(f"[{d}] {len(G)}판 평균 {st.mean(g['t'] for g in G)/60:.1f}분")
P=[p for g in R for p in g['pl']]
pr('\n== 속성별 (평균 등수, 우승률) 전체 ==')
el=C.defaultdict(list)
for p in P:
  for t in {p['tech'],p['tech2']}:
    if t: el[t].append(p['rank'])
for t,v in sorted(el.items(),key=lambda x:st.mean(x[1])):pr(f"{TKN.get(t,t)} 등수 {st.mean(v):.2f} 우승 {sum(r==1 for r in v)/len(v)*100:.1f}% (n={len(v)})")
pr('\n== 속성 조합 ==')
cb=C.defaultdict(list)
for p in P:
  if p['tech'] and p['tech2']:cb['+'.join(sorted([TKN[p['tech']],TKN[p['tech2']]]))].append(p['rank'])
for t,v in sorted(cb.items(),key=lambda x:st.mean(x[1])):pr(f"{t} {st.mean(v):.2f} 우승 {sum(r==1 for r in v)/len(v)*100:.0f}% n={len(v)}")
def units(R):
  un=C.Counter();us=C.Counter();ue=C.Counter()
  for g in R:
    for k,v in g['un'].items():un[k]+=v
    for k,v in g['us'].items():us[k]+=v
    for k,v in g['ue'].items():ue[k]+=v
  return un,us,ue
un,us,ue=units(R);n=len(R)
pr('\n== 새: 판당 구매 수 · 돈 비중 · 효율(탈출피해/1000G) ==')
tot=sum(us.values())
L=src.split('\n');i0=L.index('const U=[')
allU=[]
for ln in L[i0+1:]:
  if ln.startswith('// ----------') or ln.startswith('];'):break
  m=re.match(r"\{id:'(\w+)'",ln);c=re.search(r"\bc:(\d+)",ln)
  if m and c and 'hidden:1' not in ln and 'race:' not in ln:allU.append((m[1],c[1]))
rows=[]
for k,c in allU:
  if k=='archaeo_g':continue
  rows.append((k,un[k]/n,us[k]/tot*100 if tot else 0,ue[k]/us[k]*1000 if us[k] else 0,int(c)))
rows.sort(key=lambda x:-x[2])
for k,a,b,e,c in rows:pr(f"{NM.get(k,k)}({k},{c}G) 판당 {a:.1f}마리 돈 {b:.2f}% 효율 {e:.2f}")
pr('\n== 타워 ==')
tn=C.Counter();td=C.Counter();ti=C.Counter()
for g in R:
  for k,v in g['tn'].items():tn[k]+=v
  for k,v in g['td'].items():td[k]+=v
  for k,v in g['ti'].items():ti[k]+=v
for k in sorted(tn,key=lambda k:-tn[k]):pr(f"{k} 판당 {tn[k]/n:.1f}개 효율 {td[k]/ti[k] if ti[k] else 0:.2f}")
pr('\n== 성향 평균 등수 (상위/하위) ==')
sty=C.defaultdict(list)
for p in P:sty[p['n']].append(p['rank'])
S2=sorted([(st.mean(v),k,len(v),sum(r==1 for r in v)) for k,v in sty.items() if len(v)>=6])
for m,k,l,w in S2[:12]:pr(f"  {k} {m:.2f} 우승{w}/{l}")
pr('  ...');
for m,k,l,w in S2[-10:]:pr(f"  {k} {m:.2f} 우승{w}/{l}")
pr('\n== 유전자 ↔ 등수 상관(음수=값이 클수록 잘함), 알파 제외 ==')
Q=[p for p in P if not p['alpha']]
def rk(a):
  o=sorted(range(len(a)),key=lambda i:a[i]);r=[0]*len(a)
  for j,i in enumerate(o):r[i]=j
  return r
def sp(x,y):
  rx,ry=rk(x),rk(y);mx,my=st.mean(rx),st.mean(ry)
  num=sum((a-mx)*(b-my) for a,b in zip(rx,ry));den=(sum((a-mx)**2 for a in rx)*sum((b-my)**2 for b in ry))**.5
  return num/den if den else 0
cs=[]
for k in Q[0]['g']:
  x=[p['g'][k] for p in Q];
  if len(set(x))<5:continue
  cs.append((sp(x,[p['rank'] for p in Q]),k,st.mean(x),st.mean([p['g'][k] for p in Q if p['rank']==1])))
for c,k,m,w in sorted(cs):pr(f"  {k:8s} ρ={c:+.3f} 평균 {m:.2f} 우승자 평균 {w:.2f}")
pr('\n== 알 ==')
eg=[p['egg'] for p in P];pr('판당 사람당 알',st.mean(eg),'최대',max(eg))
def eggst(R):
  un,us,ue=units(R);return un['egg_legs']/len(R),ue['egg_legs']/us['egg_legs']*1000
pr('새 규칙 판당 %.0f마리 효율 %.2f'%eggst(R))
if B:pr('이전(보너스 없음) 판당 %.0f마리 효율 %.2f'%eggst(B))
for RR,lab in [(R,'새'),(B,'이전')]:
  if RR:
    v=[p['rank'] for g in RR for p in g['pl'] if p['n']=='수상한 알 전략'];pr(lab,'수상한 알 전략 등수',round(st.mean(v),2) if v else '-','n',len(v))
    for d in sorted(set(g['d'] for g in RR)):
      G=[g for g in RR if g['d']==d];pr('  ',lab,d,'%.1f분'%(st.mean(g['t'] for g in G)/60))
