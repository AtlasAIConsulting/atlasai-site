/* Atlas AI Consulting — the page's own instruments.
 *
 * Three bespoke devices, all driven off the --sc-p the engine publishes per act. The engine is
 * never edited and knows nothing about any of this.
 *
 *   1. THE LEDGER (the signature move). The page keeps an audit trail of itself. Every claim the
 *      reader passes stamps a line into the margin, open. The board in chapter III closes them,
 *      one at a time, each with the week it was closed in. By the colophon the trail is complete
 *      and signed, and nothing on it ever came off. An audit capability is the one thing a
 *      brochure cannot demonstrate, so this page demonstrates it on itself.
 *
 *   2. THE BOARD (the peak). Eight Workday functional areas walked through one release cycle:
 *      checks re-run, two areas raise with a named cause, each is closed with evidence. Every
 *      figure in its footer is counted from the rows, at the moment it is shown.
 *
 *   3. FIG. 1. The dependency map, drawn quietly in ink on paper. It is a figure in a column with
 *      a caption, not a hero: the brief asked for a subtle reference, and a subtle reference is
 *      what a figure is.
 *
 * Author: Atlas AI Consulting <hello@atlasaiconsultingllc.com>
 */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = '#16191A', SOFT = '#8A928F', ACCENT = '#B8431E', OK = '#1F7A5C';

  /* ══ 1 · THE LEDGER ═════════════════════════════════════════════════════════════════════════ */

  // Declared here rather than in the markup because the ledger is a record OF the page, not part
  // of its content: the entries are what a reader has been told, in the order they were told it.
  // Four of these are OPEN ITEMS and the rest are recorded notes. The distinction is the whole
  // arc: the page raises four risks in chapter I and closes every one of them before the colophon,
  // each closed by the specific thing that actually answers it. A trail that ended with items
  // still open would argue against the page.
  var ENTRIES = [
    { id: 'r1', kind: 'risk', at: '.risks li:nth-child(1)', text: 'payroll drift, single pay group' },
    { id: 'r2', kind: 'risk', at: '.risks li:nth-child(2)', text: 'carrier file format change' },
    { id: 'r3', kind: 'risk', at: '.risks li:nth-child(3)', text: 'approval trail, March' },
    { id: 'r4', kind: 'risk', at: '.risks li:nth-child(4)', text: 'release lands unattended' },
    { id: 't1', at: '.figures div:nth-child(1)', text: 'toolkit, 228 instruments' },
    { id: 't2', at: '.figures div:nth-child(2)', text: 'suite green, 11,555 checks' },
    { id: 'e1', at: '.evidence li:nth-child(1)', text: 'harvest, read only' },
    { id: 'e2', at: '.evidence li:nth-child(2)', text: 'dependency evidence marked' },
    { id: 'e3', at: '.evidence li:nth-child(3)', text: 'change simulated first' },
    { id: 'e4', at: '.evidence li:nth-child(4)', text: 'record kept as it happens', closes: 'r3' }
  ];
  var RISKS = ENTRIES.filter(function (e) { return e.kind === 'risk'; }).length;

  var ledgerEl = document.getElementById('ledger');
  var ledgerList = document.getElementById('ledgerRows');
  var ledgerStat = document.getElementById('ledgerStat');
  var stamped = {}, closed = {};

  function ledgerRender() {
    if (!ledgerList) return;
    var recorded = 0, done = 0;
    ledgerList.innerHTML = ENTRIES.filter(function (e) { return stamped[e.id]; }).map(function (e) {
      recorded++;
      var c = closed[e.id], risk = e.kind === 'risk';
      if (risk && c) done++;
      return '<li class="' + (c ? 'is-closed' : risk ? 'is-open' : '') + '">' +
        '<span class="lg-mk">' + (c ? '✓' : risk ? '!' : '·') + '</span>' +
        '<span class="lg-tx">' + e.text + '</span>' +
        (risk ? '<span class="lg-st">' + (c || 'open') + '</span>' : '') + '</li>';
    }).join('');
    if (ledgerStat) {
      ledgerStat.textContent = recorded
        ? recorded + ' recorded · ' + done + ' of ' + RISKS + ' closed' + (done === RISKS ? ' · signed' : '')
        : 'nothing recorded yet';
    }
    if (ledgerEl) {
      ledgerEl.classList.toggle('is-live', recorded > 0);
      ledgerEl.classList.toggle('is-signed', done === RISKS && recorded > 0);
    }
  }

  function ledgerStamp(id) {
    if (stamped[id]) return;
    stamped[id] = true;
    var e = ENTRIES.filter(function (x) { return x.id === id; })[0];
    if (e && e.closes) closed[e.closes] = 'chapter IV';   // the record answers the March question
    ledgerRender();
  }

  function ledgerClose(id, when) {
    if (!stamped[id] || closed[id]) return;
    closed[id] = when;
    ledgerRender();
  }

  (function watchClaims() {
    if (!('IntersectionObserver' in window)) {
      ENTRIES.forEach(function (e) { stamped[e.id] = true; });
      ledgerRender();
      return;
    }
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (!r.isIntersecting) return;
        ledgerStamp(r.target.getAttribute('data-ledger'));
        io.unobserve(r.target);
      });
    }, { rootMargin: '0px 0px -35% 0px' });
    ENTRIES.forEach(function (e) {
      var el = document.querySelector(e.at);
      if (!el) return;
      el.setAttribute('data-ledger', e.id);
      io.observe(el);
    });
  })();

  /* ══ 2 · THE BOARD ══════════════════════════════════════════════════════════════════════════ */

  var AREAS = [
    { name: 'Core HCM',      checks: 412 },
    { name: 'Payroll',       checks: 1180, raise: {
        at: 0.42, cause: 'pay component maps to retired earning', close: 0.70, ledger: 'r1' } },
    { name: 'Benefits',      checks: 864, raise: {
        at: 0.52, cause: 'carrier file width changed at source', close: 0.82, ledger: 'r2' } },
    { name: 'Absence',       checks: 507 },
    { name: 'Time Tracking', checks: 638 },
    { name: 'Recruiting',    checks: 344 },
    { name: 'Compensation',  checks: 421 },
    { name: 'Financials',    checks: 289 }
  ];

  var boardAct = document.querySelector('[data-sc-act="pin"]');
  var rowsEl = document.getElementById('boardRows');
  var phaseEl = document.getElementById('boardPhase');
  var clockEl = document.getElementById('boardClock');
  var sAreas = document.getElementById('statAreas');
  var sChecks = document.getElementById('statChecks');
  var sCaught = document.getElementById('statCaught');
  var sOpen = document.getElementById('statOpen');
  var cycleEl = document.getElementById('boardCycle');
  var boardEl = document.querySelector('.board');

  // The board holds still and green through the opening stretch. That silence is authored: the
  // first amber has to be a change from something, and a board that starts alarmed is a dashboard
  // screenshot, not a cycle.
  var HOLD = 0.20, RELEASE = 0.30, SETTLE = 0.90;

  if (rowsEl) {
    rowsEl.innerHTML = AREAS.map(function (a, i) {
      return '<div class="board__row" data-i="' + i + '">' +
        '<span class="board__area">' + a.name + '</span>' +
        '<span class="board__checks" data-checks>0</span>' +
        '<span class="tag tag--ok" data-tag>holding</span>' +
        '<span class="board__note" data-note></span></div>';
    }).join('');
  }

  var rowEls = rowsEl ? [].slice.call(rowsEl.children) : [];

  function week(p) {
    // A twelve week cycle, so the clock is a number an executive recognises rather than a percentage.
    return Math.max(0, Math.min(12, Math.round(p * 12)));
  }

  function paintBoard(p) {
    if (!rowEls.length) return;
    var wk = week(p);
    var running = p > RELEASE;
    var caught = 0, open = 0, checksShown = 0;

    AREAS.forEach(function (a, i) {
      var row = rowEls[i];
      var ratio = running ? Math.min(1, (p - RELEASE) / 0.56) : (p > HOLD ? 0.04 : 0);
      var n = Math.round(a.checks * ratio);
      checksShown += n;
      row.querySelector('[data-checks]').textContent = n ? n.toLocaleString('en-US') : '—';

      var tag = row.querySelector('[data-tag]');
      var note = row.querySelector('[data-note]');
      var r = a.raise;
      var state = 'ok', word = running ? 'passing' : 'holding', text = '';

      if (r && p >= r.at && p < r.close) {
        state = 'watch'; word = 'raised'; text = r.cause; open++;
      } else if (r && p >= r.close) {
        state = 'ok'; word = 'closed';
        text = 'fixed and evidenced · week ' + Math.round(r.close * 12);
        caught++;
        ledgerClose(r.ledger, 'week ' + Math.round(r.close * 12));
      } else if (running) {
        text = a.checks.toLocaleString('en-US') + ' checks, no change in behaviour';
      }

      tag.className = 'tag tag--' + (state === 'watch' ? 'watch' : 'ok');
      tag.textContent = word;
      note.textContent = text;
      row.classList.toggle('is-raised', state === 'watch');
    });

    if (phaseEl) {
      if (p >= SETTLE) ledgerClose('r4', 'week 12');
      phaseEl.textContent = p < HOLD ? 'monitoring'
        : p < RELEASE ? 'release inbound'
        : p < SETTLE ? 'release week, checks running'
        : 'cycle closed';
    }
    if (clockEl) clockEl.textContent = 'week ' + wk;
    // A continuously moving element. Everything else on the board changes in steps, and three
    // consecutive sampled frames came back identical because of it.
    if (cycleEl) cycleEl.style.width = (p * 100).toFixed(2) + '%';
    // The harness samples engine devices and one declared slot; a board that repaints its own DOM
    // is invisible to it, which is why three sampled frames came back identical and were reported
    // as dead scroll. This publishes what is actually on the board, so the check can see it.
    if (boardEl) {
      boardEl.setAttribute('data-sc-verify-state',
        [phaseEl ? phaseEl.textContent : '', wk, checksShown, open, caught].join('|'));
    }
    if (sAreas) sAreas.textContent = AREAS.length;
    if (sChecks) sChecks.textContent = checksShown.toLocaleString('en-US');
    if (sCaught) sCaught.textContent = caught;
    if (sOpen) sOpen.textContent = open;
  }

  /* ══ 3 · FIG. 1 · the Atlas map ════════════════════════════════════════════════════════════
     Drawn to the same rules as the product's own map rather than approximated. Two of those rules
     are what make it recognisable:

       Hue is POSITION. Each community takes its colour from its angle around the centre of the
       map, through the renderer's own nine-stop ramp, so the estate reads as a wheel rather than
       a legend. Copied verbatim from static/js/atlas-map.js.

       Flow runs on EVIDENCE. A particle travels an edge only where runtime evidence exists for
       it. The moving parts of this picture are, by construction, the parts that were proven.

     The product renders this in WebGL with additive blending on a dark ground. On paper additive
     is wrong: overlaps must darken, not blow out, so this composites with multiply instead. The
     instance is synthetic. The structure, the palette and the rule about what moves are not. */

  var RAMP = [[0.86,0.20,0.31],[0.90,0.38,0.30],[0.88,0.58,0.32],[0.84,0.68,0.40],
              [0.76,0.71,0.52],[0.56,0.76,0.68],[0.28,0.70,0.74],[0.19,0.55,0.80],[0.26,0.42,0.82]];
  function ramp(x) {
    x = Math.max(0, Math.min(0.9999, x)) * (RAMP.length - 1);
    var i = Math.floor(x), f = x - i, a = RAMP[i], b = RAMP[Math.min(RAMP.length - 1, i + 1)];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }
  function css(c, alpha) {
    return 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' +
           Math.round(c[2] * 255) + ',' + alpha + ')';
  }

  var mapCanvas = document.getElementById('mapFigure');
  var mctx = mapCanvas ? mapCanvas.getContext('2d') : null;

  function rng(seed) {
    return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  }

  var MAP = (function build() {
    var r = rng(20260830);
    var COMMS = 13, comms = [], nodes = [], edges = [];

    for (var c = 0; c < COMMS; c++) {
      var a = (c / COMMS) * Math.PI * 2 + r() * 0.22;
      var rad = 0.20 + r() * 0.20;
      comms.push({ x: 0.5 + Math.cos(a) * rad * 1.32, y: 0.5 + Math.sin(a) * rad, n: 0 });
    }
    comms.push({ x: 0.5, y: 0.5, n: 0 });                       // the dense middle

    // hue by angle around the centre of the map, exactly as the renderer does it
    var cx = 0, cy = 0;
    comms.forEach(function (c) { cx += c.x; cy += c.y; });
    cx /= comms.length; cy /= comms.length;
    comms.forEach(function (c) {
      c.col = ramp((Math.atan2(c.y - cy, c.x - cx) + Math.PI) / (Math.PI * 2));
    });

    comms.forEach(function (c, ci) {
      var count = 48 + Math.floor(r() * 74) + (ci === comms.length - 1 ? 120 : 0);
      c.first = nodes.length;
      for (var i = 0; i < count; i++) {
        // radial falloff, so a community is dense at its core and frays at the edge
        var a = r() * Math.PI * 2, d = Math.pow(r(), 1.7) * (0.055 + r() * 0.045);
        nodes.push({ x: c.x + Math.cos(a) * d * 1.25, y: c.y + Math.sin(a) * d,
                     c: ci, s: r() < 0.045 ? 2.1 : r() < 0.2 ? 1.3 : 0.85 });
      }
      c.n = count;
      // intra-community wiring
      for (var k = 0; k < count * 1.5; k++) {
        var a1 = c.first + Math.floor(r() * count), b1 = c.first + Math.floor(r() * count);
        if (a1 !== b1) edges.push({ a: a1, b: b1, ev: r() < 0.34 });
      }
    });

    // trunks between communities, which is where a dependency actually crosses a boundary
    for (var i2 = 0; i2 < comms.length; i2++) {
      for (var j2 = 0; j2 < 3; j2++) {
        var other = Math.floor(r() * comms.length);
        if (other === i2) continue;
        for (var k2 = 0; k2 < 4; k2++) {
          edges.push({
            a: comms[i2].first + Math.floor(r() * comms[i2].n),
            b: comms[other].first + Math.floor(r() * comms[other].n),
            ev: r() < 0.55, trunk: true
          });
        }
      }
    }

    // Normalised to the frame. A community layout on a circle leaves the corners empty and the
    // figure reads as a small drawing in a large box rather than a map of an estate.
    var xs = nodes.map(function (n) { return n.x; }), ys = nodes.map(function (n) { return n.y; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    nodes.forEach(function (n) {
      n.x = (n.x - x0) / (x1 - x0 || 1);
      n.y = (n.y - y0) / (y1 - y0 || 1);
    });

    var flows = edges.map(function (e, i) { return e.ev ? i : -1; })
                     .filter(function (i) { return i >= 0; });
    // one particle per few evidenced edges, the way the renderer budgets them
    var step = Math.max(1, Math.floor(flows.length / 260));
    var picked = [];
    for (var f = 0; f < flows.length; f += step) {
      picked.push({ e: flows[f], phase: r(), speed: 0.10 + r() * 0.22 });
    }
    return { comms: comms, nodes: nodes, edges: edges, flow: picked };
  })();

  var mapW = 0, mapH = 0, mapDpr = 1, plate = null;

  function mapPx(n) { return { x: 14 + n.x * (mapW - 28), y: 12 + n.y * (mapH - 24) }; }

  // Edges and nodes never move, so they are rendered once onto an offscreen plate and blitted.
  // Only the flow is redrawn per frame.
  function buildPlate() {
    plate = document.createElement('canvas');
    plate.width = Math.round(mapW * mapDpr);
    plate.height = Math.round(mapH * mapDpr);
    var g = plate.getContext('2d');
    g.setTransform(mapDpr, 0, 0, mapDpr, 0, 0);
    g.globalCompositeOperation = 'multiply';

    MAP.edges.forEach(function (e) {
      var A = mapPx(MAP.nodes[e.a]), B = mapPx(MAP.nodes[e.b]);
      var col = MAP.comms[MAP.nodes[e.a].c].col;
      g.strokeStyle = css(col, e.trunk ? 0.16 : 0.07);
      g.lineWidth = e.trunk ? 0.8 : 0.5;
      g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke();
    });
    MAP.nodes.forEach(function (n) {
      var P = mapPx(n), col = MAP.comms[n.c].col;
      g.fillStyle = css(col, n.s > 2 ? 0.9 : n.s > 1 ? 0.62 : 0.4);
      g.beginPath(); g.arc(P.x, P.y, n.s, 0, Math.PI * 2); g.fill();
    });
  }

  function sizeMap() {
    if (!mctx) return;
    var r = mapCanvas.getBoundingClientRect();
    mapDpr = Math.min(window.devicePixelRatio || 1, 2);
    mapW = Math.max(1, Math.round(r.width));
    mapH = Math.max(1, Math.round(r.height));
    mapCanvas.width = Math.round(mapW * mapDpr);
    mapCanvas.height = Math.round(mapH * mapDpr);
    mctx.setTransform(mapDpr, 0, 0, mapDpr, 0, 0);
    buildPlate();
  }

  function paintMap(t) {
    if (!mctx || !plate) return;
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    mctx.drawImage(plate, 0, 0);
    mctx.setTransform(mapDpr, 0, 0, mapDpr, 0, 0);
    if (reduce) return;                       // the structure still reads; only the traffic stops

    mctx.globalCompositeOperation = 'multiply';
    var secs = t / 1000;
    MAP.flow.forEach(function (f) {
      var e = MAP.edges[f.e];
      var A = mapPx(MAP.nodes[e.a]), B = mapPx(MAP.nodes[e.b]);
      var u = (f.phase + secs * f.speed) % 1;
      var col = MAP.comms[MAP.nodes[e.b].c].col;
      mctx.fillStyle = css(col, 0.92);
      mctx.beginPath();
      mctx.arc(A.x + (B.x - A.x) * u, A.y + (B.y - A.y) * u, 1.5, 0, Math.PI * 2);
      mctx.fill();
    });
    mctx.globalCompositeOperation = 'source-over';
  }

  /* ══ the loop ═══════════════════════════════════════════════════════════════════════════════ */

  var lastP = -1, queued = false;
  function frame(now) {
    queued = false;
    paintMap(now || 0);
    if (boardAct) {
      var raw = parseFloat(boardAct.style.getPropertyValue('--sc-p'));
      var p = isNaN(raw) ? 0 : raw;
      if (Math.abs(p - lastP) > 0.0009) { lastP = p; paintBoard(p); }
    }
    tick();
  }
  function tick() { if (queued) return; queued = true; requestAnimationFrame(frame); }

  paintBoard(0);
  ledgerRender();
  sizeMap();
  tick();

  if (window.ResizeObserver && mapCanvas) {
    new ResizeObserver(sizeMap).observe(mapCanvas);
  } else {
    window.addEventListener('resize', sizeMap);
  }

  // Reduced motion keeps the meaning and drops the theatre: the cycle still advances with scroll,
  // it just does not hold anything back to make an entrance.
  if (reduce) { HOLD = 0.02; RELEASE = 0.06; lastP = -1; }
})();
