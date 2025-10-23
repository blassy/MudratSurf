import { sampleCubic } from './geometry/bezier.js';

// --- TOP VIEW outline control points (quarter outline to midline) ---
export function outlineQuarterTop(m){
  // You’ll substitute your exact Bezier scheme later.
  // This one: tail→mid on one side, then we mirror in the renderer.
  const p0 = { x: 0,       y: 0.5*m.W_tail };
  const p1 = { x: 0.12*m.L, y: 0.5*m.W_tail + 0.25*(m.W_max - m.W_tail) };
  const p2 = { x: 0.40*m.L, y: 0.5*m.W_max };
  const p3 = { x: 0.50*m.L, y: 0.5*m.W_max };
  return { p0,p1,p2,p3 };
}

export function sampleTopOutline(m){
  const { p0,p1,p2,p3 } = outlineQuarterTop(m);
  const right = sampleCubic(p0,p1,p2,p3,160);       // tail→mid (right side)
  const left  = right.map(pt => ({ x: pt.x, y: -pt.y })).reverse();
  return [...left, ...right]; // full outline across centerline
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
