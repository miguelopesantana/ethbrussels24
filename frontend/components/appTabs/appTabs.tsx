"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { gql, useQuery } from 'urql';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import PriceCard from "./priceCard";
import { Token, Tokens, tokens } from "@/utils/tokens";
import { fetchPrice, getAvailableTokens } from "./utils";
import bg from "@/public/bg.png"
import arrow from "@/public/arrow.svg"

import {
    useContractWrite,
    useWriteContract,
} from 'wagmi';
import { abi } from "@/utils/abi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom, formatUnits, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";


export default function AppTabs() {
    const walletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(window.ethereum!)
    })

    const [selectedToken1, setSelectedToken1] = useState<string>('');
    const [selectedToken2, setSelectedToken2] = useState<string>('');
    const [tokenOptions1, setTokenOptions1] = useState<Tokens>(Object.values(tokens));
    const [tokenOptions2, setTokenOptions2] = useState<Tokens>(Object.values(tokens));
    const [price1, setPrice1] = useState<number>(0);
    const [price2, setPrice2] = useState<number>(0);
    const [balance1, setBalance1] = useState<number>(0);
    const [balance2, setBalance2] = useState<number>(0);

    const fetchData1 = async (id: string) => {
        // const token = tokens[id]
        // console.log(token);
        // const address = token ? token.address : ""
        // const price = await fetchPrice(address)
        // // console.log(price);
        // setPrice1(price)
    };

    // useEffect(() => {

    //     const options = getAvailableTokens(selectedToken2);
    //     setTokenOptions1(options);



    //     // fetchData();
    //     // console.log(price1);

    // }, [selectedToken1]);

    // useEffect(() => {

    //     const options = getAvailableTokens(tokens[selectedToken1].address);
    //     setTokenOptions2(options);


    //     // fetchData();
    //     // console.log(price2);

    // }, [selectedToken2]);
    const fetchData2 = async () => {
        const price = await fetchPrice(tokens[selectedToken1].address)
        setPrice2(price)
    };

    const selected = "data-[state=active]:bg-black data-[state=active]:text-white"
    const mainStyle = {
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
    }
    const selectStyle = "bg-white/20 backdrop-blur-3xl text-white border-0"



    const { primaryWallet } = useDynamicContext();


    return (
        <Tabs defaultValue="order" className="flex-1 w-full h-full flex flex-col justify-start items-center" style={mainStyle}>
            <style jsx>
                {`
          .columnDivider {
            border-right: 1px solid #DEDEDE;
            margin-right:-10px; /* size of gutter */
            padding-right:10px; /* size of gutter */
          }
        `}

            </style>
            <TabsList className="z-30 my-[0.7rem] grid w-fit grid-cols-2 gradient-border-1 border-gradient-br-white-black-grey ">
                <TabsTrigger value="order" className={selected}>Set Up Order</TabsTrigger>
                <TabsTrigger value="pool" className={selected}>Create Pool</TabsTrigger>
            </TabsList>
            <TabsContent value="order" className="flex-1 flex justify-center items-center data-[state=inactive]:hidden ">
                <Card className="w-[25rem] bg-[#D9D9D9]/[.10] backdrop-blur-[75px] border border-solid border-white/[.25]">
                    <CardHeader>
                        <CardTitle className="text-white text-center">Create Order</CardTitle>
                        {/* <CardDescription>
                            Make changes to your account here. Click save when you're done.
                        </CardDescription> */}
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="z-10 relative h-fit flex flex-col gap-2">
                            {/* <OrderInput title="You pay" tokens={tokenOptions1} setToken={setToken1} /> */}
                            <div className="z-0 w-full flex flex-col gap-2 border border-solid border-white rounded-md py-3 px-5">
                                <Label htmlFor="name"
                                    className="text-white row-start-1 row-end-1 col-start-1 col-end-1 my-1"
                                > You pay </Label>
                                <div className="flex flex-row  items-center gap-4">
                                    <Input id="name" className="w-full" placeholder="0.0" />
                                    {/* <TokenSelect selectedToken={selectedToken} className="row-start-2 row-end-2 col-start-q3 col-end-3" /> */}
                                    <Select onValueChange={(value) => {
                                        setSelectedToken1(value)
                                        fetchData1(value)
                                    }}>
                                        <SelectTrigger className={`w-[200px] row-start-2 row-end-2 col-start-q3 col-end-3 ${selectStyle} focus:border-0 focus:ring-offset-0 focus:ring-0`}>
                                            <SelectValue placeholder="Select Token" />
                                        </SelectTrigger>
                                        <SelectContent className={selectStyle}>
                                            {Object.values<Token>(tokenOptions1).map((token: Token, index) => {
                                                return (
                                                    <SelectItem key={index} value={token.id}
                                                        className="flex justify-start text-start "
                                                    >
                                                        <div className="flex justify-center flex-row">
                                                            <img src={token.project.logoUrl} alt={token.name} className="mt-0 h-[15px] w-auto pr-2 " />
                                                            <div className="text-xs">
                                                                {token.name}
                                                            </div>
                                                        </div>
                                                    </SelectItem>)
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <p className="text-white/80 text-sm row-start-3 row-end-3 col-start-1 col-end-1">{price1 != 0 ? `${price1}` : "--"} $</p>
                                    <p className="text-white/80 text-sm row-start-3 row-end-3 col-start-3 col-end-3">Balance: {balance1 != 0 ? `${balance1}` : "--"}</p>
                                </div>
                            </div>
                            {/* <OrderInput title="You receive" tokens={tokenOptions2} setToken={setToken2} selectedToken={selectedToken2} /> */}
                            <div className="z-0 w-full flex flex-col gap-2 border border-solid border-white rounded-md py-3 px-5">
                                <Label htmlFor="name"
                                    className="text-white row-start-1 row-end-1 col-start-1 col-end-1 my-1"
                                > You receive </Label>
                                <div className="flex flex-row  items-center gap-4">
                                    <Input id="name" className="w-full" placeholder="0.0" />
                                    {/* <TokenSelect selectedToken={selectedToken} className="row-start-2 row-end-2 col-start-q3 col-end-3" /> */}
                                    <Select onValueChange={(value) => {
                                        setSelectedToken2(value)
                                        fetchData2()
                                    }}>
                                        <SelectTrigger className={`w-[200px] row-start-2 row-end-2 col-start-q3 col-end-3 ${selectStyle} focus:border-0 focus:ring-offset-0 focus:ring-0`}>
                                            <SelectValue placeholder="Select Token" />
                                        </SelectTrigger>
                                        <SelectContent className={selectStyle}>
                                            {Object.values<Token>(tokenOptions1).map((token: Token, index) => {
                                                return (
                                                    <SelectItem key={index} value={token.id}
                                                        className="flex justify-start text-start "
                                                    >
                                                        <div className="flex justify-center flex-row">
                                                            <img src={token.project.logoUrl} alt={token.name} className="mt-0 h-[15px] w-auto pr-2 " />
                                                            <div className="text-xs">
                                                                {token.name}
                                                            </div>
                                                        </div>
                                                    </SelectItem>)
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <p className="text-white/80 text-sm row-start-3 row-end-3 col-start-1 col-end-1">{price2 != 0 ? `${price2}` : "--"} $</p>
                                    <p className="text-white/80 text-sm row-start-3 row-end-3 col-start-3 col-end-3">Balance: {balance2 != 0 ? `${balance2}` : "--"}</p>
                                </div>
                            </div>
                            <Image src={arrow} alt="arrow" className="absolute left-[50%] top-[50%] ml-[-16px] mt-[-16px] z-30 h-8 w-auto cursor-pointer" />
                        </div>
                        <PriceCard token1={selectedToken1 ? tokens[selectedToken1] : ""} token2={tokens[selectedToken2]} />
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-white text-black hover:text-white" onClick={async () => {
                            await walletClient.switchChain({
                                id: baseSepolia.id
                            })
                            walletClient.writeContract({
                                account: primaryWallet!.address as `0x${string}`,
                                address: '0x36049eEBb46fdb37FAAc39D57d2F4FC5e5F857c9',
                                abi,
                                args: [
                                    /*  parseUnits("1000000", 18),
                                     primaryWallet?.address as `0x${string}`, */
                                    '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
                                ],
                                functionName: 'setCallerContract',
                            })
                        }} >Order</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}