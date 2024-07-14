
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
        blockExplorerUrls: ["https://etherscan.io"],
        chainId: 1,
        name: "Ethereum Mainnet",
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        iconUrls: ["https://avatars.githubusercontent.com/u/6250754?s=200&v=4"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        networkId: 1,
    },
    {
        blockExplorerUrls: ["https://ropsten.etherscan.io"],
        chainId: 3,
        name: "Ropsten Testnet",
        rpcUrls: ["https://ropsten.infura.io/v3/"],
        iconUrls: ["https://avatars.githubusercontent.com/u/6250754?s=200&v=4"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        networkId: 3,
    },
    ...customEvmNetworks,
]