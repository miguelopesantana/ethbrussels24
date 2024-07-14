import { Tokens, tokens } from "@/utils/tokens";
import { createClient, gql, cacheExchange, fetchExchange } from "urql";

const client = createClient({
	url: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_API_KEY}/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B`,
	exchanges: [cacheExchange, fetchExchange],
});

// Function to exclude a token and return an array of remaining tokens
export function getAvailableTokens(excludeKey: string): Tokens {
	const newTokens = { ...tokens };
	if (excludeKey) delete newTokens[excludeKey];
	return newTokens; // Return array of token objects
}

export async function fetchPrice(tokenId: string): Promise<number> {
	const query = gql`
    {
        token(id: "${tokenId}") {
            tokenDayData(where: {priceUSD_not: "0"}, first: 1) {
            priceUSD
            }
            name
        }
    }`;
	const id = tokenId;

	const result = await client.query(query, { id }).toPromise();
	const data = result.data;
	console.log(result);
	if (!data.token) {
		return 0;
	}
	return data?.token.tokenDayData[0].priceUSD.toInteger();
}
