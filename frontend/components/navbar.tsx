"use client"

import Link from "next/link"
import Image from "next/image"
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import logo from "@/public/logo.svg"

export default function Navbar() {
    const path = usePathname().split("/")[1]

    return (
        <nav className="flex flex-row w-full bg-transparent h-16 justify-between items-center px-[6vw] z-20">

            <Image src={logo} alt="logo" className="h-6 w-auto text-white" />

            {(path == "app") ? (
                // <div className="h-4"></div>
                <DynamicWidget buttonContainerClassName="max-h-[42px]" buttonClassName="" variant='modal' />
            ) : (
                <Link href={"/app"}>
                    <Button className="bg-white text-black">Launch App</Button>
                </Link>
            )}

        </nav>
    )
}