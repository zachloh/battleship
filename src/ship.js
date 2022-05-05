/* eslint-disable consistent-return */
const createShip = (length) => {
  // check for invalid arguments
  if (typeof length !== 'number' || length <= 0) return;

  const isHit = Array(length).fill(false);

  const hit = (index) => {
    if (index < 0 || index > length - 1) return;
    isHit[index] = true;
  };

  const getIsHit = () => isHit;

  const isSunk = () => isHit.every((item) => item === true);

  return { hit, getIsHit, isSunk };
};

export { createShip };
