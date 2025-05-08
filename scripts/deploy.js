const hre = require("hardhat");

async function main() {
  // For local testing, we'll use mock addresses
  const routerAddress = "0x0000000000000000000000000000000000000000"; // Mock router address
  const usdcAddress = "0x0000000000000000000000000000000000000000";   // Mock USDC address
  const ownerWallet = "0x0000000000000000000000000000000000000000";   // Mock owner wallet

  const TIRP = await hre.ethers.getContractFactory("TIRP");
  const tirp = await TIRP.deploy(
    routerAddress,
    usdcAddress,
    ownerWallet
  );

  await tirp.waitForDeployment();

  console.log("TIRP deployed to:", await tirp.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });