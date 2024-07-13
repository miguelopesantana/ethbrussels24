import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  // fill these from the previous deployment
  const fhUSDC = "0x46eb16A790Fe37253AED7469EC69722537614a89";
  const fhWETH = "0xAC3465525a57b9380C8d291f666d5d9B6f852C26";
  const darkPoolAddress = "0xF8948c71F26c15a11B8F702a2e367b2b6106Df92";

  const sepUSDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const sepWETH = "0x1BDD24840e119DC2602dCC587Dd182812427A5Cc";

  if (hre.network.name !== "base") {
    console.error(
      `Please deploy Liquidity Pool on base network and not in inco\n[TIP] Use: yarn deploy:contracts --network base`,
    );
    return;
  }

  console.log(`deploying LiquidityPool contract...`);
  const LP = await deploy("LiquidityPool", {
    from: deployer,
    args: [darkPoolAddress],
    log: true,
  });

  console.log(`LiquidityPool contract: `, LP.address);

  console.log(`initiating setMirroredERC20 calls in LP contract on base sepolia chain...`);
  // set setDarkPoolAddress const token = await (await ethers.getContractFactory("Token")).attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
  const lp = await ethers.getContractAt("LiquidityPool", LP.address);
  await lp.setMirroredERC20(fhUSDC, sepUSDC);
  await lp.setMirroredERC20(fhWETH, sepWETH);

  const mirrored = await lp.getMirroredERC20(fhUSDC);
  console.log(`ERC20: `, mirrored, `=> FHERC20`, fhUSDC);

  const mirrored2 = await lp.getMirroredERC20(fhWETH);
  console.log(`ERC20: `, mirrored2, `=> FHERC20`, fhWETH);

  console.log(`setMirroredERC20 calls completed!`);
};
export default func;
func.id = "deploy_LiquidityPool"; // id required to prevent reexecution
func.tags = ["LiquidityPool"];
