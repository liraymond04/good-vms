import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import catchedError from '../../helpers/catchedError';
import { noBody } from '../../helpers/responses';
import prisma from '../../helpers/prisma';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const data = await prisma.causeDonation.findMany({
      where: {
        publicationId: id.toString()
      }
    });

    logger.info(`Lens: Fetched all donations on post for score for ${id}`);

    return res.status(200).json({ donations: data, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
