const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TIRP", function () {
  let TIRP;
  let tirp;
  let owner;
  let addr1;
  let addr2;
  let mockRouter;
  let mockUSDC;

  beforeEach(async function () {
    // Deploy mock contracts
    const MockRouter = await ethers.getContractFactory("MockUniswapV2Router");
    const MockUSDC = await ethers.getContractFactory("MockERC20");
    
    mockRouter = await MockRouter.deploy();
    mockUSDC = await MockUSDC.deploy("Mock USDC", "USDC");

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy TIRP
    TIRP = await ethers.getContractFactory("TIRP");
    tirp = await TIRP.deploy(
      mockRouter.address,
      mockUSDC.address,
      owner.address
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tirp.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await tirp.balanceOf(owner.address);
      expect(await tirp.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct max buy amount", async function () {
      expect(await tirp.maxBuyAmount()).to.equal(ethers.parseEther("500"));
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await tirp.transfer(addr1.address, 50);
      const addr1Balance = await tirp.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await tirp.balanceOf(owner.address);
      await expect(
        tirp.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should fail if amount exceeds max buy limit", async function () {
      const maxBuyAmount = await tirp.maxBuyAmount();
      await expect(
        tirp.transfer(addr1.address, maxBuyAmount + 1)
      ).to.be.revertedWith("Amount exceeds maximum buy limit");
    });
  });

  describe("Fee Mechanism", function () {
    it("Should take fee on transfer", async function () {
      const transferAmount = ethers.parseEther("100");
      await tirp.transfer(addr1.address, transferAmount);
      
      const contractBalance = await tirp.balanceOf(tirp.address);
      expect(contractBalance).to.be.gt(0);
    });

    it("Should not take fee for excluded addresses", async function () {
      await tirp.setExcludedFromFees(addr1.address, true);
      const transferAmount = ethers.parseEther("100");
      await tirp.transfer(addr1.address, transferAmount);
      
      const contractBalance = await tirp.balanceOf(tirp.address);
      expect(contractBalance).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update max buy amount", async function () {
      const newMaxBuy = ethers.parseEther("1000");
      await tirp.setMaxBuyAmount(newMaxBuy);
      expect(await tirp.maxBuyAmount()).to.equal(newMaxBuy);
    });

    it("Should allow owner to update fee recipient", async function () {
      await tirp.setFeeRecipient(addr1.address);
      expect(await tirp.feeRecipient()).to.equal(addr1.address);
    });

    it("Should allow owner to blacklist addresses", async function () {
      await tirp.setBlacklist(addr1.address, true);
      await expect(
        tirp.transfer(addr1.address, 100)
      ).to.be.revertedWith("Address is blacklisted");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause and unpause", async function () {
      await tirp.pause();
      await expect(
        tirp.transfer(addr1.address, 100)
      ).to.be.revertedWith("Pausable: paused");

      await tirp.unpause();
      await tirp.transfer(addr1.address, 100);
      expect(await tirp.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should allow owner to emergency withdraw", async function () {
      await mockUSDC.transfer(tirp.address, 1000);
      await tirp.emergencyWithdraw(mockUSDC.address, 1000);
      expect(await mockUSDC.balanceOf(owner.address)).to.equal(1000);
    });
  });
}); 