import { ethers, run, upgrades } from 'hardhat';

async function deployProxy() {
  const owner = '0xADDRESS';

  const GoodOrganizationStore = await ethers.getContractFactory(
    'GoodOrganizationStore'
  );
  const contract = await upgrades.deployProxy(GoodOrganizationStore, [owner]);

  await contract.deployed();

  console.log(`GoodOrganizationStore deployed to ${contract.address}`);

  await run('verify:verify', {
    address: contract.address
  });
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
