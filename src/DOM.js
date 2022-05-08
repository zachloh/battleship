/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import { getFirstDigit, getComputerShipsCoordinates } from './utilities';
import { gameController } from './game';

const playerGameboard = document.querySelector('.gameboard.player');
const computerGameboard = document.querySelector('.gameboard.computer');
const gameMessage = document.querySelector('.game-message');
const shipsLength = [5, 4, 3, 3, 2];
let shipsLengthIndex = 0;
let shipDirection = 'horizontal';
const green = '#00ff0055';
const red = '#ff000055';
const playerShipsCoordinates = [];
const computerShipsCoordinates = getComputerShipsCoordinates();
const game = gameController();

const hasEnoughSpace = (element) => {
  if (shipDirection === 'horizontal') {
    return ((element.dataset.id % 10)
      <= 10 - shipsLength[shipsLengthIndex]);
  }
  return (Number(element.dataset.id)
    + (10 * (shipsLength[shipsLengthIndex] - 1)))
    < 100;
};

const hasShipPlaced = (element) => {
  if (shipDirection === 'horizontal') {
    let currentElement = element;
    for (let i = 0; i < shipsLength[shipsLengthIndex]; i++) {
      if (currentElement.classList.contains('ship')) return true;
      currentElement = currentElement.nextElementSibling;
    }
  } else {
    let currentElement = element;
    let currentIndex = Number(currentElement.dataset.id);
    for (let i = 0; i < shipsLength[shipsLengthIndex]; i++) {
      if (currentElement.classList.contains('ship')) return true;
      currentElement = document.querySelector(`.grid[data-id="${currentIndex + 10}"]`);
      currentIndex += 10;
    }
  }
  return false;
};

const isValidPlacement = (element) => {
  if (!hasEnoughSpace(element)) return false;
  if (hasShipPlaced(element)) return false;
  return true;
};

const setGridBGColor = (element, color, iterations) => {
  if (shipDirection === 'horizontal') {
    let currentElement = element;
    for (let i = 0; i < iterations; i++) {
      currentElement.style.backgroundColor = color;
      currentElement = currentElement.nextElementSibling;
    }
  } else {
    let currentElement = element;
    let currentIndex = Number(currentElement.dataset.id);
    for (let i = 0; i < iterations; i++) {
      if (currentElement) currentElement.style.backgroundColor = color;
      currentElement = document.querySelector(`.grid[data-id="${currentIndex + 10}"]`);
      currentIndex += 10;
    }
  }
};

const placeShip = (element) => {
  const coordinates = [];
  if (shipDirection === 'horizontal') {
    let currentElement = element;
    for (let i = 0; i < shipsLength[shipsLengthIndex]; i++) {
      coordinates.push(Number(currentElement.dataset.id));
      currentElement.classList.add('ship');
      currentElement.removeAttribute('style');
      currentElement = currentElement.nextElementSibling;
    }
  } else {
    let currentElement = element;
    let currentIndex = Number(currentElement.dataset.id);
    for (let i = 0; i < shipsLength[shipsLengthIndex]; i++) {
      coordinates.push(Number(currentElement.dataset.id));
      currentElement.classList.add('ship');
      currentElement.removeAttribute('style');
      currentElement = document.querySelector(`.grid[data-id="${currentIndex + 10}"]`);
      currentIndex += 10;
    }
  }
  playerShipsCoordinates.push(coordinates);
  shipsLengthIndex++;
};

const indicateShipPlacement = (e) => {
  if (e.type === 'mouseover') {
    if (isValidPlacement(e.target)) {
      e.target.style.cursor = 'pointer';
      setGridBGColor(e.target, green, shipsLength[shipsLengthIndex]);
    } else if (!hasEnoughSpace(e.target)) {
      e.target.style.cursor = 'not-allowed';
      const invalidSpaces = (shipDirection === 'horizontal')
        ? 10 - (e.target.dataset.id % 10)
        : 10 - (getFirstDigit(e.target.dataset.id));
      setGridBGColor(e.target, red, invalidSpaces);
    } else if (hasShipPlaced(e.target)) {
      e.target.style.cursor = 'not-allowed';
      setGridBGColor(e.target, red, shipsLength[shipsLengthIndex]);
    }
  } else if (e.type === 'mouseout') {
    if (!hasEnoughSpace(e.target)) {
      const invalidSpaces = (shipDirection === 'horizontal')
        ? 10 - (e.target.dataset.id % 10)
        : 10 - (getFirstDigit(e.target.dataset.id));
      setGridBGColor(e.target, '', invalidSpaces);
    } else {
      setGridBGColor(e.target, '', shipsLength[shipsLengthIndex]);
    }
  }
};

