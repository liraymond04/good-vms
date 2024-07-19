import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import GoodEndpoint from '../good-endpoints';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  defaultCollectToken: string;
  goodApiEndpoint: string;
  goodDonation: `0x${string}`;
  goodLensSignup: `0x${string}`;
  goodPro: `0x${string}`;
  goodReferral: `0x${string}`;
  goodTipping: `0x${string}`;
  jobsActionModule: `0x${string}`;
  lensApiEndpoint: string;
  lensHandles: `0x${string}`;
  lensHub: `0x${string}`;
  permissionlessCreator?: `0x${string}`;
  sendTokens: `0x${string}`;
  tokenHandleRegistry: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case 'testnet':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        goodApiEndpoint: GoodEndpoint.Testnet,
        goodDonation: TestnetContracts.GoodDonation,
        goodLensSignup: TestnetContracts.GoodLensSignup,
        goodPro: TestnetContracts.GoodPro,
        goodReferral: TestnetContracts.GoodReferral,
        goodTipping: TestnetContracts.GoodTipping,
        jobsActionModule: TestnetContracts.JobsActionModule,
        lensApiEndpoint: LensEndpoint.Testnet,
        lensHandles: TestnetContracts.LensHandles,
        lensHub: TestnetContracts.LensHub,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        sendTokens: TestnetContracts.SendTokens,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    case 'staging':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        goodApiEndpoint: GoodEndpoint.Testnet,
        goodDonation: TestnetContracts.GoodDonation,
        goodLensSignup: TestnetContracts.GoodLensSignup,
        goodPro: TestnetContracts.GoodPro,
        goodReferral: MainnetContracts.GoodReferral,
        goodTipping: TestnetContracts.GoodTipping,
        jobsActionModule: TestnetContracts.JobsActionModule,
        lensApiEndpoint: LensEndpoint.Staging,
        lensHandles: TestnetContracts.LensHandles,
        lensHub: TestnetContracts.LensHub,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        sendTokens: TestnetContracts.SendTokens,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    default:
      return {
        defaultCollectToken: MainnetContracts.DefaultToken,
        goodApiEndpoint: GoodEndpoint.Mainnet,
        goodDonation: MainnetContracts.GoodDonation,
        goodLensSignup: MainnetContracts.GoodLensSignup,
        goodPro: MainnetContracts.GoodPro,
        goodReferral: MainnetContracts.GoodReferral,
        goodTipping: MainnetContracts.GoodTipping,
        jobsActionModule: MainnetContracts.JobsActionModule,
        lensApiEndpoint: LensEndpoint.Mainnet,
        lensHandles: MainnetContracts.LensHandles,
        lensHub: MainnetContracts.LensHub,
        permissionlessCreator: MainnetContracts.PermissionlessCreator,
        sendTokens: MainnetContracts.SendTokens,
        tokenHandleRegistry: MainnetContracts.TokenHandleRegistry
      };
  }
};

export default getEnvConfig;
