const hre = require("hardhat");

async function main() {
  const Tracking = await hre.ethers.getContractFactory("Tracking");
  const tracking = await Tracking.deploy();

  await tracking.deployed();

  console.log("Lock deployed to:", tracking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
// This script deploys the Tracking contract to the Ethereum network using Hardhat.
