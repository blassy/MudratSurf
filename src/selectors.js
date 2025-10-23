import { sampleCubic } from './geometry/bezier.js';

// Half outline on the +y side, tail (-L/2, 0) → nose (+L/2, 0)
// We'll pass through near (0, +W/2). Replace with your exact scheme later.
// --- Single source of truth: defines control points ---
export function topBezierSegments(m) {
  const L2 = m.L / 2;
  const W2 = m.W_max / 2;

  const s1 = {
    p0: { x: -L2,        y: 0 },
    p1: { x: -L2,        y: W2 },
    p2: { x: -0.9 * L2,  y: W2 },
    p3: { x: 0,          y: W2 }
  };

  const s2 = {
    p0: { x: 0,          y: W2 },
    p1: { x: 1 * L2,     y: W2 },
    p2: { x: L2,         y: 0.05 * W2 },
    p3: { x: L2,         y: 0 }
  };

  return [s1, s2];
}

// --- Outline generation: uses the segments above ---
export function halfOutlineTop(m) {
  const segs = topBezierSegments(m);
  const a = sampleCubic(segs[0].p0, segs[0].p1, segs[0].p2, segs[0].p3, 120);
  const b = sampleCubic(segs[1].p0, segs[1].p1, segs[1].p2, segs[1].p3, 120).slice(1);
  return [...a, ...b];
}

// Full closed outline: mirror +y half across x-axis to get −y side
export function fullOutlineTop(m){
  const half = halfOutlineTop(m);         // +y side, tail→nose
  const mirror = half.slice(1, -1).map(p => ({ x: p.x, y: -p.y })).reverse();
  return [...half, ...mirror];
}


// --- SIDE VIEW rocker curve ---
export function rockerCurve(m, n=200){
  const pts = [];
  for (let i=0;i<=n;i++){
    const x = (i/n)*m.L;
    const t = x/m.L;
    // smooth-ish transition nose↔tail rocker
    const y = (1-t)*(-m.rocker_tail) + t*(m.rocker_nose);
    pts.push({ x, y });
  }
  return pts;
}

// --- CROSS-SECTION ---
export function crossSectionAt(m, xPos, n=140){
  const half = sectionHalfWidth(m, xPos);
  const tMax = thicknessAt(m, xPos);
  const pts = [];
  for (let i=0;i<=n;i++){
    const s = (i/n)*2 - 1; // -1..1
    const y = s*half;
    const z = tMax * (1 - (y*y)/(half*half)); // simple ellipse
    pts.push({ y, z });
  }
  return pts;
}

// taper helpers (simple placeholders → replace with your own profiles)
function sectionHalfWidth(m, x){
  const t = x/m.L;
  // blend tail/nose with max width influence
  const wTN = (1-t)*m.W_tail + t*m.W_nose;
  return 0.5*Math.max(wTN, m.W_max*0.6);
}
function thicknessAt(m, x){
  const t = (x/m.L - 0.5);
  return Math.max(0, m.thickness_max*(1 - 1.2*t*t));
}
