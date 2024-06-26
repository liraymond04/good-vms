import { GoodDonation } from '@good/abis';
import { GOOD_DONATION, IS_MAINNET } from '@good/data/constants';
import logger from '@good/helpers/logger';
import { Handler } from 'express';
import catchedError from 'src/helpers/catchedError';
import { noBody } from 'src/helpers/responses';
import { createPublicClient, webSocket } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

const publicClient = createPublicClient({
  chain: IS_MAINNET ? polygon : polygonAmoy,
  transport: webSocket('wss://polygon-amoy-bor-rpc.publicnode.com')
});

async function verifyDoneeId(doneeId: string) {
  const verified = await publicClient.readContract({
    abi: GoodDonation,
    address: GOOD_DONATION,
    functionName: "isVerifiedDonee",
    args: []
  });

  return verified
}

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  logger.info(`checked verification status of id ${id}`)
  if (!id) {
    return noBody(res);
  }

  try {
    const verified = await verifyDoneeId(id.toString())
    return res.status(200).json({ verified, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};

