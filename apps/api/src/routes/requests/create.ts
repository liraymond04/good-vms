import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { array, number, object, string } from 'zod';

const validationSchema = object({
  length: number(),
  options: array(string())
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  try {
    const data = await prisma.request.create({
      data: {
        
      },
      select: { createdAt: true, endsAt: true, id: true, options: true }
    });

    logger.info(`Created a request ${data.id}`);

    return res.status(200).json({ request: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
