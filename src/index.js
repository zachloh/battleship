import './style.css';
import { renderGameboard, createButton } from './renderGameboard';
import { addPlaceShipsEvent } from './DOM';

// render gameboards
const gameboardContainers = document.querySelectorAll('.gameboard');
gameboardContainers.forEach((container) => {
  renderGameboard(container);
});

// render rotate button
const playerGameboardContainer = document.querySelector('.gameboard.player');
createButton(playerGameboardContainer);

addPlaceShipsEvent();
