// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RousseauNFTs is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => NFT) private _idToNFT;

    struct NFT {
        uint256 tokenId;
        address payable owner;
    }

    /// @dev Base token URI used as a prefix by tokenURI().
    string public baseTokenURI;

    constructor() ERC721("RousseauNFTs", "FYR") {
        baseTokenURI = "ipfs://";
    }

    // function _baseURI() internal pure override returns (string memory) {
    //     return "ipfs://";
    // }

    /// @dev Returns an URI for a given token ID
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _idToNFT[tokenId] = NFT(
            tokenId, 
            payable(msg.sender)
        );
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getSender() public view returns (address) {
        return msg.sender;
    }


    function payToMint(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {
        // require(existingURIs[metadataURI] == 0, 'NFT already minted!');
        require (msg.value >= 0.05 ether, 'Need to pay up!');

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _idToNFT[newItemId] = NFT(
            newItemId, 
            payable(msg.sender)
        );


        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    function getMyNfts() public view returns (NFT[] memory) {
        uint nftCount = _tokenIdCounter.current();
        uint myNftCount = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_idToNFT[i + 1].owner == msg.sender) {
                myNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](myNftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_idToNFT[i + 1].owner == msg.sender) {
                nfts[nftsIndex] = _idToNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getAllNfts() public view returns (NFT[] memory) {
        uint nftCount = _tokenIdCounter.current();

        NFT[] memory nfts = new NFT[](nftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            nfts[nftsIndex] = _idToNFT[i + 1];
            nftsIndex++;
        }
        return nfts;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /// @dev Sets the base token URI prefix.
    function setBaseTokenURI(string memory _baseTokenURI) public {
        baseTokenURI = _baseTokenURI;
    }
}