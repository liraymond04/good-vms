import { development, LensClient } from '@lens-protocol/client';

let globalTemporal = global as unknown as { client: LensClient };

/**
 * A function that initializes the {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.LensClient.html | LensClient} if it has not been initialized and
 * returns a reference to it
 *
 * @returns A reference to the global {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.LensClient.html | LensClient}
 */
const lensClient = () => {
  if (globalTemporal.client) {
    return globalTemporal.client;
  }

  globalTemporal.client = new LensClient({
    environment: development
  });

  return globalTemporal.client;
};

/**
 * Properties of {@link getLensProfile} for passing in a profile handle
 */
export interface PropsHandle {
  /**
   * Profile handle
   */
  handle: string;
}

/**
 * Properties of {@link getLensProfile} for passing in a profile ID
 */
export interface PropsId {
  /**
   * Profile ID
   */
  id: string;
}

/**
 * Function to fetch a profile either with their handle or id
 *
 * Also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#fetch}
 *
 * @param props Either { handle: string } with handle being a lens handle or
 * { id: string } with id being an ethereum address
 * @returns A promise containing the {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.ProfileFragment.html | ProfileFragment}, or null if it was not found
 */
const getLensProfile = async (props: PropsHandle | PropsId) => {
  if ('handle' in props) {
    const profileByHandle = await lensClient().profile.fetch({
      forHandle: props.handle
    });
    return profileByHandle;
  } else {
    const profileById = await lensClient().profile.fetch({
      forProfileId: props.id
    });
    return profileById;
  }
};

export default getLensProfile;
