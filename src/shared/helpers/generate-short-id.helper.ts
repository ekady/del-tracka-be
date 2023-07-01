import { customAlphabet } from 'nanoid';

const generateShortId = (length = 10): string => {
  const customNanoId = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ',
    length,
  );
  return customNanoId();
};

export default generateShortId;
