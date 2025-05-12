// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

contract TIRP is ERC20, Ownable, ReentrancyGuard, Pausable {
    IUniswapV2Router public uniswapRouter;
    address public usdcAddress;
    address public feeRecipient;
    uint256 public maxBuyAmount;
    uint256 public constant FEE_PERCENTAGE = 50; // 0.5%
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SLIPPAGE_TOLERANCE = 50; // 0.5%

    mapping(address => bool) public isExcludedFromFees;
    mapping(address => bool) public isBlacklisted;

    event TokensSwappedForUSDC(uint256 amount, uint256 usdcReceived);
    event MaxBuyAmountUpdated(uint256 newAmount);
    event FeeRecipientUpdated(address newRecipient);
    event RouterUpdated(address newRouter);
    event BlacklistUpdated(address account, bool isBlacklisted);
    event FeeExclusionUpdated(address account, bool isExcluded);

    constructor(
        address _routerAddress,
        address _usdcAddress,
        address _feeRecipient
    ) ERC20("This Is a Rug Pull", "TIRP") Ownable(msg.sender) {
        require(_routerAddress != address(0), "Invalid router address");
        require(_usdcAddress != address(0), "Invalid USDC address");
        require(_feeRecipient != address(0), "Invalid fee recipient");

        uniswapRouter = IUniswapV2Router(_routerAddress);
        usdcAddress = _usdcAddress;
        feeRecipient = _feeRecipient;
        maxBuyAmount = 500 * 10**18; // $500 worth of tokens

        // Mint total supply to contract deployer
        _mint(msg.sender, 1000000000 * 10**18); // 1 billion tokens

        // Exclude owner from fees
        isExcludedFromFees[msg.sender] = true;
    }

    modifier whenNotBlacklisted(address account) {
        require(!isBlacklisted[account], "Address is blacklisted");
        _;
    }

    function transfer(
        address to,
        uint256 amount
    ) public override whenNotPaused whenNotBlacklisted(msg.sender) whenNotBlacklisted(to) returns (bool) {
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

    function _swapTokensForUSDC(uint256 tokenAmount) private nonReentrant {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = usdcAddress;

        // Get expected USDC amount
        uint[] memory amounts = uniswapRouter.getAmountsOut(tokenAmount, path);
        uint minUSDC = (amounts[1] * (BASIS_POINTS - SLIPPAGE_TOLERANCE)) / BASIS_POINTS;

        _approve(address(this), address(uniswapRouter), tokenAmount);

        try uniswapRouter.swapExactTokensForTokens(
            tokenAmount,
            minUSDC,
            path,
            feeRecipient,
            block.timestamp + 300
        ) {
            emit TokensSwappedForUSDC(tokenAmount, amounts[1]);
        } catch {
            // If swap fails, send tokens to fee recipient
            _transfer(address(this), feeRecipient, tokenAmount);
        }
    }

    // Admin functions
    function setMaxBuyAmount(uint256 _maxBuyAmount) external onlyOwner {
        require(_maxBuyAmount > 0, "Invalid max buy amount");
        maxBuyAmount = _maxBuyAmount;
        emit MaxBuyAmountUpdated(_maxBuyAmount);
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(_feeRecipient);
    }

    function setRouter(address _router) external onlyOwner {
        require(_router != address(0), "Invalid router address");
        uniswapRouter = IUniswapV2Router(_router);
        emit RouterUpdated(_router);
    }

    function setExcludedFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
        emit FeeExclusionUpdated(account, excluded);
    }

    function setBlacklist(address account, bool blacklisted) external onlyOwner {
        isBlacklisted[account] = blacklisted;
        emit BlacklistUpdated(account, blacklisted);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(this), "Cannot withdraw TIRP tokens");
        IERC20(token).transfer(owner(), amount);
    }
}