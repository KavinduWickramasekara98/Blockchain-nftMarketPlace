const{expect}=require("chai");
//const{describe,it}=require("node:test");

describe("NFTMarket",function(){ 

    //it = execute individual tests
    // it("Deploy market",async function(){

    // });  
    // it("Deploy NFT",async function(){

    // }); 
it("Deploy smart contracts on blockchain,mint new nfts,sell a NFT and make transact! on the blockchain",async function(){
       


    const Market=await ethers.getContractFactory("NFTMarket")
    const market=await Market.deploy()
    
    await market.deployed()
    const marketAddress=market.address
    console.log(market.address);

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed()
        const nftContractAddress = nft.address

        let listingPrice = await market.getListingPrice()
        listingPrice=listingPrice.toString()
        const sellingPrice = ethers.utils.parseUnits("10","ether")//create new NFT price 10
        await nft.createToken("https://www.pwskills1.com") //alow market owner to handle sall
        await nft.createToken("https://www.pwskills2.com")

        //same ipfs  and token id .this is not real one 
        await market.createMarketItem(nftContractAddress,1,sellingPrice,{value:listingPrice}) //token id 1
        await market.createMarketItem(nftContractAddress,2,sellingPrice,{value:listingPrice}) //token id 1 

        //js structuring and distructuring
        const[_,buyerAddress]=await ethers.getSigners() //take last account address from all accountaddress
        await market.connect(buyerAddress).createMarketSale(nftContractAddress,1,{value:sellingPrice})
    
        let items = await market.fetchMarketItems();
        //all market items will load async without error
        items = await Promise.all(items.map(async i=>{ //promise is satisfied then will be called to assert
            const tokenURI=await nft.tokenURI(i.tokenId)
            let item={
                price:i.price.toString(),
                tokenId:i.tokenId.toString(),
                seller:i.seller,
                owner:i.owner,
                tokenURI
            }
            return item
        }))
        console.log('items:',items)
    });
});