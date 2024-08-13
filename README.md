# NFT Marketplace DApp
## Overview
This project is a decentralized NFT (Non-Fungible Token) marketplace built on the Ethereum blockchain. It allows users to mint, buy, and view NFTs using a seamless and intuitive interface. The application leverages Hardhat for local blockchain development, Pinata as an IPFS service for storing NFT metadata, and Next.js for the front-end. Users can connect their wallets to interact with the marketplace, enabling secure and transparent transactions.

<details><summary>Image Initial Page</summary>
   <img src="https://github.com/user-attachments/assets/d52a31db-543e-41c8-9d26-58985741a570" width=35% height=35%>
</details>
<details><summary>Image  Mint NFT </summary>
   <img src="https://github.com/user-attachments/assets/2d2392a0-9ea2-4342-bbfd-20a905e3e8b6" width=35% height=35%>
   <img src="https://github.com/user-attachments/assets/6e658cdb-eb75-4a82-ab51-5d333546b418" width=35% height=35%>
   
</details>


## Features
Mint NFTs: Users can mint their own NFTs by uploading artwork or any digital asset, with metadata stored on IPFS via Pinata.
View Owned NFTs: Users can view the NFTs they own directly within the marketplace.
Buy NFTs: Users can browse listed NFTs and purchase them using their connected wallet.
Wallet Integration: Connect a MetaMask wallet to perform transactions, mint NFTs, and view owned assets.
Local Blockchain Development: The project uses Hardhat to run a local Ethereum blockchain for testing and development.
Technology Stack
Solidity: Smart contract development for minting, buying, and selling NFTs.
Hardhat: A development environment to compile, deploy, test, and debug Ethereum software.
Pinata: IPFS (InterPlanetary File System) service used for storing NFT metadata securely and decentrally.
Next.js: A React-based framework used to build the front-end of the application.
MetaMask: Browser extension wallet used for Ethereum transactions and interacting with the DApp.
Setup Instructions
Prerequisites
Node.js and npm installed
MetaMask extension installed in your browser
Hardhat installed globally (npm install -g hardhat)
Pinata account for IPFS services
Smart Contract Deployment
Clone the Repository:

bash
Copy code
```console
git clone https://github.com/KavinduWickramasekara98/Blockchain-nftMarketPlace.git
cd nft-marketplace
```
Install Dependencies:

bash
Copy code
```
npm install
```
Compile the Smart Contracts:
bash
Copy code
```
npx hardhat compile
```
Start the Local Blockchain:

bash
Copy code
```
npx hardhat node
```
Deploy the Contracts:

bash
Copy code
```
npx hardhat run scripts/deploy.js --network localhost
```
Update Contract Address:
Update the deployed contract address and ABI in your Next.js front-end to ensure proper communication between the front-end and the blockchain.

Front-End Setup
Configure Environment Variables:
Create a .env.local file in the root of your project and add your Pinata API keys and Hardhat local network details.

## Start the Front-End:

bash
Copy code
```
npm run dev
```
Access the Application:
Open your browser and go to http://localhost:3000 to interact with the NFT marketplace.

## Usage
Connect Wallet: Click on the "Connect Wallet" button to link your MetaMask wallet with the marketplace.
Mint NFTs: Use the minting feature to create your own NFTs by uploading a digital asset. Metadata is stored on IPFS via Pinata.
View Your NFTs: Navigate to the "My NFTs" section to view all NFTs you own.
Buy NFTs: Browse the marketplace to find NFTs for sale and purchase them using your connected wallet.
Future Enhancements
Auction Feature: Implement an auction system for NFTs, allowing users to bid on assets.
User Profiles: Create user profiles to track and display owned, minted, and purchased NFTs.
Mobile Support: Enhance the UI/UX for mobile devices to provide a seamless experience across all platforms.
Social Sharing: Allow users to share their NFTs on social media directly from the platform.
## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
OpenZeppelin: For providing secure and reusable smart contract libraries.
Hardhat: For its comprehensive Ethereum development environment.
Pinata: For their reliable IPFS services.
MetaMask: For enabling seamless Ethereum wallet integration.
