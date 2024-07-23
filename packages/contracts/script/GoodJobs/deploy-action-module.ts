import { ethers, run, upgrades } from 'hardhat';

async function deployActionModuleProxy() {
  const owner = '0xADDRESS';
  const pauser = '0xADDRESS';
  const lensHub = '0xA2574D9DdB6A325Ad2Be838Bd854228B80215148';
  const organizationStore = '0xf203442D871398EDC68C72D2e28c18fD2D78acc2';

  const JobsActionModule = await ethers.getContractFactory('JobsActionModule');
  const contract = await upgrades.deployProxy(JobsActionModule, [
    owner,
    pauser,
    lensHub,
    organizationStore
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
