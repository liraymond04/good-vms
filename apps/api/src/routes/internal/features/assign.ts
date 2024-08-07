import type { Request, Response } from 'express';

import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody } from 'src/helpers/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
  id: string;
  profile_id: string;
};

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  profile_id: string()
});

export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { enabled, id, profile_id } = body as ExtensionRequest;

    try {
      if (enabled) {
        await goodPg.query(
          `
          INSERT INTO "ProfileFeature" ("featureId", "profileId")
          VALUES ($1, $2)
          ON CONFLICT ("profileId", "featureId") DO NOTHING;
        `,
          [id, profile_id]
        );

        logger.info(`Enabled features for ${profile_id}`);

        return res.status(200).json({ enabled, success: true });
      }

      await goodPg.query(
        `
        DELETE FROM "ProfileFeature"
        WHERE "profileId" = $1 AND "featureId" = $2
      `,
        [profile_id, id]
      );

      logger.info(`Disabled features for ${profile_id}`);

      return res.status(200).json({ enabled, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
