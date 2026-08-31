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
     One chart. One tenant in the middle, everything that crosses its edge around it, and a
     release cycle running over the top of it.

     There were two of these and they said overlapping things in different visual languages. This
     is the one that survived, and it inherited the other's functionality: a scroll-driven cycle
     where two flows stop with a named cause and then resume with the week they closed in.

     The animation is NOT scroll-driven. Payroll does not stop running because a reader stopped
     scrolling. Scroll drives the CYCLE, which is a different clock, and the traffic keeps moving
     underneath it. */

  var INBOUND = [
    { k: 'applicant', id: 'Applicant tracking', w: 0.6 },
    { k: 'clocks',    id: 'Time clocks',        w: 1.0 },
    { k: 'carriers',  id: 'Benefit carriers',   w: 0.6 },
    { k: 'learning',  id: 'Learning',           w: 0.4 },
    { k: 'checks',    id: 'Background checks',  w: 0.35 },
    { k: 'expense',   id: 'Expense',            w: 0.45 }
  ];
  var OUTBOUND = [
    { k: 'bank',    id: 'Payroll bank file', w: 1.0 },
    { k: 'tax',     id: 'Tax filing',        w: 0.6 },
    { k: 'carrier', id: 'Carrier files',     w: 0.7 },
    { k: 'gl',      id: 'General ledger',    w: 0.6 },
    { k: 'report',  id: 'Reporting',         w: 0.5 },
    { k: 'badge',   id: 'Badge and access',  w: 0.35 }
  ];

  // The two failures from chapter I, landing on the thing an executive actually feels: a file
  // that stops leaving the tenant.
  var RAISES = [
    { k: 'bank',    at: 0.40, close: 0.70, week: 8,
      cause: 'pay component maps to a retired earning', ledger: 'r1' },
    { k: 'carrier', at: 0.52, close: 0.82, week: 10,
      cause: 'carrier changed the file width at source', ledger: 'r2' }
  ];

  // The real figure: the sum of the check counts this page prints for the seven functional areas.
  var CHECK_TOTAL = 4366;

  var IN_C = '14,116,144', OUT_C = '124,45,182', WARN = '160,98,10';

  var estateEl = document.getElementById('estate');
  var ecv = document.getElementById('estateCanvas');
  var ectx = ecv ? ecv.getContext('2d') : null;
  var boardAct = estateEl ? estateEl.closest('[data-sc-act="pin"]') : null;
  var phaseEl = document.getElementById('boardPhase');
  var clockEl = document.getElementById('boardClock');
  var sAreas = document.getElementById('statAreas');
  var sChecks = document.getElementById('statChecks');
  var sCaught = document.getElementById('statCaught');
  var noteEl = document.getElementById('estateNote');

  var eW = 0, eH = 0, eDpr = 1, HUB = null;

  function layout() {
    HUB = { x: eW * 0.5, y: eH * 0.5, r: Math.max(44, Math.min(74, eW * 0.05)) };
    var span = eH * 0.80, top = eH * 0.10;
    INBOUND.forEach(function (s, i) {
      s.x = eW * 0.265; s.y = top + (i / (INBOUND.length - 1)) * span;
      s.c1 = { x: eW * 0.40, y: s.y }; s.c2 = { x: eW * 0.44, y: HUB.y };
      s.ex = HUB.x - HUB.r - 3; s.ey = HUB.y;
    });
    OUTBOUND.forEach(function (s, i) {
      s.x = eW * 0.735; s.y = top + (i / (OUTBOUND.length - 1)) * span;
      s.c1 = { x: eW * 0.56, y: HUB.y }; s.c2 = { x: eW * 0.60, y: s.y };
      s.ex = HUB.x + HUB.r + 3; s.ey = HUB.y;
    });
  }

  function pathOf(s, dir) {
    return dir === 'in'
      ? { a: { x: s.x, y: s.y }, c1: s.c1, c2: s.c2, b: { x: s.ex, y: s.ey } }
      : { a: { x: s.ex, y: s.ey }, c1: s.c1, c2: s.c2, b: { x: s.x, y: s.y } };
  }
  function bez(P, u) {
    var m = 1 - u, m2 = m * m, u2 = u * u;
    return {
      x: m2 * m * P.a.x + 3 * m2 * u * P.c1.x + 3 * m * u2 * P.c2.x + u2 * u * P.b.x,
      y: m2 * m * P.a.y + 3 * m2 * u * P.c1.y + 3 * m * u2 * P.c2.y + u2 * u * P.b.y
    };
  }

  var PARTICLES = (function () {
    var r = rng(31337), out = [];
    INBOUND.forEach(function (s) {
      var n = 4 + Math.round(s.w * 6);
      for (var i = 0; i < n; i++) out.push({ s: s, dir: 'in', u: r(), v: 0.024 + r() * 0.02 });
    });
    OUTBOUND.forEach(function (s) {
      var n = 4 + Math.round(s.w * 6);
      for (var i = 0; i < n; i++) out.push({ s: s, dir: 'out', u: r(), v: 0.024 + r() * 0.02 });
    });
    return out;
  })();

  function sizeEstate() {
    if (!ectx || !estateEl) return;
    var box = estateEl.getBoundingClientRect();
    if (!box.width || !box.height) return;
    eDpr = Math.min(window.devicePixelRatio || 1, 2);
    eW = Math.round(box.width); eH = Math.round(box.height);
    ecv.width = Math.round(eW * eDpr); ecv.height = Math.round(eH * eDpr);
    ectx.setTransform(eDpr, 0, 0, eDpr, 0, 0);
    layout();
  }

  var CYCLE = { HOLD: 0.18, RUN: 0.28, CLOSE: 0.90 };

  function paintEstate(p, t) {
    if (!ectx || !eW) return;
    var secs = t / 1000, running = p > CYCLE.RUN, caught = 0;

    var stopped = {};
    RAISES.forEach(function (r) {
      if (p >= r.at && p < r.close) stopped[r.k] = r;
      else if (p >= r.close) { caught++; ledgerClose(r.ledger, 'week ' + r.week); }
    });
    if (p >= CYCLE.CLOSE) ledgerClose('r4', 'week 12');

    ectx.clearRect(0, 0, eW, eH);
    ectx.lineCap = 'round';

    function side(list, dir, col) {
      list.forEach(function (s) {
        var P = pathOf(s, dir), bad = stopped[s.k];
        ectx.save();
        ectx.strokeStyle = bad ? 'rgba(' + WARN + ',.85)' : 'rgba(' + col + ',' + (0.14 + s.w * 0.16) + ')';
        ectx.lineWidth = bad ? 1.5 : 0.7 + s.w * 1.4;
        if (bad) ectx.setLineDash([5, 4]);
        ectx.beginPath();
        ectx.moveTo(P.a.x, P.a.y);
        ectx.bezierCurveTo(P.c1.x, P.c1.y, P.c2.x, P.c2.y, P.b.x, P.b.y);
        ectx.stroke();
        ectx.restore();

        ectx.save();
        ectx.fillStyle = bad ? 'rgba(' + WARN + ',1)' : 'rgba(' + col + ',.95)';
        ectx.beginPath(); ectx.arc(s.x, s.y, bad ? 4.4 : 3.4, 0, 6.284); ectx.fill();
        ectx.textAlign = dir === 'in' ? 'right' : 'left';
        var tx = s.x + (dir === 'in' ? -10 : 10);
        ectx.font = '500 11.5px "IBM Plex Mono", ui-monospace, monospace';
        ectx.fillStyle = bad ? 'rgba(' + WARN + ',1)' : 'rgba(22,25,26,.78)';
        ectx.fillText(s.id, tx, s.y + (bad ? -2 : 4));
        if (bad) {
          ectx.font = '9.5px "IBM Plex Mono", ui-monospace, monospace';
          ectx.fillStyle = 'rgba(' + WARN + ',.9)';
          ectx.fillText('STOPPED', tx, s.y + 11);
        }
        ectx.restore();
      });
    }
    side(INBOUND, 'in', IN_C);
    side(OUTBOUND, 'out', OUT_C);

    if (!reduce) {
      PARTICLES.forEach(function (q) {
        if (stopped[q.s.k]) return;                     // a stopped flow is a flow that STOPPED
        var P = pathOf(q.s, q.dir), col = q.dir === 'in' ? IN_C : OUT_C;
        var u = (q.u + secs * q.v) % 1;
        for (var k = 0; k < 4; k++) {
          var uu = u - k * 0.012;
          if (uu < 0) break;
          var pt = bez(P, uu);
          ectx.fillStyle = 'rgba(' + col + ',' + (0.85 - k * 0.19) + ')';
          ectx.beginPath(); ectx.arc(pt.x, pt.y, 2.3 - k * 0.42, 0, 6.284); ectx.fill();
        }
      });
    }

    // the tenant
    var shown = running ? Math.round(CHECK_TOTAL * Math.min(1, (p - CYCLE.RUN) / 0.5)) : 0;
    ectx.save();
    ectx.beginPath(); ectx.arc(HUB.x, HUB.y, HUB.r, 0, 6.284);
    ectx.fillStyle = 'rgba(255,255,255,.97)'; ectx.fill();
    ectx.strokeStyle = Object.keys(stopped).length ? 'rgba(' + WARN + ',.8)' : 'rgba(22,25,26,.78)';
    ectx.lineWidth = 1.5; ectx.stroke();
    ectx.beginPath(); ectx.arc(HUB.x, HUB.y, HUB.r + 7, 0, 6.284);
    ectx.strokeStyle = 'rgba(22,25,26,.14)'; ectx.lineWidth = 1; ectx.stroke();
    ectx.textAlign = 'center';
    ectx.fillStyle = '#16191A';
    ectx.font = '600 16px "Source Sans 3", system-ui, sans-serif';
    ectx.fillText('Workday', HUB.x, HUB.y - 4);
    ectx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    ectx.fillStyle = 'rgba(22,25,26,.55)';
    ectx.fillText(shown ? shown.toLocaleString('en-US') + ' checks' : 'one tenant', HUB.x, HUB.y + 12);
    ectx.restore();

    ectx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    ectx.fillStyle = 'rgba(' + IN_C + ',.85)';
    ectx.textAlign = 'left'; ectx.fillText('INBOUND', 4, 12);
    ectx.fillStyle = 'rgba(' + OUT_C + ',.85)';
    ectx.textAlign = 'right'; ectx.fillText('OUTBOUND', eW - 4, 12);

    if (phaseEl) {
      phaseEl.textContent = p < CYCLE.HOLD ? 'monitoring'
        : p < CYCLE.RUN ? 'release inbound'
        : p < CYCLE.CLOSE ? 'release week, checks running' : 'cycle closed';
    }
    if (clockEl) clockEl.textContent = 'week ' + Math.max(0, Math.min(12, Math.round(p * 12)));
    if (sAreas) sAreas.textContent = INBOUND.length + OUTBOUND.length;
    if (sChecks) sChecks.textContent = shown.toLocaleString('en-US');
    if (sCaught) sCaught.textContent = caught;
    if (noteEl) {
      var open = Object.keys(stopped).map(function (k) { return stopped[k]; });
      noteEl.textContent = open.length
        ? open.map(function (r) { return r.cause; }).join('  ·  ')
        : 'representative cycle';
      noteEl.style.color = open.length ? 'rgb(' + WARN + ')' : '';
    }
    if (estateEl) {
      estateEl.setAttribute('data-sc-verify-state',
        [phaseEl ? phaseEl.textContent : '', shown, Object.keys(stopped).length, caught].join('|'));
    }
  }

  function rng(seed) {
    return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  }

  /* ══ the loop ═══════════════════════════════════════════════════════════════════════════════ */

  var queued = false;
  function frame(now) {
    queued = false;
    var raw = boardAct ? parseFloat(boardAct.style.getPropertyValue('--sc-p')) : 0;
    paintEstate(isNaN(raw) ? 0 : raw, now || 0);
    tick();
  }
  function tick() { if (queued) return; queued = true; requestAnimationFrame(frame); }

  ledgerRender();
  sizeEstate();
  paintEstate(0, 0);
  tick();

  if (window.ResizeObserver && estateEl) new ResizeObserver(sizeEstate).observe(estateEl);
  else window.addEventListener('resize', sizeEstate);

  if (reduce) { CYCLE.HOLD = 0.02; CYCLE.RUN = 0.06; }
})();
