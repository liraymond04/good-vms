import { ethers, run, upgrades } from 'hardhat';

async function upgradeProxy() {
  const PROXY_ADDRESS = '0xf203442D871398EDC68C72D2e28c18fD2D78acc2';

  const GoodOrganizationStore = await ethers.getContractFactory(
    'GoodOrganizationStore'
  );
  const contract = await upgrades.upgradeProxy(
    PROXY_ADDRESS,
    GoodOrganizationStore
  );

  await contract.deployed();

  console.log(`Proxy ${PROXY_ADDRESS} upgraded`);

  await run('verify:verify', {
    address: PROXY_ADDRESS
  });
}

upgradeProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
