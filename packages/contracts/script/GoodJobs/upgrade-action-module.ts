import { ethers, run, upgrades } from 'hardhat';

async function upgradeActionModuleProxy() {
  const PROXY_ADDRESS = '0x7Fc20D60b6eC42caD04603AEE02dCc324a2F6DcF';

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
