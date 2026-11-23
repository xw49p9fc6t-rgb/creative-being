/* Creative Being — engine. Script in story.js, characters in characters.js, sets in sets.js. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const W = 390, H = 844;
  const stage = $("stage"), world = $("world"), box = $("box"), shown = $("shown"), rest = $("rest");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NAMES = { jasmine: "Jasmine", advisor: "Academic Advisor" };
  const AI_RE = /\b(AI|Artificial Intelligence|artificial intelligence|robot)\b/;

  const fit = () => stage.style.setProperty("--s", Math.min(innerWidth / W, innerHeight / H));
  addEventListener("resize", fit); fit();

  const state = { meters: { ...STORY.meters }, shown: { ...STORY.meters }, layers: [{ c: "#e8a948", v: 50 }], skip: false, fast: false, busy: false, waiting: null, penDown: false, ending: null };

  /* ---------------------------------------------------------------- sound */
  let AC = null, out = null, noise = null, muted = false;
  function audio() {
    if (AC) { if (AC.state === "suspended") AC.resume(); return; }
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      out = AC.createGain(); out.gain.value = 0.85; out.connect(AC.destination);
      noise = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { AC = null; }
  }
  /* Calm background music: a slow, soft music-box pattern over a warm pad. */
  let musicBus = null, musicTimer = null, nextBar = 0, bar = 0;
  const CHORDS = [[261.6, 329.6, 392.0, 493.9], [220.0, 261.6, 329.6, 392.0], [174.6, 220.0, 261.6, 329.6], [196.0, 246.9, 293.7, 392.0]];
  function music() {
    if (!AC || musicBus) return;
    musicBus = AC.createGain(); musicBus.gain.value = muted ? 0 : 1;
    const lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1600;
    const delay = AC.createDelay(); delay.delayTime.value = 0.42; const fb = AC.createGain(); fb.gain.value = 0.32;
    musicBus.connect(lp); lp.connect(out); lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(out);
    nextBar = AC.currentTime + 0.3;
    const note = (f, t, len, vol, type) => {
      const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (type === "sine" ? 0.6 : 0.03)); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + len + 0.05);
    };
    musicTimer = setInterval(() => {
      while (nextBar < AC.currentTime + 1) {
        const ch = CHORDS[bar % CHORDS.length], beat = 1.1;
        note(ch[0] / 2, nextBar, beat * 4.2, 0.03, "sine"); note(ch[2] / 2, nextBar, beat * 4.2, 0.022, "sine");
        [0, 1, 2, 3].forEach((k) => { const order = [1, 2, 3, 2][k]; note(ch[order] * 2, nextBar + k * beat, 2.4, 0.026, "triangle"); });
        nextBar += beat * 4; bar++;
      }
    }, 250);
  }
  function hit(freq, dur, vol, q = 1.5, delay = 0) {
    if (!AC || muted) return;
    const t = AC.currentTime + delay, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noise; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 0.5, dur + 0.02);
  }
  function tone(freq, dur, vol, delay = 0, type = "sine", to) {
    if (!AC || muted) return;
    const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.03);
  }
  /* Babble: each syllable is a short pitched buzz shaped into a vowel. */
  const VOW = { a: [800, 1200], e: [480, 1900], i: [320, 2350], o: [560, 900], u: [360, 820] };
  const VOICE = { jasmine: { base: 330, fs: 1.15, vol: 0.32 }, advisor: { base: 215, fs: 1, vol: 0.34 } };
  function syllable(who, ch, rise) {
    if (!AC || muted || !VOICE[who]) return;
    const v = VOICE[who], t = AC.currentTime, code = ch.toLowerCase().charCodeAt(0);
    const vow = "aeiou".includes(ch.toLowerCase()) ? ch.toLowerCase() : "aeiou"[(code * 7) % 5];
    const step = [0, 2, 4, 7, 9][(code * 13) % 5] + rise;
    const f = v.base * Math.pow(2, (step - 4) / 14);
    // a rounded hum (triangle + sine), shaped into a vowel and smoothed with a low-pass
    const o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain(), f1 = AC.createBiquadFilter(), f2 = AC.createBiquadFilter(), dry = AC.createGain(), lp = AC.createBiquadFilter();
    o.type = "triangle"; o2.type = "sine";
    o.frequency.setValueAtTime(f * 1.03, t); o.frequency.exponentialRampToValueAtTime(f * 0.95, t + 0.13);
    o2.frequency.setValueAtTime(f * 1.03, t); o2.frequency.exponentialRampToValueAtTime(f * 0.95, t + 0.13);
    f1.type = f2.type = "bandpass"; f1.frequency.value = VOW[vow][0] * v.fs; f2.frequency.value = VOW[vow][1] * v.fs; f1.Q.value = 2.2; f2.Q.value = 3;
    lp.type = "lowpass"; lp.frequency.value = 2000; dry.gain.value = 0.55;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v.vol, t + 0.025); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.15);
    o.connect(f1); o.connect(f2); o.connect(dry); o2.connect(dry); f1.connect(lp); f2.connect(lp); dry.connect(lp); lp.connect(g); g.connect(out);
    o.start(t); o2.start(t); o.stop(t + 0.17); o2.stop(t + 0.17);
  }
  const snd = {
    scratch: () => hit(3200, 0.12, 0.018, 0.9),
    key: () => hit(1800 + Math.random() * 900, 0.03, 0.035, 2),
    pen: () => { hit(2300, 0.03, 0.45, 4); hit(1700, 0.03, 0.25, 4, 0.14); hit(1400, 0.04, 0.12, 4, 0.24); },
    creak: () => tone(110, 0.5, 0.06, 0, "sawtooth", 70),
    swish: () => hit(1800, 0.35, 0.18, 0.6),
    paper: () => hit(3000, 0.18, 0.14, 0.7),
    stamp: () => { hit(160, 0.14, 0.7, 0.8); hit(1200, 0.04, 0.15, 2); },
    pour: () => { hit(700, 1.0, 0.2, 0.8); tone(200, 1.0, 0.05, 0, "sine", 560); },
    coin: (d = 0) => tone(2300 + Math.random() * 800, 0.18, 0.07, d, "triangle"),
    chime: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.6, 0.08, i * 0.09)),
    page: () => hit(2400, 0.5, 0.18, 0.5)
  };

  /* ---------------------------------------------------------------- cast */
  const actors = {}, cast = { jasmine: { expr: "neutral", pose: "", outfit: null }, advisor: { expr: "neutral", pose: "", outfit: null } };
  for (const who of ["jasmine", "advisor"]) {
    const d = document.createElement("div"); d.className = "actor " + who; $("cast").appendChild(d); actors[who] = d;
  }
  /* The group's paper-cutout sprites, one per expression. Jasmine's arm is a
     separate cutout drawn on the same canvas, so it lines up with her body. */
  const SPR = { jasmine: ["neutral", "surprised", "relieved", "happy", "excited", "sad", "stressed"], advisor: ["smiling", "happy", "brow", "defeated"] };
  const ALIAS = { jasmine: { annoyed: "stressed", hopeful: "happy" }, advisor: { neutral: "smiling", smiling: "smiling", hopeful: "happy" } };
  const spriteSrc = (who, expr) => {
    const e = (ALIAS[who] || {})[expr] || expr;
    return "assets/sprites/" + who + "_" + (SPR[who].includes(e) ? e : SPR[who][0]) + ".png";
  };
  function render(who) {
    const c = cast[who], a = actors[who];
    a.dataset.pose = c.pose;
    let pup = a.querySelector(".puppet");
    if (!pup) {
      a.classList.add("cut");
      a.innerHTML = '<div class="puppet"></div>'; pup = a.firstChild;
    }
    if (who === "jasmine") renderArm();
    const arm = null;
    const src = spriteSrc(who, c.expr), bodies = pup.querySelectorAll("img.body");
    if (bodies.length && bodies[bodies.length - 1].getAttribute("src") === src) return;
    const img = new Image(); img.className = "body"; img.alt = NAMES[who]; img.style.opacity = "0";
    img.onload = () => {
      pup.insertBefore(img, arm || null);
      requestAnimationFrame(() => { img.style.opacity = "1"; });
      setTimeout(() => bodies.forEach((n) => n.remove()), 260);
    };
    img.src = src;
  }
  /* Jasmine's arm lives on its own layer (#armfront) so the hand and pencil sit
     in front of the desk, on the paper. It mirrors her body's box and pose. */
  const armfront = $("armfront"), armImg = armfront.querySelector("img.arm");
  function renderArm() {
    const bent = !state.armRelaxed && !state.future;
    const want = "assets/sprites/jasmine_arm_" + (bent ? "bent" : "straight") + ".png";
    if (armImg.getAttribute("src") !== want) { armImg.src = want; if (!bent) armImg.style.transform = ""; }
    syncArm();
  }
  function syncArm() {
    const j = actors.jasmine;
    armfront.className = j.className.replace(/\btalk\b/g, "") + ((state.armRelaxed && !state.future) ? " behind" : "");
    armfront.dataset.pose = j.dataset.pose || "";
  }
  new MutationObserver(syncArm).observe(actors.jasmine, { attributes: true, attributeFilter: ["class", "data-pose"] });
  const setFace = (who, expr) => { if (cast[who].expr !== expr) { cast[who].expr = expr; render(who); } };
  function preload() { for (const who in SPR) for (const e of SPR[who]) new Image().src = spriteSrc(who, e); ["bent", "straight"].forEach((k) => { new Image().src = "assets/sprites/jasmine_arm_" + k + ".png"; }); }

  /* ------------------------------------------------- acting the directions */
  const pen = $("pen"), folder = $("folder");
  let typeLoop = null, writeLoop = null;
  function setPose(who, pose) {
    const was = cast[who].pose; cast[who].pose = pose; render(who);
    if (who === "advisor") {
      clearInterval(typeLoop);
      if (pose === "typing") typeLoop = setInterval(() => { if (Math.random() < 0.09) word("tak tak", 268, 400, -8); }, 95);
      if (pose === "chin" && was !== "chin") hit(900, 0.05, 0.15, 2);
    }
    if (who === "jasmine") {
      if (pose === "slumped" && was !== "slumped") { snd.creak(); word("sigh…", 30, 236, -6); }
      syncWriting();
    }
  }
  function syncWriting() {
    const on = cast.jasmine.pose === "writing" && !state.penDown && !state.future;
    state.writing = on;
  }
  function word(text, x, y, r) {
    if (state.skip) return;
    const w = document.createElement("span"); w.className = "fx-word"; w.textContent = text;
    w.style.left = x + "px"; w.style.top = y + "px"; w.style.setProperty("--r", r + "deg");
    $("sfx").appendChild(w); setTimeout(() => w.remove(), 1200);
  }
  const acts = {
    penDrop() {
      if (state.penDown) return; state.penDown = true; syncWriting();
      if (state.skip) writer.finish();
      setTimeout(() => {
        // the hand lets go and the pencil falls at the same moment
        const T = writer.tip;
        state.armRelaxed = true; renderArm();
        pen.animate([
          { transform: "rotate(" + (writer.angle || -142) + "deg)", left: T.x + "px", top: (T.y - 4.5) + "px" },
          { transform: "rotate(-168deg)", left: (T.x + 8) + "px", top: "548px", offset: 0.5, easing: "ease-out" },
          { transform: "rotate(-158deg)", left: (T.x + 11) + "px", top: "541px", offset: 0.7, easing: "ease-in" },
          { transform: "rotate(-172deg)", left: (T.x + 14) + "px", top: "551px" }
        ], { duration: state.skip || reduce ? 1 : 700, fill: "forwards", easing: "cubic-bezier(.5,0,1,.6)" });
        if (!state.skip) { setTimeout(snd.pen, 300); setTimeout(() => word("tik!", T.x + 6, 528, -10), 300); try { navigator.vibrate && navigator.vibrate(20); } catch (e) { /* ignore */ } }
      }, state.skip ? 0 : 500);
    },
    folder() { folder.classList.add("out"); snd.swish(); word("shff", 150, 470, 6); },
    bucketTease() { buckets.tease(); },
    nod() { const a = actors.advisor; a.classList.remove("nod"); void a.offsetWidth; a.classList.add("nod"); },
    shrug() { const a = actors.jasmine; a.classList.remove("shrug"); void a.offsetWidth; a.classList.add("shrug"); }
  };

  /* ----------------------------------------------------- writing on the form
     A scribbled handwriting path is laid out on the form's three lines. The
     pencil tip follows it, the arm cutout slides with the tip, and pencil marks
     are drawn on the paper exactly where the tip has been. */
  const writer = (() => {
    const SX = 103.5, SY = 478.5, ROT = -3 * Math.PI / 180, COS = Math.cos(ROT), SIN = Math.sin(ROT);
    const REST = { x: 127, y: 506.3 };
    const WRIST = { x: 106, y: 494.3 };          // end of the sleeve, in the arm's drawn position
    const PX = -106.5, PY = 97.6, PP = PX * PX + PY * PY;   // how the wrist moves when the arm turns at the shoulder            // where the tip sits when the arm is in its drawn position
    const toStage = (x, y) => ({ x: SX + x * COS - y * SIN, y: SY + x * SIN + y * COS });
    const cv = $("ink"), cx = cv.getContext("2d"); cv.width = 312; cv.height = 198;
    cx.setTransform(3, 0, 0, 3, 0, 0); cx.lineCap = cx.lineJoin = "round";
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pts = [];
    const add = (x, y, down) => pts.push({ x, y, down });
    [29, 40, 51].forEach((base, li) => {
      const x0 = 22, w = li === 2 ? 22 : 30; let s = 0;
      add(x0, base - 2, false);
      while (s < w) {
        const wl = Math.min(w - s, 6 + rnd() * 8);
        let h = 0.8 + rnd() * 0.8;
        for (let t = 0; t <= wl; t += 0.3) {
          const ph = t * 1.9;
          if (Math.cos(ph) > 0.98) h = rnd() < 0.18 ? 2.1 : 0.8 + rnd() * 0.8;   // a new letter, sometimes a tall one
          add(x0 + s + t + 0.7 * Math.sin(ph), base - 1 - 1.8 * h * (0.5 - 0.5 * Math.cos(ph)), true);
        }
        s += wl + 3.5;
        if (s < w) add(x0 + s - 1.5, base - 2, false);
      }
    });
    [29, 40, 51].forEach((base) => { add(10.5, base - 3.5, false); add(10.5, base - 3.5, true); add(12.3, base - 1.2, true); add(16.2, base - 7.4, true); });
    add(50, 49, false);

    let i = 0, f = 0, lifted = 0, idle = 0;
    const api = { tip: { x: REST.x, y: REST.y } };
    function place() {
      const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
      const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f - lifted;
      const T = toStage(x, y); api.tip = T;
      if (!state.penDown) {
        // the arm follows a third of the pencil's travel, mostly by turning at the shoulder,
        // so it stays attached; the pencil pivots in her sleeve for the rest
        const ex = (T.x - REST.x) * 0.3, ey = (T.y - REST.y) * 0.3;
        const th = (ex * PX + ey * PY) / PP, rx = ex - th * PX, ry = ey - th * PY;
        if (!state.armRelaxed && !state.future) armImg.style.transform = "translate(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px) rotate(" + th.toFixed(4) + "rad)";
        const gx = WRIST.x - 2 + ex, gy = WRIST.y - 6 + ey;
        api.angle = Math.atan2(gy - T.y, gx - T.x) * 180 / Math.PI;
        pen.style.left = T.x + "px"; pen.style.top = (T.y - 4.5) + "px";
        pen.style.transform = "rotate(" + api.angle.toFixed(2) + "deg)";
      }
    }
    function ink(a, b, f0, f1) {
      cx.strokeStyle = "rgba(52,46,60,.82)"; cx.lineWidth = 0.75;
      cx.beginPath(); cx.moveTo(a.x + (b.x - a.x) * f0, a.y + (b.y - a.y) * f0); cx.lineTo(a.x + (b.x - a.x) * f1, a.y + (b.y - a.y) * f1); cx.stroke();
    }
    api.place = place;
    api.step = (dt) => {
      if (!state.started || state.penDown || state.future) return;
      if (!state.writing) { lifted += (0 - lifted) * Math.min(1, dt * 8); place(); return; }
      if (i >= pts.length - 1) {                                   // finished: rest the pencil, tap it now and then
        idle += dt; lifted = Math.max(0, Math.sin(idle * 3.2)) * (idle % 3 < 0.9 ? 1.6 : 0); place(); return;
      }
      let budget = dt * 16;
      while (budget > 0 && i < pts.length - 1) {
        const a = pts[i], b = pts[i + 1], len = Math.hypot(b.x - a.x, b.y - a.y) || 0.001, fast = b.down ? 1 : 2.6;
        const take = Math.min(budget * fast, (1 - f) * len), f1 = f + take / len;
        if (a.down && b.down) ink(a, b, f, f1);
        budget -= take / fast; f = f1;
        if (f >= 0.999) { i++; f = 0; }
      }
      const up = !pts[Math.min(i + 1, pts.length - 1)].down;
      lifted += ((up ? 1.8 : 0) - lifted) * Math.min(1, dt * 14);
      if (Math.random() < dt * 0.5) word("scritch", api.tip.x + 12, api.tip.y - 30, 8);
      place();
    };
    api.finish = () => { while (i < pts.length - 1) { const a = pts[i], b = pts[i + 1]; if (a.down && b.down) ink(a, b, f, 1); i++; f = 0; } place(); };
    return api;
  })();

  /* ----------------------------------------------------------- camera */
  const CAMS = { wide: [195, 422, 1], jasmine: [100, 320, 1.35], advisor: [280, 300, 1.35], desk: [140, 505, 1.3], solo: [195, 400, 1] };
  function cam(name) {
    const [x, y, s] = CAMS[name] || CAMS.wide;
    const tx = Math.min(0, Math.max(W - W * s, W / 2 - x * s)), ty = Math.min(0, Math.max(H - H * s, 330 - y * s));
    world.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    for (const k in actors) actors[k].classList.toggle("dim", (name === "jasmine" && k === "advisor") || (name === "advisor" && k === "jasmine"));
  }
  const grade = (g) => { stage.classList.remove("g-warm", "g-cool", "g-mixed"); if (g) stage.classList.add("g-" + g); };
  function ai(on) {
    stage.classList.toggle("ai", on);
  }

  /* ---------------------------------------------------------- dialogue */
  function pages(text, max = 170) {
    const parts = text.match(/[^.!?…]+(?:[.!?…]+[’”"]?|$)\s*/g) || [text];
    const out = []; let cur = "";
    for (const p of parts) { if ((cur + p).trim().length > max && cur.trim()) { out.push(cur.trim()); cur = p; } else cur += p; }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  async function type(page, who) {
    state.busy = true; state.fast = false;
    box.hidden = false; box.className = who; $("name").textContent = NAMES[who] || "";
    const cues = {}; let clean = "";
    page.split(/(\{\w+\})/).forEach((part) => { const m = part.match(/^\{(\w+)\}$/); if (m) cues[clean.length] = m[1]; else clean += part; });
    page = clean;
    const fire = (i) => { if (cues[i] && who !== "narrator") { setFace(who, cues[i]); delete cues[i]; } };
    shown.textContent = ""; rest.textContent = page; fire(0);
    const isAI = AI_RE.test(page), q = page.trim().endsWith("?");
    for (let i = 0; i < page.length; i++) {
      if (state.fast || state.skip) break;
      const ch = page[i]; fire(i);
      shown.textContent = page.slice(0, i + 1); rest.textContent = page.slice(i + 1);
      if (/[a-z]/i.test(ch)) {
        if (who !== "narrator" && i % 2 === 0) {
          syllable(who, ch, q && i > page.length - 14 ? 5 : 0);
          const a = actors[who]; a.classList.add("talk"); setTimeout(() => a.classList.remove("talk"), 70);
        }
      }
      await sleep(/[.!?…]/.test(ch) ? 210 : /[,;:]/.test(ch) ? 120 : 30);
    }
    for (const k in cues) fire(+k);
    shown.innerHTML = ""; rest.textContent = "";
    if (isAI) { const span = document.createElement("span"); span.innerHTML = page.replace(/[&<>]/g, "").replace(AI_RE, '<span class="ai-word">$1</span>'); shown.appendChild(span); }
    else shown.textContent = page;
    box.classList.add("done"); state.busy = false;
  }
  function tap(e) {
    if (e && e.target.closest("button, .card, #buckets, .over")) return;
    if (state.busy) { state.fast = true; return; }
    if (state.waiting) { const r = state.waiting; state.waiting = null; r(); }
  }
  stage.addEventListener("pointerup", tap);
  addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") tap(); });
  const waitTap = () => state.skip ? Promise.resolve() : new Promise((r) => { state.waiting = r; });

  async function beat(b) {
    const who = b.who;
    if (b.faces) for (const k in b.faces) setFace(k, b.faces[k]);
    if (b.face && who !== "narrator") setFace(who, b.face);
    if (b.poses) for (const k in b.poses) setPose(k, b.poses[k]);
    cam(b.cam || (who === "narrator" ? "wide" : who));
    if (b.act) acts[b.act]();
    for (const page of pages(b.text)) {
      for (const [phrase, act] of b.on || []) if (page.includes(phrase)) setTimeout(() => acts[act](), 900);
      const isAI = AI_RE.test(page);
      if (isAI) ai(true);
      await type(page, who);
      await waitTap();
      if (isAI) ai(false);
    }
  }
  async function play(beats) { for (const b of beats) await beat(b); }

  /* ----------------------------------------------------------- buckets */
  const buckets = (() => {
    const cv = $("buckets"), g = cv.getContext("2d"); cv.width = 400; cv.height = 300;
    let th = 0, om = 0, slosh = 0, sv = 0, tilt = 0, t = 0, teaseUntil = 0, coinsShown = 12;
    const mouth = { L: { x: 0, y: 0 }, R: { x: 0, y: 0 } };
    const INK = "#2b2330";
    function sk(fn, w = 1.6) { g.strokeStyle = INK; g.lineWidth = w; g.beginPath(); fn(0); g.stroke(); g.globalAlpha = 0.45; g.lineWidth = w * 0.6; g.beginPath(); fn(0.8); g.stroke(); g.globalAlpha = 1; }
    function pail(x, y, swing, inside, label, value, side) {
      g.save(); g.translate(x, y); g.rotate(swing);
      sk((j) => { g.moveTo(j, 0); g.lineTo(-19 + j, 22); g.moveTo(-j, 0); g.lineTo(19 - j, 22); }, 1.2);
      g.beginPath(); g.moveTo(-21, 22); g.lineTo(21, 22); g.lineTo(16, 58); g.lineTo(-16, 58); g.closePath();
      g.fillStyle = "#e9edf0"; g.fill();
      g.save(); g.clip(); inside(); g.restore();
      sk((j) => { g.moveTo(-21 + j, 22); g.lineTo(21, 22 + j); g.lineTo(16 - j, 58); g.lineTo(-16, 58 - j); g.closePath(); }, 2);
      sk((j) => { g.ellipse(0, 22, 21, 3.5, 0, 0, 6.3); }, 1.2);
      g.restore();
      const m = side === "L" ? mouth.L : mouth.R; m.x = x + 95; m.y = y + 22 + 4;
      g.fillStyle = INK; g.textAlign = "center";
      g.font = "700 9px 'Zen Maru Gothic', sans-serif"; g.fillText(label, x, y + 72);
      g.font = "700 15px 'Zen Maru Gothic', sans-serif"; g.fillText(Math.round(value), x, y + 87);
    }
    function draw(dt) {
      t += dt;
      const c = state.shown.creative, s = state.shown.security;
      const target = Math.max(-0.32, Math.min(0.32, (s - c) / 100 * 0.42));
      om += ((target - th) * 24 - om * 4) * dt; th += om * dt;
      sv += ((tilt - om * 0.6 - slosh) * 40 - sv * 3.2) * dt; slosh += sv * dt;
      g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, 200, 150);
      const px = 100, py = 18, L = 58;
      sk((j) => { g.moveTo(px + j, py); g.lineTo(px + j, 120); g.moveTo(px - 26, 128 + j); g.quadraticCurveTo(px, 112, px + 26, 128 + j); }, 2.4);
      const lx = px - L * Math.cos(th), ly = py - L * Math.sin(th), rx = px + L * Math.cos(th), ry = py + L * Math.sin(th);
      sk((j) => { g.moveTo(lx, ly + j); g.lineTo(rx, ry + j); }, 3);
      g.fillStyle = "#e8b83e"; g.beginPath(); g.arc(px, py, 5, 0, 6.3); g.fill(); sk(() => g.arc(px, py, 5, 0, 6.3), 1.4);
      const tease = t < teaseUntil ? Math.sin((1 - (teaseUntil - t) / 2.4) * Math.PI * 2) * -26 : 0;
      pail(lx, ly, -om * 0.5, () => {
        const lvl = 58 - Math.max(0.04, Math.min(1.08, (c + tease) / 100)) * 34, k = Math.max(-0.6, Math.min(0.6, slosh)) * 14;
        const L = state.layers, tot = L.reduce((a, b) => a + b.v, 0) || 1, depth = 58 - lvl;
        let below = depth;
        for (let n = L.length - 1; n >= 0; n--) {                       // colours stack in bands: the newest on top
          const top = 58 - below, w = n === L.length - 1 ? 1 : 0.35;
          g.fillStyle = L[n].c; g.beginPath(); g.moveTo(-24, 62);
          for (let x = -24; x <= 24; x += 3) g.lineTo(x, top + (x / 24) * k * w + Math.sin(t * 3 + x * 0.3 + n) * (0.8 + Math.abs(sv) * 2.5) * w);
          g.lineTo(24, 62); g.closePath(); g.fill();
          below -= depth * (L[n].v / tot);
        }
        g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(-24, lvl + 1, 48, 1.6);
      }, "CREATIVE BUCKET", c, "L");
      coinsShown += (s / 100 * 26 - coinsShown) * Math.min(1, dt * 5);
      pail(rx, ry, -om * 0.5, () => {
        for (let i = 0; i < Math.round(coinsShown); i++) {
          const col = i % 3, row = Math.floor(i / 3), cx = -11 + col * 11 + (row % 2 ? 4 : 0), cy = 55 - row * 4;
          g.fillStyle = "#b9862a"; g.beginPath(); g.ellipse(cx, cy + 1.4, 7, 2.6, 0, 0, 6.3); g.fill();
          g.fillStyle = "#f2c94c"; g.beginPath(); g.ellipse(cx, cy, 7, 2.6, 0, 0, 6.3); g.fill();
        }
      }, "SECURITY", s, "R");
    }
    let drag = null;
    cv.addEventListener("pointerdown", (e) => { drag = e.clientX; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (drag !== null) { sv += (e.clientX - drag) * 0.06; drag = e.clientX; } });
    cv.addEventListener("pointerup", () => { drag = null; });
    return { draw, mouth, kick: (v) => { sv += v * 6; om += v * 0.5; }, setTilt: (v) => { tilt = v; }, tease: () => { teaseUntil = t + 2.4; sv += 3; } };
  })();
  const tiltOn = () => addEventListener("deviceorientation", (e) => { if (e.gamma !== null) buckets.setTilt(Math.max(-1, Math.min(1, e.gamma / 35)) * 0.7); });
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      $("tilt").hidden = false;
      $("tilt").onclick = () => DeviceOrientationEvent.requestPermission().then((r) => { if (r === "granted") { tiltOn(); $("tilt").hidden = true; } }).catch(() => {});
    } else tiltOn();
  }

  /* paint and coins flying into the buckets */
  const fx = $("fx"), fg = fx.getContext("2d"); fx.width = W * 2; fx.height = H * 2;
  let parts = [];
  function fling(from, to, n, color, kind) {
    for (let i = 0; i < n; i++) parts.push({ t: -i * (kind === "coin" ? 0.08 : 0.012), x0: from.x + (Math.random() - 0.5) * 120, y0: from.y + (Math.random() - 0.5) * 30, to, r: kind === "coin" ? 6 : 2.5 + Math.random() * 4, c: color, kind });
  }
  function drawParts(dt) {
    fg.setTransform(2, 0, 0, 2, 0, 0); fg.clearRect(0, 0, W, H);
    parts = parts.filter((p) => {
      p.t += dt * 1.2; if (p.t < 0) return true;
      if (p.t >= 1) { if (p.kind === "coin") snd.coin(); buckets.kick(0.04); return false; }
      const e = p.t * p.t * (3 - 2 * p.t), x = p.x0 + (p.to.x - p.x0) * e, y = p.y0 + (p.to.y - p.y0) * e - Math.sin(e * Math.PI) * 140;
      fg.fillStyle = p.c; fg.beginPath();
      if (p.kind === "coin") { fg.ellipse(x, y, p.r, p.r * 0.45 + Math.abs(Math.sin(p.t * 12)) * p.r * 0.5, 0, 0, 6.3); fg.fill(); fg.strokeStyle = "#2b2330"; fg.lineWidth = 1; fg.stroke(); }
      else { fg.arc(x, y, p.r * (1 - e * 0.5), 0, 6.3); fg.fill(); }
      return true;
    });
  }

  /* --------------------------------------------------------- decisions */
  function decide(options) {
    return new Promise((resolve) => {
      box.hidden = true; stage.classList.add("hush"); cam("desk");
      folder.classList.add("out", "open"); snd.paper();
      const deck = $("deck"); deck.textContent = ""; $("hint").textContent = STORY.ui.cardHint;
      $("cards").hidden = false;
      let locked = false;
      options.forEach((o, i) => {
        const c = document.createElement("div"); c.className = "card";
        c.style.setProperty("--c", o.color); c.style.setProperty("--r", [-1.6, 1.2, -0.8][i] + "deg"); c.style.setProperty("--d", 0.25 + i * 0.18 + "s");
        c.innerHTML = '<h3></h3><p></p><span class="stamp">CHOSEN</span>';
        c.querySelector("h3").textContent = o.title; if (o.title.length > 30) c.querySelector("h3").classList.add("long");
        c.querySelector("p").textContent = o.desc || "";
        deck.appendChild(c); setTimeout(snd.paper, 250 + i * 180);
        let start = null;
        c.addEventListener("pointerdown", (e) => { if (locked) return; start = { x: e.clientX, y: e.clientY }; c.setPointerCapture(e.pointerId); c.classList.add("drag"); });
        c.addEventListener("pointermove", (e) => { if (!start) return; const s = parseFloat(stage.style.getPropertyValue("--s")) || 1;
          c.style.transform = `translate(${(e.clientX - start.x) / s}px, ${(e.clientY - start.y) / s}px) rotate(${(e.clientX - start.x) / 30}deg)`; });
        c.addEventListener("pointerup", (e) => {
          if (!start) return; const d = Math.hypot(e.clientX - start.x, e.clientY - start.y); start = null;
          c.classList.remove("drag"); c.style.transform = "";
          if (d < 10 || d > 60) pick(o, c);
        });
      });
      function pick(o, c) {
        if (locked) return; locked = true;
        for (const x of deck.children) if (x !== c) x.classList.add("gone");
        c.classList.add("picked"); snd.stamp(); try { navigator.vibrate && navigator.vibrate(30); } catch (e) { /* ignore */ }
        setTimeout(() => {
          const s = parseFloat(stage.style.getPropertyValue("--s")) || 1, sr = stage.getBoundingClientRect(), cr = c.getBoundingClientRect();
          const from = { x: (cr.left + cr.width / 2 - sr.left) / s, y: (cr.top + cr.height / 2 - sr.top) / s };
          const dc = o.effects.creative, L = state.layers;
          if (dc > 0) L.push({ c: o.color, v: dc });
          let take = -Math.min(0, dc); while (take > 0 && L.length) { const top = L[L.length - 1], cut = Math.min(top.v, take); top.v -= cut; take -= cut; if (top.v <= 0 && L.length > 1) L.pop(); else break; }
          if (o.effects.creative > 0) { fling(from, buckets.mouth.L, 60, o.color, "paint"); snd.pour(); }
          const ds = o.effects.security;
          if (ds > 0) fling(from, buckets.mouth.R, Math.round(ds / 4), "#f2c94c", "coin");
          if (ds < 0) fling({ x: buckets.mouth.R.x, y: buckets.mouth.R.y }, { x: buckets.mouth.R.x + 90, y: 20 }, Math.round(-ds / 4), "#f2c94c", "coin");
          if (o.effects.creative < 0) fling({ x: buckets.mouth.L.x, y: buckets.mouth.L.y }, { x: buckets.mouth.L.x - 90, y: 40 }, 30, state.layers[state.layers.length - 1].c, "paint");
          for (const k in o.effects) state.meters[k] = Math.max(0, Math.min(100, state.meters[k] + o.effects[k]));
          buckets.kick(0.6);
        }, 700);
        setTimeout(() => { $("cards").hidden = true; folder.classList.remove("open"); stage.classList.remove("hush"); resolve(o); }, 2600);
      }
    });
  }

  /* ----------------------------------------------- five years later */
  async function toFuture(out) {
    $("wipe").className = "in"; snd.page(); await sleep(state.skip ? 0 : 750);
    state.future = true; syncWriting(); clearInterval(typeLoop);
    $("bg").innerHTML = Sets.themed(out.id);
    $("desk").hidden = true; $("props").hidden = true;
    actors.advisor.classList.add("away");
    cast.jasmine.expr = "happy"; cast.jasmine.pose = ""; render("jasmine");
    actors.jasmine.classList.add("solo"); cam("solo"); grade(STORY.branches[out.path].grade);
    $("later").textContent = STORY.ui.later; $("later").classList.add("on");
    $("wipe").className = "out"; await sleep(800); $("wipe").className = "";
  }

  function showEnding(id, out) {
    box.hidden = true; snd.chime();
    $("e-title").textContent = out.title;
    $("e-meters").innerHTML = "";
    for (const [k, label, c] of [["creative", "Creative Bucket", "#e8813a"], ["security", "Security", "#c9902a"]]) {
      const d = document.createElement("div"); d.className = "fm"; d.textContent = label;
      const b = document.createElement("b"); b.textContent = state.meters[k]; b.style.color = c; d.appendChild(b); $("e-meters").appendChild(d);
    }
    $("e-closing").textContent = STORY.ui.closing;
    let found = []; try { found = JSON.parse(localStorage.getItem("cb3.endings") || "[]"); } catch (e) { /* ignore */ }
    if (!found.includes(id)) found.push(id);
    try { localStorage.setItem("cb3.endings", JSON.stringify(found)); } catch (e) { /* ignore */ }
    const all = Object.keys(STORY.outcomes);
    $("e-found").textContent = `Endings found: ${all.filter((k) => found.includes(k)).length} of ${all.length}`;
    $("e-list").innerHTML = "";
    for (const k of all) { const li = document.createElement("li"); li.textContent = found.includes(k) ? STORY.outcomes[k].title : "?"; li.className = k === id ? "now" : found.includes(k) ? "" : "no"; $("e-list").appendChild(li); }
    $("ending").hidden = false;
  }

  /* -------------------------------------------------------------- flow */
  function setup() {
    $("bg").innerHTML = Sets.office(); $("desk").innerHTML = Sets.desk();
    pen.innerHTML = Sets.pen(); $("sheet").insertAdjacentHTML("afterbegin", Sets.sheet()); writer.place(); preload(); folder.innerHTML = Sets.folder();
    render("jasmine"); render("advisor"); cam("wide");
  }
  async function run() {
    state.started = true;
    $("skip").hidden = false;
    await play(STORY.opening);
    if (state.skip) { state.skip = false; setPose("advisor", ""); setPose("jasmine", ""); acts.penDrop(); acts.folder(); setFace("jasmine", "stressed"); setFace("advisor", "smiling"); ai(false); }
    $("skip").hidden = true;
    const c1 = await decide(STORY.decision1);
    const br = STORY.branches[c1.id];
    grade(br.grade);
    await play(br.beats);
    setPose("advisor", ""); acts.folder();
    const c2 = await decide(br.cards);
    const out = { ...STORY.outcomes[c2.id], id: c2.id };
    await play(out.dialogue);
    await toFuture(out);
    await play([{ who: "advisor", cam: "solo", face: out.face || "happy", text: out.text }]);
    buckets.kick(0.8);
    showEnding(c2.id, out);
  }

  /* ----------------------------------------------------------- loop */
  let last = performance.now(), frames = [];
  function loop(now) {
    const ms = now - last; last = now; if (frames.length < 3000) frames.push(ms);
    const dt = Math.min(0.05, ms / 1000);
    for (const k of ["creative", "security"]) {
      const d = state.meters[k] - state.shown[k], before = Math.round(state.shown[k]);
      state.shown[k] = Math.abs(d) < 0.2 ? state.meters[k] : state.shown[k] + d * Math.min(1, dt * 2.4);
    }
    buckets.draw(dt); drawParts(dt); writer.step(dt);
    requestAnimationFrame(loop);
  }
  window.__frames = () => { const a = frames.slice(60).sort((x, y) => x - y); return a.length ? { n: a.length, median: +a[a.length >> 1].toFixed(1), p95: +a[Math.floor(a.length * 0.95)].toFixed(1), worst: +a[a.length - 1].toFixed(1) } : null; };
  window.__state = state;

  /* ---------------------------------------------------------- wiring */
  $("t-name").textContent = STORY.ui.title; $("t-tag").textContent = STORY.ui.tagline; $("t-by").textContent = STORY.ui.authors;
  $("start").onclick = () => { audio(); music(); $("title").hidden = true; snd.page(); run(); };
  $("skip").onclick = () => { state.skip = true; state.fast = true; tap(); };
  $("sound").onclick = () => { muted = !muted; $("sound").textContent = muted ? "♪ off" : "♪ on"; if (musicBus) musicBus.gain.setTargetAtTime(muted ? 0 : 1, AC.currentTime, 0.2); };
  $("again").onclick = () => location.reload();
  document.querySelectorAll("[data-credits]").forEach((b) => { b.onclick = () => { $("credits").hidden = false; }; });
  $("close-credits").onclick = () => { $("credits").hidden = true; };
  setup();
  requestAnimationFrame(loop);
})();
