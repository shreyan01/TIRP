const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Get contract instances
  const TIRP = await hre.ethers.getContractFactory("TIRP");
  const tirp = await TIRP.attach("YOUR_DEPLOYED_TIRP_ADDRESS");

  // PancakeSwap Router ABI (minimal for adding liquidity)
  const routerABI = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
  ];

  const router = new hre.ethers.Contract(
    "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    routerABI,
    deployer
  );

  // Amount of TIRP tokens to add to liquidity
  const tokenAmount = hre.ethers.parseEther("1000000"); // 1 million TIRP tokens
  const ethAmount = hre.ethers.parseEther("1"); // 1 BNB

  // Approve router to spend TIRP tokens
  await tirp.approve(router.address, tokenAmount);
  console.log("Approved router to spend TIRP tokens");

  // Add liquidity
  const tx = await router.addLiquidityETH(
    tirp.address,
    tokenAmount,
    tokenAmount, // min token amount
    ethAmount, // min ETH amount
    deployer.address,
    Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes deadline
    { value: ethAmount }
  );

  console.log("Adding liquidity...");
  await tx.wait();
  console.log("Liquidity added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 