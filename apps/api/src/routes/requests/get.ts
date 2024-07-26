import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import prisma from 'src/helpers/prisma';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const data = await prisma.request.findUnique({
      select: {
        createdAt: true,
        description: true,
        donationAmount: true,
        donorProfileID: true,
        evidenceURL: true,
        id: true,
        organizationName: true,
        projectURL: true,
        status: true,
        transactionURL: true,
        volunteerHours: true
      },
      where: { id: id as string }
    });

    if (!data) {
      return res
        .status(400)
        .json({ error: 'Request not found.', success: false });
    }

    logger.info('Request fetched');

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
