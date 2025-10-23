export function cubicBezierPoint(t, p0, p1, p2, p3){
  const u = 1 - t;
  return {
    x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
  };
}

export function sampleCubic(p0, p1, p2, p3, n=120){
  const pts = [];
  for (let i=0;i<=n;i++){
    const t = i/n;
    pts.push(cubicBezierPoint(t, p0, p1, p2, p3));
  }
  return pts;
}
