import hre, { ethers } from "hardhat";

const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

const func = async function () {
  const LiquidityPoolAddress = "0x3c05E38726e5e801EfE0e323c7E17aa8874c5781";
  const LPFactory = await ethers.getContractFactory("LiquidityPool");
  const lp = LPFactory.attach(LiquidityPoolAddress);

  const sepUSDCAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const sepWETHAddress = "0x1BDD24840e119DC2602dCC587Dd182812427A5Cc";

  const fhUSDC = "0x46eb16A790Fe37253AED7469EC69722537614a89";
  const fhWETH = "0xAC3465525a57b9380C8d291f666d5d9B6f852C26";

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

  console.log("Depositing USDC");
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
