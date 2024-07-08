import hre from 'hardhat';

async function deployProxy() {
  const defaultAdmin = '0x6Ed8b34AF3DFca33d95B15544CF8A478F139b24F';
  const pauser = '0x6Ed8b34AF3DFca33d95B15544CF8A478F139b24F';
  const lensHub = '0xA2574D9DdB6A325Ad2Be838Bd854228B80215148';

  const SendTokens = await hre.ethers.getContractFactory('SendTokens');
  const deployProxy = await hre.upgrades.deployProxy(SendTokens as any, [
    defaultAdmin,
    pauser,
    lensHub
  ]);
  await deployProxy.deployed();

  console.log(`SendTokens deployed to ${await deployProxy.address}`);
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
