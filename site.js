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
    // The chart finishes and the audit trail signs on the same frame. That is the ending the page
    // did not have: it stopped, rather than resolving.
    var stamp = document.getElementById('surveyStamp');
    if (stamp) stamp.classList.toggle('is-on', done === RISKS && recorded > 0);
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

  /* ══ 2 · THE ESTATE, RUNNING (the peak) ════════════════════════════════════════════════════
     Named functional areas, the real flows between them, and traffic that never stops. The
     animation is NOT scroll-driven: payroll does not stop running because a reader stopped
     scrolling. Scroll drives the release cycle over the top of it, which is a different clock. */

  var AREAS = {
    recruiting: { checks: 344, label: 'Recruiting' },
    time:       { checks: 638, label: 'Time Tracking' },
    absence:    { checks: 507, label: 'Absence' },
    hcm:        { checks: 412, label: 'Core HCM' },
    comp:       { checks: 421, label: 'Compensation' },
    benefits:   { checks: 864, label: 'Benefits' },
    payroll:    { checks: 1180, label: 'Payroll' },
    carrier:    { checks: 96,  label: 'Carrier files', out: true },
    bank:       { checks: 74,  label: 'Bank & tax',    out: true },
    gl:         { checks: 118, label: 'General ledger', out: true }
  };

  // What actually moves between them in a Workday estate. Weight is how much traffic a link
  // carries, which is what sets particle density: a reader should be able to see that Core HCM
  // into Payroll is a busier road than Recruiting into Core HCM.
  var LINKS = [
    { a: 'recruiting', b: 'hcm',      w: 0.5, what: 'new hires' },
    { a: 'hcm',        b: 'payroll',  w: 1.0, what: 'worker data' },
    { a: 'hcm',        b: 'benefits', w: 0.7, what: 'eligibility' },
    { a: 'hcm',        b: 'comp',     w: 0.5, what: 'job and grade' },
    { a: 'time',       b: 'payroll',  w: 0.9, what: 'hours' },
    { a: 'absence',    b: 'payroll',  w: 0.6, what: 'leave' },
    { a: 'comp',       b: 'payroll',  w: 0.6, what: 'pay rates' },
    { a: 'benefits',   b: 'payroll',  w: 0.7, what: 'deductions' },
    { a: 'benefits',   b: 'carrier',  w: 0.6, what: 'elections' },
    { a: 'payroll',    b: 'bank',     w: 0.8, what: 'payments' },
    { a: 'payroll',    b: 'gl',       w: 0.6, what: 'postings' }
  ];

  // The two failures from chapter I, made visible on the thing they actually break.
  var RAISES = [
    { area: 'payroll',  link: 'payroll>bank',     at: 0.40, close: 0.70,
      cause: 'pay component maps to a retired earning', ledger: 'r1', week: 8 },
    { area: 'benefits', link: 'benefits>carrier', at: 0.52, close: 0.82,
      cause: 'carrier changed the file width at source', ledger: 'r2', week: 10 }
  ];

  var estateEl = document.getElementById('estate');
  var eCanvas = document.getElementById('estateCanvas');
  var ectx = eCanvas ? eCanvas.getContext('2d') : null;
  var phaseEl = document.getElementById('boardPhase');
  var clockEl = document.getElementById('boardClock');
  var sAreas = document.getElementById('statAreas');
  var sChecks = document.getElementById('statChecks');
  var sCaught = document.getElementById('statCaught');
  var noteEl = document.getElementById('estateNote');
  var boardAct = estateEl ? estateEl.closest('[data-sc-act="pin"]') : null;

  var ndEls = {}, pts = {};
  if (estateEl) {
    [].forEach.call(estateEl.querySelectorAll('.nd'), function (el) {
      ndEls[el.getAttribute('data-k')] = el;
    });
  }

  var eW = 0, eH = 0, eDpr = 1;
  function sizeEstate() {
    if (!ectx || !estateEl) return;
    var box = estateEl.getBoundingClientRect();
    eDpr = Math.min(window.devicePixelRatio || 1, 2);
    eW = Math.max(1, Math.round(box.width));
    eH = Math.max(1, Math.round(box.height));
    eCanvas.width = Math.round(eW * eDpr);
    eCanvas.height = Math.round(eH * eDpr);
    ectx.setTransform(eDpr, 0, 0, eDpr, 0, 0);
    // Positions come from the laid-out DOM, so the lines can never disagree with the labels.
    Object.keys(ndEls).forEach(function (k) {
      var r = ndEls[k].getBoundingClientRect();
      pts[k] = { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2,
                 w: r.width, h: r.height };
    });
  }

  // Particles are laid out once per link and simply advance; density follows the link's weight.
  var PARTS = [];
  (function seed() {
    var r = rng(90210);
    LINKS.forEach(function (l) {
      l.id = l.a + '>' + l.b;
      var n = Math.round(4 + l.w * 9);
      for (var i = 0; i < n; i++) {
        PARTS.push({ l: l, u: r(), v: (0.055 + r() * 0.05) * (0.6 + l.w * 0.6) });
      }
    });
  })();

  // A node's edge, so a line stops at the card rather than running under the label.
  function edgePoint(from, to) {
    var dx = to.x - from.x, dy = to.y - from.y;
    var m = Math.max(Math.abs(dx) / (from.w / 2 + 9), Math.abs(dy) / (from.h / 2 + 7)) || 1;
    return { x: from.x + dx / m, y: from.y + dy / m };
  }

  var CYCLE = { HOLD: 0.18, RUN: 0.28, CLOSE: 0.90 };

  function paintEstate(p, t) {
    if (!ectx || !eW) return;
    var secs = t / 1000;
    var running = p > CYCLE.RUN;
    var caught = 0, checksShown = 0;

    // which links are stalled, and which areas are raised
    var stalled = {}, raised = {};
    RAISES.forEach(function (r) {
      if (p >= r.at && p < r.close) { stalled[r.link] = true; raised[r.area] = r; }
      else if (p >= r.close) { caught++; ledgerClose(r.ledger, 'week ' + r.week); }
    });
    if (p >= CYCLE.CLOSE) ledgerClose('r4', 'week 12');

    ectx.clearRect(0, 0, eW, eH);

    LINKS.forEach(function (l) {
      var A = pts[l.a], B = pts[l.b];
      if (!A || !B) return;
      var a = edgePoint(A, B), b = edgePoint(B, A);
      var bad = stalled[l.id];
      ectx.save();
      ectx.strokeStyle = bad ? '#A0620A' : 'rgba(22,25,26,.22)';
      ectx.lineWidth = bad ? 1.4 : 0.6 + l.w * 0.9;
      if (bad) ectx.setLineDash([4, 4]);
      ectx.beginPath(); ectx.moveTo(a.x, a.y); ectx.lineTo(b.x, b.y); ectx.stroke();
      ectx.restore();
      l._a = a; l._b = b;

      // What moves, written on the line that moves it. Without this the diagram is pretty and
      // mute: an executive can see that Time Tracking reaches Payroll but not that it is hours.
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      var ang = Math.atan2(b.y - a.y, b.x - a.x);
      if (Math.abs(ang) > Math.PI / 2) ang += Math.PI;          // never set text upside down
      ectx.save();
      ectx.translate(mx, my);
      ectx.rotate(ang);
      ectx.font = '9px "IBM Plex Mono", ui-monospace, monospace';
      ectx.textAlign = 'center';
      ectx.fillStyle = bad ? '#A0620A' : 'rgba(22,25,26,.45)';
      ectx.fillText(bad ? 'stopped' : l.what, 0, -4);
      ectx.restore();
    });

    if (!reduce) {
      PARTS.forEach(function (q) {
        var l = q.l;
        if (!l._a || stalled[l.id]) return;          // a stalled flow is a flow that STOPPED
        var u = (q.u + secs * q.v) % 1;
        var x = l._a.x + (l._b.x - l._a.x) * u, y = l._a.y + (l._b.y - l._a.y) * u;
        ectx.save();
        ectx.fillStyle = 'rgba(184,67,30,.85)';
        ectx.beginPath(); ectx.arc(x, y, 1.9, 0, Math.PI * 2); ectx.fill();
        ectx.restore();
      });
    }

    Object.keys(AREAS).forEach(function (k) {
      var el = ndEls[k], a = AREAS[k];
      if (!el) return;
      var r = raised[k];
      var done = RAISES.some(function (x) { return x.area === k && p >= x.close; });
      el.classList.toggle('is-raised', !!r);
      el.classList.toggle('is-fixed', done && p < CYCLE.CLOSE + 0.08);
      var n = running ? Math.round(a.checks * Math.min(1, (p - CYCLE.RUN) / 0.5)) : 0;
      checksShown += n;
      var i = el.querySelector('[data-c]');
      if (i) i.textContent = r ? r.cause : (n ? n.toLocaleString('en-US') + ' checks' : 'holding');
    });

    if (phaseEl) {
      phaseEl.textContent = p < CYCLE.HOLD ? 'monitoring'
        : p < CYCLE.RUN ? 'release inbound'
        : p < CYCLE.CLOSE ? 'release week, checks running' : 'cycle closed';
    }
    if (clockEl) clockEl.textContent = 'week ' + Math.max(0, Math.min(12, Math.round(p * 12)));
    if (sAreas) sAreas.textContent = Object.keys(AREAS).length;
    if (sChecks) sChecks.textContent = checksShown.toLocaleString('en-US');
    if (sCaught) sCaught.textContent = caught;
    if (noteEl) {
      noteEl.textContent = Object.keys(stalled).length
        ? 'a stopped line is a flow that stopped'
        : 'representative cycle';
    }
    if (estateEl) {
      estateEl.setAttribute('data-sc-verify-state',
        [phaseEl ? phaseEl.textContent : '', checksShown, Object.keys(stalled).length, caught].join('|'));
    }
  }

  /* ══ 3 · THE CONTROL DATA ═══════════════════════════════════════════════════════════════════
     The estate one level down: every object, and the dependencies between them.

     The nine-stop colour ramp that used to be here is deleted. It was borrowed from the product's
     WebGL renderer, where hue encodes community position on a dark ground and additive blending
     makes it read. On paper it was the one element on the site fighting the palette, and it made
     the page look like a data-visualisation demo rather than a chart. Ink and terracotta only, and
     the distinction the caption actually promises: evidenced solid, inferred dashed.

     Motion is one thing, a levelling run: a traverse walks the mesh station to station, leaving a
     trail that fades. Evidence being collected along dependencies, which is what the chapter says. */

  var mapCanvas = document.getElementById('mapFigure');
  var mctx = mapCanvas ? mapCanvas.getContext('2d') : null;

  function rng(seed) {
    return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  }

  var MESH = (function () {
    var r = rng(4172026), nodes = [], links = [];
    // Clusters, so the mesh has structure rather than being an even scatter.
    var seeds = [[0.16,0.26],[0.42,0.14],[0.74,0.22],[0.24,0.68],[0.55,0.48],[0.82,0.62],[0.38,0.86],[0.68,0.84]];
    seeds.forEach(function (c, ci) {
      var first = nodes.length;
      nodes.push({ x: c[0], y: c[1], hub: true, c: ci });
      var n = 22 + Math.floor(r() * 20);
      for (var i = 0; i < n; i++) {
        var a = r() * Math.PI * 2, d = Math.pow(r(), 1.5) * 0.10;
        nodes.push({ x: c[0] + Math.cos(a) * d, y: c[1] + Math.sin(a) * d * 0.72, c: ci });
        links.push({ a: first, b: nodes.length - 1, ev: r() > 0.45 });
      }
      if (ci) links.push({ a: 0, b: first, ev: true, trunk: true });
    });
    for (var k = 0; k < 22; k++) {
      var a2 = Math.floor(r() * nodes.length), b2 = Math.floor(r() * nodes.length);
      if (a2 !== b2) links.push({ a: a2, b: b2, ev: r() > 0.5, trunk: true });
    }
    // the levelling route: hub to hub, the order a survey crew would walk it
    var route = [];
    for (var h = 0; h < nodes.length; h++) if (nodes[h].hub) route.push(h);
    return { nodes: nodes, links: links, route: route };
  })();

  var mapW = 0, mapH = 0, mapDpr = 1, plate = null;
  function mapPx(n) { return { x: 18 + n.x * (mapW - 36), y: 16 + n.y * (mapH - 32) }; }

  function buildPlate() {
    plate = document.createElement('canvas');
    plate.width = Math.round(mapW * mapDpr); plate.height = Math.round(mapH * mapDpr);
    var g = plate.getContext('2d');
    g.setTransform(mapDpr, 0, 0, mapDpr, 0, 0);
    MESH.links.forEach(function (l) {
      var A = mapPx(MESH.nodes[l.a]), B = mapPx(MESH.nodes[l.b]);
      g.save();
      g.strokeStyle = 'rgba(22,25,26,' + (l.ev ? (l.trunk ? 0.34 : 0.22) : 0.13) + ')';
      g.lineWidth = l.trunk ? 0.9 : 0.6;
      if (!l.ev) g.setLineDash([1.5, 3]);
      g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke();
      g.restore();
    });
    MESH.nodes.forEach(function (n) {
      var P = mapPx(n);
      g.fillStyle = 'rgba(22,25,26,' + (n.hub ? 0.62 : 0.3) + ')';
      if (n.hub) g.fillRect(P.x - 2.4, P.y - 2.4, 4.8, 4.8);
      else { g.beginPath(); g.arc(P.x, P.y, 1.25, 0, 6.284); g.fill(); }
    });
  }

  function sizeMap() {
    if (!mctx) return;
    var r = mapCanvas.getBoundingClientRect();
    mapDpr = Math.min(window.devicePixelRatio || 1, 2);
    mapW = Math.max(1, Math.round(r.width)); mapH = Math.max(1, Math.round(r.height));
    mapCanvas.width = Math.round(mapW * mapDpr); mapCanvas.height = Math.round(mapH * mapDpr);
    mctx.setTransform(mapDpr, 0, 0, mapDpr, 0, 0);
    buildPlate();
  }

  var TRAVERSE = { i: 0, u: 0, trail: [] };
  function paintMap(t) {
    if (!mctx || !plate) return;
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    mctx.drawImage(plate, 0, 0);
    mctx.setTransform(mapDpr, 0, 0, mapDpr, 0, 0);
    if (reduce || !MESH.route.length) return;

    TRAVERSE.u += 0.0075;
    if (TRAVERSE.u >= 1) {
      TRAVERSE.u = 0;
      TRAVERSE.i = (TRAVERSE.i + 1) % MESH.route.length;
    }
    var a = MESH.nodes[MESH.route[TRAVERSE.i]];
    var b = MESH.nodes[MESH.route[(TRAVERSE.i + 1) % MESH.route.length]];
    var A = mapPx(a), B = mapPx(b);
    var x = A.x + (B.x - A.x) * TRAVERSE.u, y = A.y + (B.y - A.y) * TRAVERSE.u;
    TRAVERSE.trail.push({ x: x, y: y, t: t });
    while (TRAVERSE.trail.length > 150) TRAVERSE.trail.shift();

    mctx.save();
    mctx.strokeStyle = 'rgba(184,67,30,.5)';
    mctx.lineWidth = 1.1;
    mctx.beginPath();
    TRAVERSE.trail.forEach(function (q, i) { i ? mctx.lineTo(q.x, q.y) : mctx.moveTo(q.x, q.y); });
    mctx.stroke();
    mctx.fillStyle = 'rgba(184,67,30,.95)';
    mctx.beginPath(); mctx.arc(x, y, 2.4, 0, 6.284); mctx.fill();
    mctx.restore();
  }

  /* ══ the loop ═══════════════════════════════════════════════════════════════════════════════ */

  var queued = false;
  function frame(now) {
    queued = false;
    var raw = boardAct ? parseFloat(boardAct.style.getPropertyValue('--sc-p')) : 0;
    paintEstate(isNaN(raw) ? 0 : raw, now || 0);
    paintMap(now || 0);
    tick();
  }
  function tick() { if (queued) return; queued = true; requestAnimationFrame(frame); }

  ledgerRender();
  sizeEstate();
  sizeMap();
  paintEstate(0, 0);
  tick();

  if (window.ResizeObserver && estateEl) new ResizeObserver(sizeEstate).observe(estateEl);
  else window.addEventListener('resize', sizeEstate);

  if (window.ResizeObserver && mapCanvas) {
    new ResizeObserver(sizeMap).observe(mapCanvas);
  } else {
    window.addEventListener('resize', sizeMap);
  }

  // Reduced motion keeps the meaning and drops the theatre: the cycle still advances with scroll,
  // it just does not hold anything back to make an entrance.
  if (reduce) { CYCLE.HOLD = 0.02; CYCLE.RUN = 0.06; }
})();
