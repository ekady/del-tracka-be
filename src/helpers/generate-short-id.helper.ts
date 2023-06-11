import { customAlphabet } from 'nanoid';

const generateShortId = (length?: number): string => {
  const idLength = length ?? 10;
  const customNanoId = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ',
    idLength,
  );
  return customNanoId();
};

export default generateShortId;
