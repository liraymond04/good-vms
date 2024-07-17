import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS, VERIFIED_FEATURE_ID } from 'src/helpers/constants';

export const get: Handler = async (_, res) => {
  try {
    const data = await goodPg.query(
      `
        SELECT "profileId"
        FROM "ProfileFeature"
        WHERE enabled = TRUE
        AND "featureId" = $1;
      `,
      [VERIFIED_FEATURE_ID]
    );

    const ids = data.map(({ profileId }) => profileId);
    logger.info('Verified profiles fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_MINS)
      .json({ result: ids, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
