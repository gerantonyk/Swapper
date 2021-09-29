const { expect } = require("chai");
const { ethers,network } = require("hardhat");
require("dotenv").config();

const daiWhaleAddress = '0xa859cefda4464f44e73bd5bdc68c06982ba968bb'
//const wetherWhaleAddress = '0xa550a71b4a78b67c03900ac2b598b0e0b9d4668f'
 
describe("Swapper - integration test", function () {
  let swapperFactory 
  let swapper 

  
  before(async ()=> {
    if (!process.env.MAINNET_HTTPS_URL) throw new Error("Please complete MAINNET_HTTPS_URL in .env file to continue with the integration test")
  })
 
  beforeEach(async () => {
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.MAINNET_HTTPS_URL,
            blockNumber: 13321920,
          },
        },
      ],
    });

    wether = await ethers.getContractAt('IERC20', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
    dai = await ethers.getContractAt('IERC20', '0x6b175474e89094c44da98b954eedeac495271d0f')
    swapperFactory = await ethers.getContractFactory('Swapper');
    swapper = await swapperFactory.deploy(dai.address,wether.address);   

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [daiWhaleAddress],
    });
    daiWhale =  ethers.provider.getSigner(daiWhaleAddress);

  });
  describe('Swap function', function() {

    it("Should revert if provided amount is 0", async function () {
      await expect(swapper.connect(daiWhale).swap()).to.be.revertedWith("Address didn't provide tokens")
    });
    it('Should swap provided amount', async function () {
      let balance = await dai.balanceOf(daiWhaleAddress)
      balance = balance.toString()
      await dai.connect(daiWhale).approve(swapper.address,balance)
      await swapper.connect(daiWhale).provide(balance)
      await swapper.connect(daiWhale).swap()
      let providedAmount = await swapper.providedByAddress(daiWhaleAddress)
      let swappeddAmount = await swapper.swappedByAddress(daiWhaleAddress)
      expect(providedAmount.toString()).to.be.equal('0')
      expect(swappeddAmount.toString()).to.be.equal(balance)
    }); 
  });  
});
