import { nanoid } from 'nanoid';

const generateShortId = (length?: number): string => {
  const idLength = length ?? 10;
  return nanoid(idLength);
};

export default generateShortId;
