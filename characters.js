/* Creative Being — Jasmine and the Academic Advisor.
   Original characters drawn in code in an anime sketch style: clean ink line,
   cel shading, big expressive eyes. Built from parts so expressions, blinks,
   mouth flaps and poses can change on the fly. Frame: 300 x 420, bottom edge
   sits on the desk. */
(function () {
  "use strict";
  var INK = "#2b2330";
  var uid = 0;

  /* ---------------------------------------------------------------- eyes */
  function shape(cx, cy, o) {
    return "M" + (cx - 11) + " " + (cy + 2) +
      " C" + (cx - 8) + " " + (cy - 9 * o) + " " + (cx + 6) + " " + (cy - 12 * o) + " " + (cx + 13) + " " + (cy - 3) +
      " C" + (cx + 10) + " " + (cy + 8 * o) + " " + (cx - 4) + " " + (cy + 11 * o) + " " + (cx - 11) + " " + (cy + 2) + " Z";
  }
  /* One eye, drawn as a right eye and mirrored for the left. */
  function eye(cx, cy, mirror, e, P) {
    var o = e.open == null ? 1 : e.open, dx = (e.dx || 0) * (mirror ? -1 : 1), dy = e.dy || 0;
    var id = "cl" + (++uid), sh = shape(cx, cy, o);
    var rx = e.small ? 5 : 7.6, ry = e.small ? 6.6 : 10;
    var g = '<g class="eo">' +
      '<clipPath id="' + id + '"><path d="' + sh + '"/></clipPath>' +
      '<path d="' + sh + '" fill="#fdfaf4" stroke="none"/>' +
      '<g clip-path="url(#' + id + ')" stroke="none"><g class="iris">' +
        '<ellipse cx="' + (cx + dx) + '" cy="' + (cy + 1 + dy) + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + P.irisId + ')"/>' +
        '<ellipse cx="' + (cx + dx) + '" cy="' + (cy + 1 + dy) + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + P.ring + '" stroke-width="1.1"/>' +
        '<ellipse cx="' + (cx + dx) + '" cy="' + (cy + dy) + '" rx="' + (e.small ? 1.7 : 3.3) + '" ry="' + (e.small ? 2.4 : 4.6) + '" fill="#170f14"/>' +
      '</g><path d="M' + (cx - 12) + " " + (cy - 2) + " C" + (cx - 6) + " " + (cy - 12 * o - 2) + " " + (cx + 8) + " " + (cy - 13 * o - 2) + " " + (cx + 14) + " " + (cy - 4) + '" fill="none" stroke="' + P.lidShade + '" stroke-width="5" opacity=".42"/></g>' +
      '<path d="M' + (cx - 12) + " " + (cy + 2) + " C" + (cx - 8) + " " + (cy - 10 * o) + " " + (cx + 6) + " " + (cy - 13 * o) + " " + (cx + 14) + " " + (cy - 3.5) + '" stroke-width="3.3"/>' +
      '<path d="M' + (cx + 12) + " " + (cy - 3.5) + ' l5.5 -2.2" stroke-width="2"/>' +
      '<path d="M' + (cx - 6) + " " + (cy + 10 * o) + " Q" + (cx + 3) + " " + (cy + 12 * o) + " " + (cx + 10) + " " + (cy + 5 * o) + '" stroke-width="1" opacity=".55"/>' +
      '<path d="M' + (cx - 7) + " " + (cy - 15 * o - 2) + " C" + (cx) + " " + (cy - 19 * o - 2) + " " + (cx + 8) + " " + (cy - 17 * o - 2) + " " + (cx + 12) + " " + (cy - 12 * o - 2) + '" stroke-width=".9" opacity=".4"/>' +
      '</g>' +
      '<path class="ec" d="M' + (cx - 11) + " " + (cy + 2) + " Q" + (cx + 1) + " " + (cy + 6) + " " + (cx + 13) + " " + cy + '" stroke-width="2.6"/>';
    if (mirror) g = '<g transform="translate(' + 2 * cx + ' 0) scale(-1 1)">' + g + "</g>";
    return g;
  }
  function shine(cx, cy, e) {
    if (e.arc) return "";
    var dx = e.dx || 0, dy = e.dy || 0;
    return '<g class="iris eo" stroke="none"><circle cx="' + (cx - 3 + dx) + '" cy="' + (cy - 4 + dy) + '" r="' + (e.small ? 1.6 : 2.7) + '" fill="#fff"/>' +
      '<circle cx="' + (cx + 3 + dx) + '" cy="' + (cy + 5 + dy) + '" r="1.2" fill="#fff" opacity=".9"/></g>';
  }
  function arcEye(cx, cy, mirror) {
    var p = '<path d="M' + (cx - 11) + " " + (cy + 3) + " Q" + (cx + 1) + " " + (cy - 9) + " " + (cx + 13) + " " + (cy + 1) + '" stroke-width="3"/>';
    var g = '<g class="eo">' + p + '</g><g class="ec">' + p + "</g>";
    return mirror ? '<g transform="translate(' + 2 * cx + ' 0) scale(-1 1)">' + g + "</g>" : g;
  }
  var BROWS = {
    n: function (cx, cy) { return "M" + (cx - 10) + " " + (cy - 20) + " Q" + (cx + 2) + " " + (cy - 24) + " " + (cx + 13) + " " + (cy - 19); },
    w: function (cx, cy) { return "M" + (cx - 10) + " " + (cy - 25) + " Q" + (cx + 2) + " " + (cy - 22) + " " + (cx + 13) + " " + (cy - 16); },
    a: function (cx, cy) { return "M" + (cx - 10) + " " + (cy - 15) + " Q" + (cx + 2) + " " + (cy - 19) + " " + (cx + 13) + " " + (cy - 22); },
    s: function (cx, cy) { return "M" + (cx - 10) + " " + (cy - 27) + " Q" + (cx + 2) + " " + (cy - 32) + " " + (cx + 13) + " " + (cy - 26); },
    h: function (cx, cy) { return "M" + (cx - 10) + " " + (cy - 22) + " Q" + (cx + 2) + " " + (cy - 27) + " " + (cx + 13) + " " + (cy - 22); }
  };
  function brows(kind, color) {
    var f = BROWS[kind] || BROWS.n;
    return '<path d="' + f(170, 132) + '" stroke="' + color + '" stroke-width="2.8"/>' +
      '<g transform="translate(260 0) scale(-1 1)"><path d="' + f(130, 132) + '" stroke="' + color + '" stroke-width="2.8"/></g>';
  }

  /* ------------------------------------------------------------- mouths */
  var MOUTH = {
    neutral: '<path d="M144 170 Q150 172.5 156 169.5" stroke-width="1.6"/>',
    smile: '<path d="M142 167.5 Q150 175 158 167.5" stroke-width="1.8"/>',
    worried: '<path d="M143 172 Q146.5 168.5 150 171.5 Q153.5 174.5 157 171" stroke-width="1.6"/>',
    flat: '<path d="M144 172.5 Q150 170.5 157 173" stroke-width="1.8"/>',
    grin: '<path d="M141 166 Q150 168 159 166 Q157 180 150 181 Q143 180 141 166 Z" fill="#7b2f33" stroke-width="1.4"/><path d="M145 176.5 Q150 173 155 176.5 Q150 180.5 145 176.5 Z" fill="#e7787d" stroke="none"/><path d="M142.6 167 Q150 169 157.4 167 L156.6 169.6 Q150 171 143.4 169.6 Z" fill="#fff" stroke="none"/>',
    o: '<ellipse cx="150" cy="172" rx="3.4" ry="4.4" fill="#7b2f33" stroke-width="1.3"/>',
    open: '<path d="M143 168 Q150 166.5 157 168 Q155 178 150 178.5 Q145 178 143 168 Z" fill="#7b2f33" stroke-width="1.3"/><path d="M146 175 Q150 172.5 154 175 Q150 178 146 175 Z" fill="#e7787d" stroke="none"/>',
    talk: '<path d="M144.5 168.5 Q150 167.5 155.5 168.5 Q154 175.5 150 176 Q146 175.5 144.5 168.5 Z" fill="#7b2f33" stroke-width="1.2"/>',
    oWide: '<ellipse cx="150" cy="172.5" rx="4.6" ry="6.2" fill="#7b2f33" stroke-width="1.3"/>'
  };
  function mouth(kind) {
    var talk = kind === "open" ? MOUTH.talk : kind === "o" ? MOUTH.oWide : kind === "grin" ? MOUTH.open : MOUTH.talk;
    return '<g class="m0">' + MOUTH[kind] + '</g><g class="m1">' + talk + "</g>";
  }

  /* -------------------------------------------------------- shared bits */
  function face(P) {
    return '<path d="M108 112 C108 76 126 58 150 58 C174 58 192 76 192 112 C192 140 184 162 170 180 C163 189 157 195 150 196 C143 195 137 189 130 180 C116 162 108 140 108 112 Z" fill="' + P.skin + '" stroke-width="1.8"/>' +
      '<path d="M192 112 C192 140 184 162 170 180 C163 189 157 195 150 196 C166 180 180 152 180 110 Z" fill="' + P.shade + '" stroke="none" opacity=".6"/>' +
      '<path d="M110 100 C130 114 170 114 190 100 L190 116 C170 126 130 126 110 116 Z" fill="' + P.shade + '" stroke="none" opacity=".55"/>' +
      '<path d="M148.5 150 L146.8 156 L150.6 156.6" stroke-width="1.1" opacity=".75"/>';
  }
  function neck(P) {
    return '<path d="M137 182 L135 228 C142 234 158 234 165 228 L163 182 Z" fill="' + P.skin + '" stroke-width="1.6"/>' +
      '<path d="M137 186 C144 202 156 202 163 186 L163 204 C156 213 144 213 137 204 Z" fill="' + P.shade + '" stroke="none"/>';
  }
  function blush(a) {
    if (!a) return "";
    return '<g stroke="#e0787c" stroke-width="1.2" opacity="' + Math.min(1, a + 0.25) + '">' +
      '<ellipse cx="125" cy="155" rx="10" ry="4.6" fill="#f4a3a3" stroke="none" opacity="' + a + '"/><ellipse cx="175" cy="155" rx="10" ry="4.6" fill="#f4a3a3" stroke="none" opacity="' + a + '"/>' +
      '<path d="M119 157 l3.5 -5.5 M124 157.5 l3.5 -5.5 M129 158 l3.5 -5.5 M170 158 l3.5 -5.5 M175 157.5 l3.5 -5.5 M180 157 l3.5 -5.5"/></g>';
  }
  function sparkle(x, y, s, c) {
    return '<path d="M' + x + " " + (y - s) + " Q" + x + " " + y + " " + (x + s) + " " + y + " Q" + x + " " + y + " " + x + " " + (y + s) + " Q" + x + " " + y + " " + (x - s) + " " + y + " Q" + x + " " + y + " " + x + " " + (y - s) + ' Z" fill="' + c + '" stroke-width="1"/>';
  }
  var EXTRA = {
    sweat: '<path d="M200 92 C193 104 193 113 200 113 C207 113 207 104 200 92 Z" fill="#cbe9f7" stroke="#5f8fb0" stroke-width="1.3"/><path d="M198 103 q-1 4 1 6" stroke="#fff" stroke-width="1.4"/>',
    anger: '<g stroke="#d64545" stroke-width="2.4"><path d="M202 70 q6 2 7 8"/><path d="M218 70 q-6 2 -7 8"/><path d="M202 90 q6 -2 7 -8"/><path d="M218 90 q-6 -2 -7 -8"/></g>',
    sparkles: sparkle(214, 84, 9, "#ffd166") + sparkle(88, 104, 6, "#ffd166") + sparkle(224, 116, 4, "#fff4c2")
  };
  function eyes(e, P) {
    if (e.arc) return arcEye(130, 132, true) + arcEye(170, 132, false);
    return eye(130, 132, true, e, P) + eye(170, 132, false, e, P) + shine(130, 132, e) + shine(170, 132, e);
  }
  function grad(id, c) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient>';
  }

  /* Jasmine's outfits: a "coat" layer over an inner layer, plus details. */
  var SHIRT = '<path d="M130 238 L170 238 L156 310 L160 420 L140 420 L144 310 Z" fill="#fbf9f4" stroke-width="1.6"/><path d="M132 236 L124 262 L148 256 Z" fill="#fbf9f4" stroke-width="1.5"/><path d="M168 236 L176 262 L152 256 Z" fill="#fbf9f4" stroke-width="1.5"/>';
  var OUTFITS = {
    cardigan: { coat: "#e2a948", shade: "#b97a24", sleeve: "#e2a948", inner: SHIRT,
      detail: '<path d="M140 318 L136 420 M160 318 L164 420" stroke="#b97a24" stroke-width="2"/><path d="M72 330 v24 M88 316 v28 M206 316 v28 M222 330 v24" stroke="#b97a24" stroke-width="1.1" opacity=".7"/><circle cx="168" cy="344" r="3.4" fill="#fbf9f4"/><circle cx="168" cy="384" r="3.4" fill="#fbf9f4"/><path d="M84 372 c4 -6 12 -4 12 2 c4 2 0 8 -5 6 c-3 4 -9 2 -8 -2 c-4 -2 -2 -6 1 -6 z" fill="#4f9fc4" stroke="none" opacity=".85"/>' },
    labcoat: { coat: "#f6f6f2", shade: "#c9cbd6", sleeve: "#f6f6f2", inner: '<path d="M128 238 L150 300 L172 238 Z" fill="#3e8a86" stroke-width="1.6"/><path d="M130 238 L170 238 L156 310 L160 420 L140 420 L144 310 Z" fill="#3e8a86" stroke-width="1.6"/>',
      detail: '<path d="M130 238 L112 300 L136 296 L126 320 L148 320 Z" fill="#e9e9e3" stroke-width="1.4"/><path d="M170 238 L188 300 L164 296 L174 320 L152 320 Z" fill="#e9e9e3" stroke-width="1.4"/><path d="M182 360 h40 v42 h-40 z" fill="#f6f6f2" stroke-width="1.4"/><path d="M192 360 v-18" stroke="#d6534f" stroke-width="4"/><path d="M203 360 v-22" stroke="#4f7fb8" stroke-width="4"/>' },
    smock: { coat: "#a9c7de", shade: "#6f93b3", sleeve: "#a9c7de", inner: SHIRT,
      detail: '<path d="M126 250 Q150 270 174 250" stroke-width="1.4"/><path d="M96 360 h44 v40 h-44 z" fill="#a9c7de" stroke-width="1.4"/><circle cx="208" cy="330" r="6" fill="#e8813a" stroke="none"/><circle cx="220" cy="350" r="3.5" fill="#d9536a" stroke="none"/><circle cx="80" cy="320" r="4.5" fill="#6f9e62" stroke="none"/><path d="M196 384 c6 -6 14 -2 12 4 c4 3 -2 9 -7 6 c-5 3 -10 -2 -5 -10 z" fill="#ffd166" stroke="none"/>' },
    turtleneck: { coat: "#3a3442", shade: "#221d29", sleeve: "#3a3442", inner: '<path d="M130 238 L170 238 L160 420 L140 420 Z" fill="#3a3442" stroke-width="1.6"/>',
      detail: '<path d="M134 214 C140 230 160 230 166 214 L170 240 C160 250 140 250 130 240 Z" fill="#4a4354" stroke-width="1.6"/><path d="M136 224 h28 M134 232 h32" stroke="#221d29" stroke-width="1" fill="none"/><path d="M150 252 V300" stroke="#e8b83e" stroke-width="1.2"/><circle cx="150" cy="304" r="4" fill="#e8b83e" stroke-width="1"/>' },
    hoodie: { coat: "#b9a3d9", shade: "#8a72b0", sleeve: "#b9a3d9", inner: '<path d="M130 238 L170 238 L160 420 L140 420 Z" fill="#b9a3d9" stroke-width="1.6"/>',
      detail: '<path d="M104 250 C110 222 190 222 196 250 C182 262 118 262 104 250 Z" fill="#a58fc7" stroke-width="1.6"/><path d="M140 256 v40 M160 256 v40" stroke-width="1.4"/><circle cx="140" cy="298" r="2.4" fill="#fff"/><circle cx="160" cy="298" r="2.4" fill="#fff"/><path d="M108 360 C120 350 180 350 192 360 L196 404 H104 Z" fill="#a58fc7" stroke-width="1.5"/>' },
    blazer: { coat: "#2f3f63", shade: "#1d2942", sleeve: "#2f3f63", inner: SHIRT,
      detail: '<path d="M130 238 L106 306 L128 304 L118 330 L146 320 Z" fill="#26344f" stroke-width="1.4"/><path d="M170 238 L194 306 L172 304 L182 330 L154 320 Z" fill="#26344f" stroke-width="1.4"/><circle cx="158" cy="372" r="3.4" fill="#d9b44a"/><path d="M188 340 h26" stroke="#fbf9f4" stroke-width="3"/>' },
    knit: { coat: "#efe1c6", shade: "#cbb894", sleeve: "#efe1c6", inner: '<path d="M130 238 L170 238 L160 420 L140 420 Z" fill="#efe1c6" stroke-width="1.6"/>',
      detail: '<path d="M134 224 C140 242 160 242 166 224 L170 244 C160 256 140 256 130 244 Z" fill="#e2d2b2" stroke-width="1.5"/><path d="M100 300 c6 10 -6 20 0 30 c6 10 -6 20 0 30 c6 10 -6 20 0 30 M200 300 c6 10 -6 20 0 30 c6 10 -6 20 0 30 c6 10 -6 20 0 30 M150 270 c6 10 -6 20 0 30 c6 10 -6 20 0 30 c6 10 -6 20 0 30 c6 10 -6 20 0 30" stroke="#cbb894" stroke-width="1.6" fill="none"/>' },
    apron: { coat: "#9fd4c2", shade: "#6aa894", sleeve: "#9fd4c2", inner: '<path d="M130 238 L170 238 L160 420 L140 420 Z" fill="#9fd4c2" stroke-width="1.6"/>',
      detail: '<path d="M112 300 L124 260 M188 300 L176 260" stroke="#8a6440" stroke-width="3"/><path d="M106 300 H194 L200 420 H100 Z" fill="#d9c49a" stroke-width="1.6"/><path d="M128 340 h44 v30 h-44 z" fill="#cfb789" stroke-width="1.2"/><circle cx="120" cy="320" r="5" fill="#e8813a" stroke="none"/><circle cx="182" cy="384" r="6" fill="#5b78c4" stroke="none"/><circle cx="170" cy="316" r="3.5" fill="#d9536a" stroke="none"/>' }
  };
  /* Hats and props worn on the head. */
  var HATS = {
    beret: '<path d="M106 70 C112 36 186 30 202 58 C196 74 120 80 106 70 Z" fill="#c2453b" stroke-width="1.8"/><path d="M150 40 l2 -8" stroke-width="2.4"/><path d="M118 62 Q150 50 186 56" stroke="#e36d61" stroke-width="2" opacity=".7"/>',
    headset: '<path d="M100 118 C98 44 202 44 200 118" fill="none" stroke="#2b2330" stroke-width="5"/><rect x="92" y="112" width="14" height="26" rx="6" fill="#3a3442" stroke-width="1.5"/><rect x="194" y="112" width="14" height="26" rx="6" fill="#3a3442" stroke-width="1.5"/><path d="M200 134 Q196 168 168 174" fill="none" stroke="#2b2330" stroke-width="2.5"/><circle cx="166" cy="174" r="4" fill="#3a3442"/>'
  };
  var HAT_FOR = { smock: "beret", turtleneck: "headset" };

  /* ------------------------------------------------------------ Jasmine */
  var J_EXPR = {
    neutral:   { e: { open: 1 }, brow: "n", mouth: "neutral", blush: 0.32 },
    stressed:  { e: { open: 0.95, dy: 2.5 }, brow: "w", mouth: "worried", blush: 0.22, extra: "sweat" },
    annoyed:   { e: { open: 0.55, dx: 2 }, brow: "a", mouth: "flat", blush: 0.45, extra: "anger" },
    happy:     { e: { arc: true }, brow: "h", mouth: "grin", blush: 0.6, extra: "sparkles" },
    surprised: { e: { open: 1.15, small: true }, brow: "s", mouth: "o", blush: 0.35 }
  };
  function jasmine(expr, outfit, irisId) {
    var X = J_EXPR[expr] || J_EXPR.neutral;
    var P = { skin: "#f8dfcf", shade: "#ebbca5", hair: "#3a2522", hairHi: "#8a5a46", hairSh: "#211311", ring: "#5a3218", lidShade: "#b98272", irisId: irisId };
    var back = '<path d="M98 108 C94 56 126 36 152 36 C180 36 208 58 204 110 C206 160 214 236 222 312 C204 324 182 316 174 304 L128 300 C118 316 96 324 78 312 C88 236 96 160 98 108 Z" fill="' + P.hair + '" stroke-width="1.8"/>' +
      '<path d="M104 160 C102 210 98 256 90 300 M198 160 C202 210 206 256 212 300 M112 200 C110 240 106 270 100 296" stroke="' + P.hairHi + '" stroke-width="1.1" opacity=".55"/>';
    var body = neck(P), O = OUTFITS[outfit] || OUTFITS.cardigan;
    body += O.inner + '<path d="M52 420 C54 312 84 258 130 238 L146 310 L140 420 Z" fill="' + O.coat + '" stroke-width="1.8"/>' +
      '<path d="M248 420 C246 312 216 258 170 238 L154 310 L160 420 Z" fill="' + O.coat + '" stroke-width="1.8"/>' +
      '<path d="M248 420 C246 312 216 258 186 246 C214 296 224 360 222 420 Z" fill="' + O.shade + '" stroke="none" opacity=".5"/>' + O.detail;
    body += '<path d="M80 420 C82 386 88 362 98 340 M220 420 C218 386 212 362 202 340" stroke-width="1.2" opacity=".6"/>';

    var head = '<path d="M190 150 C200 200 206 250 200 300 C196 312 186 318 180 312 C188 270 186 220 176 176 Z" fill="' + P.hair + '" stroke-width="1.6"/>' +
      '<path d="M190 190 C194 230 196 262 192 296" stroke="' + P.hairHi + '" stroke-width="1.1" opacity=".6"/>' +
      face(P) + eyes(X.e, P) + mouth(X.mouth) + blush(X.blush) +
      '<path d="M104 116 C102 74 128 50 156 50 C184 50 202 74 198 116 C192 100 184 90 176 84 C177 98 173 110 167 118 C166 102 160 92 153 86 C149 102 139 113 126 120 C131 107 131 97 129 90 C121 101 112 109 104 116 Z" fill="' + P.hair + '" stroke-width="1.8"/>' +
      '<path d="M106 104 C98 140 100 176 112 212 C116 190 116 160 114 128 Z" fill="' + P.hair + '" stroke-width="1.6"/>' +
      '<path d="M196 104 C204 140 202 176 190 212 C186 190 186 160 188 128 Z" fill="' + P.hair + '" stroke-width="1.6"/>' +
      '<path d="M118 74 Q152 60 188 76" stroke="' + P.hairHi + '" stroke-width="6" stroke-dasharray="14 5 9 5" opacity=".95"/>' +
      '<path d="M140 60 Q134 80 130 96 M160 58 Q164 78 161 96 M174 66 Q180 80 178 92" stroke="' + P.hairSh + '" stroke-width="1" opacity=".7"/>' +
      brows(X.brow, P.hairSh) +
      (HAT_FOR[outfit] === "headset" ? "" : '<path d="M192 96 L224 56" stroke="#e8b83e" stroke-width="6.5" stroke-linecap="butt"/><path d="M224 56 l4 -6 l-7 2 z" fill="#2b2330"/><path d="M190 99 l3 -4" stroke="#e98aa0" stroke-width="6.5" stroke-linecap="butt"/>') +
      (HAT_FOR[outfit] ? HATS[HAT_FOR[outfit]] : "") +
      sparkle(182, 84, 7, "#7cc6c0") +
      (X.extra ? EXTRA[X.extra] : "");
    var extra = '<g class="present"><path d="M206 262 C236 274 252 296 258 322 L238 330 C232 312 222 300 206 296 Z" fill="' + O.sleeve + '" stroke-width="1.8"/>' +
      '<path d="M240 326 C250 300 262 278 276 262 L290 272 C278 290 266 312 258 332 Z" fill="' + O.sleeve + '" stroke-width="1.8"/>' +
      '<path d="M278 264 C280 250 290 240 298 244 C304 248 300 256 294 262 C300 258 306 262 302 270 C298 276 290 276 286 274 Z" fill="' + P.skin + '" stroke-width="1.6"/></g>' +
      '<g class="gloom" stroke="#5d6390" stroke-width="1.6" opacity="0"><path d="M118 28 v34 M132 20 v40 M146 16 v42 M160 18 v40 M174 24 v36 M188 30 v30"/></g>';
    return { back: back, body: body, head: head, extra: extra,
      defs: grad(irisId, ["#3a1d10", "#9a5a2a", "#f0b56a"]) };
  }

  /* --------------------------------------------------- Academic Advisor */
  var A_EXPR = {
    neutral: { e: { open: 0.82 }, brow: "n", mouth: "neutral", blush: 0.12 },
    smiling: { e: { arc: true }, brow: "h", mouth: "smile", blush: 0.3 },
    hopeful: { e: { open: 1.05 }, brow: "s", mouth: "open", blush: 0.3, extra: "sparkles" }
  };
  function advisor(expr, outfit, irisId) {
    var X = A_EXPR[expr] || A_EXPR.neutral;
    var P = { skin: "#c98e6c", shade: "#a8704f", hair: "#8d8aa9", hairHi: "#c4c2d8", hairSh: "#5b5876", ring: "#3a241a", lidShade: "#7d4d35", irisId: irisId };
    var back = '<path d="M98 118 C92 62 128 42 152 42 C178 42 212 62 204 120 C210 156 208 186 198 204 C188 210 178 202 176 192 L124 192 C122 202 112 210 102 204 C92 186 90 156 98 118 Z" fill="' + P.hair + '" stroke-width="1.8"/>' +
      '<path d="M104 150 C104 172 106 188 110 200 M196 150 C196 172 194 188 190 200" stroke="' + P.hairSh + '" stroke-width="1.1" opacity=".7"/>';
    var body = neck(P) +
      '<path d="M130 238 L170 238 L158 320 L160 420 L140 420 L142 320 Z" fill="#f3e9d6" stroke-width="1.6"/>' +
      '<path d="M140 240 Q150 266 160 240" stroke="#c9a23f" stroke-width="1.3"/><circle cx="150" cy="258" r="3.4" fill="#e5c25a" stroke-width="1"/>' +
      '<path d="M52 420 C54 312 84 258 130 238 L146 320 L140 420 Z" fill="#2f7a78" stroke-width="1.8"/>' +
      '<path d="M248 420 C246 312 216 258 170 238 L154 320 L160 420 Z" fill="#2f7a78" stroke-width="1.8"/>' +
      '<path d="M130 238 L106 306 L128 304 L118 330 L146 320 Z" fill="#276664" stroke-width="1.4"/><path d="M170 238 L194 306 L172 304 L182 330 L154 320 Z" fill="#276664" stroke-width="1.4"/>' +
      '<path d="M248 420 C246 312 216 258 186 246 C214 296 224 360 222 420 Z" fill="#1d4f4d" stroke="none" opacity=".55"/>' +
      '<circle cx="158" cy="372" r="3.6" fill="#d9b44a"/><circle cx="158" cy="404" r="3.6" fill="#d9b44a"/>' +
      '<path d="M190 352 h30" stroke="#f3e9d6" stroke-width="3"/>' +
      '<path d="M80 420 C82 386 88 362 98 340 M220 420 C218 386 212 362 202 340" stroke-width="1.2" opacity=".6"/>';
    var head = face(P) + eyes(X.e, P) + mouth(X.mouth) + blush(X.blush) +
      '<path d="M134 166 Q131 172 134 178 M166 166 Q169 172 166 178" stroke-width=".9" opacity=".35"/>' +
      '<path d="M104 118 C104 74 132 54 160 56 C186 58 200 80 198 116 C188 96 170 86 150 88 C134 90 122 98 116 108 C114 98 112 92 112 86 C108 96 106 106 104 118 Z" fill="' + P.hair + '" stroke-width="1.8"/>' +
      '<path d="M128 70 Q150 62 178 70" stroke="' + P.hairHi + '" stroke-width="5" stroke-dasharray="12 5 8 5"/>' +
      '<path d="M140 64 C150 72 166 74 184 84 M126 80 C140 82 156 86 168 92 M188 70 C196 84 198 100 196 112" stroke="' + P.hairSh + '" stroke-width="1.1" opacity=".75"/>' +
      '<circle cx="104" cy="156" r="3.2" fill="#e5c25a" stroke-width="1"/><circle cx="196" cy="156" r="3.2" fill="#e5c25a" stroke-width="1"/>' +
      brows(X.brow, P.hairSh) +
      '<g stroke="#5a3e33" stroke-width="1.7"><rect x="115" y="118" width="31" height="25" rx="9" fill="#ffffff" fill-opacity=".1"/><rect x="154" y="118" width="31" height="25" rx="9" fill="#ffffff" fill-opacity=".1"/><path d="M146 128 Q150 125 154 128 M115 126 L105 122 M185 126 L195 122"/></g>' +
      '<path d="M120 122 l7 -2 M159 122 l7 -2" stroke="#fff" stroke-width="1.6" opacity=".8"/>' +
      (X.extra ? EXTRA[X.extra] : "");
    var extra = '<g class="fist"><path d="M138 420 L148 236 L178 240 L178 420 Z" fill="#2f7a78" stroke-width="1.8"/><path d="M146 240 L180 244" stroke="#f3e9d6" stroke-width="5"/>' +
      '<path d="M142 214 C140 200 154 192 168 196 C180 200 180 216 170 224 C160 230 144 228 142 214 Z" fill="' + P.skin + '" stroke-width="1.6"/>' +
      '<path d="M150 200 v10 M159 198 v11 M168 200 v10" stroke-width="1.1" opacity=".7"/></g>';
    return { back: back, body: body, head: head, extra: extra,
      defs: grad(irisId, ["#20120c", "#5a3424", "#a8754e"]) };
  }

  var ARTISTS = { jasmine: jasmine, advisor: advisor };

  window.CharacterArt = {
    draw: function (who, expr, outfit, label) {
      var id = "ir" + (++uid);
      var p = ARTISTS[who](expr, outfit, id);
      return '<svg viewBox="0 0 300 420" preserveAspectRatio="xMidYMax meet" role="img" aria-label="' + label + '">' +
        "<defs>" + p.defs + "</defs>" +
        '<g class="breath"><g class="figure" fill="none" stroke="' + INK + '" stroke-linecap="round" stroke-linejoin="round">' +
        '<g class="head"><g class="hidle">' + p.back + "</g></g>" + p.body +
        '<g class="head"><g class="hidle">' + p.head + "</g></g>" + p.extra +
        "</g></g></svg>";
    }
  };
})();
