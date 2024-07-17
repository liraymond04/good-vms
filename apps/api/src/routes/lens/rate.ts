import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS } from 'src/helpers/constants';

export const get: Handler = async (req, res) => {
  try {
    const response = await axios.get('https://api.bcharity.net/lens/rate');

    const { result } = response.data;

    logger.info(
      'Lens: Fetched cryptocurrency conversion rates from bcharity.net'
    );
    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_MINS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
