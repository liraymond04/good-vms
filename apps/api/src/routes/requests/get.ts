import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
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
        id: true,
        organizationName: true,
        donorProfileID: true,
        donationAmount: true,
        transactionURL: true,
        projectURL: true,
        volunteerHours: true,
        evidenceURL: true,
        description: true,
        createdAt: true,
        status: true
      },
      where: { id: id as string }
    });

    if (!data) {
      return res.status(400).json({ error: 'Request not found.', success: false });
    }

    logger.info('Request fetched');

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
