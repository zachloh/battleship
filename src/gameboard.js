/* eslint-disable implicit-arrow-linebreak */
import { createShip } from './ship';

const createGameboard = () => {
  const GAMEBOARD_LENGTH = 10;
  const ships = [];
  const hits = [];
  const misses = [];

  const getShips = () => ships;
  const getHits = () => hits;
  const getMisses = () => misses;

  const placeShips = (coordinates) => {
    if (!coordinates.length) return;
    ships.push({
      coordinates,
      ship: createShip(coordinates.length),
      isSunk: false,
    });
  };

  const isValidAttack = (position) => {
    if (
      position >= GAMEBOARD_LENGTH ** 2
      || hits.includes(position)
      || misses.includes(position)
    ) {
      return false;
    }
    return true;
  };

  const isHit = (position) =>
    ships.some((ship) => ship.coordinates.includes(position));

  const receiveAttack = (position) => {
    if (!isValidAttack(position)) return;

    if (isHit(position)) {
      hits.push(position);

      // attack ship
      // check if sunk
    } else {
      misses.push(position);
    }
  };

  return {
    getShips,
    getHits,
    getMisses,
    placeShips,
    receiveAttack,
  };
};

export { createGameboard };