const lockShipPlacement = (e) => {
  if (isValidPlacement(e.target)) {
    placeShip(e.target);
  }
  if (shipsLengthIndex > shipsLength.length - 1) {
    shipsLengthIndex = 0;
    startGame();
    gameMessage.textContent = 'LET THE BATTLE BEGIN!';
  }
};

const addPlaceShipsEvent = () => {
  const grids = playerGameboard.querySelectorAll('.grid');
  grids.forEach((grid) => {
    grid.addEventListener('mouseover', indicateShipPlacement);
    grid.addEventListener('mouseout', indicateShipPlacement);
    grid.addEventListener('click', lockShipPlacement);
  });
  const rotateBtn = document.querySelector('.rotate');
  rotateBtn.addEventListener('click', () => {
    shipDirection = (shipDirection === 'horizontal')
      ? 'vertical'
      : 'horizontal';
  });
};

const removePlaceShipsEvent = () => {
  const grids = playerGameboard.querySelectorAll('.grid');
  grids.forEach((grid) => {
    grid.style.cursor = 'default';
    grid.removeEventListener('mouseover', indicateShipPlacement);
    grid.removeEventListener('mouseout', indicateShipPlacement);
    grid.removeEventListener('click', lockShipPlacement);
  });
  const rotateBtn = document.querySelector('.rotate');
  rotateBtn.parentElement.removeChild(rotateBtn);
};

const startGame = () => {
  removePlaceShipsEvent();
  game.setupGame(playerShipsCoordinates, computerShipsCoordinates);
  addSendAttackEvent();
};

const sendAttack = (e) => {
  const attackIndex = Number(e.target.dataset.id);
  game.playRound(attackIndex);
  renderAttacks(
    computerGameboard,
    game.getGameboard2Hits(),
    game.getGameboard2Misses(),
    game.getGameboard2SunkCoords(),
  );
  checkForWinner();
  if (game.isGameOver()) return;

  // Computer's turn
  game.makeComputerChoice();
  renderAttacks(
    playerGameboard,
    game.getGameboard1Hits(),
    game.getGameboard1Misses(),
    game.getGameboard1SunkCoords(),
  );
  checkForWinner();
};

const renderAttacks = (gameboard, hits, misses, sunkCoords) => {
  const grids = gameboard.querySelectorAll('.grid');
  grids.forEach((grid) => {
    const index = Number(grid.dataset.id);
    if (hits.includes(index)) {
      grid.classList.add('hit');
      grid.classList.remove('pointer');
      grid.removeEventListener('click', sendAttack);
    }
    if (misses.includes(index)) {
      grid.classList.add('miss');
      grid.classList.remove('pointer');
      grid.removeEventListener('click', sendAttack);
    }
    if (sunkCoords.includes(index)) {
      grid.classList.add('sunk');
    }
  });
};

const checkForWinner = () => {
  if (game.isGameOver()) {
    if (game.getWinner() === 'p1') {
      gameMessage.textContent = 'GAME OVER! YOU WIN!';
    } else {
      gameMessage.textContent = 'GAME OVER! YOU LOSE!';
    }
    removeSendAttackEvent();
  }
};

const addSendAttackEvent = () => {
  const grids = computerGameboard.querySelectorAll('.grid');
  grids.forEach((grid) => {
    grid.addEventListener('click', sendAttack);
    grid.classList.add('pointer');
  });
};

const removeSendAttackEvent = () => {
  const grids = computerGameboard.querySelectorAll('.grid');
  grids.forEach((grid) => {
    grid.removeEventListener('click', sendAttack);
    grid.classList.remove('pointer');
  });
};

export { addPlaceShipsEvent };
