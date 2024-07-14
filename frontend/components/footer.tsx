import Image from "next/image";
import x from "@/public/x.svg"
import telegram from "@/public/telegram.svg"
import discord from "@/public/discord.svg"

export default function Footer() {

    const style = "h-5 w-auto"

    return (
        <footer className="flex flex-row w-full bg-black text-white text-sm h-16 justify-between items-center px-[6vw] border-t border-white/50 border-solid">
            <p>© 2024 SkoTx. All rights reserved.</p>
            <div className="flex flex-row gap-4">
                <Image src={x} alt="social" className={style} />
                <Image src={telegram} alt="social" className={style} />
                <Image src={discord} alt="social" className={style} />
            </div>
        </footer>
    );
}