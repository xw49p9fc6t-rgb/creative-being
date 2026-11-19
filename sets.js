/* Creative Being — the sketchbook sets: pencil line over watercolour wash.
   All drawn in code; no image files. Stage frame is 390 x 844. */
(function () {
  "use strict";
  var INK = "#2b2330";
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  var DEFS = '<defs>' +
    '<filter id="pencil" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter>' +
    '<filter id="wash" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="3" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".7"/></filter>' +
    '<filter id="bleed" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>' +
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcdcef"/><stop offset=".7" stop-color="#f4dcc2"/><stop offset="1" stop-color="#f7c9a0"/></linearGradient>' +
    '</defs>';
  function lines(d, w, op) { return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w || 1.3) + '" opacity="' + (op || 0.8) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }

  /* ------------------------------------------------------------- office */
  function office() {
    var r = rng(17), wash = "", ink = "", i;
    wash += '<rect x="-20" y="-20" width="430" height="520" fill="#efe0cb"/>';
    wash += '<ellipse cx="80" cy="240" rx="150" ry="150" fill="#ffd8a2" opacity=".55"/><ellipse cx="330" cy="330" rx="110" ry="190" fill="#c9c2df" opacity=".4"/><ellipse cx="200" cy="80" rx="190" ry="90" fill="#f6e8d4" opacity=".7"/>';
    // window
    wash += '<rect x="16" y="150" width="138" height="174" fill="url(#sky)"/>';
    var bx = 18;
    while (bx < 152) { var bw = 12 + r() * 18, bh = 30 + r() * 52; bw = Math.min(bw, 154 - bx);
      wash += '<rect x="' + bx.toFixed(1) + '" y="' + (324 - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" fill="#a7b4cc" opacity=".7"/>'; bx += bw + 1; }
    wash += '<circle cx="124" cy="268" r="13" fill="#ffd27f" opacity=".9"/>';
    wash += '<path d="M154 150 L390 330 L390 470 L154 324 Z" fill="#fff4dc" opacity=".35"/>';
    for (i = 0; i < 9; i++) ink += lines("M16 " + (156 + i * 8) + " H154", 1, 0.55);
    ink += lines("M16 150 H154 V324 H16 Z M85 150 V324 M16 236 H154", 2.2, 0.9);
    ink += '<rect x="8" y="324" width="154" height="8" fill="#f7efe2" stroke="' + INK + '" stroke-width="1.4"/>';
    wash += '<path d="M118 324 l3 -20 h24 l3 20 z" fill="#d07b52"/>';
    ink += lines("M118 324 l3 -20 h24 l3 20 z", 1.3);
    ink += '<g fill="#7fa86a" stroke="' + INK + '" stroke-width="1.1">' +
      '<path d="M133 304 C122 290 112 286 104 288 C110 296 122 300 133 304 Z"/><path d="M133 304 C134 288 140 278 148 274 C148 286 142 298 133 304 Z"/><path d="M133 304 C146 294 156 292 162 296 C154 302 144 304 133 304 Z"/></g>';
    // clock
    ink += '<circle cx="201" cy="166" r="16" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1.8"/>';
    for (i = 0; i < 12; i++) { var a = i * Math.PI / 6; ink += lines("M" + (201 + Math.cos(a) * 12.5).toFixed(1) + " " + (166 + Math.sin(a) * 12.5).toFixed(1) + " L" + (201 + Math.cos(a) * 14.5).toFixed(1) + " " + (166 + Math.sin(a) * 14.5).toFixed(1), 1.1, 0.7); }
    ink += lines("M201 166 V157 M201 166 L208 170", 1.8, 0.9);
    ink += '<path class="sec" d="M201 169 V152" stroke="#d6534f" stroke-width="1.1"/>';
    // corkboard with notes
    wash += '<rect x="158" y="194" width="86" height="70" fill="#d3a46e"/>';
    ink += '<rect x="158" y="194" width="86" height="70" fill="none" stroke="#6b4a32" stroke-width="3"/>';
    [["#fff4a8", 164, 200, -6], ["#cfe7f7", 190, 204, 4], ["#ffd0d6", 214, 198, -3], ["#fbf7ef", 172, 228, 3], ["#d6eccd", 204, 230, -5]].forEach(function (n) {
      ink += '<g transform="rotate(' + n[3] + " " + (n[1] + 12) + " " + (n[2] + 12) + ')"><rect x="' + n[1] + '" y="' + n[2] + '" width="24" height="24" fill="' + n[0] + '" stroke="' + INK + '" stroke-width=".9"/>' +
        lines("M" + (n[1] + 4) + " " + (n[2] + 9) + " h15 M" + (n[1] + 4) + " " + (n[2] + 14) + " h11 M" + (n[1] + 4) + " " + (n[2] + 19) + " h13", 0.8, 0.5) +
        '<circle cx="' + (n[1] + 12) + '" cy="' + (n[2] + 3) + '" r="2" fill="#d6534f"/></g>';
    });
    // bookshelf
    wash += '<rect x="292" y="104" width="110" height="380" fill="#b98d62"/>';
    var palette = ["#d6534f", "#4f7fb8", "#e8b83e", "#6f9e62", "#8a5aa8", "#e8813a", "#3e8a86", "#c9a6c8", "#f2e1c0"];
    for (var s = 0; s < 5; s++) {
      var base = 170 + s * 72, x = 298;
      while (x < 388) {
        var w = 7 + r() * 9, h = 38 + r() * 24, c = palette[Math.floor(r() * palette.length)];
        if (r() < 0.1) { ink += '<g transform="rotate(14 ' + x + ' ' + base + ')"><rect x="' + x + '" y="' + (base - h) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + c + '" stroke="' + INK + '" stroke-width=".9"/></g>'; x += w + 8; continue; }
        ink += '<rect x="' + x.toFixed(1) + '" y="' + (base - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + c + '" stroke="' + INK + '" stroke-width=".9"/>';
        ink += lines("M" + (x + 1.5).toFixed(1) + " " + (base - h + 6).toFixed(1) + " h" + (w - 3).toFixed(1), 0.7, 0.5);
        x += w + 0.8;
      }
      ink += '<rect x="290" y="' + base + '" width="112" height="7" fill="#8a6440" stroke="' + INK + '" stroke-width="1.1"/>';
    }
    ink += lines("M292 104 V480", 2.2, 0.9);
    // hanging plant
    ink += lines("M60 0 V58", 1, 0.7) + '<path d="M44 58 h32 l-5 22 h-22 z" fill="#d07b52" stroke="' + INK + '" stroke-width="1.3"/>';
    for (i = 0; i < 5; i++) { var dx = -36 + i * 18, ln = 40 + r() * 60; ink += lines("M60 76 q" + (dx * 0.5).toFixed(0) + " " + (ln * 0.5).toFixed(0) + " " + dx + " " + ln.toFixed(0), 1.2, 0.8);
      for (var k = 1; k < 4; k++) ink += '<ellipse cx="' + (60 + dx * k / 4 * 1.1).toFixed(1) + '" cy="' + (76 + ln * k / 4).toFixed(1) + '" rx="5" ry="2.8" fill="#86b06f" stroke="' + INK + '" stroke-width=".8" transform="rotate(' + (k % 2 ? 30 : -30) + " " + (60 + dx * k / 4 * 1.1).toFixed(1) + " " + (76 + ln * k / 4).toFixed(1) + ')"/>'; }
    // a framed sketch
    ink += '<rect x="22" y="76" width="0" height="0"/>';
    return '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + DEFS +
      '<rect width="390" height="844" fill="#f5eee2"/>' +
      '<g filter="url(#wash)">' + wash + "</g>" +
      '<g filter="url(#pencil)">' + ink + "</g></svg>";
  }

  /* --------------------------------------------------------------- desk */
  function desk() {
    var g = "";
    g += '<g filter="url(#wash)"><path d="M-20 68 L410 68 L420 240 L-30 240 Z" fill="#c4935f"/><rect x="-20" y="236" width="430" height="220" fill="#a3734a"/>' +
      '<ellipse cx="300" cy="96" rx="70" ry="10" fill="#7a5233" opacity=".45"/><ellipse cx="200" cy="96" rx="20" ry="5" fill="#7a5233" opacity=".45"/></g>';
    g += '<g filter="url(#pencil)">' + lines("M-20 68 H410", 2, 0.9) + lines("M-20 236 H410", 1.6, 0.8) +
      lines("M20 120 q120 -6 240 0 M60 170 q160 -8 300 2 M0 210 q200 -10 390 0", 1, 0.35);
    // laptop, back of the lid
    g += '<path d="M238 6 L350 6 L344 82 L244 82 Z" fill="#cfd2db" stroke="' + INK + '" stroke-width="1.8"/><path d="M244 12 L262 12 L254 76 L248 76 Z" fill="#fff" opacity=".35"/>' +
      '<path d="M228 82 L360 82 L368 92 L220 92 Z" fill="#a9afbf" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<path d="M296 30 l4 9 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -1 z" fill="#ffd166" stroke="' + INK + '" stroke-width="1"/>' +
      '<rect x="262" y="52" width="16" height="12" rx="3" fill="#ff8fa3" stroke="' + INK + '" stroke-width=".9" transform="rotate(-10 270 58)"/>';
    // mug
    g += '<path d="M182 52 h30 l-2 34 h-26 z" fill="#5d8fbf" stroke="' + INK + '" stroke-width="1.6"/><ellipse cx="197" cy="52" rx="15" ry="4" fill="#4a2a1c" stroke="' + INK + '" stroke-width="1.3"/>' +
      '<path d="M212 60 c10 0 10 18 -1 18" fill="none" stroke="' + INK + '" stroke-width="1.6"/><path d="M188 60 v18" stroke="#fff" stroke-width="2" opacity=".5"/>';
    // pencil cup
    g += '<path d="M352 50 h30 l-3 42 h-24 z" fill="#8a5aa8" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<path d="M358 50 l-4 -26 M366 50 v-30 M374 50 l5 -24" stroke-width="4" stroke="#e8b83e"/><path d="M366 50 v-30" stroke="#d6534f" stroke-width="4"/>';
    // nameplate
    g += '<path d="M262 108 h86 l4 22 h-94 z" fill="#6b4a3a" stroke="' + INK + '" stroke-width="1.4"/><rect x="270" y="112" width="70" height="13" fill="#efdca8" stroke="' + INK + '" stroke-width=".9"/>' +
      '<text x="305" y="122" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="8.5" letter-spacing="1.5" fill="#2b2330">ADVISOR</text>';
    // paper stack
    g += '<path d="M-6 74 h46 l-4 24 h-44 z" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1.2"/><path d="M-6 80 h48 l-3 22 h-46 z" fill="#f3ead8" stroke="' + INK + '" stroke-width="1.2"/>';
    // the 5-year plan
    g += '<g transform="rotate(-5 104 124)"><rect x="40" y="96" width="132" height="70" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<text x="50" y="110" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="9" letter-spacing="1" fill="#2b2330">5-YEAR PLAN</text>' +
      lines("M50 114 H162", 1.2, 0.8) + lines("M62 126 H160 M62 138 H160 M62 150 H140", 0.8, 0.45) +
      '<rect x="50" y="120" width="7" height="7" fill="none" stroke="' + INK + '" stroke-width=".9"/><rect x="50" y="132" width="7" height="7" fill="none" stroke="' + INK + '" stroke-width=".9"/><rect x="50" y="144" width="7" height="7" fill="none" stroke="' + INK + '" stroke-width=".9"/>' +
      lines("M51 123 l2 3 l4 -6", 1.2, 0.9) + lines("M64 124 q8 -4 14 0 t16 0 t12 -2", 1, 0.8) + "</g>";
    g += "</g>";
    return '<svg viewBox="0 0 390 434" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + DEFS + g + "</svg>";
  }

  /* Jasmine's writing arm, drawn in stage coordinates so it runs from her
     shoulder down onto the 5-year plan. */
  function arm() {
    return '<svg viewBox="0 330 200 250" aria-hidden="true"><g stroke="' + INK + '" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M14 352 C2 400 4 452 24 480 C44 504 74 520 104 530 L112 510 C86 498 64 482 52 462 C42 440 44 400 58 360 Z" fill="#e2a948"/>' +
      '<path d="M30 380 C24 410 26 440 38 462 M66 498 q10 4 20 8" fill="none" stroke="#b97a24" stroke-width="1.2"/>' +
      '<path d="M100 534 L110 506 L118 509 L108 537 Z" fill="#fbf9f4"/>' +
      '<path d="M108 512 C114 504 130 506 136 515 C141 523 137 535 127 537 C117 539 108 533 106 525 Z" fill="#f8dfcf"/></g></svg>';
  }
  function fingers() {
    return '<svg viewBox="0 330 200 250" aria-hidden="true"><g stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" fill="#f8dfcf">' +
      '<path d="M116 528 C114 520 120 516 126 518 C130 520 130 528 126 532 C122 535 117 533 116 528 Z"/><path d="M128 520 C132 516 138 518 138 524 C138 529 133 531 130 529" fill="none"/></g></svg>';
  }
  function pen() {
    return '<svg viewBox="0 0 60 10" aria-hidden="true"><g stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round">' +
      '<path d="M0 5 L12 1.5 V8.5 Z" fill="#f2d2a6"/><path d="M0 5 L4 3.8 V6.2 Z" fill="#2b2330"/><path d="M12 1.5 H52 V8.5 H12 Z" fill="#e8b83e"/><path d="M52 1.5 H59 V8.5 H52 Z" fill="#e98aa0"/></g></svg>';
  }
  function folder() {
    return '<svg viewBox="0 0 150 100" aria-hidden="true"><g stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round">' +
      '<path d="M6 26 h48 l10 -12 h40 v12 h40 v68 H6 Z" fill="#e2b56f"/>' +
      '<g class="peek"><rect x="22" y="12" width="34" height="46" fill="#fffdf8" transform="rotate(-8 39 35)"/><rect x="58" y="6" width="34" height="46" fill="#fffdf8"/><rect x="94" y="12" width="34" height="46" fill="#fffdf8" transform="rotate(8 111 35)"/>' +
      '<rect x="22" y="12" width="34" height="8" fill="#e8813a" stroke="none" transform="rotate(-8 39 35)"/><rect x="58" y="6" width="34" height="8" fill="#6f9e62" stroke="none"/><rect x="94" y="12" width="34" height="8" fill="#4f7fb8" stroke="none" transform="rotate(8 111 35)"/></g>' +
      '<path class="flap" d="M6 40 h138 v54 H6 Z" fill="#edc282"/><path d="M60 64 h30" stroke-width="1" opacity=".6"/></g></svg>';
  }

  /* ------------------------------------------------- future (outcomes) */
  var ICON = {
    wave: "M2 36 Q12 26 22 36 T42 36 T62 36 M2 48 Q12 38 22 48 T42 48 T62 48",
    mountain: "M2 52 L22 18 L32 32 L40 22 L58 52 Z M18 25 L22 18 L26 24",
    book: "M30 16 C22 10 10 10 4 14 V48 C10 44 22 44 30 50 C38 44 50 44 56 48 V14 C50 10 38 10 30 16 Z M30 16 V50 M10 22 h12 M10 30 h12 M38 22 h12 M38 30 h12",
    clapper: "M6 24 H54 V52 H6 Z M6 24 L10 12 L54 6 L54 18 Z M18 11 L14 22 M30 9 L26 22 M42 7 L38 22",
    star: "M30 6 L36 22 L54 23 L40 34 L45 52 L30 42 L15 52 L20 34 L6 23 L24 22 Z",
    phone: "M18 4 H42 Q48 4 48 10 V50 Q48 56 42 56 H18 Q12 56 12 50 V10 Q12 4 18 4 Z M26 22 L38 30 L26 38 Z M26 50 h8",
    heart: "M30 50 C10 36 4 26 10 16 C16 8 26 10 30 18 C34 10 44 8 50 16 C56 26 50 36 30 50 Z",
    moon: "M40 8 A24 24 0 1 0 52 44 A18 18 0 1 1 40 8 Z",
    telescope: "M10 26 L44 12 L48 22 L14 36 Z M44 12 L52 9 L56 19 L48 22 M28 30 L18 54 M28 30 L38 54 M28 30 V54",
    brain: "M30 12 C20 6 8 12 10 22 C2 26 4 38 12 40 C12 50 24 54 30 48 C36 54 48 50 48 40 C56 38 58 26 50 22 C52 12 40 6 30 12 Z M30 12 V48 M18 24 q6 4 0 10 M42 24 q-6 4 0 10",
    palette: "M30 6 C14 6 4 18 6 32 C8 46 22 54 32 50 C38 48 34 40 40 38 C48 36 56 34 56 24 C56 12 44 6 30 6 Z M18 20 a3 3 0 1 0 0.1 0 M30 14 a3 3 0 1 0 0.1 0 M42 18 a3 3 0 1 0 0.1 0 M16 34 a3 3 0 1 0 0.1 0",
    frame: "M6 8 H54 V52 H6 Z M12 14 H48 V46 H12 Z M14 44 L26 28 L34 38 L40 32 L48 44",
    chart: "M6 52 H56 M12 52 V36 H20 V52 M26 52 V26 H34 V52 M40 52 V14 H48 V52 M10 30 L24 20 L36 12 L52 6 M46 6 h6 v6",
    clock: "M30 6 A24 24 0 1 0 30.1 6 Z M30 16 V30 L40 36",
    yarn: "M30 8 A20 20 0 1 0 30.1 8 Z M14 22 Q30 30 48 20 M12 34 Q30 42 50 30 M20 46 Q34 38 46 46 M8 56 L52 4",
    brush: "M44 6 L54 16 L28 42 L18 32 Z M18 32 C10 34 6 42 4 54 C16 52 24 48 28 42",
    laptop: "M12 10 H48 V38 H12 Z M4 46 H56 L52 52 H8 Z M18 18 h16 M18 24 h22 M18 30 h12",
    bubble: "M8 10 H52 V38 H24 L14 50 V38 H8 Z M16 20 h28 M16 28 h18"
  };
  var PATHS = {
    leap:   { wash: ["#ffcf9a", "#ffb3a7", "#ffe7a8"], fill: "#e8813a" },
    middle: { wash: ["#cfe6c4", "#f6deb0", "#bfdcea"], fill: "#6f9e62" },
    defeat: { wash: ["#bcd3f0", "#d8d2f0", "#c8e6ea"], fill: "#4f7fb8" }
  };
  function future(path, icons) {
    var p = PATHS[path] || PATHS.leap, r = rng(path.length * 97 + icons.join("").length), g = "";
    g += '<rect width="390" height="844" fill="#f7f1e6"/>';
    g += '<g filter="url(#wash)"><ellipse cx="110" cy="250" rx="190" ry="170" fill="' + p.wash[0] + '" opacity=".8"/><ellipse cx="300" cy="420" rx="170" ry="210" fill="' + p.wash[1] + '" opacity=".7"/><ellipse cx="190" cy="120" rx="200" ry="90" fill="' + p.wash[2] + '" opacity=".75"/></g>';
    var spots = [[34, 150, -10, 1.1], [300, 140, 8, 1.2], [36, 360, 6, 0.9], [314, 330, -6, 1], [170, 560, -4, 0.8], [330, 520, 10, 0.8]];
    var ink = "";
    spots.forEach(function (s, i) {
      var name = icons[i % icons.length], d = ICON[name];
      ink += '<g transform="translate(' + s[0] + " " + s[1] + ") rotate(" + s[2] + ") scale(" + s[3] + ')"><path d="' + d + '" fill="' + p.fill + '" fill-opacity=".22" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>';
    });
    for (var i = 0; i < 22; i++) {
      var x = 20 + r() * 350, y = 60 + r() * 560, s = 2 + r() * 4;
      ink += '<path d="M' + x.toFixed(0) + " " + (y - s).toFixed(1) + " Q" + x.toFixed(0) + " " + y.toFixed(0) + " " + (x + s).toFixed(1) + " " + y.toFixed(0) + " Q" + x.toFixed(0) + " " + y.toFixed(0) + " " + x.toFixed(0) + " " + (y + s).toFixed(1) + " Q" + x.toFixed(0) + " " + y.toFixed(0) + " " + (x - s).toFixed(1) + " " + y.toFixed(0) + " Q" + x.toFixed(0) + " " + y.toFixed(0) + " " + x.toFixed(0) + " " + (y - s).toFixed(1) + 'Z" fill="' + p.fill + '" opacity=".55"/>';
    }
    ink += lines("M20 640 Q195 610 370 640", 1.6, 0.6);
    return '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + DEFS + g + '<g filter="url(#pencil)">' + ink + "</g></svg>";
  }


  /* -------------------------------------- themed scenes for each ending */
  function frame(bgFill, wash, ink) {
    return '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + DEFS +
      '<rect width="390" height="844" fill="' + bgFill + '"/><g filter="url(#wash)">' + wash + '</g><g filter="url(#pencil)">' + ink + "</g></svg>";
  }
  function pine(x, y, h, c) { return '<path d="M' + x + " " + (y - h) + " L" + (x - h * 0.32) + " " + (y - h * 0.45) + " L" + (x - h * 0.16) + " " + (y - h * 0.45) + " L" + (x - h * 0.4) + " " + y + " L" + (x + h * 0.4) + " " + y + " L" + (x + h * 0.16) + " " + (y - h * 0.45) + " L" + (x + h * 0.32) + " " + (y - h * 0.45) + ' Z" fill="' + c + '" stroke="' + INK + '" stroke-width="1.2"/>'; }
  function framed(x, y, w, h, inner) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#8a6440" stroke="' + INK + '" stroke-width="1.4"/><rect x="' + (x + 6) + '" y="' + (y + 6) + '" width="' + (w - 12) + '" height="' + (h - 12) + '" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1"/>' + inner; }
  function shelfRow(x0, x1, base, seed) { var r = rng(seed), o = "", x = x0, pal = ["#d6534f", "#4f7fb8", "#e8b83e", "#6f9e62", "#8a5aa8", "#e8813a", "#3e8a86"];
    while (x < x1 - 8) { var w = 8 + r() * 9, h = 34 + r() * 22; o += '<rect x="' + x.toFixed(1) + '" y="' + (base - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + pal[Math.floor(r() * pal.length)] + '" stroke="' + INK + '" stroke-width=".9"/>'; x += w + 0.8; }
    return o + '<rect x="' + (x0 - 4) + '" y="' + base + '" width="' + (x1 - x0 + 8) + '" height="7" fill="#8a6440" stroke="' + INK + '" stroke-width="1"/>'; }
  var SCENES = {
    uvic: function () {   // painting by the sea in Victoria
      return frame("#dcecf2",
        '<rect x="-10" y="-10" width="410" height="420" fill="#bfe0ef"/><ellipse cx="300" cy="150" rx="60" ry="60" fill="#ffe1a6" opacity=".9"/><rect x="-10" y="400" width="410" height="140" fill="#6fb0cf"/><rect x="-10" y="540" width="410" height="320" fill="#e9d7b0"/>',
        '<path d="M-10 400 L60 300 L110 350 L170 260 L240 360 L300 310 L400 400 Z" fill="#9db7c8" stroke="' + INK + '" stroke-width="1.3"/><path d="M155 280 L170 260 L184 282" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1.1"/>' +
        '<path d="M-10 430 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 M-10 470 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 M-10 510 q30 -8 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#fbf7ef" stroke-width="2.2"/>' +
        '<path d="M250 420 h50 l-6 12 h-38 z" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1.2"/><path d="M274 420 v-30 l18 26 z" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1.2"/>' +
        pine(30, 540, 150, "#4f7d55") + pine(70, 540, 110, "#5f8f62") + pine(360, 540, 160, "#4f7d55") +
        '<path d="M300 640 L330 470 L360 640 M330 470 V640" stroke="#6b4a32" stroke-width="5" fill="none"/><rect x="296" y="490" width="68" height="74" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.4"/><path d="M300 540 q16 -20 30 -6 t30 -10 V560 H300 Z" fill="#6fb0cf"/><circle cx="350" cy="508" r="7" fill="#ffd27f"/>' +
        '<path d="M110 120 q8 -8 16 0 q8 -8 16 0 M150 90 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="' + INK + '" stroke-width="1.4"/>');
    },
    uoft: function () {   // on set, directing a TV series
      return frame("#2e2a3a",
        '<rect x="-10" y="-10" width="410" height="870" fill="#3a3550"/><path d="M60 -10 L200 640 L-10 640 Z" fill="#fff2c4" opacity=".22"/><path d="M330 -10 L190 640 L400 640 Z" fill="#fff2c4" opacity=".18"/><rect x="-10" y="560" width="410" height="300" fill="#2a2636"/>',
        '<g fill="#4a4558" stroke="' + INK + '" stroke-width="1.4"><path d="M40 40 h50 v36 h-50 z"/><path d="M300 40 h50 v36 h-50 z"/></g><path d="M65 76 V140 M325 76 V140" stroke="#888" stroke-width="3"/>' +
        '<g stroke="' + INK + '" stroke-width="1.4"><rect x="34" y="420" width="96" height="70" fill="#f6f2e6"/><path d="M34 420 L40 396 L132 384 L130 410 Z" fill="#2b2330"/><path d="M58 392 l-8 20 M82 389 l-8 22 M106 386 l-8 24" stroke="#f6f2e6" stroke-width="5"/></g>' +
        '<text x="44" y="446" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="11" fill="#2b2330">SCENE 1</text><text x="44" y="466" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="11" fill="#2b2330">TAKE 3</text>' +
        '<path d="M290 600 L300 470 h60 l10 130 M300 520 h60" stroke="#c2453b" stroke-width="5" fill="none"/><rect x="296" y="470" width="68" height="22" fill="#c2453b" stroke="' + INK + '" stroke-width="1.2"/><text x="330" y="485" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="9" fill="#fff">DIRECTOR</text>' +
        '<g fill="#ffd27f">' + [60, 120, 180, 240, 300].map(function (x) { return '<circle cx="' + x + '" cy="14" r="5"/>'; }).join("") + "</g>");
    },
    nouni: function () {  // a bestselling novel and a viral video
      return frame("#fbe9e6",
        '<rect x="-10" y="-10" width="410" height="870" fill="#ffe3df"/><ellipse cx="195" cy="300" rx="150" ry="150" fill="#fff6d8"/>',
        '<circle cx="195" cy="300" r="120" fill="none" stroke="#fffdf8" stroke-width="16"/><circle cx="195" cy="300" r="120" fill="none" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<g transform="rotate(-8 60 480)"><rect x="24" y="420" width="70" height="96" fill="#5b78c4" stroke="' + INK + '" stroke-width="1.5"/><rect x="24" y="420" width="10" height="96" fill="#3f5a9e" stroke="' + INK + '" stroke-width="1.2"/><text x="64" y="460" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="10" fill="#fff">MY</text><text x="64" y="474" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="10" fill="#fff">NOVEL</text><path d="M56 488 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 z" fill="#ffd166"/></g>' +
        '<g transform="rotate(8 330 470)"><rect x="300" y="410" width="60" height="108" rx="10" fill="#2b2330" stroke="' + INK + '" stroke-width="1.5"/><rect x="306" y="420" width="48" height="84" fill="#ffd0d6"/><path d="M322 448 L342 462 L322 476 Z" fill="#fff"/></g>' +
        '<g fill="#e0566f" stroke="' + INK + '" stroke-width="1">' + [[300, 380, 1], [340, 340, 0.8], [280, 330, 0.6], [80, 380, 0.7], [110, 340, 0.5]].map(function (h) { return '<path transform="translate(' + h[0] + " " + h[1] + ") scale(" + h[2] + ')" d="M0 14 C-14 4 -16 -6 -8 -10 C-4 -12 0 -9 0 -5 C0 -9 4 -12 8 -10 C16 -6 14 4 0 14 Z"/>'; }).join("") + "</g>");
    },
    physics: function () { // a lab in Alaska under the northern lights
      return frame("#141a33",
        '<rect x="-10" y="-10" width="410" height="870" fill="#1b2347"/><path d="M-20 200 C80 120 160 260 260 160 S380 120 420 170 L420 260 C340 220 260 320 160 260 S20 260 -20 300 Z" fill="#5fe0b0" opacity=".45"/><path d="M-20 260 C100 200 200 300 300 230 S400 230 420 250 L420 300 C300 300 200 340 100 300 S0 320 -20 330 Z" fill="#9b7fe0" opacity=".35"/><rect x="-10" y="520" width="410" height="340" fill="#e7eef5"/>',
        (function () { var o = "", r = rng(5); for (var i = 0; i < 50; i++) o += '<circle cx="' + (r() * 390).toFixed(0) + '" cy="' + (r() * 480).toFixed(0) + '" r="' + (0.6 + r() * 1.4).toFixed(1) + '" fill="#fff" stroke="none" opacity=".85"/>'; return o; })() +
        '<path d="M-10 520 L70 440 L120 490 L190 420 L260 500 L320 450 L400 520 Z" fill="#cfdbe8" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<path d="M262 520 a46 46 0 0 1 92 0 Z" fill="#dfe6ee" stroke="' + INK + '" stroke-width="1.5"/><rect x="262" y="520" width="92" height="40" fill="#c9d3de" stroke="' + INK + '" stroke-width="1.5"/><path d="M300 482 L332 448" stroke="' + INK + '" stroke-width="6"/><rect x="292" y="532" width="14" height="22" fill="#ffd27f" stroke="' + INK + '" stroke-width="1"/>' +
        '<path d="M34 92 a18 18 0 1 0 22 22 a14 14 0 1 1 -22 -22 Z" fill="#f1e6b8" stroke="none"/>');
    },
    psychology: function () { // her paintings in a gallery
      return frame("#f3eee6",
        '<rect x="-10" y="-10" width="410" height="560" fill="#efe8dc"/><rect x="-10" y="540" width="410" height="320" fill="#c9b8a0"/><path d="M60 40 L20 260 H120 Z M330 40 L270 260 H390 Z" fill="#fff6d8" opacity=".7"/>',
        '<path d="M60 0 V36 M330 0 V36" stroke="' + INK + '" stroke-width="1.2"/><path d="M48 36 h24 l-4 10 h-16 z M318 36 h24 l-4 10 h-16 z" fill="#3a3442" stroke="' + INK + '" stroke-width="1"/>' +
        framed(16, 120, 96, 120, '<path d="M24 230 L50 180 L66 204 L82 186 L104 230 Z" fill="#6f9e62"/><circle cx="88" cy="150" r="10" fill="#ffd27f"/>') +
        framed(276, 110, 100, 130, '<circle cx="326" cy="176" r="30" fill="#e8813a" opacity=".85"/><circle cx="312" cy="196" r="22" fill="#5b78c4" opacity=".75"/>') +
        framed(30, 300, 70, 90, '<path d="M40 380 C50 330 70 360 90 312" stroke="#c46aa0" stroke-width="6" fill="none"/>') +
        framed(296, 290, 70, 90, '<path d="M330 320 C318 300 302 316 312 330 C298 338 312 360 330 350 C346 362 360 340 348 330 C358 316 342 300 330 320 Z" fill="#f4a3a3" stroke="#c46aa0" stroke-width="1.4"/>') +
        '<rect x="300" y="392" width="60" height="14" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1"/><text x="330" y="402" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif" font-size="7" fill="#2b2330">J. Myer</text>');
    },
    business: function () { // marketing at a publisher
      return frame("#eef1f5",
        '<rect x="-10" y="-10" width="410" height="870" fill="#e4e9f0"/><rect x="20" y="70" width="150" height="250" fill="#bcd3ea"/>',
        '<g fill="#93a8c4" stroke="' + INK + '" stroke-width="1">' + [[24, 200, 30, 120], [58, 160, 26, 160], [88, 220, 24, 100], [116, 180, 30, 140], [148, 230, 20, 90]].map(function (b) { return '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '"/>'; }).join("") + "</g>" +
        '<path d="M20 70 H170 V320 H20 Z M95 70 V320 M20 195 H170" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
        '<rect x="226" y="80" width="150" height="110" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.6"/><path d="M240 176 V150 H256 V176 M266 176 V130 H282 V176 M292 176 V110 H308 V176 M318 176 V96 H334 V176" fill="#e8b83e" stroke="' + INK + '" stroke-width="1.2"/><path d="M240 140 L280 116 L320 100 L358 88 M350 86 h8 v8" stroke="#d6534f" stroke-width="2" fill="none"/>' +
        shelfRow(230, 384, 270, 3) + shelfRow(230, 384, 340, 7) + shelfRow(230, 384, 410, 11) +
        '<rect x="226" y="200" width="160" height="10" fill="#8a6440" stroke="' + INK + '" stroke-width="1"/><text x="306" y="232" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="11" fill="#2b2330">NEW RELEASES</text>');
    },
    hour: function () {   // a cozy hour of fibre art
      return frame("#f6ece0",
        '<rect x="-10" y="-10" width="410" height="870" fill="#f1e2cf"/><ellipse cx="300" cy="250" rx="140" ry="160" fill="#ffd9a8" opacity=".6"/><rect x="230" y="70" width="140" height="180" fill="#f7d9b8"/>',
        '<path d="M230 70 H370 V250 H230 Z M300 70 V250 M230 160 H370" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
        '<path d="M40 40 H150" stroke="#8a6440" stroke-width="5"/><path d="M50 40 V200 C70 220 120 220 140 200 V40" fill="#e8b4a0" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<path d="M50 70 Q95 90 140 70 M50 100 Q95 120 140 100 M50 130 Q95 150 140 130 M50 160 Q95 180 140 160" stroke="#c2453b" stroke-width="3" fill="none"/>' +
        [60, 80, 100, 120].map(function (x) { return '<path d="M' + x + " 206 v" + (40 + (x % 40)) + '" stroke="#c46aa0" stroke-width="2"/>'; }).join("") +
        '<path d="M290 560 C290 520 370 520 370 560 L362 600 H298 Z" fill="#b98d62" stroke="' + INK + '" stroke-width="1.5"/>' +
        '<circle cx="312" cy="530" r="16" fill="#e8813a" stroke="' + INK + '" stroke-width="1.2"/><circle cx="342" cy="526" r="16" fill="#5b78c4" stroke="' + INK + '" stroke-width="1.2"/><circle cx="328" cy="512" r="14" fill="#6f9e62" stroke="' + INK + '" stroke-width="1.2"/>' +
        '<path d="M300 508 L360 470 M310 512 L372 486" stroke="#8a6440" stroke-width="3"/>' +
        '<circle cx="60" cy="300" r="20" fill="#fbf7ef" stroke="' + INK + '" stroke-width="1.5"/><path d="M60 300 V288 M60 300 L70 306" stroke="' + INK + '" stroke-width="1.6"/>');
    },
    club: function () {   // the weekly arts club, and friends
      return frame("#f7efe3",
        '<rect x="-10" y="-10" width="410" height="870" fill="#f3e6d3"/><ellipse cx="195" cy="200" rx="200" ry="140" fill="#ffe7b8" opacity=".6"/><rect x="-10" y="560" width="410" height="300" fill="#c9a77a"/>',
        '<path d="M-10 40 C100 90 290 90 400 30" fill="none" stroke="' + INK + '" stroke-width="1.2"/>' +
        [30, 80, 130, 180, 230, 280, 330].map(function (x, i) { var y = 40 + Math.sin((x / 400) * Math.PI) * 50; return '<path d="M' + (x - 10) + " " + y + " l10 22 l10 -22 Z" + '" fill="' + ["#e8813a", "#6f9e62", "#5b78c4", "#d9536a", "#e8b83e", "#8a5aa8", "#3e8a86"][i] + '" stroke="' + INK + '" stroke-width="1"/>'; }).join("") +
        '<path d="M30 600 L70 360 L110 600 M70 360 V600" stroke="#6b4a32" stroke-width="5" fill="none"/><rect x="34" y="380" width="72" height="90" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.4"/><path d="M40 450 C56 400 80 440 100 392" stroke="#5b78c4" stroke-width="7" fill="none"/>' +
        '<path d="M280 600 L320 350 L360 600 M320 350 V600" stroke="#6b4a32" stroke-width="5" fill="none"/><rect x="284" y="370" width="72" height="96" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.4"/><circle cx="320" cy="412" r="22" fill="#e8813a" opacity=".85"/><circle cx="306" cy="430" r="12" fill="#e8b83e" opacity=".85"/>' +
        '<g stroke="' + INK + '" stroke-width="1.2">' + [[150, 470, "#7aa36b"], [228, 470, "#c46aa0"]].map(function (f) { return '<circle cx="' + (f[0] < 195 ? 22 : 368) + '" cy="' + (f[1] - 2) + '" r="13" fill="#f0c9a8"/><path d="M' + ((f[0] < 195 ? 22 : 368) - 22) + ' ' + (f[1] + 40) + ' C' + ((f[0] < 195 ? 22 : 368) - 22) + ' ' + (f[1] + 14) + ' ' + ((f[0] < 195 ? 22 : 368) + 22) + ' ' + (f[1] + 14) + ' ' + ((f[0] < 195 ? 22 : 368) + 22) + ' ' + (f[1] + 40) + ' Z" fill="' + f[2] + '"/><path d="M' + ((f[0] < 195 ? 22 : 368) - 5) + ' ' + f[1] + ' q5 4 10 0" fill="none"/>'; }).join("") + "</g>");
    },
    blog: function () {   // writing the blog at a café window
      return frame("#eef0ea",
        '<rect x="-10" y="-10" width="410" height="870" fill="#e9ece4"/><rect x="20" y="60" width="350" height="260" fill="#cfe4ee"/><ellipse cx="300" cy="140" rx="50" ry="40" fill="#fff4c2"/>',
        '<path d="M20 60 H370 V320 H20 Z M195 60 V320" fill="none" stroke="' + INK + '" stroke-width="3"/><path d="M20 60 C60 100 100 100 120 70 C140 100 180 100 195 60 C210 100 250 100 270 70 C290 100 330 100 370 60" fill="#d6534f" stroke="' + INK + '" stroke-width="1.4" opacity=".9"/>' +
        '<rect x="230" y="420" width="130" height="86" rx="6" fill="#d9dce4" stroke="' + INK + '" stroke-width="1.5"/><rect x="238" y="428" width="114" height="66" fill="#fffdf8"/><rect x="238" y="428" width="114" height="12" fill="#5b78c4"/><path d="M246 452 h60 M246 462 h80 M246 472 h50" stroke="' + INK + '" stroke-width="1.2"/><path d="M222 506 H368 L376 516 H214 Z" fill="#b9bfcc" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<path d="M40 420 h72 v40 h-40 l-12 14 v-14 h-20 z" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.4"/><path d="M76 448 C68 442 66 436 70 433 C73 431 76 433 76 436 C76 433 79 431 82 433 C86 436 84 442 76 448 Z" fill="#e0566f"/>' +
        '<path d="M60 520 h28 l-3 34 h-22 z" fill="#5d8fbf" stroke="' + INK + '" stroke-width="1.4"/><path d="M68 512 c-4 -6 4 -8 0 -14" stroke="' + INK + '" stroke-width="1" fill="none" opacity=".5"/>');
    }
  };
  function themed(key) { return (SCENES[key] || SCENES.uvic)(); }
  window.Sets = { office: office, desk: desk, arm: arm, fingers: fingers, pen: pen, folder: folder, future: future, themed: themed };
})();
