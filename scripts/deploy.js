const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // BSC PancakeSwap Router address
  const PANCAKESWAP_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  // BSC USDC address
  const BSC_USDC = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";

  // Deploy TIRP
  const TIRP = await hre.ethers.getContractFactory("TIRP");
  const tirp = await TIRP.deploy(
    PANCAKESWAP_ROUTER,
    BSC_USDC,
    deployer.address
  );

  await tirp.waitForDeployment();
  const tirpAddress = await tirp.getAddress();

  console.log("TIRP deployed to:", tirpAddress);

  // Wait for 5 block confirmations
  console.log("Waiting for block confirmations...");
  await tirp.deployTransaction.wait(5);

  // Verify contract on BSCScan
  console.log("Verifying contract on BSCScan...");
  try {
    await hre.run("verify:verify", {
      address: tirpAddress,
      constructorArguments: [
        PANCAKESWAP_ROUTER,
        BSC_USDC,
        deployer.address
      ],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });