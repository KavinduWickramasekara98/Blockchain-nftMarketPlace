
'use client'
import { ethers } from "ethers";
import { useEffect,useState } from "react";
import axios from "axios";
import Web3Modal from 'web3modal';
import {nftaddress,nftmarketaddress} from '../../config';
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";


import "./globals.css";



export default function Home() {
    //all NFT load to Array
    let [nfts,setNFTs] =useState([])
    let [loadingState,setLoadingState]=useState('not-loaded')
    useEffect(()=>{
        loadNFTs()
    },[])
//remote procedure call
//run command on other machine
//evm is a other machine
    async function loadNFTs(){
        const provider =new ethers.providers.JsonRpcProvider();
        const nftContract = new ethers.Contract(nftaddress,NFT.abi,provider);
        const nftMarketContract = new ethers.Contract(nftmarketaddress,NFTMarket.abi,provider);
        const data = nftMarketContract.fetchMarketItems();
console.log("ALL data /n"+data);
        //all need to work perfectly so use promise.
        try {
            const items = await Promise.all(data.map(async (i)=> {
                // const items = await Promise.all(data.products.map(async i=> {    
                     const tokenURI = await nftContract.tokenURI(i.tokenId)
                     const meta = await axios.get(tokenURI)
         
                     //for parseInteger 
                     let price = ethers.utils.formatUnits(i.price.toString(),'ether')
                     let item = {
                         price,
                         tokenId:i.tokenId.toNumber(),
                         seller:i.seller,
                         owner:i.owner,
                         image:meta.data.image,
                         name:meta.data.name,
                         description:meta.data.description
                     }
                     return item   
                    }));   
                    setNFTs(await items)
                    setLoadingState('loaded')      
        } catch (error) {
            console.log("Load NFT file : "+ error);
        }

       
        
    }
    async function buyNFT(nft){
        //same to create NFT
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()

        const provider = new ethers.providers.Web3Provider(connection)

        const signer = provider.getSigner();
        const contract = new ethers.Contract(nftmarketaddress,NFTMarket.abi,signer);
        const price = ethers.utils.parseUnits(nft.price.toString(),'ether')
        const transaction = await contract.createMarketSale(nftaddress,nft.tokenId,{
            value:price
        })
        await transaction.wait()
        loadNFTs()
    }
    //nft array eka empty nan ekata mokada karanne kiyala thiyenawa
    if (loadingState="loaded" && !nfts.length) {
        return(
            <div>
            <p className="px-10 py-10 text-2xl font-bold flex justify-center text-cyan-200">
                Currently no NFTs in the Marketplace.<br/> Please comeback later
            </p>
            </div>
        )
    }
    // div{} map ekata
    return( 
        <div className="flex justify-center">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
                    {
                    nfts.map(nft,i=>{
                        <div key={i} className="border shadow rounded-3xl overflow-hidden">
                            <img src={i.image}/>
                            <div className="p-4">
                                    <p style={{height:'64px'}} className="text-2xl font-semibold">
                                        {nft.name}
                                    </p>
                                    <div style={{height:'70px',overflow:"hidden"}}>
                                        <p className="text-gray-400">{nft.description}</p>
                                    </div>
                            </div>
                            <div className="p-4 bg-blue">
                                <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                                <button className="w-full bg-purple-600 text-white font-bold py-2 px-12"
                                onClick={()=>buyNFT(nft)}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    })
                    }
                </div>
            </div>
        </div>
    )
    
}
