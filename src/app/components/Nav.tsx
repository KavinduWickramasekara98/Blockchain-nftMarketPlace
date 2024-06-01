import React from 'react'
import Link from 'next/link'
const Nav = () => {
  return (
    <div className="border-b p-6 bg-gradient-to-b from-yellow-950 to-yellow-100">
           <nav className="border-b p-6">
                <p className="text-4xl font-bold flex justify-center text-cyan-50">
                        Ivak Dev MarketPlace
                </p>
                <div className="flex justify-center p-8">
                    <Link href="/" className="mr-4 text-xl text-cyan-50">
                        Home
                    </Link>
                    <Link href="/createNFT" className="mr-4 text-xl text-cyan-50">
                        Mint NFTs
                    </Link>
                    <Link href="/myNFTs" className="mr-4 text-xl text-cyan-50">
                        My NFTs
                    </Link>
                    <Link href="/dashboard" className="mr-4 text-xl text-cyan-200">
                        Dashboard
                    </Link>
                </div>
           </nav>
           {/* <Component/> */}
           {/* <Component/> */}
        </div>
  )
}

export default Nav