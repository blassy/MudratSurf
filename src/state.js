export const model = {
  units: "in",
  L: 196,
  W_max: 20,
  W_tail: 8,
  W_nose: 8,
  rocker_nose: 3,
  rocker_tail: 2,
  thickness_max: 2.5,
  section_pos: 0.5, // 0..1 along length
};

const listeners = new Set();
export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }
export function setPatch(patch){
  Object.assign(model, patch);
  for (const fn of listeners) fn(model);
}
