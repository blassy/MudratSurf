export function fitHiDPI(canvas){
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

export function drawGrid(ctx, w, h, step=25){
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#E8E8E8';
  for (let x = 0; x <= w; x += step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y = 0; y <= h; y += step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  ctx.restore();
}

export function createTransform({domainX, domainY, rangeW, rangeH, padding=20}){
  const sx = (rangeW - 2*padding) / (domainX.max - domainX.min || 1);
  const sy = (rangeH - 2*padding) / (domainY.max - domainY.min || 1);
  const ox = padding - domainX.min*sx;
  const oy = padding - domainY.min*sy;
  // y-up design → y-down canvas
  return {
    toPx: ({x,y}) => ({ x: ox + x*sx, y: rangeH - (oy + y*sy) }),
  };
}
