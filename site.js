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

  /* Three incidents, one inbound and two outbound, each with a FOUR state life so a reader can
     see the week it broke, the week we were working on it, and the week it came back.

     The middle state is the one that was missing. Before this the chart went straight from
     stopped to fine, which showed a problem and hid the work: the entire value of the engagement
     happens between those two weeks, and it was invisible. Now the line says what is being done
     to it and who is doing it. */
  var INCIDENTS = [
    { k: 'clocks', dir: 'in',
      stop: 0.30, fix: 0.46, done: 0.58, wkStop: 4, wkFix: 6, wkDone: 7,
      cause:  'clock export stopped after the vendor upgrade',
      action: 're-pointed the export, backfilled three days',
      ledger: 'r4' },
    { k: 'bank', dir: 'out',
      stop: 0.38, fix: 0.54, done: 0.66, wkStop: 5, wkFix: 7, wkDone: 8,
      cause:  'pay component maps to a retired earning',
      action: 'remapped the component, re-ran the audit',
      ledger: 'r1' },
    { k: 'carrier', dir: 'out',
      stop: 0.50, fix: 0.64, done: 0.78, wkStop: 6, wkFix: 8, wkDone: 9,
      cause:  'carrier changed the file width at source',
      action: 'rebuilt the file spec to the new width',
      ledger: 'r2' }
  ];

  function stateOf(inc, p) {
    if (p < inc.stop) return 'ok';
    if (p < inc.fix)  return 'stopped';
    if (p < inc.done) return 'fixing';
    if (p < inc.done + 0.10) return 'restored';
    return 'ok';
  }

  // The real figure: the sum of the check counts this page prints for the seven functional areas.
  var CHECK_TOTAL = 4366;

  var IN_C = '14,116,144', OUT_C = '124,45,182', WARN = '160,98,10';

  var estateEl = document.getElementById('estate');
  var ecv = document.getElementById('estateCanvas');
  var ectx = ecv ? ecv.getContext('2d') : null;
  /* The cycle runs on its own clock. Driving it from scroll made it a scrubber: it only advanced
     while someone was moving, and stopped dead the moment they read something. A release cycle
     does not wait for the reader.

     It starts when the diagram is first seen rather than on page load, so nobody arrives at week
     nine, and it pauses when the diagram is off screen, which costs nothing and means the next
     look starts from the beginning. */
  var CYCLE_SECONDS = 26, CYCLE_HOLD = 3.5;
  var cycleT0 = null, cycleVisible = false, cycleP = 0;

  function advance(now) {
    if (!cycleVisible) return cycleP;
    if (cycleT0 === null) cycleT0 = now;
    var el = (now - cycleT0) / 1000;
    var span = CYCLE_SECONDS + CYCLE_HOLD;
    var phase = el % span;
    cycleP = phase >= CYCLE_SECONDS ? 1 : phase / CYCLE_SECONDS;   // run, then hold on the close
    return cycleP;
  }
  var phaseEl = document.getElementById('boardPhase');
  var clockEl = document.getElementById('boardClock');
  var sAreas = document.getElementById('statAreas');
  var sChecks = document.getElementById('statChecks');
  var sCaught = document.getElementById('statCaught');
  var noteEl = document.getElementById('estateNote');

  var eW = 0, eH = 0, eDpr = 1, HUB = null;

  function layout() {
    HUB = { x: eW * 0.5, y: (eH - 54) * 0.5, r: Math.max(44, Math.min(74, eW * 0.05)) };
    var span = (eH - 54) * 0.80, top = (eH - 54) * 0.10;
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

  var OKC = '31,122,92';

  function paintEstate(p, t) {
    if (!ectx || !eW) return;
    var secs = t / 1000, running = p > CYCLE.RUN;
    var fixed = 0, openNow = 0, working = 0;

    var state = {};
    INCIDENTS.forEach(function (inc) {
      var st = stateOf(inc, p);
      state[inc.k] = { s: st, inc: inc };
      if (st === 'stopped') openNow++;
      if (st === 'fixing') working++;
      if (p >= inc.done) { fixed++; ledgerClose(inc.ledger, 'week ' + inc.wkDone); }
    });

    ectx.clearRect(0, 0, eW, eH);
    ectx.lineCap = 'round';
    var chartH = eH - 54;                       // the strip below belongs to the timeline

    function side(list, dir, col) {
      list.forEach(function (s) {
        var P = pathOf(s, dir), st = state[s.k], kind = st ? st.s : 'ok';
        var stroke = 'rgba(' + col + ',' + (0.14 + s.w * 0.16) + ')', lw = 0.7 + s.w * 1.4, dash = null;
        if (kind === 'stopped')  { stroke = 'rgba(' + WARN + ',.95)'; lw = 2.2; dash = [6, 5]; }
        if (kind === 'fixing')   { stroke = 'rgba(' + WARN + ',.8)';  lw = 2.0; dash = [2, 4]; }
        if (kind === 'restored') { stroke = 'rgba(' + OKC + ',.9)';   lw = 2.0; }

        ectx.save();
        ectx.strokeStyle = stroke; ectx.lineWidth = lw;
        if (dash) { ectx.setLineDash(dash); ectx.lineDashOffset = kind === 'fixing' ? -secs * 26 : 0; }
        ectx.beginPath();
        ectx.moveTo(P.a.x, P.a.y);
        ectx.bezierCurveTo(P.c1.x, P.c1.y, P.c2.x, P.c2.y, P.b.x, P.b.y);
        ectx.stroke();
        ectx.restore();

        // the marker: a stopped flow gets a ring that pulses, so the eye finds it without hunting
        ectx.save();
        var mc = kind === 'ok' ? col : kind === 'restored' ? OKC : WARN;
        if (kind === 'stopped' || kind === 'fixing') {
          var pulse = 0.5 + 0.5 * Math.sin(secs * (kind === 'stopped' ? 4.2 : 2.4));
          ectx.strokeStyle = 'rgba(' + WARN + ',' + (0.15 + pulse * 0.5) + ')';
          ectx.lineWidth = 1.4;
          ectx.beginPath(); ectx.arc(s.x, s.y, 7 + pulse * 4, 0, 6.284); ectx.stroke();
        }
        ectx.fillStyle = 'rgba(' + mc + ',1)';
        ectx.beginPath(); ectx.arc(s.x, s.y, kind === 'ok' ? 3.4 : 4.6, 0, 6.284); ectx.fill();

        ectx.textAlign = dir === 'in' ? 'right' : 'left';
        var tx = s.x + (dir === 'in' ? -12 : 12);
        ectx.font = '500 11.5px "IBM Plex Mono", ui-monospace, monospace';
        ectx.fillStyle = kind === 'ok' ? 'rgba(22,25,26,.78)' : 'rgba(' + mc + ',1)';
        ectx.fillText(s.id, tx, s.y + (kind === 'ok' ? 4 : -2));
        if (kind !== 'ok') {
          var inc = st.inc;
          var badge = kind === 'stopped'  ? 'STOPPED · week ' + inc.wkStop
                    : kind === 'fixing'   ? 'FIXING · week ' + inc.wkFix
                                          : 'RESTORED · week ' + inc.wkDone;
          ectx.font = '600 9.5px "IBM Plex Mono", ui-monospace, monospace';
          ectx.fillStyle = 'rgba(' + mc + ',1)';
          ectx.fillText(badge, tx, s.y + 11);
        }
        ectx.restore();
      });
    }
    side(INBOUND, 'in', IN_C);
    side(OUTBOUND, 'out', OUT_C);

    if (!reduce) {
      PARTICLES.forEach(function (q) {
        var st = state[q.s.k];
        if (st && (st.s === 'stopped' || st.s === 'fixing')) return;   // nothing is flowing
        var P = pathOf(q.s, q.dir);
        var col = st && st.s === 'restored' ? OKC : (q.dir === 'in' ? IN_C : OUT_C);
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
    var hubY = HUB.y;
    ectx.save();
    ectx.beginPath(); ectx.arc(HUB.x, hubY, HUB.r, 0, 6.284);
    ectx.fillStyle = 'rgba(255,255,255,.97)'; ectx.fill();
    ectx.strokeStyle = openNow ? 'rgba(' + WARN + ',.9)' : working ? 'rgba(' + WARN + ',.5)' : 'rgba(22,25,26,.78)';
    ectx.lineWidth = 1.5; ectx.stroke();
    ectx.beginPath(); ectx.arc(HUB.x, hubY, HUB.r + 7, 0, 6.284);
    ectx.strokeStyle = 'rgba(22,25,26,.14)'; ectx.lineWidth = 1; ectx.stroke();
    ectx.textAlign = 'center';
    ectx.fillStyle = '#16191A';
    ectx.font = '600 16px "Source Sans 3", system-ui, sans-serif';
    ectx.fillText('Workday', HUB.x, hubY - 4);
    ectx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    ectx.fillStyle = 'rgba(22,25,26,.55)';
    ectx.fillText(shown ? shown.toLocaleString('en-US') + ' checks' : 'one tenant', HUB.x, hubY + 12);
    ectx.restore();

    ectx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    ectx.fillStyle = 'rgba(' + IN_C + ',.85)';
    ectx.textAlign = 'left'; ectx.fillText('INBOUND', 4, 12);
    ectx.fillStyle = 'rgba(' + OUT_C + ',.85)';
    ectx.textAlign = 'right'; ectx.fillText('OUTBOUND', eW - 4, 12);

    timeline(p, chartH);

    var wk = Math.max(0, Math.min(12, Math.round(p * 12)));
    if (phaseEl) {
      phaseEl.textContent = openNow ? openNow + ' stopped, ' + (working ? working + ' being fixed' : 'triaging')
        : working ? working + ' being fixed'
        : p < CYCLE.HOLD ? 'monitoring'
        : p < CYCLE.RUN ? 'release inbound'
        : p < CYCLE.CLOSE ? 'release week, checks running' : 'cycle closed, nothing open';
    }
    if (clockEl) clockEl.textContent = 'week ' + wk;
    if (sAreas) sAreas.textContent = INBOUND.length + OUTBOUND.length;
    if (sChecks) sChecks.textContent = shown.toLocaleString('en-US');
    if (sCaught) sCaught.textContent = fixed;
    if (noteEl) {
      var live = INCIDENTS.filter(function (i) { return stateOf(i, p) === 'fixing'; });
      var brk = INCIDENTS.filter(function (i) { return stateOf(i, p) === 'stopped'; });
      noteEl.textContent = live.length ? 'we are ' + live.map(function (i) { return i.action; }).join(' · we are ')
        : brk.length ? brk.map(function (i) { return i.cause; }).join(' · ')
        : 'representative cycle';
      noteEl.style.color = live.length ? 'rgb(' + WARN + ')' : brk.length ? 'rgb(' + WARN + ')' : '';
    }
    // No data-sc-verify-state any more. It existed so the harness could see a PINNED, scroll
    // driven board whose repaints were invisible to it. The cycle runs on a clock now and the act
    // is not pinned, so the declaration describes nothing, and publishing it opted every flow act
    // on the page into a dead-scroll check that ordinary prose is rightly exempt from.
    if (estateEl) estateEl.setAttribute('data-cycle', [wk, shown, openNow, working, fixed].join('|'));
  }

  /* The week ruler. "More obvious week to week" is really a request for an axis: without one, a
     reader has no way to tell whether anything changed between two moments. Events flag on it at
     the week they happen and stay flagged, so the whole cycle is legible from any position. */
  function timeline(p, y) {
    var x0 = eW * 0.10, x1 = eW * 0.90, w = x1 - x0;
    var wkNow = Math.max(0, Math.min(12, p * 12));
    ectx.save();
    ectx.strokeStyle = 'rgba(22,25,26,.22)'; ectx.lineWidth = 1;
    ectx.beginPath(); ectx.moveTo(x0, y + 16); ectx.lineTo(x1, y + 16); ectx.stroke();
    ectx.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    ectx.textAlign = 'center';
    for (var k = 0; k <= 12; k++) {
      var x = x0 + (k / 12) * w, on = k <= wkNow;
      ectx.strokeStyle = on ? 'rgba(22,25,26,.45)' : 'rgba(22,25,26,.16)';
      ectx.beginPath(); ectx.moveTo(x, y + 12); ectx.lineTo(x, y + 20); ectx.stroke();
      if (k % 2 === 0) {
        ectx.fillStyle = on ? 'rgba(22,25,26,.55)' : 'rgba(22,25,26,.25)';
        ectx.fillText('wk ' + k, x, y + 32);
      }
    }
    // travelled portion
    ectx.strokeStyle = 'rgba(' + '184,67,30' + ',.75)'; ectx.lineWidth = 2;
    ectx.beginPath(); ectx.moveTo(x0, y + 16); ectx.lineTo(x0 + (wkNow / 12) * w, y + 16); ectx.stroke();

    INCIDENTS.forEach(function (inc) {
      [['stop', inc.wkStop, WARN], ['done', inc.wkDone, OKC]].forEach(function (e) {
        if (wkNow + 0.01 < e[1]) return;
        var x = x0 + (e[1] / 12) * w;
        ectx.fillStyle = 'rgba(' + e[2] + ',.95)';
        ectx.beginPath();
        ectx.moveTo(x, y + 16 - 7); ectx.lineTo(x + 4, y + 16 - 2); ectx.lineTo(x - 4, y + 16 - 2);
        ectx.closePath(); ectx.fill();
      });
    });
    ectx.restore();
  }

  function rng(seed) {
    return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  }

  /* ══ the loop ═══════════════════════════════════════════════════════════════════════════════ */

  var queued = false;
  function frame(now) {
    queued = false;
    paintEstate(advance(now || 0), now || 0);
    tick();
  }
  function tick() { if (queued) return; queued = true; requestAnimationFrame(frame); }

  ledgerRender();
  sizeEstate();
  paintEstate(0, 0);
  tick();

  if (window.ResizeObserver && estateEl) new ResizeObserver(sizeEstate).observe(estateEl);
  else window.addEventListener('resize', sizeEstate);

  if (estateEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        cycleVisible = r.isIntersecting;
        if (!r.isIntersecting) cycleT0 = null;      // next look starts at week 0
      });
    }, { rootMargin: '80px', threshold: 0.15 }).observe(estateEl);
  } else { cycleVisible = true; }

  // Reduced motion gets the resolved cycle, held: the story is still told, nothing loops.
  if (reduce) { cycleVisible = false; cycleP = 1; }

  if (reduce) { CYCLE.HOLD = 0.02; CYCLE.RUN = 0.06; }
})();
