import subprocess as sp, os
SC=['swarm','news','build','fun','skill','send','ring','lobby']
SFXD='/home/user/jjak-relay-defense/assets/sfx/'
def run(c):
    r=sp.run(c,shell=True,capture_output=True,text=True)
    if r.returncode: print(c);print(r.stderr[-1500:]);raise SystemExit
os.makedirs('out',exist_ok=True)
ENC='-c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -r 30'
for o in 'vh':
    lst=[]
    for k in SC:
        cap=f'cap/{o}_{k}.png';f=f'out/{o}_{k}.mp4'
        base='[0]null[m]' if o=='v' else '[0]split[a][b];[a]scale=1920:-1,crop=1920:1080,boxblur=24:2,eq=brightness=-0.22:saturation=1.2[bg];[b]scale=-1:1080[fg];[bg][fg]overlay=1223:0[m]'
        run(f"ffmpeg -y -v error -framerate 30 -i sc/{k}/%04d.jpg -loop 1 -framerate 30 -i {cap} -filter_complex \"{base};[1]format=rgba,fade=in:st=0.05:d=0.18:alpha=1[c];[m][c]overlay=0:0:shortest=1,format=yuv420p\" {ENC} {f}")
        lst.append(f)
    W,H=(1080,1920) if o=='v' else (1920,1080)
    run(f"ffmpeg -y -v error -loop 1 -framerate 30 -i cap/{o}_end.png -filter_complex \"scale={W*2}:{H*2},zoompan=z='1+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps=30,format=yuv420p\" -frames:v 120 {ENC} out/{o}_end.mp4")
    lst.append(f'out/{o}_end.mp4')
    open(f'out/{o}.txt','w').write(''.join(f"file '{os.path.basename(x)}'\n" for x in lst))
    run(f"ffmpeg -y -v error -f concat -safe 0 -i out/{o}.txt -c copy out/{o}_silent.mp4")
# 효과음 타이밍(초)
F=lambda f:f/30
st={};t=0
for k,n in zip(SC,[90,105,100,128,90,90,90,75]): st[k]=t;t+=n
st['end']=t
ev=[]
ev.append((F(st['news'])+.1,'impactBell_heavy_000',.5))
for i in range(12): ev.append((F(st['build']+2+8*i),'drop_002',.5))
for i in range(4): ev.append((F(st['fun']+32*i+2),'impactSoft_medium_00%d'%(i%3),.7))
ev.append((F(st['skill']+8),'impactPunch_heavy_000',.9));ev.append((F(st['skill']+10),'glass_001',.6))
for i in range(9): ev.append((F(st['send']+4+10*i),'maximize_003',.35))
for i in range(4): ev.append((F(st['ring']+22*i),'click_002',.6))
ev.append((F(st['lobby']),'maximize_009',.5))
ev.append((F(st['end'])+.05,'jingles_NES03',.8))
ins=' '.join(f'-i {SFXD}{n}.ogg' for _,n,_ in ev)
fl=''.join(f'[{i+1}]adelay={int(t*1000)}|{int(t*1000)},volume={v}[s{i}];' for i,(t,n,v) in enumerate(ev))
mix=f"[0]volume=0.8[bg];{fl}[bg]{''.join(f'[s{i}]' for i in range(len(ev)))}amix=inputs={len(ev)+1}:normalize=0:duration=first,alimiter=limit=0.9[a]"
run(f'ffmpeg -y -v error -i bgm.wav {ins} -filter_complex "{mix}" -map "[a]" -ac 2 -ar 44100 out/mix.wav')
TOT=F(st['end'])+4
for o,name in [('v','trailer_vertical_9x16.mp4'),('h','trailer_16x9.mp4')]:
    run(f"ffmpeg -y -v error -i out/{o}_silent.mp4 -i out/mix.wav -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart out/{name}")
print('done',st,TOT)
