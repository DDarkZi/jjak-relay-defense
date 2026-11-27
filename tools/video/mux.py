import json, subprocess, glob, os
# make.js가 만든 프레임(out/fr)·소리(out/*.wav)를 MP4로 합쳐요. ffmpeg 필요.
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out'))
snd = json.load(open('sounds.json'))
n = len(glob.glob('fr/f*.jpg'))
dur = n / 30
cmd = ['ffmpeg', '-y', '-framerate', '30', '-i', 'fr/f%05d.jpg', '-i', 'bgm.wav']
for i in range(len(snd)):
    cmd += ['-i', f'sfx{i}.wav']
fc = ['[1]volume=1.0[b]']
labels = ['[b]']
for i, s in enumerate(snd):
    ms = int(s['t'] * 1000)
    fc.append(f'[{i+2}]adelay={ms}|{ms},volume=1.3[s{i}]')
    labels.append(f'[s{i}]')
fc.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0,afade=t=in:d=0.3,afade=t=out:st={dur-1.5:.2f}:d=1.5,atrim=0:{dur:.2f}[a]')
cmd += ['-filter_complex', ';'.join(fc), '-map', '0:v', '-map', '[a]',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30',
        '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', 'jjak_shorts.mp4']
subprocess.run(cmd, check=True)
print('frames', n, 'sec', round(dur, 1), 'sounds', len(snd))
