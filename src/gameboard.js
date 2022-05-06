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

  const placeShip = (coordinates) => {
    if (!coordinates.length) return;
    ships.push({
      coordinates,
      ship: createShip(coordinates.length),
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

  const getHitShip = (position) =>
    ships.find((ship) => ship.coordinates.includes(position));

  const getIndexOfHitShip = (position) =>
    getHitShip(position).coordinates.findIndex((coordinate) =>
      coordinate === position);

  const receiveAttack = (position) => {
    if (!isValidAttack(position)) return;

    if (isHit(position)) {
      hits.push(position);

      // Attack ship
      const index = getIndexOfHitShip(position);
      const hitShip = getHitShip(position);
      hitShip.ship.hit(index);
    } else {
      misses.push(position);
    }
  };

  const isGameOver = () => ships.every((ship) => ship.ship.isSunk() === true);

  return {
    getShips,
    getHits,
    getMisses,
    placeShip,
    getIndexOfHitShip,
    receiveAttack,
    isGameOver,
  };
};

export { createGameboard };
