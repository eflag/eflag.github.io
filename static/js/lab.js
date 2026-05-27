/* eFlag · ciclo P&D animado — porta vanilla de home.jsx <Lab/>.
   Lê as posições dos nós direto do SVG (renderizado pelo Hugo) e anima
   um dot circulando o anel, destacando o nó ativo e trocando o painel
   de detalhe. Hover/click pula para um nó e pausa 4.5s. */
(function () {
  var svg = document.getElementById('lab-svg');
  if (!svg) return;

  var nodes = window.LAB_NODES;
  if (!nodes || !nodes.length) return;
  var n = nodes.length;

  var groups = Array.prototype.slice.call(svg.querySelectorAll('.lab-node'));
  var segs   = Array.prototype.slice.call(svg.querySelectorAll('.lab-seg'));
  var dot    = document.getElementById('lab-dot');
  var glow   = document.getElementById('lab-glow');
  var pulse  = document.getElementById('lab-pulse');
  var elStep = document.getElementById('lab-step');
  var elTitle = document.getElementById('lab-title');
  var elBody  = document.getElementById('lab-body');
  var pagerBtns = Array.prototype.slice.call(document.querySelectorAll('#lab-pager [data-pager]'));

  // Posições lidas do atributo transform="translate(x,y)" de cada nó.
  var pts = groups.map(function (g) {
    var m = /translate\(\s*([-\d.]+)\s*[ ,]\s*([-\d.]+)\s*\)/.exec(g.getAttribute('transform') || '');
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 0, y: 0 };
  });

  var pad2 = function (i) { return (i < 10 ? '0' : '') + i; };
  var ease = function (x) { return x * x * (3 - 2 * x); };

  var lastActive = -1;
  function render(phase) {
    var active = Math.round(phase * n) % n;
    var seg = phase * n;
    var segIdx = Math.floor(seg) % n;
    var segT = seg - Math.floor(seg);
    var a = pts[segIdx], b = pts[(segIdx + 1) % n];
    var dx = a.x + (b.x - a.x) * ease(segT);
    var dy = a.y + (b.y - a.y) * ease(segT);

    dot.setAttribute('cx', dx); dot.setAttribute('cy', dy);
    glow.setAttribute('cx', dx); glow.setAttribute('cy', dy);

    segs.forEach(function (s, i) {
      var on = i === segIdx;
      s.setAttribute('stroke', on ? 'var(--accent)' : 'var(--border)');
      s.setAttribute('stroke-width', on ? 2 : 1.5);
      s.setAttribute('stroke-dasharray', on ? '0' : '3 4');
    });

    groups.forEach(function (g, i) {
      var isActive = i === active;
      var ring = g.querySelector('.lab-node-ring');
      var label = g.querySelector('.lab-node-label');
      ring.setAttribute('r', isActive ? 22 : 18);
      ring.setAttribute('stroke', isActive ? 'var(--accent)' : 'var(--border)');
      ring.setAttribute('stroke-width', isActive ? 2 : 1.5);
      label.setAttribute('fill', isActive ? 'var(--accent)' : 'var(--fg2)');
    });

    if (active !== lastActive) {
      lastActive = active;
      pulse.setAttribute('cx', pts[active].x);
      pulse.setAttribute('cy', pts[active].y);
      elStep.textContent = 'Etapa ' + pad2(active + 1) + ' de ' + pad2(n);
      elTitle.textContent = nodes[active].label;
      elBody.textContent = nodes[active].desc;
      pagerBtns.forEach(function (btn, i) {
        btn.classList.toggle('active', i === active);
      });
    }
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── interação (hover/click/pager) — disponível em ambos os modos
  var DURATION = 32000;
  var phaseOffset = 0;
  var start = performance.now();
  var paused = reduce; // sem auto-animação se reduced-motion
  var pauseUntil = 0;

  function jumpTo(i) {
    phaseOffset = i / n;
    render(phaseOffset);
    paused = true;
    pauseUntil = performance.now() + 4500;
    if (reduce) pauseUntil = Infinity;
  }

  groups.forEach(function (g, i) {
    g.addEventListener('mouseenter', function () { jumpTo(i); });
    g.addEventListener('click', function () { jumpTo(i); });
  });
  pagerBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { jumpTo(i); });
  });

  // estado inicial
  render(0);

  if (reduce) return; // mantém estático, só responde a interação

  function tick() {
    var now = performance.now();
    if (paused && now > pauseUntil) {
      start = now - phaseOffset * DURATION;
      paused = false;
    }
    if (!paused) {
      var t = ((now - start) / DURATION) % 1;
      phaseOffset = t;
      render(t);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
