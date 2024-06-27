import { GoodDonation } from '@good/abis';
import { GOOD_DONATION, IS_MAINNET } from '@good/data/constants';
import logger from '@good/helpers/logger';
import { createPublicClient, webSocket } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import { z } from 'zod';

import prisma from '../helpers/prisma';

interface CauseCreateInput {
  publicationId: string;
  profileId: string;
  profileOwner: string;
}

const donationEventValidator = z.object({
  publicationId: z.bigint().transform((id) => id.toString(16)),
  profileId: z.bigint().transform((id) => id.toString(16)),
  profileOwner: z.string(),
});

async function makeCause(input: CauseCreateInput) {
  const prismaInput = {
    profileAddress: input.profileOwner,
    publicationId: input.publicationId,
    profileId: input.profileId
  }
  const data = await prisma.cause.create({ data: prismaInput});

  logger.info(`Created a cause ${data.id}`);
}

export default function listenCauses() {
  const publicClient = createPublicClient({
    chain: IS_MAINNET ? polygon : polygonAmoy,
    transport: webSocket('wss://polygon-amoy-bor-rpc.publicnode.com')
  });

  publicClient.watchContractEvent({
    abi: GoodDonation,
    address: GOOD_DONATION,
    eventName: 'CauseCreated',
    onError(error) {
      logger.error('Failed to watch create cause contract event', error);
    },
    onLogs: (logs) => {
      for (const event of logs) {
        const { args } = event;
        console.log(args)
        const input = donationEventValidator.safeParse(args);

        if (!input.success) {
          logger.error(`Failed to parse event: ${input.error}`);
          continue;
        }

        try {
          makeCause(input.data);
        } catch (error) {
          logger.error(`Failed to make cause: ${error}`);
        }
      }
    }
  });
}
