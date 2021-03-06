const createPlayer = () => {
  const sendAttack = (position, gameboard) => {
    gameboard.receiveAttack(position);
  };

  return {
    sendAttack,
  };
};

const createComputerPlayer = () => {
  const attackedPositions = [];

  const getAttackedPositions = () => attackedPositions;

  const addAttackedPosition = (position) => {
    attackedPositions.push(position);
  };

  const getRandomPosition = () => {
    let position;
    do {
      position = Math.floor(Math.random() * 100);
    } while (attackedPositions.includes(position));
    attackedPositions.push(position);
    return position;
  };

  const sendAttack = (gameboard) => {
    if (attackedPositions.length >= 100) return;
    const position = getRandomPosition();
    gameboard.receiveAttack(position);
  };

  return {
    getAttackedPositions,
    addAttackedPosition,
    getRandomPosition,
    sendAttack,
  };
};

export { createPlayer, createComputerPlayer };
