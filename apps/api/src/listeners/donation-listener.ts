import { GoodDonation } from '@good/abis';
import { GOOD_DONATION } from '@good/data/constants';
import logger from '@good/helpers/logger';
import { z } from 'zod';

import prisma from '../helpers/prisma';
import { ListenerClient } from 'src/server';

const donationEventValidator = z.object({
  fromProfileId: z.bigint().transform((id) => id.toString(16)),
  toProfileId: z.bigint().transform((id) => id.toString(16)),
  publicationId: z.bigint().transform((id) => id.toString(16)),
  token: z.string(),
  from: z.string(),
  to: z.string(),
  amount: z.bigint()
});

interface MakeDonationInput extends z.infer<typeof donationEventValidator> {
  txHash: string;
}

async function makeDonation(input: MakeDonationInput) {
  const cause = await prisma.cause.findFirstOrThrow({
    where: {
      publicationId: input.publicationId,
      profileId: input.fromProfileId
    }
  });

  const data = await prisma.causeDonation.create({
    data: {
      amount: input.amount,
      causeId: cause.id,
      fromProfileId: input.fromProfileId,
      fromAddress: input.from,
      tokenAddress: input.token,
      txHash: input.txHash
    }
  });

  logger.info(`Created a donation ${data.id}`);
}

export default function listenDonations(client: ListenerClient) {
  client.watchContractEvent({
    abi: GoodDonation,
    address: GOOD_DONATION,
    eventName: 'DonationSent',
    onError(error) {
      logger.error('Failed to watch donation contract event', error);
    },
    onLogs: (logs) => {
      for (const event of logs) {
        const { args } = event;
        const input = donationEventValidator.safeParse(args);

        if (!input.success) {
          logger.error(`Failed to parse event: ${input.error}`);
          continue;
        }

        try {
          makeDonation({ ...input.data, txHash: event.transactionHash });
        } catch (error) {
          logger.error(`Failed to make donation: ${error}`);
        }
      }
    }
  });
}
