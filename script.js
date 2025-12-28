const darkModeBtn = document.getElementById("darkModeBtn");
const btnIcon = darkModeBtn.querySelector(".btn__icon");
const btnText = darkModeBtn.querySelector(".btn__text");

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d", { alpha: true });

const STORAGE_KEY = "cv_theme"; 
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let W = 0, H = 0, DPR = 1;
let stars = [];
let rafId = null;
let running = false;
let t = 0;

function rand(min, max){ return Math.random() * (max - min) + min; }

function setTheme(isDark, save = true){
  document.body.classList.toggle("dark-mode", isDark);
  darkModeBtn.setAttribute("aria-pressed", String(isDark));

  if (isDark){
    btnIcon.textContent = "🌙";
    btnText.textContent = "Light Mode";
  } else {
    btnIcon.textContent = "☀️";
    btnText.textContent = "Dark Mode";
  }

  if (save) localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
}

darkModeBtn.addEventListener("click", () => {
  const isDarkNow = document.body.classList.contains("dark-mode");
  setTheme(!isDarkNow, true);
});

function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = Math.floor(window.innerWidth);
  H = Math.floor(window.innerHeight);

  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  buildStars();
}

window.addEventListener("resize", resize);

function buildStars(){
  stars = [];
  const density = Math.floor((W * H) / 9000);
  const count = Math.max(200, Math.min(900, density));

  for (let i = 0; i < count; i++){
    stars.push({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.6, 1.8),
      a: rand(0.2, 1),
      tw: rand(0.002, 0.012),
      vx: rand(-0.05, 0.05),
      vy: rand(-0.03, 0.03),
    });
  }
}

function paintBase(){
  const isDark = document.body.classList.contains("dark-mode");

  ctx.clearRect(0, 0, W, H);

  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (isDark){
    g.addColorStop(0, "#02040f");
    g.addColorStop(0.45, "#06142b");
    g.addColorStop(1, "#071a3b");
  } else {
    g.addColorStop(0, "#58c2ff");
    g.addColorStop(0.55, "#b9ecff");
    g.addColorStop(1, "#f3fdff");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const v = ctx.createRadialGradient(W * 0.5, H * 0.3, 20, W * 0.5, H * 0.5, Math.max(W, H));
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.10)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

function paintStars(){
  const isDark = document.body.classList.contains("dark-mode");
  const alphaBoost = isDark ? 1 : 0.22;

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
    ctx.fillStyle = `rgba(255,255,255,${s.a * alphaBoost})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintAurora(){
  const isDark = document.body.classList.contains("dark-mode");
  if (!isDark) return;

  const time = t;
  const bands = prefersReducedMotion ? 2 : 4;
  const baseY = H * 0.18;
  const height = H * 0.55;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let b = 0; b < bands; b++){
    const phase = time * (0.006 + b * 0.0015);
    const waveAmp = (H * (0.045 + b * 0.012));
    const drift = (Math.sin(time * 0.002 + b) * 40);

    const grad = ctx.createLinearGradient(0, baseY, 0, baseY + height);
    grad.addColorStop(0.00, `rgba(46,233,255,0.00)`);
    grad.addColorStop(0.15, `rgba(46,233,255,0.12)`);
    grad.addColorStop(0.42, `rgba(120,255,210,0.16)`);
    grad.addColorStop(0.70, `rgba(248,200,220,0.10)`);
    grad.addColorStop(1.00, `rgba(138,92,255,0.00)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, baseY);

    const step = Math.max(18, Math.floor(W / 70));
    for (let x = 0; x <= W + step; x += step){
      const nx = x / W;
      const wav =
        Math.sin(nx * (Math.PI * 2) * (1.4 + b * 0.25) + phase) +
        Math.sin(nx * (Math.PI * 2) * (2.4 + b * 0.22) - phase * 1.2) * 0.55;

      const y = baseY + drift + wav * waveAmp + (Math.sin(time * 0.003 + nx * 3) * 10);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(W, baseY);
    ctx.lineTo(W, H);
    ctx.closePath();

    ctx.globalAlpha = prefersReducedMotion ? 0.55 : (0.42 + b * 0.12);
    ctx.fill();

    ctx.globalAlpha = prefersReducedMotion ? 0.22 : 0.18;
    ctx.fillStyle = `rgba(46,233,255,0.10)`;
    ctx.fillRect(0, baseY + height * 0.15, W, height * 0.55);
  }

  ctx.restore();
}

function paintStardust(){
  const isDark = document.body.classList.contains("dark-mode");
  if (!isDark || prefersReducedMotion) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++){
    const x = rand(0, W);
    const y = rand(0, H);
    const r = rand(0.7, 1.6);
    ctx.beginPath();
    ctx.fillStyle = `rgba(${Math.floor(rand(180,255))},${Math.floor(rand(180,255))},${Math.floor(rand(220,255))},0.06)`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function loop(){
  if (!running) return;
  t += 1;

  paintBase();
  paintStars();
  paintAurora();
  paintStardust();

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
if (saved === "light") setTheme(false, false);
else setTheme(true, false);

start();
