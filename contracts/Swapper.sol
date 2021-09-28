//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Swapper {
    
    using SafeMath for uint256;

    IERC20 private fromToken;
    IERC20 private toToken;
    mapping (address => uint) public providedByAddress;

    constructor(IERC20 _fromToken, IERC20 _toToken) {
        fromToken = _fromToken;
        toToken   = _toToken;
    }

    function balance() public view returns (uint) {
        uint result = fromToken.balanceOf(msg.sender);
        console.log(address(this));
        return result;
    }

    function provide(uint _amount) public {
        require(_amount > 0, "Provided amount can't be 0");
        uint256 allowance = fromToken.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Amount exceeds allowance");
        providedByAddress[msg.sender] = providedByAddress[msg.sender].add(_amount);
        fromToken.transferFrom(msg.sender, address(this), _amount);
    }
}