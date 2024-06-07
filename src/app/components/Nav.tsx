import React from 'react'
import Link from 'next/link'
const Nav = () => {
  return (
           <nav className="border-b p-6">
                <p className="text-4xl font-bold flex justify-center text-cyan-50 outline-black">
                        Ivak Dev MarketPlace
                </p>
                <div className="flex justify-center p-8">
                    <Link href="/" className="mr-4 text-xl text-cyan-50 outline-black">
                        Home
                    </Link>
                    <Link href="/createNFT" className="mr-4 text-xl text-cyan-50 outline-black">
                        Mint NFTs
                    </Link>
                    <Link href="/myNFTs" className="mr-4 text-xl text-cyan-50 outline-black">
                        My NFTs
                    </Link>
                    <Link href="/dashboard" className="mr-4 text-xl text-cyan-50 outline-black">
                        Dashboard
                    </Link>
                </div>
           </nav>
          
        
  )
}

export default Nav