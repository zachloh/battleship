/* eslint-disable no-undef */
import { createGameboard } from '../gameboard';
import { createShip } from '../ship';

jest.mock('../ship');
let gameboard;
beforeEach(() => {
  gameboard = createGameboard();
});

describe('placing ships', () => {
  beforeAll(() => {
    createShip.mockImplementation((length) => `ship with length ${length}`);
  });

  it('places 1 ship correctly', () => {
    gameboard.placeShip([0, 1, 2]);

    expect(createShip).toHaveBeenCalledWith(3);

    expect(gameboard.getShips()).toEqual([
      {
        coordinates: [0, 1, 2],
        ship: 'ship with length 3',
      },
    ]);
  });

  it('places 2 ships correctly', () => {
    gameboard.placeShip([0, 1, 2]);
    gameboard.placeShip([10, 11, 12, 13, 14]);

    expect(createShip).toHaveBeenCalledWith(3);
    expect(createShip).toHaveBeenCalledWith(5);

    expect(gameboard.getShips()[0]).toEqual({
      coordinates: [0, 1, 2],
      ship: 'ship with length 3',
    });

    expect(gameboard.getShips()[1]).toEqual({
      coordinates: [10, 11, 12, 13, 14],
      ship: 'ship with length 5',
    });
  });

  describe('invalid arguments', () => {
    it('does not add ship if no coordinates provided', () => {
      gameboard.placeShip([]);

      expect(gameboard.getShips().length).toBe(0);
    });

    it('does not add ship if non-array provided', () => {
      gameboard.placeShip(3);

      expect(gameboard.getShips().length).toBe(0);
    });
  });
});

describe('receiving attack', () => {
  beforeAll(() => {
    createShip.mockImplementation(() => {
      const hit = (index) => index;
      return { hit };
    });
  });

  beforeEach(() => {
    gameboard.placeShip([10, 11, 12]);
  });

  it('adds a hit correctly', () => {
    gameboard.receiveAttack(10);

    expect(gameboard.getHits()).toEqual([10]);
    expect(gameboard.getMisses()).toEqual([]);
  });

  it('adds a miss correctly', () => {
    gameboard.receiveAttack(13);

    expect(gameboard.getHits()).toEqual([]);
    expect(gameboard.getMisses()).toEqual([13]);
  });

  it('returns if position is out of range', () => {
    gameboard.receiveAttack(100);

    expect(gameboard.getHits()).toEqual([]);
    expect(gameboard.getMisses()).toEqual([]);
  });

  it('adds hit/miss only once if same position attacked', () => {
    gameboard.receiveAttack(10);
    gameboard.receiveAttack(10);
    gameboard.receiveAttack(13);
    gameboard.receiveAttack(13);

    expect(gameboard.getHits()).toEqual([10]);
    expect(gameboard.getMisses()).toEqual([13]);
  });

  describe('gets index of the hit ship correctly', () => {
    it('gets index 0 correctly', () => {
      gameboard.receiveAttack(10);
      expect(gameboard.getIndexOfHitShip(10)).toBe(0);
    });

    it('gets index 1 correctly', () => {
      gameboard.receiveAttack(11);
      expect(gameboard.getIndexOfHitShip(11)).toBe(1);
    });

    it('gets index 2 correctly', () => {
      gameboard.receiveAttack(12);
      expect(gameboard.getIndexOfHitShip(12)).toBe(2);
    });
  });
});

describe('checking if all ships have sunk', () => {
  it('reports correctly when all ships have sunk', () => {
    createShip.mockImplementation(() => {
      const isSunk = () => true;
      return { isSunk };
    });

    gameboard.placeShip([0, 1, 2]);
    gameboard.placeShip([10, 11, 12, 13, 14]);

    expect(gameboard.isGameOver()).toBe(true);
  });

  it('reports correctly when not all ships have sunk', () => {
    createShip.mockImplementationOnce(() => {
      const isSunk = () => true;
      return { isSunk };
    }).mockImplementationOnce(() => {
      const isSunk = () => false;
      return { isSunk };
    });

    gameboard.placeShip([0, 1, 2]);
    gameboard.placeShip([10, 11, 12, 13, 14]);

    expect(gameboard.isGameOver()).toBe(false);
  });
});
