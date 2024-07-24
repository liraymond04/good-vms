import { ethers, run, upgrades } from 'hardhat';

async function deployActionModuleProxy() {
  const owner = '0xADDRESS';
  const pauser = '0xADDRESS';
  const lensHub = '0xADDRESS';

  const JobsActionModule = await ethers.getContractFactory('JobsActionModule');
  const contract = await upgrades.deployProxy(JobsActionModule, [
    owner,
    pauser,
    lensHub
  ]);

  await contract.deployed();

  console.log(`JobsActionModule deployed to ${contract.address}`);

  await run('verify:verify', {
    address: contract.address
  });
}

deployActionModuleProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
