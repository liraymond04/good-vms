import type { Request, Response } from 'express';

import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

type StatusChangeRequest = {
    requestId: string;
    statusChange: string;
    };

// Request Schema
const validationSchema = object({
    requestId: string().uuid(),
    statusChange: string().regex(/^(SUBMITTED|INREVIEW|APPROVED|REJECTED)$/),
});

export const post = [
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { body } = req;
    console.log("start")

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { requestId, statusChange } = body as StatusChangeRequest;

    try {
      const identityToken = req.headers['x-identity-token'] as string;
      const payload = parseJwt(identityToken);
      console.log("attempt  to change status of request");

      const data = await goodPg.query(
        `
        UPDATE "Request"
        SET status = $2
        WHERE id = $1
        RETURNING id;
      `,
        [requestId, statusChange]
      );

      logger.info(`Changed request status to ${data[0]?.status}`);

      return res.status(200).json({ id: data[0]?.id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
