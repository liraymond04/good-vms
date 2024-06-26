import { ethers, run, upgrades } from 'hardhat';

async function deployActionModuleProxy() {
  const owner = '0x77F64F403Cf1B65c12Bc4F22587335785eb0618F';
  const pauser = '0x77F64F403Cf1B65c12Bc4F22587335785eb0618F';
  const lensHub = '0xA2574D9DdB6A325Ad2Be838Bd854228B80215148';

  const GoodDonationActionModule = await ethers.getContractFactory(
    'GoodDonationActionModule'
  );
  const contract = await upgrades.deployProxy(GoodDonationActionModule, [
    owner,
    pauser,
    lensHub
  ]);

  await contract.deployed();

  console.log(`GoodTipping deployed to ${contract.address}`);

  await run('verify:verify', {
    address: contract.address
  });
}

deployActionModuleProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
