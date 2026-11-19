// 새떼 주의보용: 착지한 자리에 시조새 뼈 화석이 찍힌 둥근 돌판이 솟았다가 금 가며 부서지는 효과.
import { Particles, P, Rng, fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
export const meta = {
  name: "Fossil imprint", desc: "A flat round stone slab heaves up out of the ground with the bones of a little bird pressed into it: skull, spine, ribs, wing bones and a long bony tail. It holds, then crumbles into dust.",
  tags: ["nature", "stone", "fossil", "bones", "imprint", "one-shot"], size: [170, 110], origin: [85, 92], duration: 2.6, loop: false, fps: 30, bg: "ground",
  options: { palette: ["#1c1610", "#33281c", "#4f3f2c", "#6e5a40", "#927a58", "#b89f78", "#dcc8a2"], bone: ["#8a806c", "#e4dcc8", "#fffaf0"], seed: 4 },
};
export function create(o) {
  const C = fit(o.palette, 7), B = fit(o.bone, 3), R = new Rng(o.seed), floor = () => 0, ps = new Particles({ rng: R, ground: floor, sparks: [WHITE, B[2], B[1]] });
  let t = 0, crumbled = false;
  for (let i = 0; i < 14; i++) { const s = R.sign(); ps.spawn(P.DUST, s * R.range(10, 50), -2, s * R.range(20, 70), -R.range(10, 40), R.range(.5, .9), R.pick([C[3], C[4], C[5]]), R.range(2, 4), R.range(0, .1)); }
  const CY = -30, W = 52, H = 24;
  const bone = (p, x0, y0, x1, y1, a) => { p.line(x0, y0 + 1, x1, y1 + 1, B[0], a); p.line(x0, y0, x1, y1, B[1], a); };
  return {
    update(dt) { t += dt; if (!crumbled && t > 2.0) { crumbled = true; for (let i = 0; i < 30; i++) ps.spawn(P.DUST, R.range(-W, W), CY + R.range(-H, H) * .6, R.range(-30, 30), R.range(-40, -5), R.range(.4, .8), R.pick([C[4], C[5], C[6]]), R.range(1.5, 3.5)); for (let i = 0; i < 14; i++) ps.spawn(P.GRIT, R.range(-W, W), CY, R.range(-60, 60), R.range(-90, -30), R.range(.4, .7), R.pick([C[3], C[5]]), 1); } ps.update(dt); },
    drawBack(p) { ps.draw(p, "back"); },
    draw(p) {
      const up = ease.outBack(clamp(t / .35), 1.6), fade = t < 2.0 ? 1 : 1 - clamp((t - 2.0) / .25), y = CY + (1 - up) * 26;
      if (fade > 0) {
        p.ellipse(2, y + 4, W, H, C[1], fade); p.ellipse(0, y, W, H, C[3], fade); p.ellipse(-4, y - 3, W * .9, H * .82, C[4], fade);
        const a = fade * clamp((t - .25) / .3);
        // 뼈: 머리·부리·척추·갈비·날개뼈·꼬리
        p.circle(-30, y - 6, 6, B[1], a); p.disc(-30, y - 6, 2, C[2], a); p.line(-36, y - 4, -44, y - 1, B[1], a);
        bone(p, -24, y - 4, 22, y + 2, a);
        for (let i = 0; i < 5; i++) { const x = -18 + i * 6; bone(p, x, y - 2, x - 3, y + 8, a); bone(p, x, y - 4, x - 3, y - 13, a); }
        bone(p, -14, y - 4, -2, y - 18, a); bone(p, -2, y - 18, 16, y - 20, a); for (let i = 0; i < 4; i++) bone(p, 16 - i * 3, y - 20, 22 - i * 3, y - 14, a);
        for (let i = 0; i < 6; i++) { const x = 22 + i * 4, yy = y + 2 + i; p.disc(x, yy, 1.6, B[1], a); bone(p, x, yy, x + 1, yy - 5, a * .8); bone(p, x, yy, x + 1, yy + 5, a * .8); }
        if (t > 1.6) { const k = clamp((t - 1.6) / .4); for (let i = 0; i < 5; i++) { const q = i * 1.3; p.line(Math.cos(q) * 4, y + Math.sin(q) * 2, Math.cos(q) * (8 + 40 * k), y + Math.sin(q) * (4 + 16 * k), C[0], fade); } }
      }
      ps.draw(p, "front");
    },
  };
}
