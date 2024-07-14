// import { useState } from "react";
// import Image from "next/image";
// import {
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Token, Tokens } from "@/utils/tokens"
// import { useTokenContext } from "./tokenContext";


// export default function tokenSelect({
//     className,
//     selectedToken
// }: {
//     className: string,
//     selectedToken: number
// }) {

//     const style = "bg-white/20 backdrop-blur-3xl text-white border-0"

//     let selectedToken1: string = "";
//     let selectedToken2: string = "";
//     let setSelectedToken1: (token: string) => void = () => { };
//     let setSelectedToken2: (token: string) => void = () => { };
//     let tokenOptions1: Tokens = {};
//     let tokenOptions2: Tokens = {};
//     if (selectedToken == 1) ({ selectedToken1, setSelectedToken1, tokenOptions1 } = useTokenContext());
//     else ({ selectedToken2, setSelectedToken2, tokenOptions2 } = useTokenContext());

//     return (
//         <>
//             {selectedToken == 1 ? (
//                 <Select onValueChange={setSelectedToken1}>
//                     <SelectTrigger className={`w-[200px] ${className} ${style} focus:border-0 focus:ring-offset-0 focus:ring-0`}>
//                         <SelectValue placeholder="Select Token" />
//                     </SelectTrigger>
//                     <SelectContent className={`${style}`}>
//                         {Object.values<Token>(tokenOptions1).map((token: Token, index) => {
//                             return (
//                                 <SelectItem key={index} value={token.id}
//                                     className="flex justify-start text-start"
//                                 >
//                                     {/* // <Image src={token.project.logoUrl} alt={token.name} className="h-3 w-auto" /> */}
//                                     {token.name}
//                                 </SelectItem>)
//                         })}
//                     </SelectContent>
//                 </Select>
//             ) : (
//                 <Select onValueChange={setSelectedToken2}>
//                     <SelectTrigger className={`w-[200px] ${className} ${style} focus:border-0 focus:ring-offset-0 focus:ring-0`}>
//                         <SelectValue placeholder="Select Token" />
//                     </SelectTrigger>
//                     <SelectContent className={`${style}`}>
//                         {Object.values<Token>(tokenOptions2).map((token: Token, index) => {
//                             return (
//                                 <SelectItem key={index} value={token.id}
//                                     className="flex justify-start text-start"
//                                 >
//                                     {/* // <Image src={token.project.logoUrl} alt={token.name} className="h-3 w-auto" /> */}
//                                     {token.name}
//                                 </SelectItem>)
//                         })}
//                     </SelectContent>
//                 </Select>
//             )}
//         </>
//     )

// }
