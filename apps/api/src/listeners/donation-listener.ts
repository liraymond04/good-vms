import { GoodDonation } from '@good/abis';
import { GOOD_DONATION, IS_MAINNET } from '@good/data/constants';
import logger from '@good/helpers/logger';
import { createPublicClient, webSocket } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import { z } from 'zod';

import prisma from '../helpers/prisma';

interface DonationCreateInput {
  amount: number;
  fromAddress: string;
  fromProfileId: string;
  publicationId: string;
  toAddress: string;
  tokenAddress: string;
  toProfileId: string;
  txHash: string;
}

const donationEventValidator = z.object({
  amount: z.bigint().transform((amount) => Number(amount)),
  fromAddress: z.string(),
  fromProfileId: z.bigint().transform((id) => id.toString(16)),
  publicationId: z.bigint().transform((id) => id.toString(16)),
  toAddress: z.string(),
  tokenAddress: z.string(),
  toProfileId: z.bigint().transform((id) => id.toString(16)),
  txHash: z.string()
});

async function makeDonation(input: DonationCreateInput) {
  const cause = await prisma.cause.findFirstOrThrow({
    where: { publicationId: input.publicationId }
  });

  const data = await prisma.causeDonation.create({
    data: {
      amount: input.amount,
      causeId: cause.id,
      fromProfileId: input.fromProfileId,
      fromAddress: input.fromAddress,
      tokenAddress: input.tokenAddress,
      txHash: input.txHash
    }
  });

  logger.info(`Created a donation ${data.id}`);
}

export default function listenDonations() {
  const publicClient = createPublicClient({
    chain: IS_MAINNET ? polygon : polygonAmoy,
    transport: webSocket('wss://polygon-amoy-bor-rpc.publicnode.com')
  });

  publicClient.watchContractEvent({
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
          makeDonation(input.data);
        } catch (error) {
          logger.error(`Failed to make donation: ${error}`);
        }
      }
    }
  });
}
