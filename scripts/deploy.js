// scripts/deploy.js

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // ✅ Deploy Reward Token
  const TokenFactory = await hre.ethers.getContractFactory(
    "ReadifyRewardToken"
  );
  const token = await TokenFactory.deploy();
  await token.waitForDeployment(); // ✅ Correct in newer Hardhat
  console.log("✅ Token deployed to:", await token.getAddress());

  // ✅ Deploy Submission Manager with token address
  const tokenAddress = await token.getAddress();
  const ManagerFactory = await hre.ethers.getContractFactory(
    "ReadifySubmissionManager"
  );
  const manager = await ManagerFactory.deploy(tokenAddress);
  await manager.waitForDeployment();
  console.log("✅ Submission Manager deployed to:", await manager.getAddress());

  // ✅ Grant MINTER_ROLE
  const MINTER_ROLE = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("MINTER_ROLE")
  );
  const tx = await token.grantRole(MINTER_ROLE, await manager.getAddress());
  await tx.wait();
  console.log("✅ MINTER_ROLE granted to Submission Manager");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
