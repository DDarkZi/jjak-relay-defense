import json,sys,glob,statistics as st,collections as C
D,tag=sys.argv[1],sys.argv[2];R=[];[R.extend(json.load(open(f))) for f in glob.glob(f'{D}/{tag}_*.json')]
def sty(n):
  for s in ('이자형','안정형','밸런스형'):
    if n.endswith(s):return s
  return '특수'
a=C.Counter();w=C.Counter();sv=C.defaultdict(list);kl=C.defaultdict(list);ic=C.defaultdict(list)
for r in R:
  for i,n in enumerate(r['ps']):
    s=sty(n);a[s]+=1;sv[s].append(r['die'][i] or r['t']);kl[s].append(r['kills'][i]);ic[s].append(r['inc'][i])
  if r['win']>=0:w[sty(r['ps'][r['win']])]+=1
out=f"[{tag}] {len(R)}판 평균 {st.mean(r['t'] for r in R)/60:.1f}분 | "+' | '.join(f"{s} {w[s]/a[s]*100:.1f}%(생존{st.mean(sv[s])/60:.1f}분·처치{st.mean(kl[s]):.0f}·인컴{st.mean(ic[s]):.0f})" for s in ('이자형','안정형','밸런스형','특수'))
print(out);open(f'{D}/summary.txt','a').write(out+'\n')
