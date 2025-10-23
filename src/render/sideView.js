import { rockerCurve } from '../selectors.js';
import { fitHiDPI, drawGrid, createTransform } from './canvasUtils.js';

export function renderSide(canvas, m){
  const { ctx, width, height } = fitHiDPI(canvas);
  ctx.clearRect(0,0,width,height);
  drawGrid(ctx, width, height, 25);

  const yMin = -m.rocker_tail - 1;
  const yMax =  m.rocker_nose + 1;

  const domainX = { min: 0, max: m.L };
  const domainY = { min: yMin, max: yMax };
  const { toPx } = createTransform({ domainX, domainY, rangeW: width, rangeH: height, padding: 30 });

  const pts = rockerCurve(m, 240);
  ctx.beginPath();
  let p = toPx(pts[0]);
  ctx.moveTo(p.x, p.y);
  for (let i=1;i<pts.length;i++){
    p = toPx(pts[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#444';
  ctx.stroke();

  // baseline (y=0)
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
