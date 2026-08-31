/* The estate survey.
 *
 * The whole site is one window onto a single chart. Scrolling pans north across it, so every
 * chapter is on the same sheet and the ground under chapter III is the same ground as under the
 * title page.
 *
 * THE ONE RULE THIS FILE OBEYS: the terrain is a real quantity. Station heights are the check
 * counts the page already prints for each functional area, so "contour interval 120 checks" is a
 * true statement about the drawing and the two summits land on Payroll and Benefits because those
 * really are the most heavily checked areas. An earlier draft of this direction printed a unit for
 * a sum of Gaussians, which is the sort of decoration that makes every other number on a page
 * suspect. If the field ever stops being derived from real counts, the legend must lose its unit.
 *
 * Performance: each station's kernel is precomputed once onto a fixed sheet-space grid, so the
 * per-frame field is a weighted sum with no transcendentals in the hot loop, and the background
 * self-limits to ~30fps because contours this slow cannot be seen to step. Chapter III's particles
 * keep the full frame rate; they are fast and the eye tracks them.
 *
 * Author: Atlas AI Consulting <hello@atlasaiconsultingllc.com>
 */
(function () {
  'use strict';

  var cv = document.getElementById('sheet');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var INK = '22,25,26', ACCENT = '184,67,30', PAPER = '243,244,241';

  /* ── the survey: real areas, real check counts ────────────────────────────────────────────── */
  // x,y are in sheet space (0..1 across, 0..1 down the whole chart). checks are the figures the
  // page prints on the functional area cards, which is what makes the contour unit honest.
  var STATIONS = [
    { id: 'TP·01', x: 0.16, y: 0.10, checks: 344,  s: 0.10 },   // Recruiting
    { id: 'TP·02', x: 0.47, y: 0.14, checks: 412,  s: 0.13 },   // Core HCM
    { id: 'TP·03', x: 0.78, y: 0.09, checks: 421,  s: 0.11 },   // Compensation
    { id: 'TP·04', x: 0.13, y: 0.31, checks: 638,  s: 0.12 },   // Time Tracking
    { id: 'TP·05', x: 0.40, y: 0.36, checks: 507,  s: 0.11 },   // Absence
    { id: 'TP·06', x: 0.72, y: 0.33, checks: 864,  s: 0.14 },   // Benefits
    { id: 'TP·07', x: 0.52, y: 0.55, checks: 1180, s: 0.16 },   // Payroll
    { id: 'TP·08', x: 0.86, y: 0.58, checks: 96,   s: 0.07 },   // Carrier files
    { id: 'TP·09', x: 0.20, y: 0.62, checks: 74,   s: 0.07 },   // Bank and tax
    { id: 'TP·10', x: 0.66, y: 0.78, checks: 118,  s: 0.08 },   // General ledger
    { id: 'TP·11', x: 0.30, y: 0.84, checks: 210,  s: 0.09 },
    { id: 'TP·12', x: 0.88, y: 0.86, checks: 160,  s: 0.08 },
    { id: 'TP·13', x: 0.09, y: 0.92, checks: 130,  s: 0.08 },
    { id: 'TP·14', x: 0.58, y: 0.96, checks: 180,  s: 0.09 }
  ];

  var GW = 150, GH = 240;                    // sheet-space sample grid
  var kernels = [], fieldMax = 0;

  (function precompute() {
    for (var i = 0; i < STATIONS.length; i++) {
      var st = STATIONS[i], k = new Float32Array(GW * GH), two = 2 * st.s * st.s;
      for (var gy = 0; gy < GH; gy++) {
        var dy = gy / (GH - 1) - st.y;
        for (var gx = 0; gx < GW; gx++) {
          var dx = gx / (GW - 1) - st.x;
          k[gy * GW + gx] = Math.exp(-(dx * dx + dy * dy) / two);
        }
      }
      kernels.push(k);
    }
    // The tallest point the field can reach, so levels can be stated in checks.
    var f = new Float32Array(GW * GH);
    for (var s = 0; s < STATIONS.length; s++) {
      var kk = kernels[s], h = STATIONS[s].checks;
      for (var c = 0; c < f.length; c++) f[c] += kk[c] * h;
    }
    for (var c2 = 0; c2 < f.length; c2++) if (f[c2] > fieldMax) fieldMax = f[c2];
  })();

  var INTERVAL = 70;                                    // checks between contour lines
  var MAXLEVEL = Math.floor(fieldMax / INTERVAL);

  /* ── state ───────────────────────────────────────────────────────────────────────────────── */
  var W = 0, H = 0, dpr = 1, docH = 1, established = new Float32Array(STATIONS.length);
  var field = null, fw = 0, fh = 0;
  var last = 0, progress = 0, settled = 0;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, innerWidth > 1600 ? 1.5 : 2);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    docH = Math.max(1, document.documentElement.scrollHeight - H);
    fw = Math.ceil(W / 9) + 2; fh = Math.ceil(H / 9) + 2;
    field = new Float32Array(fw * fh);
  }

  /* ── the field over the visible window ───────────────────────────────────────────────────── */
  // The chart is 1.9 viewports wide and spans the document vertically; scroll pans north at 0.62
  // of scroll speed, so the ground moves with the reader but slower than the type.
  var YSPAN = 0.42;                       // fraction of the sheet visible vertically
  function xSpan() { return Math.max(0.25, Math.min(1, YSPAN * (W / H))); }

  function sample(p) {
    var top = p * (1 - YSPAN);
    var xs = xSpan();
    for (var i = 0; i < field.length; i++) field[i] = 0;
    for (var s = 0; s < STATIONS.length; s++) {
      var h = STATIONS[s].checks * established[s];
      if (h < 1) continue;
      var k = kernels[s];
      for (var y = 0; y < fh; y++) {
        var sy = (top + (y * 9 / H) * YSPAN) * (GH - 1);
        var y0 = sy | 0, ty = sy - y0;
        if (y0 < 0) y0 = 0; if (y0 > GH - 2) { y0 = GH - 2; ty = 1; }
        var r0 = y0 * GW, r1 = r0 + GW;
        for (var x = 0; x < fw; x++) {
          var sx = (x * 9 / W) * xs * (GW - 1);
          var x0 = sx | 0, tx = sx - x0;
          if (x0 > GW - 2) { x0 = GW - 2; tx = 1; }
          var a = k[r0 + x0] + (k[r0 + x0 + 1] - k[r0 + x0]) * tx;
          var b = k[r1 + x0] + (k[r1 + x0 + 1] - k[r1 + x0]) * tx;
          field[y * fw + x] += (a + (b - a) * ty) * h;
        }
      }
    }
  }

  /* ── marching squares ────────────────────────────────────────────────────────────────────── */
  function contour(level, path) {
    var cell = 9;
    for (var y = 0; y < fh - 1; y++) {
      for (var x = 0; x < fw - 1; x++) {
        var i = y * fw + x;
        var a = field[i], b = field[i + 1], c = field[i + fw + 1], d = field[i + fw];
        var mn = a < b ? a : b; if (c < mn) mn = c; if (d < mn) mn = d;
        var mx = a > b ? a : b; if (c > mx) mx = c; if (d > mx) mx = d;
        if (level < mn || level > mx) continue;         // the cull that makes this cheap
        var px = x * cell, py = y * cell;
        var code = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (code === 0 || code === 15) continue;
        var t;
        var T = function (v0, v1) { return (level - v0) / (v1 - v0 || 1e-6); };
        var top = null, right = null, bottom = null, left = null;
        if ((code & 8) !== (code & 4) >> 1) {}
        // edge crossings
        if (((code >> 3) & 1) !== ((code >> 2) & 1)) { t = T(a, b); top = [px + t * cell, py]; }
        if (((code >> 2) & 1) !== ((code >> 1) & 1)) { t = T(b, c); right = [px + cell, py + t * cell]; }
        if (((code >> 1) & 1) !== (code & 1)) { t = T(d, c); bottom = [px + t * cell, py + cell]; }
        if ((code & 1) !== ((code >> 3) & 1)) { t = T(a, d); left = [px, py + t * cell]; }
        var pts = [top, right, bottom, left].filter(Boolean);
        for (var q = 0; q + 1 < pts.length; q += 2) {
          path.moveTo(pts[q][0], pts[q][1]);
          path.lineTo(pts[q + 1][0], pts[q + 1][1]);
        }
      }
    }
  }

  /* ── the clearing: contours ghost out under running text ─────────────────────────────────── */
  function clearing() {
    var cols = document.querySelectorAll('.sheet, .estate-stage');
    ctx.fillStyle = 'rgba(' + PAPER + ',.82)';
    for (var i = 0; i < cols.length; i++) {
      var r = cols[i].getBoundingClientRect();
      if (r.bottom < -40 || r.top > H + 40) continue;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(r.left - 20, r.top - 14, r.width + 40, r.height + 28, 3);
      else ctx.rect(r.left - 20, r.top - 14, r.width + 40, r.height + 28);
      ctx.fill();
    }
  }

  /* ── draw ────────────────────────────────────────────────────────────────────────────────── */
  function draw(t) {
    var p = Math.max(0, Math.min(1, scrollY / docH));
    progress = p;

    // stations establish as the reader descends: the survey is made while it is read
    for (var s = 0; s < STATIONS.length; s++) {
      // The first six are the primary landform and are established on load: the title page is the
      // top-left corner of a chart that already exists. The rest come in as the reader descends,
      // so the survey visibly completes.
      var due = s < 6 ? -1 : 0.06 + ((s - 6) / (STATIONS.length - 6)) * 0.66;
      var want = p > due ? 1 : 0;
      established[s] += (want - established[s]) * 0.055;
    }

    sample(p);
    ctx.clearRect(0, 0, W, H);

    // 1 · graticule, with grid references that genuinely increment
    var off = (p * docH * YSPAN) % 64;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(' + INK + ',.045)';
    ctx.beginPath();
    for (var gx = 0; gx < W; gx += 64) { ctx.moveTo(gx + .5, 0); ctx.lineTo(gx + .5, H); }
    for (var gy = -off; gy < H; gy += 64) { ctx.moveTo(0, gy + .5); ctx.lineTo(W, gy + .5); }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(' + INK + ',.085)';
    ctx.beginPath();
    for (var ix = 0; ix < W; ix += 320) { ctx.moveTo(ix + .5, 0); ctx.lineTo(ix + .5, H); }
    for (var iy = -((p * docH * YSPAN) % 320); iy < H; iy += 320) { ctx.moveTo(0, iy + .5); ctx.lineTo(W, iy + .5); }
    ctx.stroke();

    ctx.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    ctx.fillStyle = 'rgba(' + INK + ',.30)';
    for (var ex = 320; ex < W; ex += 320) ctx.fillText('E ' + (4700 + ex), ex + 4, 12);
    for (var ny = -((p * docH * YSPAN) % 320); ny < H; ny += 320) {
      if (ny > 20) ctx.fillText('N ' + (1100 + Math.round(p * docH * YSPAN + ny)), 6, ny - 5);
    }

    // 2 · contours. Levels rise as the survey is completed.
    var levels = MAXLEVEL;
    var fine = new Path2D(), index = new Path2D();
    for (var L = 1; L <= levels; L++) contour(L * INTERVAL, (L % 5 === 0) ? index : fine);

    // 3 · hypsometric tint, stepped and hard edged, never a gradient
    ctx.save();
    ctx.fillStyle = 'rgba(' + INK + ',.020)';
    var band = new Path2D(); contour(5 * INTERVAL, band);
    ctx.restore();

    ctx.lineWidth = 0.75;
    ctx.strokeStyle = 'rgba(' + INK + ',.20)';
    ctx.stroke(fine);
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = 'rgba(' + INK + ',.36)';
    ctx.stroke(index);

    // 4 · trig stations
    for (var q = 0; q < STATIONS.length; q++) {
      if (established[q] < 0.08) continue;
      var st = STATIONS[q];
      var sx = (st.x / xSpan()) * W;
      var sy = ((st.y - (p * (1 - YSPAN))) / YSPAN) * H;
      if (sy < -40 || sy > H + 40 || sx < -40 || sx > W + 40) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, established[q]);
      ctx.strokeStyle = 'rgba(' + INK + ',.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx, sy - 5); ctx.lineTo(sx + 4.6, sy + 3); ctx.lineTo(sx - 4.6, sy + 3); ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(' + INK + ',.55)';
      ctx.beginPath(); ctx.arc(sx, sy, 1.3, 0, 6.284); ctx.fill();
      ctx.fillStyle = 'rgba(' + INK + ',.40)';
      ctx.fillText(st.id, sx + 8, sy + 10);
      ctx.restore();
    }

    clearing();
  }

  /* ── the marginalia: a legend that states only what is true ──────────────────────────────── */
  function marginalia() {
    var el = document.getElementById('sheetLegend');
    if (!el) return;
    el.innerHTML =
      '<b>Atlas AI Consulting — estate survey</b>' +
      '<span>Sheet 1 of 1 · series WD/2026</span>' +
      '<span>Contour interval ' + INTERVAL + ' checks</span>' +
      '<span><i class="lg-tri"></i> Trig station · functional area</span>' +
      '<span><i class="lg-solid"></i> Sight line, evidenced</span>' +
      '<span><i class="lg-dash"></i> Sight line, inferred</span>';
  }

  function frame(t) {
    // The background self-limits: contours this slow cannot be seen to step, and the budget
    // belongs to chapter III's particles, which the eye does track.
    if (t - last > 33) { last = t; draw(t); }
    requestAnimationFrame(frame);
  }

  size();
  marginalia();
  if (reduce) { for (var i = 0; i < established.length; i++) established[i] = 1; draw(0); }
  else requestAnimationFrame(frame);

  var deb;
  addEventListener('resize', function () {
    clearTimeout(deb);
    deb = setTimeout(function () { size(); draw(0); }, 120);
  });
})();
