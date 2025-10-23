import { sampleCubic } from './geometry/bezier.js';

// Half outline on the +y side, tail (-L/2, 0) → nose (+L/2, 0)
// We'll pass through near (0, +W/2). Replace with your exact scheme later.
export function halfOutlineTop(m) {
  const L2 = m.L / 2;
  const W2 = m.W_max / 2;

  // Control points you’ll refine: tail→mid→nose on +y side
  // Segment 1: tail centerline (-L/2, 0) to mid max (0, W/2)
  const s1_p0 = { x: -L2, y: 0 };
  const s1_p1 = { x: -0.35 * L2, y: 0.35 * W2 }; // tweak to taste
  const s1_p2 = { x: -0.10 * L2, y: 0.85 * W2 };
  const s1_p3 = { x: 0,         y: W2 };

  // Segment 2: mid max (0, W/2) to nose centerline (+L/2, 0)
  const s2_p0 = s1_p3;
  const s2_p1 = { x:  0.10 * L2, y: 0.85 * W2 };
  const s2_p2 = { x:  0.35 * L2, y: 0.35 * W2 };
  const s2_p3 = { x:  L2,        y: 0 };

  const seg1 = sampleCubic(s1_p0, s1_p1, s1_p2, s1_p3, 120);
  const seg2 = sampleCubic(s2_p0, s2_p1, s2_p2, s2_p3, 120);

  // Concatenate, but avoid duplicating the join point
  const half = [...seg1, ...seg2.slice(1)];
  return half;
}

// Full closed outline: mirror +y half across x-axis to get −y side
export function fullOutlineTop(m) {
  const half = halfOutlineTop(m);           // tail→nose along +y
  const mirrored = half
    .slice(1, -1)                           // avoid duplicating endpoints
    .map(({x, y}) => ({ x, y: -y }))        // mirror over x-axis (y→−y)
    .reverse();                             // go back nose→tail along −y
  return [...half, ...mirrored, half[0]];   // close loop
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
