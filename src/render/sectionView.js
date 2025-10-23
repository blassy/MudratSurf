import { crossSectionAt } from '../selectors.js';
import { fitHiDPI, drawGrid, createTransform } from './canvasUtils.js';

export function renderSection(canvas, m){
  const { ctx, width, height } = fitHiDPI(canvas);
  ctx.clearRect(0,0,width,height);
  drawGrid(ctx, width, height, 25);

  const x = m.section_pos * m.L;
  const sec = crossSectionAt(m, x, 140);

  const yMax = Math.max(1, ...sec.map(p => Math.abs(p.y)));
  const zMax = Math.max(1, ...sec.map(p => Math.abs(p.z)));

  const domainX = { min: -yMax, max: yMax };           // lateral
  const domainY = { min: -0.2*zMax, max: 1.2*zMax };   // vertical
  const { toPx } = createTransform({ domainX, domainY, rangeW: width, rangeH: height, padding: 30 });

  ctx.beginPath();
  let q = toPx({ x: sec[0].y, y: sec[0].z });
  ctx.moveTo(q.x, q.y);
  for (let i=1;i<sec.length;i++){
    q = toPx({ x: sec[i].y, y: sec[i].z });
    ctx.lineTo(q.x, q.y);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#555';
  ctx.stroke();

  // centerline
  ctx.beginPath();
  q = toPx({x: 0, y: 0});
  ctx.moveTo(q.x, q.y);
  q = toPx({x: yMax, y: 0});
  ctx.lineTo(q.x, q.y);
  q = toPx({x: -yMax, y: 0});
  ctx.moveTo(q.x, q.y);
  q = toPx({x: 0, y: 0});
  ctx.lineTo(q.x, q.y); // ensures stroke
  ctx.lineWidth = 1;
  ctx.setLineDash([6,6]);
  ctx.strokeStyle = '#888';
  ctx.stroke();
  ctx.setLineDash([]);
}
