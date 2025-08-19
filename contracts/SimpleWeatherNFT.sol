// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract SimpleWeatherNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    constructor() ERC721("Simple Weather NFT", "SWRNFT") {
        _transferOwnership(msg.sender);
    }
    function mint(address to) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}
