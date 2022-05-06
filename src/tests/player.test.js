/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import { createGameboard } from '../gameboard';
import { createPlayer, createComputerPlayer } from '../player';

jest.mock('../gameboard');
createGameboard.mockImplementation(() => {
  const receiveAttack = (position) => position;
  return { receiveAttack };
});

describe('player', () => {
  it('sends the attack position correctly', () => {
    const player = createPlayer();
    const opponentGameboard = createGameboard();
    const mockReceiveAttack = jest.spyOn(opponentGameboard, 'receiveAttack');
    player.sendAttack(0, opponentGameboard);
    expect(mockReceiveAttack).toHaveBeenCalledWith(0);
  });
});

describe('computer', () => {
  let computer;
  let opponentGameboard;
  beforeEach(() => {
    computer = createComputerPlayer();
    opponentGameboard = createGameboard();
  });

  it('sends the attack correctly', () => {
    const mockReceiveAttack = jest.spyOn(opponentGameboard, 'receiveAttack');
    computer.sendAttack(opponentGameboard);
    expect(mockReceiveAttack).toHaveBeenCalled();
  });

  it('does not attack the same position twice', () => {
    const choices = [];
    const benchmark = [];
    for (let i = 0; i < 100; i++) {
      choices.push(computer.getRandomPosition());
      benchmark.push(i);
    }
    choices.sort((a, b) => a - b);
    expect(choices).toEqual(benchmark);
  });

  it('does not attack if gameboard is filled', () => {
    const mockReceiveAttack = jest.spyOn(opponentGameboard, 'receiveAttack');
    for (let i = 0; i < 105; i++) {
      computer.sendAttack(opponentGameboard);
    }

    expect(mockReceiveAttack).toHaveBeenCalledTimes(100);
  });
});
