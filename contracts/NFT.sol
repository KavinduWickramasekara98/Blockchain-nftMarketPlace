// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


// Uniform Resource Identifier -- is a sequence of characters
// that distinguishes one resource from another. 
// It means that the tokenURIs are also stored in "storage". 
// The base implementation in ERC721.sol reads the baseURI in
// memory and concatenates the resulting String on-the-fly,
// without storing them as a state var.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

//counters is a utility smart contract used for counting token items in blockchain.
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress; 

    constructor(address marketPlaceAddress) ERC721("Kavindu","IVAK"){
        contractAddress=marketPlaceAddress;
    }
    function createToken(string memory tokenURI) public returns(uint){
        _tokenIds.increment();
        uint256 newItemId=_tokenIds.current();
        _mint(msg.sender,newItemId);
        _setTokenURI(newItemId,tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
         
    }
}