// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
        amounts = new uint[](2);
        amounts[0] = amountIn;
        amounts[1] = amountIn; // Mock 1:1 swap
        return amounts;
    }

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external pure returns (uint[] memory amounts) {
        amounts = new uint[](2);
        amounts[0] = amountIn;
        amounts[1] = amountIn; // Mock 1:1 swap
        return amounts;
    }
} 