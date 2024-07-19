import { ethers, run, upgrades } from 'hardhat';

async function upgradeActionModuleProxy() {
  const PROXY_ADDRESS = '0x4f450963b586ef10e3a741a543ffefd4a908b66f';

  const GoodReferralActionModule = await ethers.getContractFactory(
    'GoodReferralActionModule'
  );
  const contract = await upgrades.upgradeProxy(
    PROXY_ADDRESS,
    GoodReferralActionModule
  );

  await contract.deployed();

  console.log(`Proxy ${PROXY_ADDRESS} upgraded`);

  await run('verify:verify', {
    address: PROXY_ADDRESS
  });
}

upgradeActionModuleProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
