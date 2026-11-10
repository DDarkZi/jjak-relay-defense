import numpy as np, wave
SR=44100; BPM=150; B=60/BPM; DUR=29.1+0.6
N=int(SR*DUR); out=np.zeros(N)
def tone(f,d,kind='sq',duty=.5,vol=.2,att=.005,rel=.06):
    t=np.arange(int(SR*d))/SR
    if kind=='sq': w=np.where((t*f)%1<duty,1.,-1.)
    elif kind=='tri': w=2*np.abs(2*((t*f)%1)-1)-1
    else: w=np.sin(2*np.pi*f*t)
    env=np.minimum(1,t/att)*np.minimum(1,(d-t)/rel).clip(0,1)
    return w*env*vol
def add(x,at):
    i=int(at*SR); j=min(N,i+len(x));
    if i<N: out[i:j]+=x[:j-i]
def kick(at):
    t=np.arange(int(SR*.18))/SR;f=150*np.exp(-t*25)+45;add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*14)*.55,at)
def snare(at):
    t=np.arange(int(SR*.15))/SR;add(np.random.uniform(-1,1,len(t))*np.exp(-t*24)*.22,at)
def hat(at):
    t=np.arange(int(SR*.04))/SR;n=np.random.uniform(-1,1,len(t));n=np.diff(n,prepend=0);add(n*np.exp(-t*80)*.08,at)
nf=lambda m:440*2**((m-69)/12)
# 0~3초: 사이렌 + 드럼 빌드업
t=np.arange(int(SR*3.0))/SR;f=750+200*np.sin(2*np.pi*1.3*t);siren=np.sin(2*np.pi*np.cumsum(f)/SR)*.13*np.minimum(1,t/.2)*np.clip((3.0-t)/.4,0,1)
add(siren,0)
start=3.0-4*B  # 3초에 본편 시작
END=25.6
prog=[(60,[60,64,67]),(57,[57,60,64]),(53,[53,57,60]),(55,[55,59,62])]  # C Am F G
mel=[72,74,76,79,76,74,72,74, 72,76,79,81,79,76,74,72, 69,72,74,76,74,72,69,72, 71,74,79,77,76,74,71,74]
# 드럼 롤 0~3초 (점점 빠르게)
for i in range(12): snare(1.2+i*.15*(1-i/30))
bar=0;t0=3.0
while t0<END-1e-6:
    root,ch=prog[bar%4]
    for b in range(4):
        tb=t0+b*B
        if tb>=END:break
        kick(tb) if b in(0,2) else snare(tb)
        hat(tb);hat(tb+B/2)
        for e in range(2): add(tone(nf(root-24+(12 if e else 0)),B/2*.9,'tri',vol=.22),tb+e*B/2)
        for e in range(2):
            m=mel[(bar%4)*8+b*2+e]
            add(tone(nf(m),B/2*.85,'sq',duty=.25,vol=.07),tb+e*B/2)
        if b in(0,2): 
            for k,n in enumerate(ch): add(tone(nf(n),B*1.8,'sq',duty=.5,vol=.025,rel=.3),tb)
    bar+=1;t0+=4*B
# 끝: 큰 화음 하나
for n in [60,64,67,72,76]: add(tone(nf(n),2.5,'sq',duty=.25,vol=.04,rel=1.8),END)
kick(END);
out=out/np.max(np.abs(out))*.85
fade=int(SR*.6);out[-fade:]*=np.linspace(1,0,fade)
w=wave.open('bgm.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
print('ok',DUR)
