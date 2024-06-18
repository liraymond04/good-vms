import type { Handler } from 'express';
import type { Address } from 'viem';

import {
  GOOD_MEMBERSHIP_NFT_PUBLICATION_ID,
  IS_MAINNET
} from '@good/data/constants';
import LensEndpoint from '@good/data/lens-endpoints';
import logger from '@good/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_INDEFINITE, GOOD_USER_AGENT } from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';
import { getAddress } from 'viem';

const LENS_GRAPHQL_API_V2 = 'https://api-v2.lens.dev/graphql';

const fetchPublications = async () => {
  const LENS_V2_HAS_ACTED_QUERY = {
    query: `
    query Profile($request: PublicationRequest!) {
  publication(request: $request) {
    ... on Post {
      by {
        id
        ownedBy {
          address
        }
      }
    }
  }
}
  `,
    variables: {
      request: {
        forId: GOOD_MEMBERSHIP_NFT_PUBLICATION_ID
      }
    }
  };

  const { data } = await axios.post(
    IS_MAINNET ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    LENS_V2_HAS_ACTED_QUERY,
    {
      headers: {
        'Content-Type': 'application/json',
        'User-agent': GOOD_USER_AGENT
      }
    }
  );
  console.log(data);
  if (data.data.publication) {
    return data.data.publication.by;
  } else {
    return null;
  }
};

export const get: Handler = async (req, res) => {
  const { address, id } = req.query;

  if (!id && !address) {
    return noBody(res);
  }

  try {
    const formattedAddress = address
      ? getAddress(address as Address)
      : undefined;

    console.log(formattedAddress);
    // const variables = {
    //   id,
    //   address: formattedAddress
    // };

    const response: any = await fetchPublications();

    if (!response) {
      return res.status(200).json({ hasGoodNft: false, success: true });
    }

    const profile = response.id;
    const addr = response.ownedBy.address;

    if (!profile || !addr) {
      logger.info(`No profile found for ${id || formattedAddress}`);
      return res.status(200).json({ hasGoodNft: false, success: true });
    }

    const hasGoodNft = profile == id || formattedAddress == addr;

    logger.info(`Good NFT badge fetched for ${id || formattedAddress}`);

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        hasGoodNft ? CACHE_AGE_INDEFINITE : 'no-cache'
      )
      .json({ hasGoodNft, success: true });
  } catch (error: any) {
    logger.error(`Error fetching Good NFT badge for ${id}: ${error.message}`);
    return catchedError(res, error);
  }
};
