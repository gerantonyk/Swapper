const { expect } = require("chai");
const { ethers,network } = require("hardhat");


describe("Swapper - unit test", function () {
  let tokenFactory 
  let token1 
  let token2 
  let swapperFactory 
  let swapper 
  let owner 
  let addr1

  before(async ()=> {
    await network.provider.request({method: "hardhat_reset"});
    [owner, addr1] = await ethers.getSigners();
    tokenFactory = await ethers.getContractFactory("Token");
    swapperFactory = await ethers.getContractFactory('Swapper');
  })
 
  beforeEach(async () => {
    token1 = await tokenFactory.deploy('token1','TK1');
    token2 = await tokenFactory.deploy('token2','TK2');
    swapper = await swapperFactory.deploy(token1.address, token2.address);
  });
  describe('Provide function', function() {

    it("Should revert if amount is 0", async function () {
      await expect(swapper.provide(0)).to.be.revertedWith("Provided amount can't be 0")
    });
    it('Should revert if greeting is amount exeeds allowance', async function () {
      await token1.approve(swapper.address,500)
      await expect(swapper.provide(700)).to.be.revertedWith("Amount exceeds allowance")
      let providedAmount = await swapper.providedByAddress(owner.address)
      expect(providedAmount.toNumber()).to.be.equal(0)
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
      await expect(swapper.swap()).to.be.revertedWith("Address didn't provide tokens")
    });
    it('Should swap provided amount', async function () {
      await token1.approve(swapper.address,700)
      await swapper.provide(700)
      await swapper.swap()
      let providedAmount = await swapper.providedByAddress(owner.address)
      let swappeddAmount = await swapper.swappedByAddress(owner.address)
      expect(providedAmount.toNumber()).to.be.equal(0)
      expect(swappeddAmount.toNumber()).to.be.equal(700)
    });
    it('Should only swap tokens from the caller', async function () {
      await token1.transfer(addr1.address,5000)
      await token1.approve(swapper.address,700)
      await swapper.provide(700)
      await token1.connect(addr1).approve(swapper.address,1500)
      await swapper.connect(addr1).provide(1000)
      await swapper.swap()
      let providedAmount = await swapper.providedByAddress(owner.address)
      let swappeddAmount = await swapper.swappedByAddress(owner.address)
      expect(providedAmount.toNumber()).to.be.equal(0)
      expect(swappeddAmount.toNumber()).to.be.equal(700)
      providedAmount = await swapper.providedByAddress(addr1.address)
      swappeddAmount = await swapper.swappedByAddress(addr1.address)
      expect(providedAmount.toNumber()).to.be.equal(1000)
      expect(swappeddAmount.toNumber()).to.be.equal(0)      
    });    
  });  
  describe('Withdraw function', function() {

    it("Should revert if swapped amount is 0", async function () {
      await expect(swapper.withdraw()).to.be.revertedWith("There are no tokens to withdraw")
    });
    it('Should revert if there is not enough tokens to withdraw', async function () {
      await token1.approve(swapper.address,700)
      await swapper.provide(700)
      await swapper.swap()
      await expect(swapper.withdraw()).to.be.revertedWith("There is not enough tokens")
      let swappeddAmount = await swapper.swappedByAddress(owner.address)
      expect(swappeddAmount.toNumber()).to.be.equal(700)
    });
    it('Should tranfer the swapped amount to the owner', async function () {
      await token2.transfer(swapper.address,5000)
      await token1.approve(swapper.address,700)
      await swapper.provide(700)
      await swapper.swap()
      await swapper.withdraw()
      let swappeddAmount = await swapper.swappedByAddress(owner.address)
      expect(swappeddAmount.toNumber()).to.be.equal(0)
      let balance = await token2.balanceOf(swapper.address)
      expect(balance.toNumber()).to.be.equal(4300)
    });    
  });    
});
