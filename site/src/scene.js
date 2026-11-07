import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute,
  ShaderMaterial, Points, AdditiveBlending, Color, Vector2
} from 'three';

/* Morphing particle field — one draw call, five shapes blended on the GPU. */
const SHAPES = 5;

function rand(a, b) { return a + Math.random() * (b - a); }

function buildShapes(N) {
  const s = Array.from({ length: SHAPES }, () => new Float32Array(N * 3));
  const rnd = new Float32Array(N * 3);
  const gold = Math.PI * (3 - Math.sqrt(5));
  const cols = Math.ceil(Math.sqrt(N * 2.6));
  const rows = Math.ceil(N / cols);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    rnd[i3] = Math.random(); rnd[i3 + 1] = Math.random(); rnd[i3 + 2] = Math.random();

    // 0 — logo swirl galaxy (3 arms)
    const arm = i % 3;
    const t = Math.pow(Math.random(), 0.7);
    const r = 0.25 + t * 5.2;
    const ang = arm * (Math.PI * 2 / 3) + r * 1.15 + rand(-0.35, 0.35) * (1.2 - t);
    const spread = (1 - t) * 0.5 + 0.12;
    s[0][i3] = Math.cos(ang) * r + rand(-spread, spread);
    s[0][i3 + 1] = rand(-spread, spread) * 0.55;
    s[0][i3 + 2] = Math.sin(ang) * r + rand(-spread, spread);

    // 1 — noisy nebula (the "chaos" of a business with no system)
    const u = Math.random() * Math.PI * 2, v = Math.acos(rand(-1, 1));
    const rr = Math.cbrt(Math.random()) * 7.5;
    s[1][i3] = Math.sin(v) * Math.cos(u) * rr * 1.5;
    s[1][i3 + 1] = Math.sin(v) * Math.sin(u) * rr * 0.8;
    s[1][i3 + 2] = Math.cos(v) * rr - 2;

    // 2 — globe network (Fibonacci sphere)
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = gold * i;
    const R = 3.4 + (Math.random() < 0.12 ? rand(0.2, 1.4) : 0);
    s[2][i3] = Math.cos(th) * rad * R;
    s[2][i3 + 1] = y * R;
    s[2][i3 + 2] = Math.sin(th) * rad * R;

    // 3 — flowing wave sheet
    const cx = i % cols, cy = Math.floor(i / cols);
    s[3][i3] = (cx / cols - 0.5) * 22;
    s[3][i3 + 1] = -1.4;
    s[3][i3 + 2] = (cy / rows - 0.5) * 10 - 1;

    // 4 — torus ring (orbit / portal)
    const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI * 2;
    const tube = 0.35 + Math.random() * 0.5;
    s[4][i3] = (3.8 + tube * Math.cos(b)) * Math.cos(a);
    s[4][i3 + 1] = tube * Math.sin(b) * 0.8;
    s[4][i3 + 2] = (3.8 + tube * Math.cos(b)) * Math.sin(a);
  }
  return { s, rnd };
}

const vert = /* glsl */`
  attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec3 aP4; attribute vec3 aRnd;
  uniform float uTime; uniform float uW[5]; uniform float uSize; uniform float uPR; uniform vec2 uMouse; uniform float uVel;
  varying float vMix; varying float vAlpha;
  mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
  void main(){
    vec3 p0 = position;
    p0.xz = rot(uTime*0.06 + aRnd.x*0.02) * p0.xz;
    vec3 p1 = aP1 + vec3(sin(uTime*.3+aRnd.y*6.28), cos(uTime*.25+aRnd.z*6.28), sin(uTime*.2+aRnd.x*6.28))*0.35;
    vec3 p2 = aP2; p2.xz = rot(uTime*0.12) * p2.xz;
    vec3 p3 = aP3; p3.y += sin(p3.x*0.55 + uTime*1.1)*0.7 + cos(p3.z*0.8 + uTime*0.8)*0.45;
    vec3 p4 = aP4; p4.xz = rot(-uTime*0.1) * p4.xz;
    vec3 pos = p0*uW[0] + p1*uW[1] + p2*uW[2] + p3*uW[3] + p4*uW[4];
    // living drift
    pos += vec3(sin(uTime*0.7+aRnd.x*40.), cos(uTime*0.6+aRnd.y*40.), sin(uTime*0.5+aRnd.z*40.)) * 0.04;
    pos.xy += uMouse * (0.25 + aRnd.z*0.35);
    vec4 mv = modelViewMatrix * vec4(pos,1.0);
    gl_Position = projectionMatrix * mv;
    float sz = uSize * (0.35 + aRnd.y*1.15) * (1.0 + uVel*0.6);
    gl_PointSize = sz * uPR * (10.0 / -mv.z);
    vMix = aRnd.x;
    vAlpha = 0.35 + aRnd.z*0.65;
  }`;

