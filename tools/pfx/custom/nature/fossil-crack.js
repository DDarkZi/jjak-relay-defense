// 새떼 주의보용: 둥근 돌(화석) 껍질에 금이 퍼지다가 와르르 깨져 조각과 돌가루가 떨어지는 효과.
import { Particles, P, Rng, fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
export const meta = {
  name: "Fossil crack", desc: "A round stone shell cracks from the middle out, the cracks glowing faintly, then bursts into chunks that tumble down with grit and dust.",
  tags: ["nature", "stone", "fossil", "crack", "shatter", "one-shot"], size: [150, 130], origin: [75, 116], duration: 1.6, loop: false, fps: 30, bg: "ground",
  options: { palette: ["#2a2620", "#4c4842", "#67625a", "#827c72", "#9c968b", "#bdb6aa", "#e0dacd"], dust: ["#4f3f2c", "#927a58", "#dcc8a2"], seed: 11 },
};
export function create(o) {
  const C = fit(o.palette, 7), Dc = fit(o.dust, 3), R = new Rng(o.seed), CY = -40, RAD = 24, floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [WHITE, C[6], C[5]] });
  const cracks = []; for (let i = 0; i < 7; i++) { let a = (i / 7) * TAU + R.range(-.3, .3), x = 0, y = 0; const pts = [[0, 0]]; for (let k = 0; k < 4; k++) { a += R.range(-.5, .5); const l = R.range(5, 8); x += Math.cos(a) * l; y += Math.sin(a) * l; pts.push([x, y]); } cracks.push(pts); }
  const chunks = []; let burst = false, t = 0;
  const T1 = 0.55;
  return {
    update(dt) {
      t += dt;
      if (!burst && t >= T1) {
        burst = true;
        for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU + R.range(-.2, .2), sp = R.range(50, 110), r = R.range(4, 8);
          chunks.push({ x: Math.cos(a) * RAD * .5, y: CY + Math.sin(a) * RAD * .5, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, r, rot: R.range(0, TAU), vr: R.range(-9, 9), c: R.pick([C[3], C[4], C[5]]), life: R.range(.8, 1.05) }); }
        for (let i = 0; i < 22; i++) { const a = R.range(0, TAU), sp = R.range(20, 90); ps.spawn(P.DUST, Math.cos(a) * 8, CY + Math.sin(a) * 8, Math.cos(a) * sp, Math.sin(a) * sp - 20, R.range(.5, 1), R.pick(Dc), R.range(2, 4)); }
        for (let i = 0; i < 16; i++) { const a = R.range(0, TAU), sp = R.range(60, 150); ps.spawn(P.GRIT, Math.cos(a) * 6, CY + Math.sin(a) * 6, Math.cos(a) * sp, Math.sin(a) * sp - 50, R.range(.5, .9), R.pick([C[2], C[4], C[5]]), 1); }
      }
      for (const c of chunks) { c.vy += 260 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt; if (c.y > -c.r * .5) { c.y = -c.r * .5; c.vy *= -.3; c.vx *= .6; c.vr *= .5; } c.life -= dt; }
      ps.update(dt);
    },
    drawBack(p) { p.glow(0, -2, 34, C[3], 0.25 * (1 - clamp(t / 1.6))); ps.draw(p, "back"); },
    draw(p) {
      if (!burst) {
        const sh = t > .35 ? Math.sin(t * 90) * 1.2 : 0;
        p.disc(sh + 2, CY + 3, RAD, C[1], 1); p.disc(sh, CY, RAD, C[3], 1); p.disc(sh - 6, CY - 7, RAD * .55, C[4], 1); p.disc(sh - 9, CY - 11, RAD * .2, C[5], 1); p.disc(sh + 8, CY + 6, 3, C[2], 1); p.disc(sh - 12, CY + 8, 2.5, 0xff6b8e3a, 1);
        const g = ease.outCubic(clamp(t / T1));
        for (const pts of cracks) { const n = Math.max(1, Math.floor(g * (pts.length - 1) + .5)); for (let k = 0; k < n; k++) { const [x0, y0] = pts[k], [x1, y1] = pts[k + 1]; p.line(sh + x0, CY + y0, sh + x1, CY + y1, C[0]); if (t > .3) p.glowLine(sh + x0, CY + y0, sh + x1, CY + y1, 2, C[6], .25); } }
        if (t > T1 - .06) p.ring(0, CY, RAD + 3, 2, WHITE, .7);
      }
      for (const c of chunks) { if (c.life <= 0) continue; const a = Math.min(1, c.life * 3), pts = []; for (let k = 0; k < 5; k++) { const q = c.rot + (k / 5) * TAU; pts.push([c.x + Math.cos(q) * c.r * (k % 2 ? .7 : 1), c.y + Math.sin(q) * c.r * (k % 2 ? .7 : 1)]); }
        p.poly(pts, c.c, a); p.px(Math.round(c.x - c.r * .3), Math.round(c.y - c.r * .3), C[6]); }
      ps.draw(p, "front");
    },
  };
}
