const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // BSC Mainnet addresses
  const PANCAKESWAP_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
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

  // Verify contract
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

  // Create liquidity pool
  const routerABI = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
  ];

  const router = new hre.ethers.Contract(
    PANCAKESWAP_ROUTER,
    routerABI,
    deployer
  );

  // Initial liquidity: 1 million TIRP tokens + 1 BNB
  const tokenAmount = hre.ethers.parseEther("1000000");
  const ethAmount = hre.ethers.parseEther("1");

  // Approve router
  await tirp.approve(router.address, tokenAmount);
  console.log("Approved router to spend TIRP tokens");

  // Add liquidity
  const tx = await router.addLiquidityETH(
    tirpAddress,
    tokenAmount,
    tokenAmount,
    ethAmount,
    deployer.address,
    Math.floor(Date.now() / 1000) + 60 * 20,
    { value: ethAmount }
  );

  console.log("Adding liquidity...");
  await tx.wait();
  console.log("Liquidity added successfully!");

  // Initial setup
  await tirp.setMaxBuyAmount(hre.ethers.parseEther("500"));
  await tirp.setExcludedFromFees(deployer.address, true);
  console.log("Initial setup completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 