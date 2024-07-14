const customEvmNetworks = [
	{
		blockExplorerUrls: ["https://explorer.testnet.inco.org"],
		chainId: 9090,
		name: "Inco Gentry Testnet",
		rpcUrls: ["https://testnet.inco.org"],
		iconUrls: ["https://avatars.githubusercontent.com/u/142320057?s=200&v=4"],
		nativeCurrency: {
			name: "Inco",
			symbol: "INCO",
			decimals: 18,
		},
		networkId: 9090,
	},
];

export const evmNetworks = [
	{
		blockExplorerUrls: ["https://sepolia.basescan.org/"],
		chainId: 84532,
		name: "Base Sepolia Testnet",
		rpcUrls: ["https://sepolia.base.org/"],
		iconUrls: ["https://avatars.githubusercontent.com/u/6250754?s=200&v=4"],
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		networkId: 84532,
	},
	...customEvmNetworks,
];
