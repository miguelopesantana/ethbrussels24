import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const LiquidityPoolAddress = "0x120fF097341B9D1ec6BC83AE44A4eF66284B6Eb2";
  const darkPoolAddress = "0x189E8bd2F90AB1Ab1b6Ce3F5Fe7b207fb0ABA823";
  const tokenFHUSDC = "0x6e248879ddd267991482796623CD375c508aE2E0";
  const tokenFHWETH = "0x93204C2224C296DB1424312883D2bA6ACebc2d42";

  const LPFactory = await ethers.getContractFactory("LiquidityPool");
  const lp = LPFactory.attach(LiquidityPoolAddress);

  const DPFactory = await ethers.getContractFactory("DarkPool");
  const dp = DPFactory.attach(darkPoolAddress);

  const tokenFHUSDCFactory = await ethers.getContractFactory("EncryptedERC20");
  const fhusdc = tokenFHUSDCFactory.attach(tokenFHUSDC);

  const tokenFHWETHFactory = await ethers.getContractFactory("EncryptedERC20");
  const fhweth = tokenFHWETHFactory.attach(tokenFHWETH);

  console.log(hre.network.name);
  if (hre.network.name !== "base") {
    console.error(`Please use base network and not inco\n[TIP] Use: yarn run --network base`);
    return;
  }

  console.log(`initiation deposit call in LP contract on base sepolia chain...`);
};
export default func;
func.id = "deploy_LiquidityPool"; // id required to prevent reexecution
func.tags = ["LiquidityPool"];
