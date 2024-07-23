import type { Request, Response } from 'express';

import logger from '@good/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody } from 'src/helpers/responses';
import { number, object, string } from 'zod';

const validationSchema = object({
  organizationName: string(),
  donorProfileID: string(),
  donationAmount: number(),
  transactionURL: string(),
  projectURL: string(),
  volunteerHours: number(),
  evidenceURL: string(),
  description: string(),
});

export const post = [
  validateLensAccount,
  async (req: Request, res: Response) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  try {
    console.log("body:" + body);
    const data = await prisma.request.create({
      data: {
        organizationName: body.organizationName,
        donorProfileID: body.donorProfileID,
        donationAmount: body.donationAmount,
        transactionURL: body.transactionURL,
        projectURL: body.projectURL,
        volunteerHours: body.volunteerHours,
        evidenceURL: body.evidenceURL,
        description: body.description,
      },
      select: { createdAt: true, id: true}
    });

    logger.info(`Created a request ${data.id}`);

    return res.status(200).json({ request: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
}
];
