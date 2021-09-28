// async function swapperCheck() {
//   let swapper = await ethers.getContractAt('Swapper','0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e')

//   const result2 = swapper.provide(600)
//   let result = await swapper.balance()
//   console.log(result.toNumber())


//   const swapper = await ethers.getContractAt('Swapper','0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e')
// }
/*token1

0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
let token1 = await ethers.getContractAt('Token','0x8A791620dd6260079BF849Dc5567aDC3F2FdC318')
let balance = await token1.balanceOf('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
let transf = await token1.transfer('0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',600)
swapperCheck()

// //main account 

// 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

// // transfer:
// Token1 deployed to: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
// Token2 deployed to: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
// Swapper deployed to: 0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e

// myGdl.transfer('0x70997970c51812dc3a010c7d01b50e0d17dc79c8', 400)