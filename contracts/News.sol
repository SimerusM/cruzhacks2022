pragma solidity >=0.4.22 <0.9.0;

contract News {

    // Store image hashes
    mapping(address => mapping(uint256 => bool)) private imageHashes;
    // Store news headline hashes
    mapping(address => mapping(uint256 => bool)) private articleHashes;

    function addImage(uint256 hashval) public {
        imageHashes[msg.sender][hashval] = true;
    }

    function addArticle(uint256 hashval) public {
        articleHashes[msg.sender][hashval] = true;
    }

    function checkImage (address publisher, uint256 hashval) public view returns (bool) {
        return imageHashes[publisher][hashval];
    }

    function checkArticle (address publisher, uint256 hashval) public view returns (bool) {
        return articleHashes[publisher][hashval];
    }

    function removeImage(uint256 hashval) public {
        imageHashes[msg.sender][hashval] = false;
    }

    function removeArticle(uint256 hashval) public {
        articleHashes[msg.sender][hashval] = false;
    }

}