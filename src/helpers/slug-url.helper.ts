import slugify from 'slugify';
import { nanoid } from 'nanoid';

export interface ISlugifyOptions {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
}
export interface ISlugUrlOptions {
  slugify?: ISlugifyOptions;
  length?: number;
}

const slugUrl = (value: string, options?: ISlugUrlOptions): string => {
  const slugifyOpt = options?.slugify ?? {};
  const length = options?.length ?? 10;

  const sluged = slugify(value, slugifyOpt);
  const crypto = nanoid(length);

  return `${sluged}-${crypto}`;
};

export default slugUrl;
