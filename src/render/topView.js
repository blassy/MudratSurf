import { fullOutlineTop, topBezierSegments } from '../selectors.js';
import { fitHiDPI, drawGrid, createTransform } from './canvasUtils.js';

export function renderTop(canvas, m){
  const { ctx, width, height } = fitHiDPI(canvas);
  ctx.clearRect(0,0,width,height);

  drawGrid(ctx, width, height, 25);

  // Domain centered at (0,0)
  const domainX = { min: -m.L/2, max:  m.L/2 };
  const domainY = { min: -m.W_max/2, max: m.W_max/2 };

  const pad = Math.floor(Math.min(width, height) * 0.08);
  const { toPx } = createTransform({
    domainX, domainY, rangeW: width, rangeH: height, padding: pad
  });

  // --- Outline ---
  const outline = fullOutlineTop(m);
  ctx.beginPath();
  let p = toPx(outline[0]);
  ctx.moveTo(p.x, p.y);
  for (let i=1; i<outline.length; i++){
    p = toPx(outline[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#333';
  ctx.stroke();

  // --- Axes (optional) ---
  ctx.save();
  ctx.setLineDash([6,6]);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;

  let a = toPx({ x: -m.L/2, y: 0 });
  let b = toPx({ x:  m.L/2, y: 0 });
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

  a = toPx({ x: 0, y: -m.W_max/2 });
  b = toPx({ x: 0, y:  m.W_max/2 });
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.restore();

  // --- Control-point visualization (P0..P3, handles), BOTH halves ---
  const segs = topBezierSegments(m);

  const drawSeg = (seg, ySign, segIdx) => {
    const P0 = { x: seg.p0.x, y: ySign * seg.p0.y };
    const P1 = { x: seg.p1.x, y: ySign * seg.p1.y };
    const P2 = { x: seg.p2.x, y: ySign * seg.p2.y };
    const P3 = { x: seg.p3.x, y: ySign * seg.p3.y };

    // dashed handle lines: P0–P1 and P2–P3
    ctx.save();
    ctx.setLineDash([5,4]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#999';
    line(ctx, toPx(P0), toPx(P1));
    line(ctx, toPx(P2), toPx(P3));
    ctx.restore();

    // draw points (bigger radius so they’re visible)
    dot(ctx, toPx(P0), 3.5, '#1064e8');   // anchors: blue
    dot(ctx, toPx(P3), 3.5, '#1064e8');
    dot(ctx, toPx(P1), 3.5, '#ea7a1a');   // handles: orange
    dot(ctx, toPx(P2), 3.5, '#ea7a1a');

    // small labels so you can confirm which is which
    label(ctx, toPx(P0), `S${segIdx}:P0`, -8, -6);
    label(ctx, toPx(P1), `S${segIdx}:P1`,  6, -6);
    label(ctx, toPx(P2), `S${segIdx}:P2`,  6, 14);
    label(ctx, toPx(P3), `S${segIdx}:P3`, -8, 14);
  };

  // +y half (your defined control points)
  segs.forEach((seg, i) => drawSeg(seg, +1, i));

  // −y mirrored half (so you see both sides)
  segs.forEach((seg, i) => drawSeg(seg, -1, i));
}

// tiny helpers
function dot(ctx, p, r=3, color='#000'){
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}
function line(ctx, a, b){
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}
function label(ctx, p, text, dx=6, dy=-6){
  ctx.save();
  ctx.font = '11px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, p.x + dx, p.y + dy);
  ctx.restore();
}
