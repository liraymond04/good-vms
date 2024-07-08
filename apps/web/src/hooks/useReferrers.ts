import type { Address } from 'viem';

import getEnvConfig from '@good/data/utils/getEnvConfig';
import { useGetReferrersLazyQuery } from '@good/lens';
import { useEffect, useState } from 'react';

const makeReferralChain = (profileIds: Address[]) => {
  console.log('make referral chain', profileIds);
  let ret: Address[] = [];
  let existingIds = new Set<string>();

  for (const v of profileIds.toReversed()) {
    if (!existingIds.has(v)) {
      ret.push(v);
      existingIds.add(v);
    }
  }

  console.log('ret', ret);
  return ret;
};

const useReferrers = (publicationId: string) => {
  const { fetchMore } = useGetReferrersLazyQuery({
    variables: { request: { forId: publicationId } }
  })[1];

  const [referrers, setReferrers] = useState<Address[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const refetch = async () => {
    setLoading(true);
    let nextPublicationId = publicationId;
    let err = '';
    let referrers: Address[] = [];
    loop: while (nextPublicationId) {
      console.log('npid', nextPublicationId);
      const { data, error: referrersQueryError } = await fetchMore({
        variables: { request: { forId: nextPublicationId } }
      });

      if (!data || !data.publication) {
        console.error(referrersQueryError);
        err = `failed to fetch full referral chain due to ${referrersQueryError}`;
        break loop;
      }

      referrers.push(data.publication.by.id);

      switch (data.publication.__typename) {
        case 'Post': {
          const actionModule = data.publication.openActionModules.find(
            (m) =>
              m.__typename === 'UnknownOpenActionModuleSettings' &&
              m.contract.address.toLowerCase() ===
                getEnvConfig().goodReferral.toLowerCase()
          );
          if (!actionModule) {
            console.error(
              'Original post does not contain the referral action module'
            );
            err = 'Original post does not contain the referral action module';
          } else {
            referrers = makeReferralChain(referrers);
          }
          break loop;
        }
        case 'Comment':
          nextPublicationId = data.publication.commentOn.id;
          break;
        case 'Quote':
          nextPublicationId = data.publication.quoteOn.id;
          break;
        case 'Mirror':
          nextPublicationId = data.publication.mirrorOn.id;
          break;
        default:
          console.log('no typename, exiting');
          nextPublicationId = '';
      }
    }
    if (!!err) {
      setError(err);
    }
    if (referrers.length > 0) {
      setReferrers(referrers);
    }
    setLoading(false);
    return { data: referrers, error };
  };

  useEffect(() => {
    refetch();
  }, []);

  return { error, loading, referrers, refetch };
};

export default useReferrers;
