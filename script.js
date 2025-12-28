const canvas = document.getElementById("dawn");
const ctx = canvas.getContext("2d", { alpha: true });

const themeBtn = document.getElementById("themeBtn");
const themeIcon = themeBtn.querySelector(".theme-btn__icon");
const themeText = themeBtn.querySelector(".theme-btn__text");

const STORAGE_KEY = "cv_theme";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let W = 0, H = 0, DPR = 1;
let rafId = null;
let running = false;
let t = 0;

const dust = [];
let stars = [];

function rand(min, max){ return Math.random() * (max - min) + min; }
function isDark(){ return document.body.classList.contains("dark-mode"); }

function applyTheme(dark, save = true){
  document.body.classList.toggle("dark-mode", dark);
  themeBtn.setAttribute("aria-pressed", String(dark));

  if (dark){
    themeIcon.textContent = "☀️";
    themeText.textContent = "Light Mode";
  } else {
    themeIcon.textContent = "🌙";
    themeText.textContent = "Dark Mode";
  }

  if (save) localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
}

themeBtn.addEventListener("click", () => {
  applyTheme(!isDark(), true);
});

function buildDust(){
  dust.length = 0;
  const count = prefersReducedMotion ? 14 : Math.min(58, Math.max(26, Math.floor((W * H) / 24000)));
  for (let i = 0; i < count; i++){
    dust.push({
      x: rand(0, W),
      y: rand(H * 0.15, H),
      r: rand(0.8, 2.2),
      a: rand(0.08, 0.22),
      vx: rand(-0.10, 0.10),
      vy: rand(-0.22, -0.06),
      tw: rand(0.002, 0.01)
    });
  }
}

function buildStars(){
  stars = [];
  const count = prefersReducedMotion ? 160 : Math.min(900, Math.max(260, Math.floor((W * H) / 9000)));
  for (let i = 0; i < count; i++){
    stars.push({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.6, 1.8),
      a: rand(0.2, 1),
      tw: rand(0.002, 0.012),
      vx: rand(-0.04, 0.04),
      vy: rand(-0.02, 0.02),
    });
  }
}

function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = Math.floor(window.innerWidth);
  H = Math.floor(window.innerHeight);

  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  buildDust();
  buildStars();
}

window.addEventListener("resize", resize);

function paintSunGlow(){
  const cx = W * 0.22;
  const cy = H * 0.62;
  const maxR = Math.max(W, H) * 0.55;

  const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxR);
  g.addColorStop(0.00, "rgba(255, 207, 110, 0.30)");
  g.addColorStop(0.25, "rgba(255, 122, 89, 0.16)");
  g.addColorStop(0.55, "rgba(255, 215, 198, 0.10)");
  g.addColorStop(1.00, "rgba(255, 255, 255, 0.00)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function paintRays(){
  if (prefersReducedMotion) return;

  const cx = W * 0.22;
  const cy = H * 0.62;

  const rays = 18;
  const baseLen = Math.max(W, H) * 0.55;

  ctx.save();
  ctx.translate(cx, cy);

  const drift = Math.sin(t * 0.004) * 0.08;
  ctx.rotate(drift);

  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < rays; i++){
    const ang = (i / rays) * Math.PI * 2;
    const wobble = Math.sin(t * 0.01 + i) * 0.04;
    const len = baseLen * (0.55 + (Math.sin(t * 0.008 + i) * 0.06));

    ctx.save();
    ctx.rotate(ang + wobble);

    const grad = ctx.createLinearGradient(0, 0, len, 0);
    grad.addColorStop(0.0, "rgba(255, 207, 110, 0.00)");
    grad.addColorStop(0.15, "rgba(255, 207, 110, 0.10)");
    grad.addColorStop(0.35, "rgba(255, 122, 89, 0.06)");
    grad.addColorStop(1.0, "rgba(255, 255, 255, 0.00)");

    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len, 10);
    ctx.lineTo(len, -10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

function paintDust(){
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const p of dust){
    if (!prefersReducedMotion){
      p.a += (Math.random() - 0.5) * p.tw;
      p.a = Math.max(0.04, Math.min(0.26, p.a));
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < H * 0.12) { p.y = H + rand(10, 120); p.x = rand(0, W); }
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function paintMoon(){
  const cx = W * 0.78;
  const cy = H * 0.22;
  const R = Math.min(W, H) * 0.10;

  const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, R * 3.2);
  g.addColorStop(0.00, "rgba(200,240,255,0.18)");
  g.addColorStop(0.25, "rgba(160,220,255,0.10)");
  g.addColorStop(1.00, "rgba(255,255,255,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.beginPath();
  ctx.fillStyle = "rgba(245,252,255,0.30)";
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cx + R * 0.35, cy - R * 0.05, R * 0.92, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function paintStars(){
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const s of stars){
    if (!prefersReducedMotion){
      s.a += (Math.random() - 0.5) * s.tw;
      s.a = Math.max(0.08, Math.min(1, s.a));
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${s.a * 0.9})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function paintNightGlow(){
  const g = ctx.createRadialGradient(W*0.25, H*0.35, 10, W*0.25, H*0.35, Math.max(W,H)*0.7);
  g.addColorStop(0.00, "rgba(120,220,255,0.10)");
  g.addColorStop(0.35, "rgba(190,140,255,0.06)");
  g.addColorStop(1.00, "rgba(0,0,0,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function loop(){
  if (!running) return;
  t += 1;
  ctx.clearRect(0, 0, W, H);

  if (isDark()){
    paintNightGlow();
    paintStars();
    paintMoon();
  } else {
    paintSunGlow();
    paintRays();
    paintDust();
  }

  rafId = requestAnimationFrame(loop);
}

function start(){
  if (running) return;
  running = true;
  rafId = requestAnimationFrame(loop);
}
function stop(){
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop();
  else start();
});

resize();

const saved = localStorage.getItem(STORAGE_KEY);
applyTheme(saved === "dark", false);

start();
