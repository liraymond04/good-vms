import { ethers, run, upgrades } from 'hardhat';

async function deployProxy() {
  const owner = '0x77F64F403Cf1B65c12Bc4F22587335785eb0618F';
  const lensHub = '0xA2574D9DdB6A325Ad2Be838Bd854228B80215148';

  const GoodDonation = await ethers.getContractFactory('GoodDonationV2');
  const deployProxy = await upgrades.deployProxy(GoodDonation, [
    owner,
    owner,
    lensHub
  ]);
  const contract = await deployProxy.deployed();

  console.log(`GoodDonationV2 deployed to ${contract.address}`);

  await run('verify:verify', {
    address: contract.address
  });
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xA6A26C724c59A40e5203c17fe88a1e3EAA70717d
