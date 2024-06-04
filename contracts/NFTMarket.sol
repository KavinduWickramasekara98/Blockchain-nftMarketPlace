// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listingPrice = 0.01 ether; //commission get for 1NFT sell

    constructor(){
        owner = payable(msg.sender);
    }

    struct MarketItem{ //same name store different data types
        uint itemId;   //reference this document
        address nftContract;
        uint tokenId; //IERC known unique key
        address payable seller; //external account want to sell NFT in this platform
        address payable owner; //owner of NFT Market who get the listing fees
        uint256 price;
        bool sold; //sold or not
    }


    //map id to MarketItem

    mapping(uint256=>MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,  //reference this document
        address indexed nftContract,
        uint256 indexed tokenId,  //IERC known unique key
        address seller, //creater of nft
        address owner, //smart contract address
        uint256 price,
        bool sold
    );

//can use to UI
    function getListingPrice() public view returns(uint256 ){
        return listingPrice;
    }

//create NFT 
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    )public payable nonReentrant{
        require(price>0,"price need to be at least 1 wei" );
        require(msg.value == listingPrice,"price need to be equal to listingPrice");
        _itemIds.increment();
        uint256 itemId=_itemIds.current();

        //
        idToMarketItem[itemId]=MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), //market palce contract
            payable(address(0)), //artist/owner/creater
            price,
            false
        );

        //this is actual nft creation
        IERC721(nftContract).transferFrom(msg.sender,address(this),tokenId);


        //check detail what happen in my nft 
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender, //creater of nft
            address(0), //smart contract address
            price,
            false
        );
    }

    //NFT put into market
    function createMarketSale(
        address payable nftContract,
        uint256 itemId
        //price already given
    )public payable nonReentrant{

        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId=idToMarketItem[itemId].tokenId;
        require(msg.value == price,"Please add currect price for Order");
        idToMarketItem[itemId].seller.transfer(msg.value); //send money to creater

        IERC721(nftContract).transferFrom(address(this),msg.sender,tokenId);//ownership is changing
        idToMarketItem[itemId].owner = payable(msg.sender); //new owner will be msg sendr
        idToMarketItem[itemId].sold =true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice); //commission of this

    }
//find unsold NFTs..SO some one can buy NFTs
    function fetchMarketItems() public view returns(MarketItem[] memory){
        uint itemCount = _itemIds.current();
        uint unSoldItemCount = _itemIds.current()-_itemsSold.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unSoldItemCount);
        for (uint i=0; i<itemCount; i++) 
        {
            if(idToMarketItem[i+1].owner==address(0)){  //address(0) gives the unsold items.we assign owner when create
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem=idToMarketItem[currentId];
                items[currentIndex]=currentItem;
                currentIndex+=1;

            }
        }
        return items;
    }


//
    function fetchMyNFT() public view returns(MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex=0;
        //if there are 1000 NFTs.find how many NFTs own by address/msg.sender
        for (uint i=0; i<totalItemCount; i++) 
        {
            if(idToMarketItem[i+1].owner == msg.sender){
                itemCount+=1;
            }  
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i=0; i<totalItemCount; i++) //all NFTs iterating
        {
            if (idToMarketItem[i+1].owner ==msg.sender) { //counters begin from 1
                uint currentId = i+1;
                MarketItem memory ownItem = idToMarketItem[currentId];
                items[currentIndex] = ownItem;
                currentIndex+=1;
            }
        }
        return items;

    }

//some one is a seller.that means he create NFT
    function fetchItemsCreated() public view returns(MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount=0;
        uint currentIndex = 0;

        for (uint i=0; i<totalItemCount; i++) 
        {
            if (idToMarketItem[i+1].seller==msg.sender) {
                itemCount+=1;
            }
            
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i=0; i<totalItemCount; i++) 
        {
            uint currentId=i+1;
            if(idToMarketItem[currentId].seller == msg.sender){
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex]=currentItem;
                currentIndex+=1;
            }
        }
        return items;
    }
}
