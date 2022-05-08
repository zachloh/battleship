/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import { createGameboard } from './gameboard';
import { createPlayer, createComputerPlayer } from './player';
import { getNextAttacks } from './utilities';

const gameController = () => {
  let player1;
  let player2;
  let player1Gameboard;
  let player2Gameboard;
  let activePlayer;
  let activeOpponentGameboard;

  const placeShips = (shipsCoordinates, gameboard) => {
    shipsCoordinates.forEach((coordinates) => {
      gameboard.placeShip(coordinates);
    });
  };

  const setupGame = (player1Ships, player2Ships) => {
    player1 = createPlayer();
    player2 = createComputerPlayer();
    player1Gameboard = createGameboard();
    player2Gameboard = createGameboard();
    activePlayer = player1;
    activeOpponentGameboard = player2Gameboard;
    placeShips(player1Ships, player1Gameboard);
    placeShips(player2Ships, player2Gameboard);
  };

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    activeOpponentGameboard = activeOpponentGameboard === player2Gameboard
      ? player1Gameboard : player2Gameboard;
  };

  const playRound = (attackPosition) => {
    if (activePlayer === player1) {
      activePlayer.sendAttack(attackPosition, activeOpponentGameboard);
    } else {
      activePlayer.sendAttack(activeOpponentGameboard);
    }
    switchTurn();
  };

  const getGameboard1Hits = () => player1Gameboard.getHits();
  const getGameboard1Misses = () => player1Gameboard.getMisses();

  const getGameboard2Hits = () => player2Gameboard.getHits();
  const getGameboard2Misses = () => player2Gameboard.getMisses();

  const getSunkCoords = (gameboard) => {
    const sunkCoords = [];
    const ships = gameboard.getShips();
    ships.forEach((ship) => {
      if (ship.ship.isSunk()) {
        ship.coordinates.forEach((coordinate) => {
          sunkCoords.push(coordinate);
        });
      }
    });
    return sunkCoords;
  };

  const getGameboard1SunkCoords = () => getSunkCoords(player1Gameboard);
  const getGameboard2SunkCoords = () => getSunkCoords(player2Gameboard);

  const getHitButNotSunkCoords = () => {
    const hits = getGameboard1Hits();
    const sunkCoords = getGameboard1SunkCoords();
    if (hits.length) {
      return hits.filter((hit) => !sunkCoords.includes(hit));
    }
    return [];
  };

  const makeComputerChoice = () => {
    if (getHitButNotSunkCoords().length > 1) {
      attackSameDirection();
    } else if (getHitButNotSunkCoords().length === 1) {
      attackAdjacentGrid();
    } else {
      playRound();
    }
  };

  const attackSameDirection = () => {
    const attackedPositions = player2.getAttackedPositions();
    const hitButNotSunkCoords = getHitButNotSunkCoords().sort((a, b) => a - b);
    let nextAttack;

    // Attack left or right
    for (let i = 0; i < hitButNotSunkCoords.length - 1; i++) {
      const firstHit = hitButNotSunkCoords[i];
      const secondHit = hitButNotSunkCoords[i + 1];
      const diff = firstHit - secondHit;
      if (diff === -1
        && (secondHit % 10) !== 0) {
        nextAttack = secondHit + 1;
        if (attackedPositions.includes(nextAttack)
          || (nextAttack % 10) === 0) {
          nextAttack = firstHit - 1;
          if (attackedPositions.includes(nextAttack)
            || (nextAttack % 10) === 9
            || nextAttack < 0) {
            nextAttack = null;
          }
        }
        if (nextAttack) break;
      }
    }

    // Attack up or down
    if (!nextAttack) {
      for (let i = 0; i < hitButNotSunkCoords.length; i++) {
        const hit = hitButNotSunkCoords[i];
        nextAttack = hit + 10;
        if (attackedPositions.includes(nextAttack) || nextAttack >= 100) {
          nextAttack = hit - 10;
          if (attackedPositions.includes(nextAttack) || nextAttack < 0) {
            nextAttack = null;
          }
        }
        if (nextAttack) break;
      }
    }

    if (nextAttack) {
      sendComputerAttack(nextAttack);
    } else {
      attackAdjacentGrid();
    }
  };

  const attackAdjacentGrid = () => {
    const hitButNotSunkCoords = getHitButNotSunkCoords();
    for (let i = hitButNotSunkCoords.length - 1; i >= 0; i--) {
      const hitButNotSunkPosition = hitButNotSunkCoords[i];
      const nextAttacks = getNextAttacks(
        hitButNotSunkPosition,
        player2,
      );
      // eslint-disable-next-line no-continue
      if (!nextAttacks.length) continue;
      const nextAttack = nextAttacks.pop();
      sendComputerAttack(nextAttack);
      break;
    }
  };

  const sendComputerAttack = (position) => {
    player1Gameboard.receiveAttack(position);
    player2.addAttackedPosition(position);
    switchTurn();
  };

  const isGameOver = () => player1Gameboard.isGameOver()
    || player2Gameboard.isGameOver();

  const getWinner = () => {
    if (player1Gameboard.isGameOver()) return 'p2';
    if (player2Gameboard.isGameOver()) return 'p1';
    return 'no winner';
  };

  return {
    setupGame,
    playRound,
    getGameboard1Hits,
    getGameboard1Misses,
    getGameboard2Hits,
    getGameboard2Misses,
    getGameboard1SunkCoords,
    getGameboard2SunkCoords,
    makeComputerChoice,
    isGameOver,
    getWinner,
  };
};

export { gameController };
