"use client"
import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Token } from "@/utils/tokens"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import plus from "@/public/plus.svg"
import minus from "@/public/minus.svg"

export default function PriceCard({ token1, token2 }: { token1: Token, token2: Token }) {
    const [price, setPrice] = useState<number>(0);

    useEffect(() => {
        // Fetch token data
        // const tokenData = await fetch(`https://api.example.com/tokens/${tokenAddress}`);
        // const tokenJson = await tokenData.json();
        // setToken1(tokenJson.name);
        // setToken2(tokenJson.symbol);
        // console.log(token1, token2);
    }, [token2]);

    function n(a: number, b: number, operation: number): number {
        if (!operation) return a + b;
        else return a - b;
    }

    return (
        <div className="z-0 w-full flex flex-col gap-2 border border-solid border-white rounded-md py-3 px-5">
            <Label htmlFor="name"
                className="text-white row-start-1 row-end-1 col-start-1 col-end-1 my-1"
            > Price </Label>
            <div className="flex flex-row  items-center gap-4">
                <Input id="name" className="w-full" placeholder="0.0" />
                <div className="flex flex-col gap-2">
                    <Button className={`h-7 w-7 bg-white/30 backdrop-blur-xl ${price != 0 ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={() => setPrice(n(price, 0.1, 0))}>
                        <Image src={plus} alt="plus" className="h-4 w-auto p-3 text-white block" />
                    </Button>
                    <Button className={`h-7 w-7 bg-white/30 backdrop-blur-xl ${price != 0 ? "cursor-pointer" : "cursor-not-allowed"} `} onClick={() => setPrice(n(price, 0.1, 1))}>
                        {/* <Image src={minus} alt="minus" className="h-4 w-auto p-3 text-white block" /> */}
                    </Button>
                </div>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-white/80 text-sm row-start-3 row-end-3 col-start-1 col-end-1">
                    {token1 ? `${token1.symbol}` : "--"} per {token2 ? `${token2.symbol}` : "--"}
                </p>
                <p className="text-white/80 text-sm row-start-3 row-end-3 col-start-3 col-end-3">Balance: 0</p>
            </div>
        </div>
    )
}