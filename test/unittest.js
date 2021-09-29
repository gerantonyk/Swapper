const { expect } = require("chai");
const { ethers } = require("hardhat");
;
describe("Swapper", function () {
  let tokenFactory 
  let token1 
  let token2 
  let swapperFactory 
  let swapper 
  let owner 
  let addr1
  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    tokenFactory = await ethers.getContractFactory("Token");
    token1 = await tokenFactory.deploy('token1','TK1');
    token2 = await tokenFactory.deploy('token2','TK2');
    swapperFactory = await ethers.getContractFactory('Swapper');
    swapper = await swapperFactory.deploy(token1.address, token2.address);
  });
  describe('Provide function', function() {

    it("Should revert if amount is 0", async function () {
      await expect(swapper.provide(0)).to.be.revertedWith("Provided amount can't be 0")
    });
    it('Should revert if greeting is amount exeeds allowance', async function () {
      await token1.approve(swapper.address,500)
      await expect(swapper.provide(700)).to.be.revertedWith("Amount exceeds allowance")
    });
    it('Should transfer the token to Swapper if amount is equal or less tha allowance', async function () {
      await token1.approve(swapper.address,600)
      await swapper.provide(600)
      let swapperBalance = await token1.balanceOf(swapper.address)
      let providedAmount = await swapper.providedByAddress(owner.address)
      expect(providedAmount.toNumber()).to.be.equal(600)
      expect(swapperBalance.toNumber()).to.be.equal(600)
    });    
    it('Should sum all the amounts provided', async function () {
      await token1.approve(swapper.address,900)
      await swapper.provide(500)
      await swapper.provide(300)
      let swapperBalance = await token1.balanceOf(swapper.address)
      let providedAmount = await swapper.providedByAddress(owner.address)
      expect(providedAmount.toNumber()).to.be.equal(800)
      expect(swapperBalance.toNumber()).to.be.equal(800)
    }); 
  });
  describe('Swap function', function() {

    it("Should revert if provided amount is 0", async function () {
      await expect(swapper.swap).to.be.revertedWith("Address didn't provide tokens")
    });
    xit('Should revert if greeting is amount exeeds allowance', async function () {
      await token1.approve(swapper.address,500)
      await expect(swapper.provide(700)).to.be.revertedWith("Amount exceeds allowance")
    });
    xit('Should transfer the token to Swapper if amount is equal or less tha allowance', async function () {
      await token1.approve(swapper.address,600)
      await swapper.provide(600)
      let swapperBalance = await token1.balanceOf(swapper.address)
      let providedAmount = await swapper.providedByAddress(owner.address)
      expect(providedAmount.toNumber()).to.be.equal(600)
      expect(swapperBalance.toNumber()).to.be.equal(600)
    });    
    xit('Should sum all the amounts provided', async function () {
      await token1.approve(swapper.address,900)
      await swapper.provide(500)
      await swapper.provide(300)
      let swapperBalance = await token1.balanceOf(swapper.address)
      let providedAmount = await swapper.providedByAddress(owner.address)
      expect(providedAmount.toNumber()).to.be.equal(800)
      expect(swapperBalance.toNumber()).to.be.equal(800)
    }); 
  });  
});
