/* eFlag · bandeira three.js no hero — porta vanilla de js/flag.jsx.
   Tecido cotton em silhueta de swallowtail (logo eFlag), iluminado por 3 luzes
   de marca (cyan/verde/magenta). Overlay matrix + outline do logo. Deforma com
   vento + mouse.

   Carregamento LAZY/CONDICIONAL:
   · não roda com prefers-reduced-motion nem em telas < 900px (fica o <img> fallback);
   · three.js só é baixado quando o hero entra na viewport.                       */
(function () {
  var THREE_SRC = '/js/three.min.js'; // hospedado localmente (sem dependência de CDN)

  var mount = document.getElementById('hero-flag');
  if (!mount) return;

  // Sem fallback visual: se a bandeira não puder rodar, a área some e o
  // conteúdo do hero ocupa a largura toda (grid colapsada para 1 coluna).
  function collapse() {
    mount.style.display = 'none';
    var grid = mount.closest('.eks-hero-grid');
    if (grid) grid.style.gridTemplateColumns = 'minmax(0, 1fr)';
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || window.innerWidth < 900) { collapse(); return; }

  var started = false;

  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    var s = document.createElement('script');
    s.src = THREE_SRC;
    s.onload = cb;
    s.onerror = collapse; // falhou o download: some sem fallback
    document.head.appendChild(s);
  }

  function start() {
    if (started) return;
    started = true;
    loadThree(function () { if (window.THREE) { init(); } else { collapse(); } });
  }

  // O hero fica no topo (sempre visível), então carregamos direto.
  // Nada de IntersectionObserver: ele não dispara em elemento display:none.
  start();

  function init() {
    var THREE = window.THREE;

    // revela a área antes de medir, senão clientWidth/Height vêm 0 (display:none)
    mount.style.display = 'block';

    var w0 = mount.clientWidth, h0 = mount.clientHeight;
    if (!w0 || !h0) { w0 = 480; h0 = 380; }

    var renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
    renderer.setSize(w0, h0, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, w0 / h0, 0.1, 50);
    camera.position.set(0.0, 0.0, 5.2);
    camera.lookAt(0, 0, 0);

    var geo = new THREE.PlaneGeometry(2.8, 2.8, 180, 180);

    var WIND_RAD = 54.6 * Math.PI / 180;
    var uniforms = {
      uTime:          { value: 0 },
      uMouse:         { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0 },
      uColorCyan:     { value: new THREE.Color(0x00f5d4) },
      uColorGreen:    { value: new THREE.Color(0x00e76a) },
      uColorMagenta:  { value: new THREE.Color(0xff2dd4) },
      uAlbedo:        { value: new THREE.Color(0xfafafc) },
      uWindDir:       { value: new THREE.Vector2(Math.cos(WIND_RAD), Math.sin(WIND_RAD)) },
      uOverlayColor:  { value: new THREE.Color(0xb400e6) },
      uOutlineColor:  { value: new THREE.Color(0xfcfcfc) }
    };

    var vertexShader = [
      'uniform float uTime;',
      'uniform vec2  uMouse;',
      'uniform float uMouseStrength;',
      'uniform vec2  uWindDir;',
      'varying vec2 vUv;',
      'varying vec3 vViewPos;',
      'varying vec3 vNormal;',
      'vec3 deformPos(vec3 pos, vec2 uv) {',
      '  float pin = smoothstep(0.0, 1.0, uv.x);',
      '  float t = uTime;',
      '  float phase = (pos.x * uWindDir.x + pos.y * uWindDir.y) * 1.6;',
      '  float w1 = sin(phase * 2.0 + t * 1.4) * 0.18;',
      '  float w2 = sin(phase * 4.6 + pos.y * 2.4 + t * 1.8) * 0.10;',
      '  float w3 = sin((pos.y * uWindDir.x - pos.x * uWindDir.y) * 3.4 - t * 1.1) * 0.055;',
      '  float w4 = sin(phase * 9.0 - t * 2.7) * 0.022;',
      '  float turb = sin(pos.x * 12.0 + t * 4.5) * sin(pos.y * 11.0 - t * 3.7) * 0.03 * 0.65;',
      '  float wave = (w1 + w2 + w3 + w4 + turb) * pin;',
      '  float sag = -uv.x * uv.x * 0.16 * (1.0 - uv.y);',
      '  vec2 mDist = uv - uMouse;',
      '  float falloff = exp(-dot(mDist, mDist) / (0.22 * 0.22));',
      '  float push = -falloff * uMouseStrength * 0.55;',
      '  vec3 r = pos;',
      '  r.z += wave + sag + push;',
      '  r.y += sag * 0.4;',
      '  return r;',
      '}',
      'void main() {',
      '  vUv = uv;',
      '  vec3 p0 = deformPos(position, uv);',
      '  const float eps    = 0.006;',
      '  const float uvStep = 0.006 / 2.8;',
      '  vec3 pxp = deformPos(position + vec3( eps, 0.0, 0.0), uv + vec2( uvStep, 0.0));',
      '  vec3 pxn = deformPos(position + vec3(-eps, 0.0, 0.0), uv + vec2(-uvStep, 0.0));',
      '  vec3 pyp = deformPos(position + vec3(0.0,  eps, 0.0), uv + vec2(0.0,  uvStep));',
      '  vec3 pyn = deformPos(position + vec3(0.0, -eps, 0.0), uv + vec2(0.0, -uvStep));',
      '  vec3 nrm = normalize(cross(pxp - pxn, pyp - pyn));',
      '  vec4 mvPos = modelViewMatrix * vec4(p0, 1.0);',
      '  vViewPos = mvPos.xyz;',
      '  vNormal  = normalize(normalMatrix * nrm);',
      '  gl_Position = projectionMatrix * mvPos;',
      '}'
    ].join('\n');

    var fragmentShader = [
      'precision highp float;',
      'uniform float uTime;',
      'uniform vec2  uMouse;',
      'uniform float uMouseStrength;',
      'uniform vec3  uColorCyan;',
      'uniform vec3  uColorGreen;',
      'uniform vec3  uColorMagenta;',
      'uniform vec3  uAlbedo;',
      'uniform vec3  uOverlayColor;',
      'uniform vec3  uOutlineColor;',
      'varying vec2  vUv;',
      'varying vec3  vViewPos;',
      'varying vec3  vNormal;',
      'void main() {',
      '  float d1 = vUv.y - vUv.x;',
      '  float d2 = 1.0 - vUv.x - vUv.y;',
      '  float inside = max(d1, d2);',
      '  float aaM = fwidth(inside) * 1.2 + 0.001;',
      '  float mask = smoothstep(-aaM, aaM, inside);',
      '  if (mask < 0.01) discard;',
      '  vec3 n  = normalize(vNormal);',
      '  vec3 viewDir = normalize(-vViewPos);',
      '  vec3 lights[3];',
      '  lights[0] = vec3(-2.2,  1.6, 2.4);',
      '  lights[1] = vec3( 2.4,  1.4, 2.2);',
      '  lights[2] = vec3( 0.2, -2.0, 2.6);',
      '  vec3 cols[3];',
      '  cols[0] = uColorCyan;',
      '  cols[1] = uColorGreen;',
      '  cols[2] = uColorMagenta;',
      '  float intensities[3];',
      '  intensities[0] = 0.74;',
      '  intensities[1] = 1.11;',
      '  intensities[2] = 0.87;',
      '  const float SPEC_POWER  = 38.8;',
      '  const float SPEC_BOOST  = 0.6;',
      '  const float SHEEN_AMT   = 0.2;',
      '  const float IRID_AMT    = 0.2;',
      '  float ndotLavg = 0.0;',
      '  for (int i = 0; i < 3; i++) {',
      '    vec3 lightDir = normalize(lights[i] - vViewPos);',
      '    ndotLavg += max(dot(n, lightDir), 0.0) * intensities[i];',
      '  }',
      '  ndotLavg /= 3.0;',
      '  vec3 baseLit = uAlbedo * (0.38 + 0.55 * ndotLavg);',
      '  vec3 specSum = vec3(0.0);',
      '  for (int i = 0; i < 3; i++) {',
      '    vec3 lightDir = normalize(lights[i] - vViewPos);',
      '    vec3 H        = normalize(lightDir + viewDir);',
      '    float spec    = pow(max(dot(n, H), 0.0), SPEC_POWER);',
      '    specSum      += cols[i] * spec * intensities[i];',
      '  }',
      '  vec3 result = baseLit + specSum * SPEC_BOOST;',
      '  float sheenAmt = pow(1.0 - abs(dot(n, viewDir)), 3.2);',
      '  float cm1 = clamp(n.x * 0.55 + 0.5, 0.0, 1.0);',
      '  float cm2 = clamp(n.y * 0.55 + 0.5, 0.0, 1.0);',
      '  vec3 sheenColor = mix(uColorMagenta, uColorCyan, cm1);',
      '  sheenColor      = mix(sheenColor,    uColorGreen, cm2 * 0.6);',
      '  result += sheenColor * sheenAmt * (0.40 * SHEEN_AMT + 0.20 * IRID_AMT);',
      '  const float OVERLAY_INT   = 1.5;',
      '  const float OVERLAY_SPEED = 1.51;',
      '  float ts = uTime * OVERLAY_SPEED;',
      '  {',
      '    vec2 cellSize = vec2(1.0 / 22.0, 1.0 / 30.0);',
      '    vec2 cell     = floor(vUv / cellSize);',
      '    vec2 inCell   = fract(vUv / cellSize);',
      '    float colSeed = fract(sin(cell.x * 91.7) * 47589.4);',
      '    float speed   = 0.35 + colSeed * 1.1;',
      '    float colT    = ts * speed + colSeed * 7.0;',
      '    float headY = 1.2 - mod(colT * 0.32, 1.5);',
      '    float dy    = headY - vUv.y;',
      '    float trail = 0.0;',
      '    if (dy >= 0.0 && dy < 0.55) {',
      '      trail = pow(1.0 - dy / 0.55, 1.8);',
      '    }',
      '    float head = exp(-dy * dy * 1200.0);',
      '    float column = trail + head * 1.4;',
      '    float charT     = floor(colT * 4.0 + cell.y);',
      '    float charSeed  = fract(sin(cell.x * 41.7 + cell.y * 91.3 + charT * 31.0) * 23984.0);',
      '    float charOn    = step(0.42, charSeed);',
      '    vec2 pad = step(0.12, inCell) * step(inCell, vec2(0.88));',
      '    float padMask = pad.x * pad.y;',
      '    vec2 g = floor((inCell - 0.12) / (0.76 / vec2(3.0, 5.0)));',
      '    float pixV = fract(sin(g.x * 12.9898 + g.y * 78.233 + charSeed * 100.0) * 43758.5453);',
      '    float pix = step(0.45, pixV);',
      '    float ov = column * charOn * pix * padMask;',
      '    result += uOverlayColor * ov * OVERLAY_INT * 0.85;',
      '  }',
      '  const float OUT_INSET    = 0.046;',
      '  const float OUT_WIDTH    = 0.0105;',
      '  const float OUT_STRENGTH = 1.5;',
      '  {',
      '    float inT1 = step(0.0, vUv.y - vUv.x);',
      '    float inT2 = step(0.0, 1.0 - vUv.x - vUv.y);',
      '    float dT1 = min(min(1.0 - vUv.y, vUv.x), max(vUv.y - vUv.x, 0.0) * 0.7071);',
      '    float dT2 = min(min(vUv.y, vUv.x), max(1.0 - vUv.x - vUv.y, 0.0) * 0.7071);',
      '    float hw = OUT_WIDTH * 0.5;',
      '    float aaL = fwidth(vUv.x + vUv.y) * 1.2 + 0.0005;',
      '    float band1 = inT1 * (1.0 - smoothstep(hw - aaL, hw + aaL, abs(dT1 - OUT_INSET)));',
      '    float band2 = inT2 * (1.0 - smoothstep(hw - aaL, hw + aaL, abs(dT2 - OUT_INSET)));',
      '    float outline = max(band1, band2);',
      '    result = mix(result, uOutlineColor, outline * OUT_STRENGTH);',
      '  }',
      '  float mD = distance(vUv, uMouse);',
      '  float spot = exp(-mD * mD * 18.0) * uMouseStrength;',
      '  result += vec3(1.0, 1.0, 1.05) * spot * 0.45;',
      '  float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 6.0);',
      '  result *= 1.0 - rim * 0.12;',
      '  gl_FragColor = vec4(result, mask);',
      '}'
    ].join('\n');

    var mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      glslVersion: THREE.GLSL1
    });

    var flag = new THREE.Mesh(geo, mat);
    flag.rotation.y = -0.12;
    flag.rotation.z = 0.015;
    scene.add(flag);

    var mouseUV = new THREE.Vector2(0.5, 0.5);
    var HOVER_STRENGTH = 0.61;
    var targetStrength = 0;
    function onMove(e) {
      var rect = mount.getBoundingClientRect();
      mouseUV.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
    }
    function onEnter() { targetStrength = HOVER_STRENGTH; }
    function onLeave() { targetStrength = 0; }
    mount.addEventListener('mousemove', onMove);
    mount.addEventListener('mouseenter', onEnter);
    mount.addEventListener('mouseleave', onLeave);

    function onResize() {
      var w = mount.clientWidth || w0;
      var h = mount.clientHeight || h0;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    var ro = new ResizeObserver(onResize);
    ro.observe(mount);

    var clock = new THREE.Clock();
    function tick() {
      var dt = clock.getDelta();
      uniforms.uTime.value += dt;
      var cur = uniforms.uMouse.value;
      cur.x += (mouseUV.x - cur.x) * 0.12;
      cur.y += (mouseUV.y - cur.y) * 0.12;
      uniforms.uMouseStrength.value += (targetStrength - uniforms.uMouseStrength.value) * 0.08;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { renderer.render(scene, camera); clock.getDelta(); }
    });
  }
})();
