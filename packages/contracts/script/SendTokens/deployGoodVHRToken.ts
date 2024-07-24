import hre from 'hardhat';

async function deployProxy() {
  const defaultAdmin = '0x6Ed8b34AF3DFca33d95B15544CF8A478F139b24F';
  const pauser = '0x6Ed8b34AF3DFca33d95B15544CF8A478F139b24F';
  const lensHub = '0xA2574D9DdB6A325Ad2Be838Bd854228B80215148';
  const GOOD = '0x2d4139144F9Dc09C4A97Dd1fFA83acAf60ff275E';
  const VHR = '0x7E6A70e1e1B0cC0Af51424Bb70d98445A1af5CCA'; 

  const SendGoodVHRToken = await hre.ethers.getContractFactory('SendGoodVHRToken');
  const deployProxy = await hre.upgrades.deployProxy(SendGoodVHRToken  as any, [
    defaultAdmin,
    pauser,
    lensHub,
    GOOD,
    VHR
  ]);
  await deployProxy.deployed();

  console.log(`SendGoodVHRTokens deployed to ${await deployProxy.address}`);
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
