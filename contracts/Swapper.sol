//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Swapper {
    
    using SafeMath for uint256;

    IERC20 private fromToken;
    IERC20 private toToken;
    mapping (address => uint) public providedByAddress;
    mapping (address => uint) public swappedByAddress;
    uint public exchangeRatio = 1;

    constructor(IERC20 _fromToken, IERC20 _toToken) {
        fromToken = _fromToken;
        toToken   = _toToken;
    }

    function provide(uint _amount) public  {
        require(_amount > 0, "Provided amount can't be 0");
        uint256 _allowance = fromToken.allowance(msg.sender, address(this));
        require(_allowance >= _amount, "Amount exceeds allowance");
        providedByAddress[msg.sender] = providedByAddress[msg.sender].add(_amount);
        fromToken.transferFrom(msg.sender, address(this), _amount);  
    }

    function swap() public  {
        require(providedByAddress[msg.sender]>0,"Address didn't provide tokens");
        swappedByAddress[msg.sender]= providedByAddress[msg.sender].mul(exchangeRatio);
        providedByAddress[msg.sender] = 0;
    }

    function withdraw() public  {
        require(swappedByAddress[msg.sender]>0,"There are no tokens to withdraw");
        uint256 _balance = toToken.balanceOf(address(this));
        uint  _swapped = swappedByAddress[msg.sender];
        require(_balance >= _swapped, "There is not enough tokens");
        swappedByAddress[msg.sender] = 0;
        toToken.transfer(msg.sender,_swapped);
    }    
}