const frag = /* glsl */`
  uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform float uFade;
  varying float vMix; varying float vAlpha;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if(d>0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.6);
    vec3 col = vMix < 0.5 ? mix(uC1, uC2, vMix*2.0) : mix(uC2, uC3, (vMix-0.5)*2.0);
    gl_FragColor = vec4(col * (1.0 + a*0.6), a * vAlpha * uFade);
  }`;

export function createScene(canvas) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const lowPower = (navigator.hardwareConcurrency || 4) <= 4;
  const N = isMobile ? 9000 : lowPower ? 16000 : 26000;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  const PR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);
  renderer.setPixelRatio(PR);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 2.2, 10);
  camera.lookAt(0, 0, 0);

  const { s, rnd } = buildShapes(N);
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(s[0], 3));
  geo.setAttribute('aP1', new BufferAttribute(s[1], 3));
  geo.setAttribute('aP2', new BufferAttribute(s[2], 3));
  geo.setAttribute('aP3', new BufferAttribute(s[3], 3));
  geo.setAttribute('aP4', new BufferAttribute(s[4], 3));
  geo.setAttribute('aRnd', new BufferAttribute(rnd, 3));

  const uniforms = {
    uTime: { value: 0 }, uW: { value: [1, 0, 0, 0, 0] }, uSize: { value: isMobile ? 3.2 : 2.8 }, uPR: { value: PR },
    uMouse: { value: new Vector2() }, uVel: { value: 0 }, uFade: { value: 0 },
    uC1: { value: new Color('#2563EB') }, uC2: { value: new Color('#06B6D4') }, uC3: { value: new Color('#22D3EE') }
  };
  const mat = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const points = new Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  // targets the page drives
  const state = { shape: 0, offsetX: 0, offsetY: 0, tilt: 0.35, mouse: new Vector2(), vel: 0, fade: 1 };
  const cur = { w: [1, 0, 0, 0, 0], ox: state.offsetX, oy: 0, tilt: state.tilt, mouse: new Vector2(), vel: 0 };

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 70 : 55;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let running = true, last = performance.now(), t = 0;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(loop); }
  });

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
    const k = 1 - Math.pow(0.04, dt); // smooth follow
    for (let i = 0; i < SHAPES; i++) cur.w[i] += ((i === state.shape ? 1 : 0) - cur.w[i]) * k * 0.9;
    cur.ox += (state.offsetX - cur.ox) * k;
    cur.oy += (state.offsetY - cur.oy) * k;
    cur.tilt += (state.tilt - cur.tilt) * k;
    cur.mouse.lerp(state.mouse, k * 0.8);
    cur.vel += (state.vel - cur.vel) * k;
    uniforms.uTime.value = t;
    uniforms.uW.value = cur.w;
    uniforms.uMouse.value.copy(cur.mouse);
    uniforms.uVel.value = cur.vel;
    uniforms.uFade.value += (state.fade - uniforms.uFade.value) * k * 0.6;
    points.position.set(cur.ox, cur.oy, 0);
    points.rotation.x = cur.tilt;
    points.rotation.z = cur.mouse.x * 0.05;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    setShape(i, opts = {}) {
      state.shape = i;
      if (opts.offsetX !== undefined) state.offsetX = isMobile ? 0 : opts.offsetX;
      if (opts.offsetY !== undefined) state.offsetY = opts.offsetY;
      if (opts.tilt !== undefined) state.tilt = opts.tilt;
      if (opts.fade !== undefined) state.fade = opts.fade;
    },
    setMouse(x, y) { state.mouse.set(x, y); },
    setVelocity(v) { state.vel = Math.min(Math.abs(v) / 2500, 1.2); },
    isMobile
  };
}
