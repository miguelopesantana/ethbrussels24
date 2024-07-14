"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { DynamicContextProvider, mergeNetworks } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { evmNetworks } from "@/utils/networks";
import { createClient, cacheExchange, fetchExchange } from 'urql';

// Create the provider component
export default function contextProvider({ children }: { children: ReactNode }) {

    // console.log("dynamic", process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID);
    return (
        // <Provider value={client}>
        <DynamicContextProvider
            theme="dark"
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",
                overrides: { evmNetworks: networks => mergeNetworks(evmNetworks, networks) },
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            {children}
        </DynamicContextProvider>
    );
};