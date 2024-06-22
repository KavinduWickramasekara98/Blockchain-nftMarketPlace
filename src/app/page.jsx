
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
    
        const provider= new ethers.providers.JsonRpcProvider()
        //const provider = ethers.getDefaultProvider();
        
        // if (provider) {
        //     console.log("Network name:", provider.network.name);
        //     console.log("Network chain ID:", provider.network.chainId);
        // }else{
        //     console.log("No provider");
        // }
        //console.log("this is NFT : "+  JSON.stringify(NFT.abi, null, 2));
        //console.log("this is NFTMarket : "+  JSON.stringify(NFTMarket.abi, null, 2));
        console.log("NFT address : "+nftaddress);
        console.log("Market address : "+nftmarketaddress);
        const nftContract = new ethers.Contract(nftaddress,NFT.abi,provider);
        const nftMarketContract = new ethers.Contract(nftmarketaddress,NFTMarket.abi,provider);
        //const data =await nftMarketContract.getListingPrice();
        //let price = ethers.utils.formatUnits(data.toString(), 'ether');
        //console.log("Get contracts done "+price);
        
         
        const data =await nftMarketContract.fetchMarketItems();
       // console.log("This is nft market ALL data : "+data);
        //all need to work perfectly so use promise.
        try {
            const items = await Promise.all(
                    data.map(async (i)=> {
                        // const items = await Promise.all(data.products.map(async i=> {    
                        const tokenURI = await nftContract.tokenURI(i.tokenId)
                        console.log("TokenURI in  :"+tokenURI);
                        const meta = await axios.get(tokenURI)
                        console.log(meta.data);
                        //for parseInteger 
                        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                        let item = {
                            price:price,
                            tokenId:i.tokenId.toString(),
                            seller:i.seller,
                            owner:i.owner,
                            image:meta.data.image,
                            name:meta.data.name,
                            description:meta.data.description
                        }
                        console.log("this is item : "+meta.data.image)
                        return item   
                    }
                )
            );   

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
                    nfts.map((nft,i)=>(
                        <div key={i} className="border shadow rounded-3xl overflow-hidden flex flex-col items-center" style={{ height: '60vh' }}>
                            <img className="rounded mt-4" src={nft.image} alt="allnfts" style={{ height: '30vh' }}/>
                            <div className="p-1">
                                    <p style={{height:'4vh'}} className="text-2xl font-semibold">
                                        {nft.name}
                                    </p>
                                    <div style={{height:'6vh',overflow:"hidden"}}>
                                        <p className="text-gray-600 font-bold">{nft.description}</p>
                                    </div>
                            </div>
                            <div className="rounded p-1 bg-yellow-950 w-full flex flex-col items-center bg-opacity-75">
                                <p className="text-2xl mb-4 font-bold text-white ">{nft.price} ETH</p>
                                <button className="text-xl rounded-2xl bg-yellow-50 text-yellow-950 font-bold py-2 px-12"
                                onClick={()=>buyNFT(nft)}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
    
}
