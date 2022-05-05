/* eslint-disable no-undef */
import { createGameboard } from '../gameboard';
import { createShip } from '../ship';

jest.mock('../ship');
createShip.mockImplementation((length) => `ship with length ${length}`);
let gameboard;
beforeEach(() => {
  gameboard = createGameboard();
});

describe('placing ships', () => {
  it('places 1 ship correctly', () => {
    gameboard.placeShips([0, 1, 2]);

    expect(createShip).toHaveBeenCalledWith(3);

    expect(gameboard.getShips()).toEqual([
      {
        coordinates: [0, 1, 2],
        ship: 'ship with length 3',
        isSunk: false,
      },
    ]);

    // expect(gameboard.getShips()[0]).toMatchObject({
    //   coordinates: [0, 1, 2],
    //   // ship: 'ship with length 3',
    //   isSunk: false,
    // });
  });

  it('places 2 ships correctly', () => {
    gameboard.placeShips([0, 1, 2]);
    gameboard.placeShips([10, 11, 12, 13, 14]);

    expect(createShip).toHaveBeenCalledWith(3);
    expect(createShip).toHaveBeenCalledWith(5);

    expect(gameboard.getShips()[0]).toEqual({
      coordinates: [0, 1, 2],
      ship: 'ship with length 3',
      isSunk: false,
    });

    expect(gameboard.getShips()[1]).toEqual({
      coordinates: [10, 11, 12, 13, 14],
      ship: 'ship with length 5',
      isSunk: false,
    });
  });

  describe('invalid arguments', () => {
    it('does not add ship if no coordinates provided', () => {
      gameboard.placeShips([]);

      expect(gameboard.getShips().length).toBe(0);
    });

    it('does not add ship if non-array provided', () => {
      gameboard.placeShips(3);

      expect(gameboard.getShips().length).toBe(0);
    });
  });
});

describe('receiving attack', () => {
  beforeEach(() => {
    gameboard.placeShips([0, 1, 2]);
  });

  it('adds a hit correctly', () => {
    gameboard.receiveAttack(0);

    expect(gameboard.getHits()).toEqual([0]);
    expect(gameboard.getMisses()).toEqual([]);
  });

  it('adds a miss correctly', () => {
    gameboard.receiveAttack(3);

    expect(gameboard.getHits()).toEqual([]);
    expect(gameboard.getMisses()).toEqual([3]);
  });

  it('returns if position is out of range', () => {
    gameboard.receiveAttack(100);

    expect(gameboard.getHits()).toEqual([]);
    expect(gameboard.getMisses()).toEqual([]);
  });

  it('adds hit/miss only once if same position attacked', () => {
    gameboard.receiveAttack(0);
    gameboard.receiveAttack(0);
    gameboard.receiveAttack(3);
    gameboard.receiveAttack(3);

    expect(gameboard.getHits()).toEqual([0]);
    expect(gameboard.getMisses()).toEqual([3]);
  });
});
