/* eslint-disable no-param-reassign */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
const createElement = (elementType, className) => {
  const htmlElement = document.createElement(elementType);
  htmlElement.classList.add(className);
  return htmlElement;
};

const getFirstDigit = (number) => 
  parseInt((number.toString().substring(0, 1)), 10);

const getNumOfDigits = (number) => number.toString().length;

const getComputerShipsCoordinates = () => {
  const shipsCoordinates = [];
  const shipLengths = [5, 4, 3, 3, 2];
  const directions = ['horizontal', 'vertical'];

  const isValid = (coordinates, direction) => {
    if (coordinates[coordinates.length - 1] >= 100) return false;
    if (direction === 'horizontal') {
      if (getNumOfDigits(coordinates[0]) === 1) {
        if (getNumOfDigits(coordinates[coordinates.length - 1]) > 1) {
          return false;
        }
      } else if (getFirstDigit(coordinates[0])
          !== getFirstDigit(coordinates[coordinates.length - 1])) {
        return false;
      }
    }
    for (const shipCoordinates of shipsCoordinates) {
      for (const coordinate of shipCoordinates) {
        if (coordinates.includes(coordinate)) return false;
      }
    }
    return true;
  };

  shipLengths.forEach((length) => {
    let coordinates;
    const direction = directions[Math.floor(Math.random() * directions.length)];
    do {
      coordinates = [];
      let coordinate = Math.floor(Math.random() * 100);
      for (let i = 0; i < length; i++) {
        if (direction === 'horizontal') {
          coordinates.push(coordinate);
          coordinate++;
        } else {
          coordinates.push(coordinate);
          coordinate += 10;
        }
      }
    } while (!isValid(coordinates, direction));
    shipsCoordinates.push(coordinates);
  });
  return shipsCoordinates;
};

const getAdjacentAttacks = (hit) => {
  hit = Number(hit);

  const isValidLeft = (position) => {
    const invalidPositions = [-1, 9, 19, 29, 39, 49, 59, 69, 79, 89];
    if (invalidPositions.includes(position)) return false;
    return true;
  };

  const isValidRight = (position) => {
    const invalidPositions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    if (invalidPositions.includes(position)) return false;
    return true;
  };

  const isValidUp = (position) => {
    if (position < 0) return false;
    return true;
  };

  const isValidDown = (position) => {
    if (position >= 100) return false;
    return true;
  };

  const nextAttacks = [];
  const left = hit - 1;
  const right = hit + 1;
  const up = hit - 10;
  const down = hit + 10;

  if (isValidLeft(left)) nextAttacks.push(left);
  if (isValidRight(right)) nextAttacks.push(right);
  if (isValidUp(up)) nextAttacks.push(up);
  if (isValidDown(down)) nextAttacks.push(down);

  return nextAttacks;
};

const filterOutAttackedPositions = (nextAttacks, attackedPositions) =>   
  nextAttacks.filter((attack) => !attackedPositions.includes(attack));

const getNextAttacks = (lastHit, computerPlayer) => {
  let nextAttacks = getAdjacentAttacks(lastHit);
  nextAttacks = filterOutAttackedPositions(
    nextAttacks, 
    computerPlayer.getAttackedPositions(),
  );
  return nextAttacks;
};

export {
  createElement, 
  getFirstDigit, 
  getComputerShipsCoordinates, 
  getNextAttacks,
};
