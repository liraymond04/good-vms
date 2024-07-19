import { ethers, run, upgrades } from 'hardhat';

async function deployActionModuleProxy() {
  const owner = '0xa6Aa32af2D6787c22AE3F43a0954cc5f03438650';
  const pauser = '0xa6Aa32af2D6787c22AE3F43a0954cc5f03438650';
  const lensHub = '0xA2574D9DdB6A325Ad2Be838Bd854228B80215148';

  const GoodReferralActionModule = await ethers.getContractFactory(
    'GoodReferralActionModule'
  );
  const contract = await upgrades.deployProxy(GoodReferralActionModule, [
    owner,
    pauser,
    lensHub
  ]);

  await contract.deployed();

  console.log(`GoodReferral deployed to ${contract.address}`);

  await run('verify:verify', {
    address: contract.address
  });
}

deployActionModuleProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// https://amoy.polygonscan.com/address/0xaa25A52240BEb3296E0b4843b6fb1831bB80681E#code
