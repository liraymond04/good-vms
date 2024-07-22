import { ethers, run, upgrades } from 'hardhat';

async function upgradeActionModuleProxy() {
  const PROXY_ADDRESS = '0x8E6E173929FA8c5151A140e201Ff9e72BaCD9D29';

  const JobsActionModule = await ethers.getContractFactory('JobsActionModule');
  const contract = await upgrades.upgradeProxy(PROXY_ADDRESS, JobsActionModule);

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
