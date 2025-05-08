// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract TIRP is ERC20, Ownable {
    IUniswapV2Router public uniswapRouter;
    address public usdcAddress;
    address public ownerWallet;
    uint256 public maxBuyAmount;
    uint256 public constant FEE_PERCENTAGE = 50; // 0.5%
    uint256 public constant BASIS_POINTS = 10000;

    mapping(address => bool) public isExcludedFromFees;

    event TokensSwappedForUSDC(uint256 amount, uint256 usdcReceived);

    constructor(
        address _routerAddress,
        address _usdcAddress,
        address _ownerWallet
    ) ERC20("This Is a Rug Pull", "TIRP") Ownable() {
        uniswapRouter = IUniswapV2Router(_routerAddress);
        usdcAddress = _usdcAddress;
        ownerWallet = _ownerWallet;
        maxBuyAmount = 500 * 10**18; // $500 worth of tokens

        // Mint total supply to contract deployer
        _mint(msg.sender, 1000000000 * 10**18); // 1 billion tokens

        // Exclude owner from fees
        isExcludedFromFees[msg.sender] = true;
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(amount <= maxBuyAmount, "Amount exceeds maximum buy limit");
        
        if (isExcludedFromFees[msg.sender] || isExcludedFromFees[to]) {
            return super.transfer(to, amount);
        }

        uint256 fee = (amount * FEE_PERCENTAGE) / BASIS_POINTS;
        uint256 transferAmount = amount - fee;

        // Transfer the fee to the contract
        super.transfer(address(this), fee);
        
        // Swap fee for USDC and send to owner
        _swapTokensForUSDC(fee);

        return super.transfer(to, transferAmount);
    }

    function _swapTokensForUSDC(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = usdcAddress;

        _approve(address(this), address(uniswapRouter), tokenAmount);

        uniswapRouter.swapExactTokensForTokens(
            tokenAmount,
            0, // Accept any amount of USDC
            path,
            ownerWallet,
            block.timestamp + 300
        );

        emit TokensSwappedForUSDC(tokenAmount, 0);
    }

    function setExcludedFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
    }

    function setMaxBuyAmount(uint256 _maxBuyAmount) external onlyOwner {
        maxBuyAmount = _maxBuyAmount;
    }
}