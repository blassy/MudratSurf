import { model, subscribe, setPatch } from './state.js';
import { renderTop } from './render/topView.js';
import { renderSide } from './render/sideView.js';
import { renderSection } from './render/sectionView.js';
import { mountControls } from './ui/controls.js';

const cvsTop  = document.getElementById('topView');
const cvsSide = document.getElementById('sideView');
const cvsSect = document.getElementById('sectView');
const controls = document.getElementById('controls');

mountControls(controls, model);

function renderAll(){
  renderTop(cvsTop, model);
  renderSide(cvsSide, model);
  renderSection(cvsSect, model);
}
renderAll();
subscribe(renderAll);

window.addEventListener('resize', renderAll);

// Cross-section slider
const sectionSlider = document.getElementById('sectionPos');
const sectionLabel  = document.getElementById('sectionLabel');
sectionSlider.addEventListener('input', () => {
  const p = +sectionSlider.value / 100;
  sectionLabel.textContent = `(${Math.round(p*100)}%)`;
  setPatch({ section_pos: p });
});
