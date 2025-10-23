import { fullOutlineTop } from '../selectors.js';
import { fitHiDPI, drawGrid, createTransform } from './canvasUtils.js';

export function renderTop(canvas, m){
  const { ctx, width, height } = fitHiDPI(canvas);
  ctx.clearRect(0,0,width,height);

  drawGrid(ctx, width, height, 25);

  // ORIGIN-CENTERED DOMAINS
  const domainX = { min: -m.L/2, max:  m.L/2 };
  const domainY = { min: -m.W_max/2, max: m.W_max/2 };

  const edgePad = Math.floor(Math.min(width, height) * 0.08);
  const { toPx } = createTransform({
    domainX, domainY, rangeW: width, rangeH: height, padding: edgePad
  });

  // Draw outline
  const outline = fullOutlineTop(m);
  ctx.beginPath();
  let p = toPx(outline[0]);
  ctx.moveTo(p.x, p.y);
  for (let i=1;i<outline.length;i++){
    p = toPx(outline[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#333';
  ctx.stroke();

  // Axes: x=0 and y=0 (optional but recommended)
  ctx.save();
  ctx.setLineDash([6,6]);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;

  // y=0 (centerline from tail to nose)
  let a = toPx({ x: -m.L/2, y: 0 });
  let b = toPx({ x:  m.L/2, y: 0 });
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

  // x=0 (width axis)
  a = toPx({ x: 0, y: -m.W_max/2 });
  b = toPx({ x: 0, y:  m.W_max/2 });
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

  ctx.restore();

  // Landmarks (optional): tail, nose, max width points
  dot(ctx, toPx({ x: -m.L/2, y: 0 }), '#007acc'); // tail
  dot(ctx, toPx({ x:  m.L/2, y: 0 }), '#007acc'); // nose
  dot(ctx, toPx({ x:  0,      y:  m.W_max/2 }), '#cc5500');
  dot(ctx, toPx({ x:  0,      y: -m.W_max/2 }), '#cc5500');
}

function dot(ctx, p, color='#000'){
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}
