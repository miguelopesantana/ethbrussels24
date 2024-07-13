import { AbiCoder, JsonRpcProvider } from "ethers";
import { FhevmInstance, createInstance } from "fhevmjs";
import { ethers, hre } from "hardhat";

const provider = new JsonRpcProvider(`https://testnet.inco.org`);

// Contract address of TFHE.sol
const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";

let _instance: FhevmInstance;

const getInstance = async () => {
  if (_instance) return _instance;

  const network = await provider.getNetwork();
  const chainId = +network.chainId.toString(); // chainId: 9090

  console.log("network", network);
  console.log("chainId", chainId);

  // Get blockchain public key
  const ret = await provider.call({
    to: FHE_LIB_ADDRESS,
    // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
    data: "0xd9d47bb001",
  });
  const decoded = AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
  const publicKey = decoded[0];

  _instance = await createInstance({ chainId, publicKey });
};

const func = async function () {
  const fheInstance = await getInstance();
  const fhUSDC = "0x03043c8D53c08bC7cF654a51EC76b709BCB9bD6e";
  const fhWETH = "0x20b57aA58CA9EEc740Ee146b4fC53ED0a96C00f5";
  const darkPoolAddress = "0xAafdF45f42130dC92d586AeBAA3Bf949382e12eB";

  const sepUSDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const sepWETH = "0x1BDD24840e119DC2602dCC587Dd182812427A5Cc";

  const DPFactory = await ethers.getContractFactory("DarkPool");
  const dp = DPFactory.attach(darkPoolAddress);

  const tokenFHUSDCFactory = await ethers.getContractFactory("EncryptedERC20");
  const fhusdc = tokenFHUSDCFactory.attach(fhUSDC);

  const tokenFHWETHFactory = await ethers.getContractFactory("EncryptedERC20");
  const fhweth = tokenFHWETHFactory.attach(fhWETH);

  console.log(hre.network.name);
  if (hre.network.name !== "inco") {
    console.error(`Please use inco net work to deposit in DarkPool`);
    return;
  }

  console.log(`initiation depositAndPortToken call in LP contract on base sepolia chain...`);

  // depositAndPortToken
  const amount = 1000000;

  console.log("Approving USDC");
  await fhusdc.approve(darkPoolAddress, amount);

  console.log("Creating USDC Order");

  // cipher the amount
  const cipherAmount = fheInstance!.encrypt32(amount);
  const cipherPrice = fheInstance!.encrypt32(2);

  // Order to buy 1 usdc at price 2
  await dp.createOrder(0, cipherAmount, cipherPrice);

  console.log("Somone can now fill the order for USDC in Inco network");
};

func()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
