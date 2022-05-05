/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import { createShip } from '../ship';

describe('tests invalid arguments to createShip()', () => {
  it('returns if no argument provided', () => {
    expect(createShip()).toBeUndefined();
  });

  it('returns if called with length 0', () => {
    expect(createShip(0)).toBeUndefined();
  });

  it('returns if called with a negative number', () => {
    expect(createShip(-1)).toBeUndefined();
  });

  it('returns if called with a string', () => {
    expect(createShip('3')).toBeUndefined();
  });
});

describe('tests hit()', () => {
  let ship;
  beforeEach(() => {
    ship = createShip(3);
  });

  it('hits the right position - 0', () => {
    ship.hit(0);
    expect(ship.getIsHit()).toEqual([true, false, false]);
  });

  it('hits the right position - 1', () => {
    ship.hit(1);
    expect(ship.getIsHit()).toEqual([false, true, false]);
  });

  it('hits the right position - 2', () => {
    ship.hit(2);
    expect(ship.getIsHit()).toEqual([false, false, true]);
  });

  it('does not hit if index < 0', () => {
    ship.hit(-1);
    expect(ship.getIsHit()).toEqual([false, false, false]);
  });

  it('does not hit if index is out of range', () => {
    ship.hit(3);
    expect(ship.getIsHit()).toEqual([false, false, false]);
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
