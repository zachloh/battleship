const createShip = (length) => {
  // check for invalid arguments
  if (typeof length !== 'number') {
    throw new Error('createShip only accepts number types');
  }
  if (!length || length < 0) {
    throw new Error('createShip only accepts a positive number');
  }

  const isHit = Array(length).fill(false);

  const hit = (index) => {
    if (index > length - 1) throw new Error('index provided is out of range');
    isHit[index] = true;
  };

  const isSunk = () => isHit.every((item) => item === true);

  return { hit, isSunk };
};

export { createShip };
