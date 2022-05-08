/* eslint-disable no-plusplus */
import { createElement } from './utilities';

const renderGameboard = (container) => {
  for (let i = 0; i < 100; i++) {
    const grid = createElement('div', 'grid');
    grid.setAttribute('data-id', i);
    container.appendChild(grid);
  }
};

const createButton = (container) => {
  const rotateBtn = createElement('button', 'rotate');
  rotateBtn.textContent = 'Rotate';
  container.appendChild(rotateBtn);
};

export { renderGameboard, createButton };
