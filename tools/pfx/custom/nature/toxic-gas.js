// 새떼 주의보용 둥근 독가스(반복). 둥근 연기 공을 위에서 비추는 방식은 spawn/poof(Sprite Fusion 효과를 바탕으로 한 것)를 참고.
import { Lights, Rng, fit, TAU, WHITE } from "../../core/index.js";

export const meta = {
  name: "Toxic gas",
  desc: "A round, lumpy, see-through ball of purple toxic gas sitting on the ground: soft puffs that breathe in and out and slowly churn round, little bubbles rising through it and popping, a sickly glow underneath.",
  tags: ["nature", "poison", "gas", "cloud", "toxic", "loop"],
  size: [120, 100],
  origin: [60, 88],
  duration: 2.4,
  loop: true,
  fps: 30,
  bg: "ground",
  options: {
    palette: ["#1a0b26", "#2e1446", "#4a1f6e", "#6a2f9a", "#8c47c4", "#b578e6", "#e8ccff"],
    accent: ["#2f6a1e", "#7cd63a", "#d6ff8e"],
    seed: 7,
  },
};

export function create(o) {
  const C = fit(o.palette, 7), A = fit(o.accent, 3), R = new Rng(o.seed), D = meta.duration, CY = -30;
  const balls = [];
  // 가운데가 높은 둥근 덩어리: 아래 줄은 넓게, 위로 갈수록 좁게
  const rows = [[6, 30, 11, 0], [5, 21, 12, -14], [3, 11, 11, -26], [1, 0, 10, -34]];
  for (const [n, spread, r, dy] of rows) for (let i = 0; i < n; i++) {
    const k = n === 1 ? 0 : i / (n - 1) - 0.5;
    balls.push({ bx: k * spread * 2 + R.range(-2, 2), by: CY + 14 + dy + R.range(-2, 2), r: r + R.range(-1.5, 1.5), n: R.pick([1, 2]), ph: R.range(0, TAU), wx: R.range(1.5, 3), wy: R.range(1, 2), m: R.pick([1, 1, 2]) });
  }
  const bubbles = [];
  for (let j = 0; j < 7; j++) bubbles.push({ x: R.range(-22, 22), ph: R.range(0, 1), r: R.range(1.5, 3), m: R.pick([1, 2]) });
  const lights = new Lights();
  let t = 0;
  const pos = (b) => {
    const a = (TAU * t) / D;
    return [b.bx + Math.cos(a * b.m + b.ph) * b.wx, b.by + Math.sin(a * b.m + b.ph) * b.wy, b.r * (1 + 0.13 * Math.sin(a * b.n + b.ph * 1.7))];
  };
  const drawBall = (p, b, layer) => {
    const [x, y, r] = pos(b), hy = (y - CY) / 20, lo = hy > 0.25;
    if (layer === "shade") p.disc(x + r * 0.14, y + r * 0.18, r, lo ? C[1] : C[2], 0.42);
    else if (layer === "body") p.disc(x - r * 0.05, y - r * 0.08, r * 0.86, lo ? C[2] : C[3], 0.5);
    else if (hy < -0.35) {
      p.disc(x - r * 0.24, y - r * 0.3, r * 0.4, C[4], 0.55);
      if (hy < -0.8) p.disc(x - r * 0.3, y - r * 0.38, r * 0.16, C[6], 0.8);
    }
  };
  lights.add(0, CY + 10, 52, C[4], 0.5, 999);
  return {
    update(dt) { t += dt; lights.update(dt); },
    drawBack(p) {
      p.glow(0, -2, 40, C[4], 0.22);
      p.glow(0, CY + 6, 30, C[5], 0.1);
    },
    draw(p) {
      for (const layer of ["shade", "body", "cap"]) for (const b of balls) drawBall(p, b, layer);
      // 초록 독 방울이 몇 개 떠다니며 독 느낌
      for (let i = 0; i < 3; i++) {
        const a = (TAU * t) / D + i * 2.1;
        p.disc(Math.cos(a) * 14, CY + 6 + Math.sin(a * 2) * 6, 2.6, A[1], 0.9);p.disc(Math.cos(a) * 14 - 0.8, CY + 5 + Math.sin(a * 2) * 6, 1.1, A[2], 0.9);
      }
      // 거품: 아래에서 올라와 위에서 톡 터짐
      for (const q of bubbles) {
        const u = ((t / D) * q.m + q.ph) % 1, y = -6 - u * 52, x = q.x * (1 - u * 0.4);
        if (u < 0.86) { p.ring(x, y, q.r, 1, C[6], 0.9); p.disc(x - q.r * 0.3, y - q.r * 0.3, 0.8, WHITE, 0.9); }
        else { const k = (u - 0.86) / 0.14; p.ring(x, y, q.r + 3 * k, 1, C[6], 1 - k); }
      }
      lights.draw(p);
    },
  };
}
