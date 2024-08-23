const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const keccak256 = require("keccak256");
async function main() {
  const [owner1,owner2,owner3]=await hre.ethers.getSigners();
  console.log("owner1:",owner1.address);

  let whitelistAddress=[
    owner1.address,
    owner2.address,
  ]

  const leafNodes=whitelistAddress.map(addr=>keccak256(addr));
  const merkleTree=new MerkleTree(leafNodes, keccak256, {sortPairs: true});
  const rootHash=merkleTree.getRoot();
  console.log("leafNodes:",leafNodes);
  console.log("merkleTree:",merkleTree.toString());
  console.log("rootHash:",rootHash.buffer);

  const hexProof1=merkleTree.getHexProof(leafNodes[0]);

  const MerkleProofDepoly = await hre.ethers.deployContract("MerkleProofWhitelist");
  await MerkleProofDepoly.deployed();
  console.log("MerkleProofDepoly:", MerkleProofDepoly.address);

  console.log("merkleProofContract:",MerkleProofDepoly);

  const setMerkleMes = await MerkleProofDepoly.setMerkleMes(rootHash);
  await setMerkleMes.wait();
  console.log("setMerkleMes success");

  const whitelistMint1 = await MerkleProofDepoly.whitelistMint(hexProof1);
  await whitelistMint1.wait();
  console.log("whitelist mint success");
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
