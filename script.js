@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Poppins:wght@300;400;600&display=swap');

:root{
  --radius: 18px;
  --radius2: 26px;
  --blur: 16px;

  --bg1: #88d6ff;
  --bg2: #eaf9ff;

  --text: #2a2a2a;
  --muted: rgba(42,42,42,.72);

  --accent: #b03a6f;
  --accent2: #2bd4ff;

  --glass: rgba(255,255,255,.55);
  --glass2: rgba(255,255,255,.28);
  --stroke: rgba(255,255,255,.36);
  --shadow: 0 18px 55px rgba(0,0,0,.12);

  --btnBg: rgba(255,255,255,.65);
  --btnText: #3a1f2d;
}

body.dark-mode{
  --bg1: #02040f;
  --bg2: #071a3b;

  --text: rgba(245,248,255,.95);
  --muted: rgba(245,248,255,.72);

  --accent: #f8c8dc;
  --accent2: #2ee9ff;

  --glass: rgba(14, 24, 44, .55);
  --glass2: rgba(14, 24, 44, .22);
  --stroke: rgba(180, 255, 245, .22);
  --shadow: 0 24px 70px rgba(0,0,0,.38);

  --btnBg: rgba(20, 28, 56, .62);
  --btnText: rgba(245,248,255,.92);
}

*{ box-sizing:border-box; }
html, body{ height:100%; }

body{
  margin:0;
  font-family:'Poppins', sans-serif;
  color: var(--text);
  line-height:1.7;
  overflow-x:hidden;

  background:
    radial-gradient(1200px 800px at 20% 10%, rgba(255,255,255,.55) 0%, transparent 55%),
    radial-gradient(1200px 800px at 80% 20%, rgba(255,255,255,.35) 0%, transparent 60%),
    linear-gradient(180deg, var(--bg1), var(--bg2));

  transition: background 600ms ease, color 300ms ease;
}

/* كنت */
#sky{
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -3;
}

/* عع */
.sky-overlay{
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  transition: opacity 600ms ease, filter 600ms ease, transform 600ms ease;
}

body:not(.dark-mode) .sky-overlay{
  opacity: 1;
  filter: saturate(1.05);
  background:
    radial-gradient(900px 520px at 20% 18%, rgba(255,255,255,.70) 0%, transparent 55%),
    radial-gradient(1000px 560px at 80% 16%, rgba(255,255,255,.55) 0%, transparent 60%),
    radial-gradient(900px 520px at 55% 40%, rgba(255,255,255,.45) 0%, transparent 60%),
    radial-gradient(1100px 640px at 60% 80%, rgba(255,255,255,.22) 0%, transparent 65%);
  animation: drift 18s ease-in-out infinite;
}

body.dark-mode .sky-overlay{
  opacity: 1;
  filter: saturate(1.12) contrast(1.05);
  background:
    radial-gradient(900px 520px at 15% 20%, rgba(46,233,255,.14) 0%, transparent 55%),
    radial-gradient(1100px 640px at 80% 30%, rgba(248,200,220,.10) 0%, transparent 60%),
    radial-gradient(900px 520px at 55% 78%, rgba(138,92,255,.10) 0%, transparent 60%),
    linear-gradient(180deg, rgba(2,4,15,.28), rgba(2,4,15,.78));
}

@keyframes drift{
  0%{ transform: translate3d(0,0,0) scale(1); }
  50%{ transform: translate3d(18px,-10px,0) scale(1.02); }
  100%{ transform: translate3d(0,0,0) scale(1); }
}

@media (prefers-reduced-motion: reduce){
  .sky-overlay{ animation: none !important; }
  *{ transition: none !important; scroll-behavior: auto !important; }
}

/* ااااا */
.container{
  width: min(1000px, 92vw);
  margin: 0 auto;
  padding: 22px 0 34px;
}

.grid{
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 14px;
}

/* Sea-زجاجس */
.sea-glass{
  position: relative;
  background: linear-gradient(135deg, var(--glass), var(--glass2));
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));
  overflow: hidden;
}

.sea-glass::before{
  content:"";
  position:absolute;
  inset:-2px;
  background:
    radial-gradient(700px 240px at 15% 10%, rgba(255,255,255,.28) 0%, transparent 60%),
    radial-gradient(520px 200px at 90% 0%, rgba(255,255,255,.16) 0%, transparent 65%),
    linear-gradient(90deg, rgba(43,212,255,.08), transparent 40%, rgba(248,200,220,.08));
  opacity: .9;
  pointer-events:none;
  mix-blend-mode: overlay;
}

.sea-glass::after{
  content:"";
  position:absolute;
  inset:0;
  background:
    radial-gradient(12px 12px at 18% 70%, rgba(255,255,255,.18) 0%, transparent 60%),
    radial-gradient(10px 10px at 65% 30%, rgba(255,255,255,.14) 0%, transparent 60%),
    radial-gradient(16px 16px at 85% 78%, rgba(255,255,255,.12) 0%, transparent 60%);
  opacity: .9;
  pointer-events:none;
}

/* هيرو */
.hero{
  border-radius: var(--radius2);
  padding: clamp(18px, 3.8vw, 28px);
  text-align: center;
}

