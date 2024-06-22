// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// const JAN_1ST_2030 = 1893456000;
// const ONE_GWEI = 1_000_000_000n;

// module.exports = buildModule("LockModule", (m) => {
//   const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
//   const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

//   const lock = m.contract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   return { lock };
// });

const hre=require("hardhat");

async function main() {
 
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();

  console.log("nft market deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();

  console.log("nft deployed to :",nft.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// const { build } = require('@nomiclabs/hardhat-ignition');

// const deployment = build.deployment('Deployment', async (deploy, namedAccounts) => {
//   // Deploy the NFTMarket contract
//   const nftMarket = await deploy('NFTMarket');
//   console.log("nft market deployed to:", nftMarket.address);

//   // Deploy the NFT contract with the address of the deployed NFTMarket contract
//   const nft = await deploy('NFT', { args: [nftMarket.address] });
//   console.log("nft deployed to :", nft.address);
// });

// module.exports = { deployment };
