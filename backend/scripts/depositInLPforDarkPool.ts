import hre, { ethers } from "hardhat";

const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

const func = async function () {
  const LiquidityPoolAddress = "0xAC3465525a57b9380C8d291f666d5d9B6f852C26";
  const fhUSDC = "0xc63E5e80D160d75C6d5E694fB084806D67ceba20";
  const fhWETH = "0xd09D1BF64dE02f88534031F81A7B0F300f4D2227";
  const darkPoolAddress = "0xd9b76d1a554b2DEa915a13E1080DE88C96d4988D";
  const LPFactory = await ethers.getContractFactory("LiquidityPool");
  const lp = LPFactory.attach(LiquidityPoolAddress);

  const sepUSDCAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const sepWETHAddress = "0x1BDD24840e119DC2602dCC587Dd182812427A5Cc";
  const sepUSDC = await ethers.getContractAt(IERC20_SOURCE, sepUSDCAddress);
  const sepWETH = await ethers.getContractAt(IERC20_SOURCE, sepWETHAddress);

  console.log(hre.network.name);
  if (hre.network.name !== "base") {
    console.error(`Please use base network and not inco\n[TIP] Use: yarn run --network base`);
    return;
  }

  console.log(`initiation depositAndPortToken call in LP contract on base sepolia chain...`);

  // depositAndPortToken
  const amount = ethers.parseUnits("1", 6);

  console.log("Approving USDC");
  await sepUSDC.approve(LiquidityPoolAddress, ethers.parseUnits("100000000000000000000000000"));

  console.log("Depositing USDC", fhUSDC, amount);
  await lp.depositAndPortToken(fhUSDC, amount);

  console.log("You can now call depositAndPortToken for USDC in Inco network");
};
func.id = "run_DepositLiquidityPool"; // id required to prevent reexecution
func.tags = ["LiquidityPool"];
func()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
