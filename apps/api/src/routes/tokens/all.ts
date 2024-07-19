import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_1_DAY } from 'src/helpers/constants';

export const get: Handler = async (_, res) => {
  try {
    const data = await goodPg.query(`
      SELECT *
      FROM "AllowedToken"
      ORDER BY priority DESC;
    `);

    logger.info('All tokens fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_1_DAY)
      .json({ success: true, tokens: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
