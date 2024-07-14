import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  // fill these from the previous deployment
  const fhUSDC = "0xc63E5e80D160d75C6d5E694fB084806D67ceba20";
  const fhWETH = "0xd09D1BF64dE02f88534031F81A7B0F300f4D2227";
  const darkPoolAddress = "0xd9b76d1a554b2DEa915a13E1080DE88C96d4988D";

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