.hero__inner{
  display:flex;
  gap: 16px;
  align-items:center;
  justify-content:center;
  flex-wrap: wrap;
}

.hero__text h1{
  font-family: 'Playfair Display', serif;
  font-size: clamp(30px, 4.6vw, 46px);
  margin: 0 0 6px;
  letter-spacing: .2px;
  text-shadow: 0 12px 40px rgba(0,0,0,.18);
}

.hero__text p{
  margin: 0 0 14px;
  color: var(--muted);
  font-weight: 600;
}

.hero__shine{
  position:absolute;
  inset:-2px;
  background:
    radial-gradient(900px 260px at 20% 0%, rgba(255,255,255,.22) 0%, transparent 55%),
    radial-gradient(700px 220px at 80% 0%, rgba(255,255,255,.14) 0%, transparent 55%);
  opacity: .85;
  pointer-events:none;
  mix-blend-mode: overlay;
}

.avatar-wrap{
  width: 110px;
  height: 110px;
  position: relative;
  flex: 0 0 auto;
  border-radius: 50%;
  overflow: visible;
}

.avatar{
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  display:block;
  position: relative;
  z-index: 3;

  border: 2px solid rgba(255,255,255,.28);
  box-shadow: 0 18px 55px rgba(0,0,0,.28);
  transform: translateZ(0);
}

/* صورةe */
.avatar-glow{
  position:absolute;
  inset:-14px;
  border-radius: 50%;
  z-index: 1;
  background:
    radial-gradient(circle at 30% 30%, rgba(46,233,255,.42), transparent 55%),
    radial-gradient(circle at 70% 70%, rgba(248,200,220,.26), transparent 55%),
    radial-gradient(circle at 50% 90%, rgba(138,92,255,.18), transparent 60%);
  filter: blur(8px);
  opacity: .95;
  animation: pulse 2.9s ease-in-out infinite;
}

@keyframes pulse{
  0%,100%{ transform: scale(1); opacity: .85; }
  50%{ transform: scale(1.08); opacity: 1; }
}

/* الزجاج */
.avatar-ring{
  position:absolute;
  inset:-6px;
  border-radius: 50%;
  z-index: 2;
  background: linear-gradient(135deg, rgba(255,255,255,.20), rgba(255,255,255,.06));
  border: 1px solid rgba(180,255,245,.22);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.avatar-shine{
  position:absolute;
  inset: 0;
  border-radius: 50%;
  z-index: 4;
  pointer-events:none;
  background:
    radial-gradient(60px 38px at 30% 25%, rgba(255,255,255,.45), transparent 70%),
    radial-gradient(70px 44px at 70% 10%, rgba(255,255,255,.22), transparent 70%);
  mix-blend-mode: screen;
  opacity: .9;
}

/* الازرار */
.btn{
  display:inline-flex;
  align-items:center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: linear-gradient(135deg, var(--btnBg), rgba(255,255,255,.08));
  color: var(--btnText);
  cursor: pointer;
  font-weight: 700;
  transition: transform 160ms ease, box-shadow 250ms ease, background 300ms ease;
  box-shadow: 0 14px 35px rgba(0,0,0,.16);
  user-select:none;
}

.btn:hover{ transform: translateY(-1px); box-shadow: 0 18px 48px rgba(0,0,0,.22); }
.btn:active{ transform: translateY(0) scale(.98); }
.btn:focus-visible{ outline: none; box-shadow: 0 0 0 3px rgba(46,233,255,.28), 0 18px 48px rgba(0,0,0,.22); }

.btn__icon{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display:grid;
  place-items:center;
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.10);
}

/* كرت الكتابات */
.card{
  padding: 20px;
  grid-column: span 6;
  transition: transform 220ms ease, border-color 300ms ease;
}

.card:hover{
  transform: translateY(-2px);
  border-color: rgba(46,233,255,.32);
}

.card--wide{ grid-column: span 12; }

.card h2{
  font-family: 'Playfair Display', serif;
  margin: 0 0 12px;
  font-size: 26px;
  color: var(--accent);
  letter-spacing: .2px;
}

.card p{
  margin: 0;
  color: var(--muted);
}

/* الاستايلات */
.chips{
  list-style:none;
  padding:0;
  margin:0;
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chips li{
  background: rgba(255,255,255,.22);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--stroke);
  font-weight: 700;
  min-width: 92px;
  text-align:center;
}

/* البروجيكت */
.list{
  padding-left: 18px;
  margin: 0;
}
.list li{
  margin: 6px 0;
  font-weight: 600;
  color: var(--muted);
}

.mono{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  word-break: break-word;
}

.footer{
  margin-top: 18px;
  display:flex;
  gap: 10px;
  align-items:center;
  justify-content:center;
  color: var(--muted);
  font-weight: 700;
  letter-spacing: .2px;
}

.dot{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(180deg, var(--accent2), var(--accent));
  box-shadow: 0 12px 26px rgba(0,0,0,.18);
}

@media (max-width: 920px){
  .card{ grid-column: span 12; }
}

@media (max-width: 520px){
  .container{ width: 94vw; }
  .card{ padding: 18px; }
  .chips li{ min-width: 84px; }
  .avatar-wrap, .avatar{ width: 96px; height: 96px; }
}
