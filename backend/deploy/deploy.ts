import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log(`deployer: `, deployer);

  // check if current network is inco, if so skip
  if (hre.network.name !== "inco") {
    console.error(`Skipping deployment of DarkPool and EncryptedERC20 tokens, not on inco network`);
    return;
  }

  const deployedFHUSDC = await deploy("EncryptedERC20", {
    from: deployer,
    args: ["Encrypted USDC", "eUSDC"],
    log: true,
  });

  const deployedFHWETH = await deploy("EncryptedERC20", {
    from: deployer,
    args: ["Encrypted WETH", "eWETH"],
    log: true,
  });

  console.log(`Deploying DarkPool contract...`);

  // encode ERC20[] memory _token into a single argument
  const deployedDarkPool = await deploy("DarkPool", {
    from: deployer,
    args: [[deployedFHUSDC.address, deployedFHWETH.address]],
    log: true,
  });

  console.log(`EncryptedERC20 contract: `, deployedFHUSDC.address);
  console.log(`EncryptedERC20 contract: `, deployedFHWETH.address);

  console.log(`DarkPool contract: `, deployedDarkPool.address);
};
export default func;
func.id = "deploy_encryptedERC20"; // id required to prevent reexecution
func.tags = ["EncryptedERC20", "DarkPool"];
