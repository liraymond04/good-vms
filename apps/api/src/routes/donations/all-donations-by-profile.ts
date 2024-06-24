import type { Handler } from 'express';
import prisma from '../../helpers/prisma';
import catchedError from '../../helpers/catchedError';
import { noBody } from '../../helpers/responses';
import logger from '@good/helpers/logger';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const donations = await prisma.causeDonation.findMany({
      where: {
        fromProfileId: id.toString()
      }
    });

    logger.info(`Fetched ${donations.length} donations for profile ${id}`);

    return res.status(200).json({ donations, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
