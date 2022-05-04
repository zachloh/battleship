/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import { createShip } from '../ship';

describe('tests invalid arguments to createShip()', () => {
  it('throws if no argument provided', () => {
    expect(createShip()).toBeUndefined();
  });

  it('throws if called with length 0', () => {
    expect(createShip(0)).toBeUndefined();
  });

  it('throws if called with a negative number', () => {
    expect(createShip(-1)).toBeUndefined();
  });

  it('throws if called with a string', () => {
    expect(createShip('3')).toBeUndefined();
  });
});

describe('tests invalid arguments to hit()', () => {
  const ship = createShip(3);
  it('throws if the position is out of range', () => {
    expect(() => ship.hit(-1)).toThrow();
    expect(() => ship.hit(3)).toThrow();
    expect(() => ship.hit(4)).toThrow();
  });

  it('does not throw if valid index provided', () => {
    expect(() => ship.hit(0)).not.toThrow();
    expect(() => ship.hit(1)).not.toThrow();
    expect(() => ship.hit(2)).not.toThrow();
  });
});

describe('tests if a ship sinks (length of 3)', () => {
  let ship;
  beforeEach(() => {
    ship = createShip(3);
  });

  it('does not sink with no position hit', () => {
    expect(ship.isSunk()).toBe(false);
  });

  it('does not sink when only 1 position is hit', () => {
    ship.hit(2);

    expect(ship.isSunk()).toBe(false);
  });

  it('does not sink when only 2 positions are hit', () => {
    for (let i = 0; i < 2; i++) {
      ship.hit(i);
    }

    expect(ship.isSunk()).toBe(false);
  });

  it('sinks when all 3 positions are hit', () => {
    for (let i = 0; i < 3; i++) {
      ship.hit(i);
    }

    expect(ship.isSunk()).toBe(true);
  });
});
