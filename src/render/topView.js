import { sampleTopOutline } from '../selectors.js';
import { fitHiDPI, drawGrid, createTransform } from './canvasUtils.js';

export function renderTop(canvas, m){
  const { ctx, width, height } = fitHiDPI(canvas);
  ctx.clearRect(0,0,width,height);
  drawGrid(ctx, width, height, 25);

  // Design space: x in [0..L], y in [-Wmax/2 .. +Wmax/2]
  const domainX = { min: 0, max: m.L };
  const domainY = { min: -0.5*m.W_max, max: 0.5*m.W_max };
  const { toPx } = createTransform({ domainX, domainY, rangeW: width, rangeH: height, padding: 30 });

  const outline = sampleTopOutline(m);
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

  // centerline
  ctx.beginPath();
  p = toPx({x: 0, y: 0});
  ctx.moveTo(p.x, p.y);
  p = toPx({x: m.L, y: 0});
  ctx.lineTo(p.x, p.y);
  ctx.lineWidth = 1;
  ctx.setLineDash([6,6]);
  ctx.strokeStyle = '#888';
  ctx.stroke();
  ctx.setLineDash([]);
}
