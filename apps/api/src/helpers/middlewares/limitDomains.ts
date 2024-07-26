import type { NextFunction, Request, Response } from 'express';

import { Errors } from '@good/data';
import logger from '@good/helpers/logger';

import catchedError from '../catchedError';

const allowedDomains = [
  'https://hey.xyz',
  'https://testnet.hey.xyz',
  'https://staging.hey.xyz',
  'https://good-vms-web.vercel.app',
  'http://localhost:4783'
];

const pathsToSkip = ['/health', '/meta', '/sitemap'];

const limitDomains = (req: Request, res: Response, next: NextFunction) => {
  if (pathsToSkip.some((path) => req.path.startsWith(path))) {
    return next();
  }

  const origin = (req.headers.origin || req.headers.referer || '').replace(
    /\/$/,
    ''
  );

  if (!origin || !allowedDomains.includes(origin)) {
    logger.error(`Origin not allowed - ${origin}`);
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }

  next();
};

export default limitDomains;
