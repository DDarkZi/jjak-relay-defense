// 새떼 주의보용: 날아가는 돌 화석 새 아래로 작은 돌 부스러기와 흙먼지가 계속 떨어지는 반복 효과.
import { Rng, fit, TAU } from "../../core/index.js";
export const meta = {
  name: "Stone trail", desc: "Little pebbles and puffs of dry dust keep crumbling off something flying overhead and drop away below it.",
  tags: ["nature", "stone", "fossil", "trail", "dust", "loop"], size: [80, 110], origin: [40, 20], duration: 1.2, loop: true, fps: 30, bg: "sky",
  options: { palette: ["#2c2c38", "#5c5c6b", "#a4a4b2"], dust: ["#6e5a40", "#b89f78", "#dcc8a2"], seed: 3 },
};
export function create(o) {
  const C = fit(o.palette, 3), D = fit(o.dust, 3), R = new Rng(o.seed), Dur = meta.duration, bits = [];
  for (let i = 0; i < 14; i++) bits.push({ x: R.range(-14, 14), ph: R.range(0, 1), s: R.range(1, 2.6), c: R.pick(C), dust: i % 3 === 0, m: R.pick([1, 1, 2]) });
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (const b of bits) { const u = ((t / Dur) * b.m + b.ph) % 1, y = u * u * 80, x = b.x + Math.sin(u * TAU + b.ph * 9) * 2;
        if (b.dust) p.disc(x, y, b.s * (1 + u * 2.5), D[1 + (u > .5 ? 0 : 1)], .7 * (1 - u));
        else { p.rect(Math.round(x), Math.round(y), b.s > 1.8 ? 2 : 1, b.s > 1.8 ? 2 : 1, b.c, 1 - u * .6); } }
    },
  };
}
