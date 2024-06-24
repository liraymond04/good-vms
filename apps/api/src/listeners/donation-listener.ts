import { GoodDonation } from '@good/abis';
import { createPublicClient, webSocket } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import prisma from '../helpers/prisma';
import logger from '@good/helpers/logger';
import { GOOD_DONATION, IS_MAINNET } from '@good/data/constants';
import { z } from 'zod';

interface DonationCreateInput {
  amount: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  fromProfileId: string;
  toProfileId: string;
  publicationId: string;
  tokenAddress: string;
}

const donationEventValidator = z.object({
  amount: z.bigint().transform((amount) => Number(amount)),
  txHash: z.string(),
  fromAddress: z.string(),
  toAddress: z.string(),
  fromProfileId: z.bigint().transform((id) => id.toString(16)),
  toProfileId: z.bigint().transform((id) => id.toString(16)),
  publicationId: z.bigint().transform((id) => id.toString(16)),
  tokenAddress: z.string()
});

async function makeTip(input: DonationCreateInput) {
  const data = await prisma.causeDonation.create({ data: input });

  logger.info(`Created a tip ${data.id}`);
}

export default function listenDonations() {
  const publicClient = createPublicClient({
    chain: IS_MAINNET ? polygon : polygonAmoy,
    transport: webSocket('wss://polygon-amoy-bor-rpc.publicnode.com')
  });

  publicClient.watchContractEvent({
    address: GOOD_DONATION,
    abi: GoodDonation,
    eventName: 'DonationSent',
    onLogs: (logs) => {
      logs.forEach((event) => {
        const args = event.args;
        const input = donationEventValidator.safeParse(args);
        
        if (!input.success) {
          logger.error(`Failed to parse event: ${input.error}`);
          return
        }
        
        try {
          makeTip(input.data);
        } catch (error) {
          logger.error(`Failed to make tip: ${error}`);
        }
      });
    },
    onError(error) {
      logger.error('Failed to watch donation contract event', error);
    }
  });
}
