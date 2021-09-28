async function mygdl() {
  myGdl = await ethers.getContractAt('GLDToken','0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0')
  const totalSupply = await myGdl.totalSupply()
  console.log(totalSupply.toNumber())
}

mygdl()