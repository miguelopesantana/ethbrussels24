/* eslint-disable @typescript-eslint/no-explicit-any */
import "@nomicfoundation/hardhat-ethers";
import { extendConfig, subtask, task } from "hardhat/config";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

import { crossdeployConfigExtender } from "./config";
import {
  PLUGIN_NAME,
  TASK_VERIFY_CONTRACT,
  TASK_VERIFY_GASLIMIT,
  TASK_VERIFY_SIGNER,
  TASK_VERIFY_SUPPORTED_NETWORKS,
} from "./constants";
import { Network, networks } from "./networks";
import "./type-extensions";

extendConfig(crossdeployConfigExtender);

task("crossdeploy", "Deploys the contract across all predefined networks").setAction(async (_, hre) => {
  await hre.run(TASK_VERIFY_SUPPORTED_NETWORKS);
  await hre.run(TASK_VERIFY_SIGNER);
  await hre.run(TASK_VERIFY_CONTRACT);
  await hre.run(TASK_VERIFY_GASLIMIT);

  await hre.run("compile");

  const fheUSDC = "0x5E377216e3c9448dA115D0E70b2F74689F8172E4";
  const fheWETH = "0xccf2B636A5d8C1fAC1Dab8740d2D2A5e08aEDA33";

  if (hre.config.crossdeploy.contracts && hre.config.crossdeploy.contracts.length === 3) {
    const providers: any[] = [];
    const wallets: any[] = [];
    const signers: any[] = [];

    console.info("Deploying to:", hre.network.name);

    const incoNetwork: Network = networks["inco"] as Network;
    const targetNetwork: Network = networks[hre.network.name as keyof typeof networks] as Network;
    const nets = [incoNetwork, targetNetwork];

    [0, 1].map((i) => {
      providers[i] = new hre.ethers.JsonRpcProvider(nets[i].rpcUrl);
      wallets[i] = new hre.ethers.Wallet(hre.config.crossdeploy.signer, providers[i]);
      signers[i] = wallets[i].connect(providers[i]);
    });

    const FHUSDCContract = await hre.ethers.getContractFactory(hre.config.crossdeploy.contracts[0]);
    const FHWETHContract = await hre.ethers.getContractFactory(hre.config.crossdeploy.contracts[0]);
    const BalancesManager = await hre.ethers.getContractFactory(hre.config.crossdeploy.contracts[1]);
    const DarkPool = await hre.ethers.getContractFactory(hre.config.crossdeploy.contracts[2]);

    try {
      // transfer tokens
      console.info("Deploying DarkPool contract on Inco...");
      const darkPool = await DarkPool.connect(signers[1]).deploy([fheUSDC, fheWETH]);
      await darkPool.waitForDeployment();

      const darkPoolAddr = await darkPool.getAddress();

      console.info("Dark Pool address on Inco:", darkPoolAddr);

      console.info("Deploying contract FHUSDC on Inco...");
      const fhusdcInstance: any = await FHUSDCContract.connect(signers[0]).deploy();
      const fhusdcAddr = await fhusdcInstance.getAddress();

      await fhusdcInstance.waitForDeployment();
      console.info("Contract address FHUSDC on Inco:", fhusdcAddr);

      {
        console.info("Initializing contract on Inco...");
        const tx = await fhusdcInstance.initialize(
          targetNetwork.chainId,
          fhusdcAddr,
          incoNetwork.interchainExecuteRouterAddress,
        );
        await tx.wait();
      }

      console.info("Deploying contract FHWETH on Inco...");
      const fhwethInstance: any = await FHWETHContract.connect(signers[0]).deploy();
      const fhwethAddr = await fhwethInstance.getAddress();

      await fhwethInstance.waitForDeployment();
      console.info("Contract address FHWETH on Inco:", fhwethAddr);

      {
        console.info("Initializing contract on Inco...");
        const tx = await fhwethInstance.initialize(
          targetNetwork.chainId,
          fhwethAddr,
          incoNetwork.interchainExecuteRouterAddress,
        );
        await tx.wait();
      }

      console.info("Deploying contract on target chain (Base)...");
      const balancesManagerInstance: any = await BalancesManager.connect(signers[1]).deploy(darkPoolAddr);
      const balancesManagerAddr = await balancesManagerInstance.getAddress();

      await balancesManagerInstance.waitForDeployment();
      console.info("Balance Manager address on target chain (Base):", balancesManagerAddr);

      {
        console.info("Initializing contract on target chain...");
        const tx = await balancesManagerInstance.initialize(
          incoNetwork.chainId,
          balancesManagerAddr,
          targetNetwork.interchainExecuteRouterAddress,
        );
        await tx.wait();
      }

      console.info("Setting mirrored ERC20 tokens...");
      {
        const tx = await balancesManagerInstance.setMirroredERC20(fhUSDC, sepUSDC);
        await tx.wait();
      }

      {
        const tx = await balancesManagerInstance.setMirroredERC20(fhWETH, sepWETH);
        await tx.wait();
      }

      {
        console.info("Setting owner for Inco contract...");
        const tx = await fhBalancesManagerInstance.setCallerContract(await balancesManagerInstance.getICA());
        await tx.wait();
      }

      {
        console.info("Setting owner for target chain contract...");
        const tx = await balancesManagerInstance.setCallerContract(targetNetwork.interchainExecuteRouterAddress);
        await tx.wait();
      }

      console.info("Contract address on Inco:", fhBalancesManagerAddr);
      console.info("Contract address on target chain:", balancesManagerAddr);

      // view card test
      {
        console.info("Viewing card on Inco...");
        const card = await fhBalancesManagerInstance.getCard();
        console.info("Card on Inco:", card);

        console.info("Viewing card on target chain...");
        const card2 = await balancesManagerInstance.getCard();
        console.info("Card on target chain:", card2);
      }
    } catch (err) {
      console.error(err);
    }
  }
});

