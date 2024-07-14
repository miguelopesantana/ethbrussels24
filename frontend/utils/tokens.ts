export interface Token {
  id: string;
  address: string;
  chain: string;
  symbol: string;
  name: string;
  decimals: number;
  standard: string;
  project: TokenProject;
  __typename: string;
}

interface TokenProject {
  id: string;
  name: string;
  logo: Image;
  safetyLevel: string;
  logoUrl: string;
  isSpam: boolean;
  __typename: string;
}

interface Image {
  id: string;
  url: string;
  __typename: string;
}

export interface Tokens {
  [key: string]: any;  // Adjust the 'any' type as per your actual value type
}

export const  tokens: Tokens = {
  "VG9rZW46RVRIRVJFVU1fMHhjMDJhYWEzOWIyMjNmZThkMGEwZTVjNGYyN2VhZDkwODNjNzU2Y2My": {
    "id": "VG9rZW46RVRIRVJFVU1fMHhjMDJhYWEzOWIyMjNmZThkMGEwZTVjNGYyN2VhZDkwODNjNzU2Y2My",
    "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "chain": "ETHEREUM",
    "symbol": "WETH",
    "name": "Wrapped Ether",
    "decimals": 18,
    "standard": "ERC20",
    "project": {
      "id": "VG9rZW5Qcm9qZWN0OkVUSEVSRVVNXzB4YzAyYWFhMzliMjIzZmU4ZDBhMGU1YzRmMjdlYWQ5MDgzYzc1NmNjMl9XRVRI",
      "name": "WETH",
      "logo": {
        "id": "SW1hZ2U6aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1VuaXN3YXAvYXNzZXRzL21hc3Rlci9ibG9ja2NoYWlucy9ldGhlcmV1bS9hc3NldHMvMHhDMDJhYUEzOWIyMjNGRThEMEEwZTVDNEYyN2VBRDkwODNDNzU2Q2MyL2xvZ28ucG5n",
        "url": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        "__typename": "Image"
      },
      "safetyLevel": "VERIFIED",
      "logoUrl": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      "isSpam": false,
      "__typename": "TokenProject"
    },
    "__typename": "Token"
  },
  "VG9rZW46RVRIRVJFVU1fMHhkYWMxN2Y5NThkMmVlNTIzYTIyMDYyMDY5OTQ1OTdjMTNkODMxZWM3": {
    "id": "VG9rZW46RVRIRVJFVU1fMHhkYWMxN2Y5NThkMmVlNTIzYTIyMDYyMDY5OTQ1OTdjMTNkODMxZWM3",
    "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "chain": "ETHEREUM",
    "symbol": "USDT",
    "name": "Tether USD",
    "decimals": 6,
    "standard": "ERC20",
    "project": {
      "id": "VG9rZW5Qcm9qZWN0OkVUSEVSRVVNXzB4ZGFjMTdmOTU4ZDJlZTUyM2EyMjA2MjA2OTk0NTk3YzEzZDgzMWVjN19UZXRoZXI=",
      "name": "Tether",
      "logo": {
        "id": "SW1hZ2U6aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1VuaXN3YXAvYXNzZXRzL21hc3Rlci9ibG9ja2NoYWlucy9ldGhlcmV1bS9hc3NldHMvMHhkQUMxN0Y5NThEMmVlNTIzYTIyMDYyMDY5OTQ1OTdDMTNEODMxZWM3L2xvZ28ucG5n",
        "url": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        "__typename": "Image"
      },
      "safetyLevel": "VERIFIED",
      "logoUrl": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      "isSpam": false,
      "__typename": "TokenProject"
    },
    "__typename": "Token"
  },
}