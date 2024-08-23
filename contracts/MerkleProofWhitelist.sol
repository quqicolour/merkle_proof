//SPDX-License-Identifier: GPL-3
pragma solidity ^0.8.9;
import "../libraries/MerkleProof.sol";
import "./Ownable.sol";
contract MerkleProofWhitelist is Ownable{

    bytes32 public merkleRoot;

    constructor()Ownable(){}

    mapping(address=>bool)private whitelistIfClaim;

    event whitelistClaim(address indexed user);

    function setMerkleMes(bytes32 _merkleRoot)external onlyOwner{
        merkleRoot=_merkleRoot;
    }

    function whitelistMint(bytes32[] calldata _merkleProof)external{
        require(whitelistIfClaim[msg.sender]==false,"Already claim");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf),"Invalid proof");
        whitelistIfClaim[msg.sender]=true;
        emit whitelistClaim(msg.sender);
    }


}