subtask(TASK_VERIFY_SUPPORTED_NETWORKS).setAction(async (_, hre) => {
  if (!Object.keys(networks).includes(hre.network.name) || hre.network.name === "inco") {
    throw new NomicLabsHardhatPluginError(
      PLUGIN_NAME,
      `The network you are trying to deploy to is not supported by this plugin.
      The currently supported networks are ${Object.keys(networks).filter((n) => n !== "inco")}.`,
    );
  }
});

subtask(TASK_VERIFY_SIGNER).setAction(async (_, hre) => {
  if (!hre.config.crossdeploy.signer || hre.config.crossdeploy.signer === "") {
    throw new NomicLabsHardhatPluginError(
      PLUGIN_NAME,
      `Please provide a signer private key. We recommend using Hardhat configuration variables.
      See https://hardhat.org/hardhat-runner/docs/guides/configuration-variables.
      E.g.: { [...], crossdeploy: { signer: vars.get("PRIVATE_KEY", "") }, [...] }.`,
    );
  }
});

subtask(TASK_VERIFY_CONTRACT).setAction(async (_, hre) => {
  if (!hre.config.crossdeploy.contracts || hre.config.crossdeploy.contracts.length !== 3) {
    throw new NomicLabsHardhatPluginError(
      PLUGIN_NAME,
      `Please specify a pair of contract names to be deployed.
      E.g.: { [...], crossdeploy: { contracts: ["WERC20", "ERC20"] }, [...] }.`,
    );
  }
});

subtask(TASK_VERIFY_GASLIMIT).setAction(async (_, hre) => {
  if (hre.config.crossdeploy.gasLimit && hre.config.crossdeploy.gasLimit > 15 * 10 ** 6) {
    throw new NomicLabsHardhatPluginError(
      PLUGIN_NAME,
      `Please specify a lower gasLimit. Each block has currently 
      a target size of 15 million gas.`,
    );
  }
});
