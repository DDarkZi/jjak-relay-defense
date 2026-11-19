import json,sys,glob,statistics as st,collections as C
D,tag=sys.argv[1],sys.argv[2];R=[];[R.extend(json.load(open(f))) for f in glob.glob(f'{D}/{tag}_*.json')]
N={'nest':'둥지 연합','raptor':'맹금 군단','dusk':'황혼 깃털단','grove':'숲 지킴이'}
a=C.Counter();w=C.Counter();sv=C.defaultdict(list)
for r in R:
  for i,k in enumerate(r['race']):
    a[k]+=1;sv[k].append(r['die'][i] or r['t'])
    if r['win']==i:w[k]+=1
out=f"[{tag} 종족] "+' | '.join(f"{N.get(k,k)} {w[k]/a[k]*100:.1f}%(생존{st.mean(sv[k])/60:.1f}분)" for k in sorted(a,key=lambda k:-w[k]/a[k]))
print(out);open(f'{D}/summary.txt','a').write(out+'\n')
