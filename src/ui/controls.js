import { setPatch } from '../state.js';

export function mountControls(el, model){
  el.innerHTML = `
    <label>Length (in)
      <input id="L" type="range" min="120" max="240" step="1" value="${model.L}">
      <span class="val" id="Lval">${model.L}</span>
    </label>
    <label>Max Width (in)
      <input id="Wmax" type="range" min="14" max="24" step="0.1" value="${model.W_max}">
      <span class="val" id="Wmaxval">${model.W_max}</span>
    </label>
    <label>Nose Width (in)
      <input id="Wnose" type="range" min="4" max="16" step="0.1" value="${model.W_nose}">
      <span class="val" id="Wnoseval">${model.W_nose}</span>
    </label>
    <label>Tail Width (in)
      <input id="Wtail" type="range" min="4" max="16" step="0.1" value="${model.W_tail}">
      <span class="val" id="Wtailval">${model.W_tail}</span>
    </label>
    <label>Rocker Nose (in)
      <input id="Rnose" type="range" min="0" max="6" step="0.1" value="${model.rocker_nose}">
      <span class="val" id="Rnoseval">${model.rocker_nose}</span>
    </label>
    <label>Rocker Tail (in)
      <input id="Rtail" type="range" min="0" max="6" step="0.1" value="${model.rocker_tail}">
      <span class="val" id="Rtailval">${model.rocker_tail}</span>
    </label>
  `;

  const bind = (id, key, spanId) => {
    const input = el.querySelector(`#${id}`);
    const span  = el.querySelector(`#${spanId}`);
    input.addEventListener('input', () => {
      const val = parseFloat(input.value);
      span.textContent = val;
      setPatch({ [key]: val });
    });
  };
  bind('L', 'L', 'Lval');
  bind('Wmax', 'W_max', 'Wmaxval');
  bind('Wnose', 'W_nose', 'Wnoseval');
  bind('Wtail', 'W_tail', 'Wtailval');
  bind('Rnose', 'rocker_nose', 'Rnoseval');
  bind('Rtail', 'rocker_tail', 'Rtailval');
}
