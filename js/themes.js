const ThemeEngine = (() => {
  let canvas, ctx, W, H, T = 0, frame, active = 'aurora';
  const S = {};

  const THEMES = {
    aurora:   { name: 'Aurora',    accent: '#00ff88', dot: 'linear-gradient(135deg,#00ff88,#7c3aed)' },
    ocean:    { name: 'Ocean',     accent: '#00c8ff', dot: 'linear-gradient(135deg,#0066cc,#00e4ff)' },
    galaxy:   { name: 'Galaxy',    accent: '#a78bfa', dot: 'linear-gradient(135deg,#0d0020,#7c3aed,#ec4899)' },
    ember:    { name: 'Ember',     accent: '#ff8c00', dot: 'linear-gradient(135deg,#ff2200,#ffcc00)' },
    cyber:    { name: 'Cyber',     accent: '#00ff9f', dot: 'linear-gradient(135deg,#020610,#00ff9f)' },
    sakura:   { name: 'Sakura',   accent: '#ffb7c5', dot: 'linear-gradient(135deg,#2d1b5e,#ffb7c5)' },
    matrix:   { name: 'Matrix',    accent: '#00ff41', dot: 'linear-gradient(135deg,#000,#003a00,#00ff41)' },
    tron:     { name: 'Tron',      accent: '#00e5ff', dot: 'linear-gradient(135deg,#00021e,#0050aa,#00e5ff)' },
    nebula:   { name: 'Nebula',    accent: '#ff9de2', dot: 'linear-gradient(135deg,#04000e,#8b00ff,#ff6b35,#ff9de2)' },
    neonRain: { name: 'Neon Rain', accent: '#ff00cc', dot: 'linear-gradient(135deg,#040008,#5500aa,#ff00cc,#00ccff)' },
    plasma:   { name: 'Plasma',    accent: '#ff00ff', dot: 'linear-gradient(135deg,#ff0080,#ff00ff,#00ffff,#ffff00)' },
    void:     { name: 'Void',      accent: '#9d00ff', dot: 'linear-gradient(135deg,#000,#1a0033,#9d00ff)' },
    glitch:     { name: 'Glitch',     accent: '#ff0050', dot: 'linear-gradient(135deg,#020208,#ff0050,#00ff80,#0050ff)' },
    synthwave:  { name: 'Synthwave',  accent: '#ff00cc', dot: 'linear-gradient(135deg,#07000f,#ff00cc,#cc00ff,#ff9de2)' },
    hologram:   { name: 'Hologram',   accent: '#00dcff', dot: 'linear-gradient(135deg,#000c12,#00dcff,#00ffaa)' },
    bloodMoon:  { name: 'Blood Moon', accent: '#ff2200', dot: 'linear-gradient(135deg,#050000,#880000,#ff2200,#ff6622)' },
    quantum:    { name: 'Quantum',    accent: '#ff88ff', dot: 'linear-gradient(135deg,#02020c,#ff00ff,#00ffff,#ffff00,#ff0088)' },
    lava:       { name: 'Lava',       accent: '#ff6600', dot: 'linear-gradient(135deg,#0a0200,#cc2200,#ff6600,#ffcc00)' },
    arctic:   { name: 'Arctic',    accent: '#00eeff', dot: 'linear-gradient(135deg,#000510,#ffffff,#00eeff,#0088ff)' },
    crimson:  { name: 'Crimson',  accent: '#ff0044', dot: 'linear-gradient(135deg,#000,#ff0044,#ffffff)' },
    midnight: { name: 'Midnight', accent: '#ffffff', dot: 'linear-gradient(135deg,#000,#111,#ffffff,#aaaaaa)' },
    frost:    { name: 'Frost',     accent: '#a0e8ff', dot: 'linear-gradient(135deg,#000814,#003366,#a0e8ff,#ffffff)' },
    toxic:    { name: 'Toxic',     accent: '#aaff00', dot: 'linear-gradient(135deg,#000500,#004400,#aaff00,#44ff44)' },
    inferno:  { name: 'Inferno',   accent: '#ff8800', dot: 'linear-gradient(135deg,#0a0000,#660000,#ff3300,#ff9900,#ffff00)' },
    deepSea:  { name: 'Deep Sea',  accent: '#00ffcc', dot: 'linear-gradient(135deg,#00000a,#000033,#003366,#00ffcc)' },
    neonCity: { name: 'Neon City', accent: '#ff00aa', dot: 'linear-gradient(135deg,#000008,#220033,#ff00aa,#00eeff,#ffff00)' },
    storm:    { name: 'Storm',     accent: '#7788ff', dot: 'linear-gradient(135deg,#05050f,#1a1a3a,#7788ff,#aabbff)' },
  };

  // ── Existing init helpers ───────────────────────────────
  function initOcean() {
    S.waves = Array.from({ length: 5 }, (_, i) => ({
      amp: 28 + i * 14,
      freq: 0.0028 + i * 0.0009,
      speed: 0.28 + i * 0.14,
      yBase: 0.42 + i * 0.09,
      alpha: 0.14 + i * 0.04,
      r: 0, g: 90 + i * 28, b: 180 + i * 14,
    }));
  }

  function initGalaxy() {
    S.stars = Array.from({ length: 420 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.7 + 0.3,
      spd: Math.random() * 0.9 + 0.3,
      ph: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.82,
    }));
  }

  function initEmber() {
    S.sparks = Array.from({ length: 140 }, () => newSpark());
  }

  function newSpark() {
    return {
      x: (Math.random() * 1.4 - 0.2) * W,
      y: H + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.9,
      vy: -(Math.random() * 2.2 + 0.9),
      life: 1,
      decay: Math.random() * 0.006 + 0.003,
      r: Math.random() * 2.8 + 0.8,
    };
  }

  function initCyber() {
    S.nodes = [];
    const cols = 9, rows = 6;
    for (let c = 0; c <= cols; c++)
      for (let r = 0; r <= rows; r++)
        S.nodes.push({
          x: (c / cols) * W, y: (r / rows) * H,
          on: Math.random() > 0.55,
          ph: Math.random() * Math.PI * 2,
        });
    S.gW = W / cols;
    S.gH = H / rows;
  }

  function initSakura() {
    S.petals = Array.from({ length: 90 }, () => newPetal(true));
  }

  function newPetal(scatter) {
    return {
      x: Math.random() * W,
      y: scatter ? Math.random() * H : -12,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 0.9 + 0.35,
      r: Math.random() * 4 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      alpha: Math.random() * 0.55 + 0.2,
      pink: Math.random() > 0.5,
    };
  }

  // ── New theme init helpers ──────────────────────────────

  // Matrix: pre-build character grid per column
  const MAT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ$#@%&!?><+-=|';
  function rmc() { return MAT_CHARS[Math.floor(Math.random() * MAT_CHARS.length)]; }

  function initMatrix() {
    const cW = 14;
    const cols = Math.floor(W / cW) + 1;
    S.matCols = cols;
    S.matCW = cW;
    S.matCH = 16;
    S.drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -(H / 16)));
    S.matChars = Array.from({ length: cols }, () =>
      Array.from({ length: Math.ceil(H / 16) + 8 }, () => rmc())
    );
    S.matSpeeds = Array.from({ length: cols }, () => Math.random() * 0.38 + 0.14);
    S.matLastMut = 0;
    // Fill canvas black immediately so trail effect starts clean
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
  }

  function initTron() {
    const gs = 55;
    S.tGs = gs;
    S.tNodes = [];
    for (let x = gs; x < W; x += gs)
      for (let y = gs; y < H; y += gs)
        if (Math.random() > 0.78)
          S.tNodes.push({ x, y, ph: Math.random() * Math.PI * 2 });
    S.tLines = Array.from({ length: 10 }, () => newTronLine());
  }

  function newTronLine() {
    const gs = S.tGs || 55;
    const dir = Math.floor(Math.random() * 4);
    return {
      x: Math.round(Math.random() * (W / gs)) * gs,
      y: Math.round(Math.random() * (H / gs)) * gs,
      dir,
      progress: 0,
      maxLen: (Math.floor(Math.random() * 7) + 3) * gs,
      spd: gs * 0.65,
      hue: Math.random() > 0.4 ? 186 : 204,
      a: Math.random() * 0.4 + 0.5,
      done: false,
    };
  }

  function initNebula() {
    S.nebStars = Array.from({ length: 360 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.25,
      spd: Math.random() * 0.9 + 0.25,
      ph: Math.random() * Math.PI * 2,
    }));
  }

  function initNeonRain() {
    S.rain = Array.from({ length: 230 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      spd: Math.random() * 6 + 4,
      len: Math.random() * 18 + 8,
      a: Math.random() * 0.3 + 0.08,
    }));
  }

  // ── Existing render helpers ─────────────────────────────
  function renderAurora() {
    ctx.fillStyle = '#02071a';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const blobs = [
      { bx: 0.5 + Math.sin(T * 0.15) * 0.27,       by: 0.38, c: [0, 255, 136],   r: 0.55 },
      { bx: 0.34 + Math.sin(T * 0.12 + 1.5) * 0.2,  by: 0.46, c: [0, 195, 255],   r: 0.5  },
      { bx: 0.66 + Math.sin(T * 0.18 + 3.1) * 0.2,  by: 0.43, c: [120, 80, 255],  r: 0.45 },
      { bx: 0.5  + Math.sin(T * 0.1  + 2) * 0.3,    by: 0.56, c: [220, 55, 175],  r: 0.4  },
      { bx: 0.28 + Math.sin(T * 0.21 + 4) * 0.15,   by: 0.34, c: [0, 255, 195],   r: 0.32 },
    ];

    blobs.forEach(b => {
      const cx = b.bx * W, cy = b.by * H;
      const radius = b.r * H;
      const angle = T * 0.05 + b.c[0] * 0.012;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g.addColorStop(0,   `rgba(${b.c},0.38)`);
      g.addColorStop(0.4, `rgba(${b.c},0.12)`);
      g.addColorStop(1,   `rgba(${b.c},0)`);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.scale(2.1, 0.38);
      ctx.translate(-cx, -cy);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }

  function renderOcean() {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#000e1a');
    bg.addColorStop(1, '#001e38');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const caustic = ctx.createLinearGradient(0, 0, 0, H * 0.28);
    caustic.addColorStop(0, 'rgba(0,90,170,0.18)');
    caustic.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = caustic;
    ctx.fillRect(0, 0, W, H * 0.28);

    S.waves.forEach(w => {
      const baseY = w.yBase * H;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = baseY
          + Math.sin(x * w.freq + T * w.speed) * w.amp
          + Math.sin(x * w.freq * 2.4 + T * w.speed * 1.6) * w.amp * 0.38;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      const g = ctx.createLinearGradient(0, baseY - w.amp, 0, H);
      g.addColorStop(0,   `rgba(${w.r},${w.g},${w.b},${w.alpha * 2.2})`);
      g.addColorStop(0.4, `rgba(${w.r},${w.g},${w.b},${w.alpha})`);
      g.addColorStop(1,   `rgba(${w.r},${w.g},${w.b},0)`);
      ctx.fillStyle = g;
      ctx.fill();
    });
    ctx.restore();
  }

  function renderGalaxy() {
    ctx.fillStyle = '#020007';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    [
      { nx: 0.26, ny: 0.4,  nr: 0.34, c: '60,10,100' },
      { nx: 0.74, ny: 0.45, nr: 0.29, c: '10,40,105' },
      { nx: 0.5,  ny: 0.26, nr: 0.24, c: '100,10,65' },
      { nx: 0.62, ny: 0.65, nr: 0.27, c: '28,68,120' },
    ].forEach(n => {
      const g = ctx.createRadialGradient(n.nx * W, n.ny * H, 0, n.nx * W, n.ny * H, n.nr * W);
      g.addColorStop(0, `rgba(${n.c},0.5)`);
      g.addColorStop(1, `rgba(${n.c},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    S.stars.forEach(s => {
      const a = 0.28 + 0.72 * (0.5 + 0.5 * Math.sin(T * s.spd + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm
        ? `rgba(255,220,180,${a})`
        : s.r > 1.3 ? `rgba(180,210,255,${a})` : `rgba(255,255,255,${a})`;
      ctx.fill();
      if (s.r > 1.3 && a > 0.68) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.warm ? '255,200,140' : '160,190,255'},${a * 0.14})`;
        ctx.fill();
      }
    });
    ctx.restore();
  }

  function renderEmber() {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#060100');
    bg.addColorStop(1, '#1a0500');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const glow = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, W * 0.85);
    glow.addColorStop(0,   'rgba(255,55,0,0.42)');
    glow.addColorStop(0.3, 'rgba(255,95,0,0.2)');
    glow.addColorStop(0.6, 'rgba(255,140,0,0.07)');
    glow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    S.sparks.forEach(p => {
      p.life -= p.decay;
      p.x += p.vx + Math.sin(T * 2.2 + p.x * 0.012) * 0.32;
      p.y += p.vy;
      if (p.life <= 0 || p.y < -8) Object.assign(p, newSpark());

      const t = 1 - p.life;
      const r = 255, g = t < 0.35 ? 210 : t < 0.65 ? 130 : 45, b = 0;
      const a = p.life * 0.88;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.18})`;
      ctx.fill();
    });
    ctx.restore();
  }

  function renderCyber() {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#020610');
    bg.addColorStop(1, '#030c18');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let x = 0; x <= W; x += S.gW) {
      const a = 0.055 + Math.sin(T * 0.45 + x * 0.01) * 0.018;
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.strokeStyle = `rgba(0,255,159,${a})`;
      ctx.lineWidth = 1; ctx.stroke();
    }
    for (let y = 0; y <= H; y += S.gH) {
      const a = 0.055 + Math.sin(T * 0.32 + y * 0.01) * 0.018;
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.strokeStyle = `rgba(0,255,159,${a})`;
      ctx.lineWidth = 1; ctx.stroke();
    }

    const hz = ctx.createLinearGradient(0, H * 0.42, 0, H * 0.58);
    hz.addColorStop(0,   'rgba(0,180,255,0)');
    hz.addColorStop(0.5, 'rgba(0,180,255,0.07)');
    hz.addColorStop(1,   'rgba(0,180,255,0)');
    ctx.fillStyle = hz;
    ctx.fillRect(0, 0, W, H);

    S.nodes.forEach(n => {
      if (!n.on) return;
      const pulse = 0.5 + 0.5 * Math.sin(T * 2.1 + n.ph);
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,159,${0.38 + pulse * 0.62})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,159,${pulse * 0.14})`;
      ctx.fill();
    });

    const scanY = (T * 85) % H;
    const scan = ctx.createLinearGradient(0, scanY - 3, 0, scanY + 3);
    scan.addColorStop(0,   'rgba(0,255,159,0)');
    scan.addColorStop(0.5, 'rgba(0,255,159,0.14)');
    scan.addColorStop(1,   'rgba(0,255,159,0)');
    ctx.fillStyle = scan;
    ctx.fillRect(0, scanY - 3, W, 6);

    ctx.restore();
  }

  function renderSakura() {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#100820');
    bg.addColorStop(0.5, '#2d1b5e');
    bg.addColorStop(1, '#18083a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const moon = ctx.createRadialGradient(W * 0.76, H * 0.18, 0, W * 0.76, H * 0.18, H * 0.42);
    moon.addColorStop(0,   'rgba(255,240,200,0.11)');
    moon.addColorStop(0.3, 'rgba(255,200,220,0.04)');
    moon.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = moon;
    ctx.fillRect(0, 0, W, H);

    [
      { bx: 0.2,  by: 0.72, br: 0.26, c: '195,95,148' },
      { bx: 0.82, by: 0.32, br: 0.21, c: '145,75,200' },
      { bx: 0.52, by: 0.52, br: 0.16, c: '175,95,175' },
    ].forEach(b => {
      const g = ctx.createRadialGradient(b.bx * W, b.by * H, 0, b.bx * W, b.by * H, b.br * W);
      g.addColorStop(0, `rgba(${b.c},0.14)`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    S.petals.forEach(p => {
      p.x += p.vx + Math.sin(T * 0.52 + p.y * 0.012) * 0.32;
      p.y += p.vy;
      p.angle += p.spin;
      if (p.y > H + 14) Object.assign(p, newPetal(false));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.pink
        ? `rgba(255,183,197,${p.alpha})`
        : `rgba(255,155,195,${p.alpha})`;
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }

  // ── New render helpers ──────────────────────────────────

  function renderMatrix() {
    // Fade trail: semi-transparent black each frame
    ctx.fillStyle = 'rgba(0,0,0,0.055)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${S.matCH - 2}px "Courier New", monospace`;

    // Randomly mutate a few characters per frame
    if (T - S.matLastMut > 0.06) {
      S.matLastMut = T;
      const n = Math.ceil(S.matCols * 0.08);
      for (let i = 0; i < n; i++) {
        const col = Math.floor(Math.random() * S.matCols);
        const row = Math.floor(Math.random() * S.matChars[col].length);
        S.matChars[col][row] = rmc();
      }
    }

    S.drops.forEach((drop, col) => {
      S.drops[col] += S.matSpeeds[col];
      const headRow = Math.floor(S.drops[col]);
      const x = col * S.matCW;
      const trailLen = 28;

      for (let i = 0; i <= trailLen; i++) {
        const row = headRow - i;
        if (row < 0) continue;
        const y = row * S.matCH;
        if (y > H) continue;
        const ch = S.matChars[col][row % S.matChars[col].length];
        if (i === 0) {
          ctx.fillStyle = 'rgba(210,255,210,1)';
        } else if (i < 3) {
          ctx.fillStyle = `rgba(60,255,60,${1 - i * 0.22})`;
        } else {
          const a = Math.max(0, 1 - i / (trailLen + 2));
          ctx.fillStyle = `rgba(0,${Math.floor(130 + 125 * a)},${Math.floor(30 * a)},${a})`;
        }
        ctx.fillText(ch, x, y);
      }

      if (S.drops[col] * S.matCH > H + trailLen * S.matCH) {
        S.drops[col] = Math.random() * -22;
      }
    });
  }

  function renderTron() {
    ctx.fillStyle = '#00020e';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Grid lines
    const gs = S.tGs;
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += gs) {
      const a = 0.038 + Math.sin(T * 0.4 + x * 0.008) * 0.012;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.strokeStyle = `rgba(0,190,255,${a})`; ctx.stroke();
    }
    for (let y = 0; y <= H; y += gs) {
      const a = 0.038 + Math.sin(T * 0.3 + y * 0.008) * 0.012;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.strokeStyle = `rgba(0,190,255,${a})`; ctx.stroke();
    }

    // Horizon ambient glow
    const hz = ctx.createLinearGradient(0, H * 0.38, 0, H * 0.62);
    hz.addColorStop(0,   'rgba(0,140,255,0)');
    hz.addColorStop(0.5, 'rgba(0,140,255,0.055)');
    hz.addColorStop(1,   'rgba(0,140,255,0)');
    ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H);

    // Light cycle lines
    S.tLines.forEach((line, i) => {
      if (line.done) return;
      const dt = 1 / 60;
      line.progress = Math.min(line.progress + line.spd * dt, line.maxLen);
      const dx = [1, 0, -1, 0][line.dir];
      const dy = [0, 1, 0, -1][line.dir];
      const ex = line.x + dx * line.progress;
      const ey = line.y + dy * line.progress;

      ctx.shadowBlur = 14;
      ctx.shadowColor = `hsla(${line.hue},100%,65%,1)`;
      ctx.beginPath(); ctx.moveTo(line.x, line.y); ctx.lineTo(ex, ey);
      ctx.strokeStyle = `hsla(${line.hue},100%,65%,${line.a})`;
      ctx.lineWidth = 2; ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${line.hue},100%,92%,1)`; ctx.fill();

      if (line.progress >= line.maxLen) {
        line.done = true;
        setTimeout(() => { S.tLines[i] = newTronLine(); }, Math.random() * 700 + 150);
      }
    });

    // Pulsing nodes
    S.tNodes.forEach(n => {
      const p = 0.5 + 0.5 * Math.sin(T * 2.3 + n.ph);
      ctx.beginPath(); ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,220,255,${0.3 + p * 0.7})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,220,255,${p * 0.12})`; ctx.fill();
    });

    ctx.restore();
  }

  function renderNebula() {
    ctx.fillStyle = '#000006';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const clouds = [
      { bx: 0.28 + Math.sin(T * 0.03) * 0.04,       by: 0.38, c: [205, 65, 148], r: 0.44 },
      { bx: 0.7  + Math.sin(T * 0.025 + 1) * 0.04,  by: 0.5,  c: [60, 110, 230], r: 0.38 },
      { bx: 0.5  + Math.sin(T * 0.028 + 2) * 0.04,  by: 0.28, c: [225, 95, 55],  r: 0.32 },
      { bx: 0.18 + Math.sin(T * 0.032 + 3) * 0.03,  by: 0.62, c: [110, 55, 235], r: 0.30 },
      { bx: 0.82 + Math.sin(T * 0.02  + 4) * 0.03,  by: 0.32, c: [55, 195, 135], r: 0.28 },
      { bx: 0.6  + Math.sin(T * 0.027 + 5) * 0.04,  by: 0.65, c: [195, 45, 190], r: 0.26 },
    ];

    clouds.forEach(c => {
      const cx = c.bx * W, cy = c.by * H;
      const r = c.r * Math.max(W, H);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   `rgba(${c.c.join(',')}, 0.52)`);
      g.addColorStop(0.38,`rgba(${c.c.join(',')}, 0.22)`);
      g.addColorStop(1,   `rgba(${c.c.join(',')}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // Stars
    S.nebStars.forEach(s => {
      const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(T * s.spd + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
    });

    ctx.restore();
  }

  function initVoid() {
    S.vParts = Array.from({ length: 220 }, () => newVoidParticle());
  }

  function newVoidParticle() {
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * Math.max(W, H) * 0.52 + 60;
    return {
      angle, dist,
      spin:   (Math.random() * 0.012 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      inward: Math.random() * 0.28 + 0.08,
      size:   Math.random() * 2.8 + 0.4,
      hue:    Math.random() * 60 + 255,
      alpha:  Math.random() * 0.7 + 0.25,
    };
  }

  function initGlitch() {
    S.gBars = Array.from({ length: 14 }, () => newGlitchBar());
    S.gIntensity = 0;
  }

  function newGlitchBar() {
    return {
      y:     Math.random() * H,
      h:     Math.random() * 22 + 2,
      dx:    (Math.random() - 0.5) * 70,
      alpha: Math.random() * 0.35 + 0.08,
      life:  Math.random() * 0.5 + 0.1,
      decay: Math.random() * 0.025 + 0.008,
      col:   Math.floor(Math.random() * 3),
    };
  }

  function renderNeonRain() {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#030006');
    bg.addColorStop(0.65, '#07000e');
    bg.addColorStop(1, '#0a0018');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Neon glow blobs
    [
      { x: 0.15, y: 0.55, c: [255, 0, 180],  r: 0.28, ph: 0   },
      { x: 0.85, y: 0.5,  c: [0, 200, 255],  r: 0.25, ph: 1.5 },
      { x: 0.5,  y: 0.63, c: [155, 0, 255],  r: 0.22, ph: 3   },
      { x: 0.3,  y: 0.44, c: [255, 80, 0],   r: 0.19, ph: 4.5 },
      { x: 0.7,  y: 0.35, c: [0, 255, 180],  r: 0.18, ph: 6   },
    ].forEach(b => {
      const pulse = 0.68 + 0.32 * Math.sin(T * 2.4 + b.ph);
      const g = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, b.r * W);
      g.addColorStop(0,   `rgba(${b.c.join(',')}, ${0.3 * pulse})`);
      g.addColorStop(0.5, `rgba(${b.c.join(',')}, ${0.11 * pulse})`);
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    ctx.restore();

    // Rain streaks drawn on top (additive not screen)
    ctx.save();
    ctx.lineWidth = 0.8;
    S.rain.forEach(drop => {
      drop.y += drop.spd;
      if (drop.y > H + drop.len) { drop.y = -drop.len; drop.x = Math.random() * W; }
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.spd * 0.1, drop.y + drop.len);
      ctx.strokeStyle = `rgba(155,215,255,${drop.a})`;
      ctx.stroke();
    });
    ctx.restore();
  }

  function renderPlasma() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 7; i++) {
      const cx = (0.5 + Math.sin(T * 0.22 + i * 1.45) * 0.38) * W;
      const cy = (0.5 + Math.cos(T * 0.18 + i * 1.1)  * 0.32) * H;
      const hue = (T * 35 + i * 51.4) % 360;
      const r   = Math.max(W, H) * (0.38 + Math.sin(T * 0.15 + i) * 0.1);
      const g   = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   `hsla(${hue},100%,65%,0.4)`);
      g.addColorStop(0.45,`hsla(${(hue+50)%360},100%,55%,0.15)`);
      g.addColorStop(1,   `hsla(${(hue+100)%360},100%,45%,0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function renderVoid() {
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const cx = W / 2, cy = H / 2;

    // Outer glow halo
    const halo = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(W,H) * 0.5);
    halo.addColorStop(0,   'rgba(120,0,255,0.18)');
    halo.addColorStop(0.4, 'rgba(60,0,120,0.07)');
    halo.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);

    // Accretion ring
    const ring = ctx.createRadialGradient(cx, cy, 36, cx, cy, 95);
    ring.addColorStop(0,   'rgba(0,0,0,0)');
    ring.addColorStop(0.45,'rgba(180,80,255,0.15)');
    ring.addColorStop(0.6, 'rgba(100,40,200,0.08)');
    ring.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ring; ctx.fillRect(0, 0, W, H);

    // Orbiting particles
    S.vParts.forEach(p => {
      p.angle += p.spin;
      p.dist  -= p.inward;
      if (p.dist < 22) Object.assign(p, newVoidParticle());

      const x = cx + Math.cos(p.angle) * p.dist;
      const y = cy + Math.sin(p.angle) * p.dist * 0.62;
      const fade = Math.min(1, p.dist / 120) * p.alpha;
      ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${fade})`; ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';
    // Black hole core — absorbs all light
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
    core.addColorStop(0,   'rgba(0,0,0,1)');
    core.addColorStop(0.75,'rgba(0,0,0,1)');
    core.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = core; ctx.fillRect(0, 0, W, H);

    ctx.restore();
  }

  function renderGlitch() {
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Ambient blue tint
    const amb = ctx.createRadialGradient(W/2,H/2,0, W/2,H/2,Math.max(W,H)*0.6);
    amb.addColorStop(0, 'rgba(0,30,80,0.28)');
    amb.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = amb; ctx.fillRect(0, 0, W, H);

    // Scanlines
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, y, W, 2);
    }

    // Random glitch trigger
    if (Math.random() > 0.97) S.gIntensity = 1.8;
    if (S.gIntensity > 0) {
      S.gIntensity = Math.max(0, S.gIntensity - 0.045);
      const bars = Math.ceil(S.gIntensity * 9);
      for (let i = 0; i < bars; i++) {
        const y  = Math.random() * H;
        const h  = Math.random() * 28 + 2;
        const dx = (Math.random() - 0.5) * 90 * S.gIntensity;
        const cols = ['rgba(255,0,70,0.2)','rgba(0,255,100,0.18)','rgba(0,100,255,0.2)'];
        ctx.fillStyle = cols[i % 3];
        ctx.fillRect(dx, y, W, h);
      }
    }

    // Persistent glitch bars
    S.gBars.forEach((b, i) => {
      b.life -= b.decay;
      if (b.life <= 0) { S.gBars[i] = newGlitchBar(); return; }
      const cols = ['rgba(255,0,70,','rgba(0,255,100,','rgba(0,100,255,'];
      ctx.fillStyle = cols[b.col] + (b.alpha * b.life) + ')';
      ctx.fillRect(b.dx, b.y, W, b.h);
    });

    ctx.restore();
  }

  // ── Synthwave ────────────────────────────────────────────
  function renderSynthwave() {
    ctx.fillStyle = '#07000f';
    ctx.fillRect(0, 0, W, H);
    const hy = H * 0.52;

    // Sky aurora
    const sky = ctx.createLinearGradient(0, 0, 0, hy);
    sky.addColorStop(0,   'rgba(30,0,60,1)');
    sky.addColorStop(0.6, 'rgba(60,0,80,0.8)');
    sky.addColorStop(1,   'rgba(120,0,100,0.4)');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hy);

    // Stars
    if (!S.swStars) S.swStars = Array.from({length:120},()=>({ x:Math.random()*W, y:Math.random()*hy, r:Math.random()*1.2+0.2, ph:Math.random()*Math.PI*2 }));
    S.swStars.forEach(s => {
      const a = 0.5 + 0.5 * Math.sin(T * 1.1 + s.ph);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,200,255,${a * 0.8})`; ctx.fill();
    });

    // Sun glow
    const sg = ctx.createRadialGradient(W/2, hy, 0, W/2, hy, W * 0.55);
    sg.addColorStop(0,   'rgba(255,80,200,0.55)');
    sg.addColorStop(0.25,'rgba(180,0,200,0.25)');
    sg.addColorStop(0.6, 'rgba(80,0,120,0.1)');
    sg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);

    // Sun disc
    const sr = 68;
    ctx.save();
    ctx.beginPath(); ctx.arc(W/2, hy, sr, Math.PI, 0); ctx.closePath();
    const sd = ctx.createLinearGradient(W/2, hy - sr, W/2, hy);
    sd.addColorStop(0,   '#ff9de2');
    sd.addColorStop(0.4, '#ff2090');
    sd.addColorStop(1,   '#cc0066');
    ctx.fillStyle = sd; ctx.fill();
    // Stripes
    for (let i = 1; i <= 5; i++) {
      const sy = hy - i * 11;
      if (sy > hy - sr && sy < hy) {
        const hw = Math.sqrt(Math.max(0, sr*sr - (sy-hy)*(sy-hy)));
        ctx.fillStyle = '#07000f';
        ctx.fillRect(W/2 - hw, sy, hw * 2, 5 + i * 1.5);
      }
    }
    ctx.restore();

    // Perspective grid — floor
    ctx.save();
    const numV = 20;
    for (let i = 0; i <= numV; i++) {
      const t = i / numV;
      const alpha = 0.18 + 0.22 * (1 - Math.abs(t - 0.5) * 2);
      ctx.strokeStyle = `rgba(255,0,200,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(W/2, hy);
      ctx.lineTo(t * W, H);
      ctx.stroke();
    }
    const numH = 14;
    for (let i = 0; i < numH; i++) {
      const tp = ((i + (T * 0.5 % 1)) / numH);
      const ease = tp * tp;
      const y = hy + ease * (H - hy);
      const alpha = ease * 0.65;
      ctx.strokeStyle = `rgba(255,0,200,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    // Horizon glow
    const hg = ctx.createLinearGradient(0, hy - 2, 0, hy + 2);
    hg.addColorStop(0, 'rgba(255,0,200,0)');
    hg.addColorStop(0.5,'rgba(255,100,255,0.9)');
    hg.addColorStop(1, 'rgba(255,0,200,0)');
    ctx.fillStyle = hg; ctx.fillRect(0, hy - 2, W, 4);
    ctx.restore();
  }

  // ── Hologram ─────────────────────────────────────────────
  function initHologram() {
    S.holoParts = Array.from({length:60},()=>({
      x: Math.random()*W, y: Math.random()*H,
      vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5,
      r: Math.random()*1.5+0.4, ph: Math.random()*Math.PI*2,
    }));
    S.holoHexes = Array.from({length:25},()=>({
      x: Math.random()*W, y: Math.random()*H,
      size: Math.random()*30+14,
      ph: Math.random()*Math.PI*2,
      spd: Math.random()*0.4+0.1,
    }));
  }
  function renderHologram() {
    ctx.fillStyle = '#000c12';
    ctx.fillRect(0, 0, W, H);

    // Scanlines
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? 'rgba(0,200,255,0.025)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, y, W, 1);
    }

    // Center glow
    const cg = ctx.createRadialGradient(W/2,H/2,0, W/2,H/2,Math.max(W,H)*0.55);
    cg.addColorStop(0,   'rgba(0,220,255,0.07)');
    cg.addColorStop(0.5, 'rgba(0,100,180,0.04)');
    cg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

    // Hexagons
    ctx.save();
    S.holoHexes.forEach(h => {
      h.ph += h.spd * 0.012;
      const a = 0.08 + 0.1 * Math.abs(Math.sin(h.ph));
      ctx.strokeStyle = `rgba(0,220,255,${a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const px = h.x + Math.cos(ang) * h.size;
        const py = h.y + Math.sin(ang) * h.size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.stroke();
    });
    ctx.restore();

    // Floating particles
    S.holoParts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.ph += 0.02;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const a = 0.3 + 0.4 * Math.abs(Math.sin(p.ph));
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,220,255,${a})`; ctx.fill();
    });

    // Glitch flicker
    if (Math.random() > 0.975) {
      const y = Math.random() * H;
      const hh = Math.random() * 3 + 1;
      ctx.fillStyle = `rgba(0,255,255,${Math.random()*0.12})`;
      ctx.fillRect(0, y, W, hh);
    }

    // Vignette
    const vig = ctx.createRadialGradient(W/2,H/2,H*0.3, W/2,H/2,H*0.8);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,5,10,0.7)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
  }

  // ── Blood Moon ───────────────────────────────────────────
  function initBloodMoon() {
    S.bmParts = Array.from({length:80},()=>({
      x: Math.random()*W, y: H + Math.random()*40,
      vx:(Math.random()-0.5)*0.4,
      vy:-(Math.random()*0.5+0.15),
      r: Math.random()*1.8+0.4,
      life:1, decay: Math.random()*0.003+0.001,
    }));
    S.bmClouds = Array.from({length:6},()=>({
      x: Math.random()*W*1.4 - W*0.2, y: Math.random()*H*0.6,
      w: Math.random()*200+100, h: Math.random()*40+20,
      spd: Math.random()*0.15+0.05,
    }));
  }
  function renderBloodMoon() {
    ctx.fillStyle = '#050000';
    ctx.fillRect(0, 0, W, H);

    // Deep red ambient
    const amb = ctx.createRadialGradient(W/2,H*0.28,0, W/2,H*0.28,H*0.9);
    amb.addColorStop(0,   'rgba(140,0,0,0.25)');
    amb.addColorStop(0.4, 'rgba(60,0,0,0.15)');
    amb.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = amb; ctx.fillRect(0, 0, W, H);

    // Moon rings
    const mr = 95;
    for (let i = 3; i >= 1; i--) {
      const rr = ctx.createRadialGradient(W/2,H*0.28,mr+i*25, W/2,H*0.28,mr+i*55);
      rr.addColorStop(0, `rgba(180,0,0,${0.06/i})`);
      rr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rr; ctx.fillRect(0, 0, W, H);
    }

    // Moon disc
    const pulse = 1 + 0.025 * Math.sin(T * 0.8);
    const moonGrad = ctx.createRadialGradient(W/2-18,H*0.28-18,0, W/2,H*0.28,mr*pulse);
    moonGrad.addColorStop(0,   '#ff4422');
    moonGrad.addColorStop(0.35,'#cc1100');
    moonGrad.addColorStop(0.7, '#880000');
    moonGrad.addColorStop(1,   '#330000');
    ctx.beginPath(); ctx.arc(W/2, H*0.28, mr*pulse, 0, Math.PI*2);
    ctx.fillStyle = moonGrad; ctx.fill();

    // Surface craters
    const craters = [[0.35,0.32,8],[0.55,0.2,5],[0.45,0.4,12],[0.38,0.22,6]];
    craters.forEach(([fx,fy,cr]) => {
      const cx2 = W/2 + (fx-0.5)*mr*1.6;
      const cy2 = H*0.28 + (fy-0.5)*mr*1.6;
      ctx.beginPath(); ctx.arc(cx2, cy2, cr, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(40,0,0,0.35)'; ctx.fill();
    });

    // Drifting clouds
    S.bmClouds.forEach(c => {
      c.x -= c.spd;
      if (c.x + c.w < 0) c.x = W + 10;
      const cg2 = ctx.createRadialGradient(c.x + c.w/2, c.y + c.h/2, 0, c.x + c.w/2, c.y + c.h/2, c.w/2);
      cg2.addColorStop(0, 'rgba(30,0,0,0.18)');
      cg2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cg2;
      ctx.fillRect(c.x, c.y, c.w, c.h);
    });

    // Rising embers
    S.bmParts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
      if (p.life <= 0) {
        S.bmParts[i] = { x:Math.random()*W, y:H+5, vx:(Math.random()-0.5)*0.4, vy:-(Math.random()*0.5+0.15), r:Math.random()*1.8+0.4, life:1, decay:Math.random()*0.003+0.001 };
        return;
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,${Math.floor(p.life*60)},0,${p.life * 0.7})`; ctx.fill();
    });
  }

  // ── Quantum ──────────────────────────────────────────────
  function initQuantum() {
    S.qParts = Array.from({length:90},()=>({
      x: Math.random()*W, y: Math.random()*H,
      vx:(Math.random()-0.5)*1.2, vy:(Math.random()-0.5)*1.2,
      hue: Math.random()*360,
      r: Math.random()*2+1,
    }));
  }
  function renderQuantum() {
    ctx.fillStyle = 'rgba(2,2,12,0.18)';
    ctx.fillRect(0, 0, W, H);

    // Update + draw particles
    S.qParts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.hue = (p.hue + 0.3) % 360;
    });

    // Connection lines
    for (let i = 0; i < S.qParts.length; i++) {
      for (let j = i+1; j < S.qParts.length; j++) {
        const dx = S.qParts[i].x - S.qParts[j].x;
        const dy = S.qParts[i].y - S.qParts[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          const a = (1 - dist/110) * 0.5;
          ctx.strokeStyle = `hsla(${(S.qParts[i].hue+S.qParts[j].hue)/2},100%,70%,${a})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(S.qParts[i].x, S.qParts[i].y);
          ctx.lineTo(S.qParts[j].x, S.qParts[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    S.qParts.forEach(p => {
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*5);
      grd.addColorStop(0, `hsla(${p.hue},100%,85%,0.9)`);
      grd.addColorStop(1, `hsla(${p.hue},100%,60%,0)`);
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r*5, 0, Math.PI*2); ctx.fill();
    });
  }

  // ── Lava ─────────────────────────────────────────────────
  function renderLava() {
    const t = T * 0.28;
    ctx.fillStyle = '#0a0200';
    ctx.fillRect(0, 0, W, H);

    // Multiple lava blobs via radial gradients
    const blobs = [
      [0.25, 0.5 + 0.15*Math.sin(t*1.1), 0.38, 255, 60, 0],
      [0.75, 0.5 + 0.12*Math.cos(t*0.9), 0.32, 255, 100, 0],
      [0.5,  0.4 + 0.1*Math.sin(t*1.3),  0.30, 255, 150, 0],
      [0.15, 0.7 + 0.1*Math.cos(t*0.7),  0.25, 200, 40,  0],
      [0.85, 0.6 + 0.08*Math.sin(t*1.5), 0.22, 220, 80,  0],
      [0.5,  0.75 + 0.06*Math.cos(t*2),  0.28, 255, 30,  0],
    ];

    blobs.forEach(([fx, fy, rr, r, g, b]) => {
      const bx = fx * W; const by = fy * H;
      const brd = rr * Math.min(W, H);
      const bg2 = ctx.createRadialGradient(bx, by, 0, bx, by, brd);
      bg2.addColorStop(0,   `rgba(${r},${g+60},${b},0.75)`);
      bg2.addColorStop(0.35,`rgba(${r},${g},${b},0.45)`);
      bg2.addColorStop(0.65,`rgba(${Math.round(r*0.6)},${Math.round(g*0.3)},${b},0.2)`);
      bg2.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = bg2; ctx.fillRect(0, 0, W, H);
    });

    // Surface cracks (glowing lines)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const crackSeeds = [[0.1,0.9],[0.4,0.85],[0.7,0.95],[0.55,0.75]];
    crackSeeds.forEach(([fx, fy]) => {
      ctx.beginPath();
      ctx.moveTo(fx*W, fy*H);
      let x2 = fx*W, y2 = fy*H;
      for (let i = 0; i < 6; i++) {
        x2 += (Math.random()-0.5)*80 + Math.sin(t+i)*20;
        y2 -= Math.random()*50+20;
        ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = `rgba(255,${150+Math.floor(50*Math.sin(t))},0,0.25)`;
      ctx.lineWidth = 1.5; ctx.stroke();
    });
    ctx.restore();

    // Heat shimmer overlay
    const hg2 = ctx.createLinearGradient(0, H, 0, 0);
    hg2.addColorStop(0,   'rgba(200,50,0,0.18)');
    hg2.addColorStop(0.3, 'rgba(150,30,0,0.08)');
    hg2.addColorStop(0.6, 'rgba(80,10,0,0.04)');
    hg2.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = hg2; ctx.fillRect(0, 0, W, H);
  }

  // ── Arctic (high contrast ice) ──────────────────────────
  function initArctic() {
    S.arcticParts = Array.from({length:160}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.8+0.3, speed: Math.random()*0.4+0.08,
      ph: Math.random()*Math.PI*2, hue: Math.random()*30+185,
    }));
    S.arcticBeams = Array.from({length:8}, () => ({
      x: Math.random()*W, w: Math.random()*60+20, alpha: Math.random()*0.08+0.02, speed: (Math.random()-0.5)*0.3,
    }));
  }
  function renderArctic() {
    ctx.fillStyle = '#000810'; ctx.fillRect(0,0,W,H);
    const bg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.7);
    bg.addColorStop(0,'rgba(0,80,120,0.25)'); bg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // Beams
    S.arcticBeams.forEach(b => {
      b.x+=b.speed; if(b.x>W+b.w)b.x=-b.w; if(b.x<-b.w)b.x=W+b.w;
      const rg=ctx.createLinearGradient(0,0,0,H);
      rg.addColorStop(0,`rgba(0,238,255,${b.alpha})`); rg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.moveTo(b.x-b.w/2,0); ctx.lineTo(b.x+b.w/2,0); ctx.lineTo(b.x+b.w,H); ctx.lineTo(b.x-b.w,H);
      ctx.fillStyle=rg; ctx.fill();
    });
    // High-contrast particles
    S.arcticParts.forEach(p => {
      p.y-=p.speed; p.x+=Math.sin(T*0.4+p.ph)*0.2; if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
      const a=0.7+0.3*Math.sin(T*1.2+p.ph);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${p.hue},100%,90%,${a})`; ctx.fill();
    });
    // Grid lines (high contrast)
    ctx.strokeStyle='rgba(0,238,255,0.06)'; ctx.lineWidth=0.5;
    for(let x=0;x<W;x+=80){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for(let y=0;y<H;y+=80){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  }

  // ── Crimson (high contrast red/white) ───────────────────
  function initCrimson() {
    S.crimParts = Array.from({length:120}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.8, vy: (Math.random()-0.5)*0.8,
      r: Math.random()*2+0.4, alpha: Math.random()*0.7+0.2,
      hue: Math.random()*20, // red range
    }));
    S.crimLines = Array.from({length:12}, () => ({
      x: Math.random()*W, y: 0, len: Math.random()*H*0.4+H*0.1,
      speed: Math.random()*0.6+0.2, alpha: Math.random()*0.15+0.05,
    }));
  }
  function renderCrimson() {
    ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(0,0,W,H);
    // Vertical light shafts
    S.crimLines.forEach(l => {
      l.y+=l.speed; if(l.y>H+l.len)l.y=-l.len;
      const lg=ctx.createLinearGradient(l.x,l.y,l.x,l.y+l.len);
      lg.addColorStop(0,'rgba(255,0,0,0)'); lg.addColorStop(0.5,`rgba(255,0,68,${l.alpha})`); lg.addColorStop(1,'rgba(255,0,0,0)');
      ctx.beginPath(); ctx.moveTo(l.x-1,l.y); ctx.lineTo(l.x+1,l.y); ctx.lineTo(l.x+2,l.y+l.len); ctx.lineTo(l.x-2,l.y+l.len);
      ctx.fillStyle=lg; ctx.fill();
    });
    S.crimParts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
      const pulse=0.6+0.4*Math.sin(T*1.5+p.x*0.01);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${p.hue},100%,${65+20*pulse}%,${p.alpha*pulse})`; ctx.fill();
    });
    // High contrast vignette
    const vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.2,W/2,H/2,Math.max(W,H)*0.7);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.5)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
  }

  // ── Midnight (pure black / white high contrast) ──────────
  function initMidnight() {
    S.midStars = Array.from({length:300}, () => ({
      x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+0.2,
      ph:Math.random()*Math.PI*2, speed:Math.random()*0.5+0.1,
    }));
    S.midGrid = { alpha: 0 };
  }
  function renderMidnight() {
    ctx.fillStyle='#000000'; ctx.fillRect(0,0,W,H);
    // Subtle grid
    ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=0.5;
    for(let x=0;x<W;x+=60){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for(let y=0;y<H;y+=60){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    // High contrast stars
    S.midStars.forEach(s => {
      s.y+=s.speed*0.1; if(s.y>H)s.y=0;
      const a=(0.5+0.5*Math.sin(T*0.8+s.ph));
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${a*0.9})`; ctx.fill();
    });
    // Center glow
    const cg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.min(W,H)*0.4);
    cg.addColorStop(0,'rgba(255,255,255,0.04)'); cg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=cg; ctx.fillRect(0,0,W,H);
  }

  // ── Frost ───────────────────────────────────────────────
  function initFrost() {
    S.snowflakes = Array.from({length:180}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*2.2+0.5, speed: Math.random()*0.55+0.15,
      drift: (Math.random()-0.5)*0.25, ph: Math.random()*Math.PI*2,
    }));
    S.frostCrystals = Array.from({length:14}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      size: Math.random()*36+16, rot: Math.random()*Math.PI/3,
      alpha: Math.random()*0.055+0.015,
    }));
  }
  function renderFrost() {
    const bg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.75);
    bg.addColorStop(0,'#061020'); bg.addColorStop(0.5,'#030a18'); bg.addColorStop(1,'#010508');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    S.frostCrystals.forEach(c => {
      ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.rot+T*0.008);
      ctx.globalAlpha=c.alpha; ctx.strokeStyle='#a0e8ff'; ctx.lineWidth=1;
      for(let a=0;a<6;a++){
        const ang=a*Math.PI/3;
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.lineTo(Math.cos(ang)*c.size,Math.sin(ang)*c.size); ctx.stroke();
        const bx=Math.cos(ang)*c.size*0.5, by=Math.sin(ang)*c.size*0.5;
        const p=ang+Math.PI/2;
        ctx.beginPath(); ctx.moveTo(bx,by);
        ctx.lineTo(bx+Math.cos(p)*c.size*0.2,by+Math.sin(p)*c.size*0.2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx,by);
        ctx.lineTo(bx-Math.cos(p)*c.size*0.2,by-Math.sin(p)*c.size*0.2); ctx.stroke();
      }
      ctx.restore();
    });
    ctx.globalAlpha=1;
    S.snowflakes.forEach(s => {
      s.y+=s.speed; s.x+=s.drift+Math.sin(T*0.7+s.ph)*0.28;
      if(s.y>H+5){s.y=-5;s.x=Math.random()*W;}
      if(s.x>W+5)s.x=-5; if(s.x<-5)s.x=W+5;
      const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*3.5);
      g.addColorStop(0,'rgba(220,245,255,0.9)'); g.addColorStop(0.4,'rgba(160,220,255,0.45)'); g.addColorStop(1,'rgba(100,180,255,0)');
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r*3.5,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='rgba(230,248,255,0.95)'; ctx.fill();
    });
  }

  // ── Toxic ───────────────────────────────────────────────
  function initToxic() {
    S.toxBubbles = Array.from({length:55}, () => ({
      x: Math.random()*W, y: H+Math.random()*H,
      r: Math.random()*16+4, speed: Math.random()*0.55+0.18,
      wobble: Math.random()*0.7+0.3, ph: Math.random()*Math.PI*2,
    }));
    S.toxParts = Array.from({length:110}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.38, vy: -(Math.random()*0.38+0.08),
      r: Math.random()*1.4+0.3, hue: Math.random()*50+80, alpha: Math.random()*0.55+0.25,
    }));
  }
  function renderToxic() {
    const bg=ctx.createRadialGradient(W/2,H*0.8,0,W/2,H*0.3,Math.max(W,H)*0.8);
    bg.addColorStop(0,'#001500'); bg.addColorStop(0.4,'#000a00'); bg.addColorStop(1,'#000200');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    const gg=ctx.createLinearGradient(0,H,0,H*0.55);
    gg.addColorStop(0,'rgba(80,255,0,0.1)'); gg.addColorStop(1,'rgba(0,255,0,0)');
    ctx.fillStyle=gg; ctx.fillRect(0,0,W,H);
    S.toxParts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${p.hue},100%,62%,${p.alpha})`; ctx.fill();
    });
    S.toxBubbles.forEach(b => {
      b.y-=b.speed; b.x+=Math.sin(T*b.wobble+b.ph)*0.5;
      if(b.y+b.r<0){b.y=H+b.r;b.x=Math.random()*W;}
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${100+b.r*5|0},255,0,0.6)`; ctx.lineWidth=1.2; ctx.stroke();
      const bg2=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
      bg2.addColorStop(0,'rgba(140,255,40,0.08)'); bg2.addColorStop(1,'rgba(0,255,0,0)');
      ctx.fillStyle=bg2; ctx.fill();
      ctx.beginPath(); ctx.arc(b.x-b.r*0.3,b.y-b.r*0.3,b.r*0.22,0,Math.PI*2);
      ctx.fillStyle='rgba(200,255,150,0.28)'; ctx.fill();
    });
  }

  // ── Inferno ─────────────────────────────────────────────
  function newFire() {
    return { x:Math.random()*W, y:H+Math.random()*30, vx:(Math.random()-0.5)*1.1, vy:-(Math.random()*3+1.4),
      life:1, decay:Math.random()*0.011+0.005, r:Math.random()*9+2, hue:Math.random()*25 };
  }
  function initInferno() { S.fireP = Array.from({length:200},newFire); }
  function renderInferno() {
    ctx.fillStyle='rgba(5,0,0,0.22)'; ctx.fillRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,H,0,H*0.35);
    bg.addColorStop(0,'rgba(180,40,0,0.28)'); bg.addColorStop(0.3,'rgba(100,15,0,0.12)'); bg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    S.fireP.forEach((p,i) => {
      p.x+=p.vx+Math.sin(T*2+p.x*0.012)*0.35; p.y+=p.vy; p.life-=p.decay; p.r*=0.996;
      if(p.life<=0||p.y<-60) S.fireP[i]=newFire();
      const l=50+p.life*28;
      ctx.save(); ctx.globalAlpha=p.life*0.82;
      const fg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2.2);
      fg.addColorStop(0,`hsla(${p.hue+5},100%,${l}%,1)`);
      fg.addColorStop(0.5,`hsla(${p.hue},100%,${l-22}%,0.5)`);
      fg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*2.2,0,Math.PI*2); ctx.fillStyle=fg; ctx.fill();
      ctx.restore();
    });
  }

  // ── Deep Sea ─────────────────────────────────────────────
  function initDeepSea() {
    S.seaGlow = Array.from({length:80}, () => ({
      x:Math.random()*W, y:Math.random()*H, r:Math.random()*2.8+0.5,
      speed:Math.random()*0.18+0.04, ph:Math.random()*Math.PI*2,
      hue:Math.random()>0.5?165+Math.random()*25:280+Math.random()*25,
      alpha:Math.random()*0.55+0.2,
    }));
    S.seaFish = Array.from({length:16}, () => ({
      x:Math.random()*W, y:Math.random()*H,
      speed:(Math.random()*0.7+0.25)*(Math.random()>0.5?1:-1),
      size:Math.random()*11+4, hue:160+Math.random()*55, alpha:Math.random()*0.35+0.18,
      ph:Math.random()*Math.PI*2,
    }));
    S.seaRays = Array.from({length:5}, () => ({
      x:Math.random()*W, w:Math.random()*70+28, speed:(Math.random()-0.5)*0.18,
      alpha:Math.random()*0.055+0.018,
    }));
  }
  function renderDeepSea() {
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#000005'); bg.addColorStop(0.4,'#000012'); bg.addColorStop(1,'#001028');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    ctx.save(); ctx.globalCompositeOperation='screen';
    S.seaRays.forEach(r => {
      r.x+=r.speed; if(r.x>W+r.w)r.x=-r.w; if(r.x<-r.w)r.x=W+r.w;
      const rg=ctx.createLinearGradient(0,0,0,H);
      rg.addColorStop(0,`rgba(0,140,170,${r.alpha})`); rg.addColorStop(0.5,`rgba(0,90,130,${r.alpha*0.5})`); rg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.moveTo(r.x-r.w/2,0); ctx.lineTo(r.x+r.w/2,0);
      ctx.lineTo(r.x+r.w,H); ctx.lineTo(r.x-r.w,H); ctx.fillStyle=rg; ctx.fill();
    });
    ctx.restore();
    S.seaGlow.forEach(p => {
      p.y-=p.speed; p.x+=Math.sin(T*0.3+p.ph)*0.28; if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
      const a=p.alpha*(0.7+0.3*Math.sin(T*1.4+p.ph));
      const gw=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4.5);
      gw.addColorStop(0,`hsla(${p.hue},100%,80%,${a})`); gw.addColorStop(0.5,`hsla(${p.hue},100%,55%,${a*0.35})`); gw.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4.5,0,Math.PI*2); ctx.fillStyle=gw; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`hsla(${p.hue},100%,92%,${a*0.85})`; ctx.fill();
    });
    S.seaFish.forEach(f => {
      f.x+=f.speed; f.y+=Math.sin(T*0.5+f.ph)*0.38;
      if(f.x>W+f.size*2)f.x=-f.size; if(f.x<-f.size*2)f.x=W+f.size;
      ctx.save(); ctx.globalAlpha=f.alpha*(0.6+0.4*Math.sin(T*0.8+f.ph));
      const jg=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.size);
      jg.addColorStop(0,`hsla(${f.hue},100%,70%,0.6)`); jg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.ellipse(f.x,f.y,f.size,f.size*0.65,0,Math.PI,0); ctx.fillStyle=jg; ctx.fill();
      for(let t=-2;t<=2;t++){
        ctx.beginPath(); ctx.moveTo(f.x+t*f.size*0.2,f.y);
        ctx.quadraticCurveTo(f.x+t*f.size*0.3+Math.sin(T+t)*f.size*0.2,f.y+f.size*1.2,f.x+t*f.size*0.22,f.y+f.size*1.7);
        ctx.strokeStyle=`hsla(${f.hue},100%,70%,0.28)`; ctx.lineWidth=0.7; ctx.stroke();
      }
      ctx.restore();
    });
  }

  // ── Neon City ────────────────────────────────────────────
  function initNeonCity() {
    S.ncBuildings=[];
    let bx=0;
    while(bx<W+80){
      const bw=Math.random()*58+28, bh=Math.random()*H*0.44+H*0.09;
      const hue=[300,185,48,0][Math.floor(Math.random()*4)];
      const wins=[];
      for(let wy=H-bh+8;wy<H-8;wy+=15) for(let wx=bx+5;wx<bx+bw-5;wx+=12) wins.push({x:wx,y:wy,on:Math.random()>0.4,t:Math.random()*8});
      S.ncBuildings.push({x:bx,w:bw,h:bh,hue,wins}); bx+=bw+2;
    }
    S.ncParticles=Array.from({length:75},()=>({
      x:Math.random()*W, y:Math.random()*H*0.65,
      vx:(Math.random()-0.5)*1.1, vy:-(Math.random()*0.45+0.08),
      hue:[300,180,55][Math.floor(Math.random()*3)], r:Math.random()*1.6+0.3, alpha:Math.random()*0.65+0.2,
    }));
  }
  function renderNeonCity() {
    ctx.fillStyle='#020008'; ctx.fillRect(0,0,W,H);
    const sky=ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#020008'); sky.addColorStop(0.6,'#060015'); sky.addColorStop(1,'#100020');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
    S.ncParticles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; if(p.y<-5){p.y=H*0.65;p.x=Math.random()*W;}
      if(p.x<-5)p.x=W+5; if(p.x>W+5)p.x=-5;
      const gp=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3.5);
      gp.addColorStop(0,`hsla(${p.hue},100%,70%,${p.alpha})`); gp.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*3.5,0,Math.PI*2); ctx.fillStyle=gp; ctx.fill();
    });
    S.ncBuildings.forEach(b=>{
      ctx.fillStyle='rgba(4,0,12,0.97)'; ctx.fillRect(b.x,H-b.h,b.w,b.h);
      ctx.strokeStyle=`hsla(${b.hue},100%,58%,0.45)`; ctx.lineWidth=1;
      ctx.shadowColor=`hsl(${b.hue},100%,60%)`; ctx.shadowBlur=8;
      ctx.strokeRect(b.x,H-b.h,b.w,b.h); ctx.shadowBlur=0;
      b.wins.forEach(w=>{
        w.t-=0.016; if(w.t<0){w.on=!w.on;w.t=Math.random()*5+2;}
        if(w.on){
          ctx.shadowColor=`hsl(${b.hue},100%,70%)`; ctx.shadowBlur=5;
          ctx.fillStyle=`hsla(${b.hue},80%,68%,0.88)`;
          ctx.fillRect(w.x,w.y,7,5); ctx.shadowBlur=0;
        }
      });
    });
    const ref=ctx.createLinearGradient(0,H*0.84,0,H);
    ref.addColorStop(0,'rgba(140,0,255,0.07)'); ref.addColorStop(1,'rgba(0,180,255,0.03)');
    ctx.fillStyle=ref; ctx.fillRect(0,H*0.84,W,H*0.16);
  }

  // ── Storm ────────────────────────────────────────────────
  function initStorm() {
    S.stRain=Array.from({length:340},()=>({
      x:Math.random()*W*1.5-W*0.25, y:Math.random()*H,
      len:Math.random()*16+7, speed:Math.random()*8+10, alpha:Math.random()*0.38+0.08,
    }));
    S.stClouds=Array.from({length:8},()=>({
      x:Math.random()*W, y:Math.random()*H*0.38, w:Math.random()*280+130, h:Math.random()*75+35,
      speed:(Math.random()-0.5)*0.28, alpha:Math.random()*0.14+0.04,
    }));
    S.stBolt=null; S.stFlash=0; S.stNext=Math.random()*4+2;
  }
  function renderStorm() {
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#030308'); bg.addColorStop(0.5,'#050510'); bg.addColorStop(1,'#060615');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    S.stFlash=Math.max(0,S.stFlash-0.055); S.stNext-=0.016;
    if(S.stNext<=0){
      S.stFlash=1;
      const bx=W*0.2+Math.random()*W*0.6;
      S.stBolt=[]; let cx=bx,cy=0;
      while(cy<H*0.78){S.stBolt.push([cx,cy]);cx+=(Math.random()-0.5)*75;cy+=Math.random()*70+18;}
      S.stNext=Math.random()*5+3;
    }
    if(S.stFlash>0){ctx.fillStyle=`rgba(140,155,255,${S.stFlash*0.07})`;ctx.fillRect(0,0,W,H);}
    S.stClouds.forEach(c=>{
      c.x+=c.speed; if(c.x>W+c.w)c.x=-c.w; if(c.x<-c.w)c.x=W+c.w;
      const cg=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y+c.h*0.3,c.w*0.5);
      cg.addColorStop(0,`rgba(70,70,110,${c.alpha})`); cg.addColorStop(0.6,`rgba(35,35,60,${c.alpha*0.5})`); cg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=cg; ctx.fillRect(c.x-c.w/2,c.y-c.h/2,c.w,c.h);
    });
    ctx.save();
    S.stRain.forEach(r=>{
      r.y+=r.speed; r.x-=r.speed*0.14; if(r.y>H){r.y=-r.len;r.x=Math.random()*W*1.5-W*0.25;}
      ctx.beginPath(); ctx.moveTo(r.x,r.y); ctx.lineTo(r.x-r.len*0.14,r.y-r.len);
      ctx.strokeStyle=`rgba(140,160,255,${r.alpha})`; ctx.lineWidth=0.75; ctx.stroke();
    });
    ctx.restore();
    if(S.stBolt&&S.stFlash>0.28){
      ctx.save(); ctx.globalAlpha=S.stFlash;
      ctx.strokeStyle='#ddeeff'; ctx.lineWidth=2.2;
      ctx.shadowColor='#aabbff'; ctx.shadowBlur=22;
      ctx.beginPath();
      S.stBolt.forEach(([bx,by],i)=>i===0?ctx.moveTo(bx,by):ctx.lineTo(bx,by));
      ctx.stroke(); ctx.lineWidth=0.9; ctx.stroke(); ctx.restore();
    }
  }

  // ── Routing maps ────────────────────────────────────────
  const renders = {
    aurora:    renderAurora,
    ocean:     renderOcean,
    galaxy:    renderGalaxy,
    ember:     renderEmber,
    cyber:     renderCyber,
    sakura:    renderSakura,
    matrix:    renderMatrix,
    tron:      renderTron,
    nebula:    renderNebula,
    neonRain:  renderNeonRain,
    plasma:    renderPlasma,
    void:      renderVoid,
    glitch:    renderGlitch,
    synthwave: renderSynthwave,
    hologram:  renderHologram,
    bloodMoon: renderBloodMoon,
    quantum:   renderQuantum,
    lava:      renderLava,
    arctic:    renderArctic,
    crimson:   renderCrimson,
    midnight:  renderMidnight,
    frost:     renderFrost,
    toxic:     renderToxic,
    inferno:   renderInferno,
    deepSea:   renderDeepSea,
    neonCity:  renderNeonCity,
    storm:     renderStorm,
  };

  const inits = {
    ocean: initOcean, galaxy: initGalaxy, ember: initEmber, cyber: initCyber, sakura: initSakura,
    matrix: initMatrix, tron: initTron, nebula: initNebula, neonRain: initNeonRain,
    void: initVoid, glitch: initGlitch, hologram: initHologram, bloodMoon: initBloodMoon,
    quantum: initQuantum,
    arctic: initArctic, crimson: initCrimson, midnight: initMidnight,
    frost: initFrost, toxic: initToxic, inferno: initInferno, deepSea: initDeepSea,
    neonCity: initNeonCity, storm: initStorm,
  };

  function doInit() {
    S.sparks = S.waves = S.stars = S.nodes = S.petals = undefined;
    S.drops = S.matChars = S.matSpeeds = S.tLines = S.tNodes = S.nebStars = S.rain = undefined;
    S.vParts = S.gBars = S.swStars = S.holoParts = S.holoHexes = S.bmParts = S.bmClouds = S.qParts = undefined;
    S.arcticParts = S.arcticBeams = S.crimParts = S.crimLines = S.midStars = undefined;
    S.snowflakes = S.frostCrystals = S.toxBubbles = S.toxParts = S.fireP = undefined;
    S.seaGlow = S.seaFish = S.seaRays = S.ncBuildings = S.ncParticles = undefined;
    S.stRain = S.stClouds = S.stBolt = undefined;
    if (inits[active]) inits[active]();
  }

  function init(el) {
    canvas = el;
    ctx = canvas.getContext('2d');
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    doInit();
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      doInit();
    });
  }

  function animate(ts) {
    T = ts / 1000;
    renders[active]();
    frame = requestAnimationFrame(animate);
  }

  function start() { frame = requestAnimationFrame(animate); }
  function stop()  { if (frame) cancelAnimationFrame(frame); }
  function setTheme(name) { if (THEMES[name]) { active = name; doInit(); } }
  function getTheme()     { return active; }
  function getAccent()    { return THEMES[active].accent; }

  return { init, start, stop, setTheme, getTheme, getAccent, THEMES };
})();
