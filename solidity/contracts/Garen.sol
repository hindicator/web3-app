// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Garen is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant MAX_MINT_PER_PERSON = 2;
    uint256 public constant MINT_PRICE = 0.5 ether;
    bool public isSaleOn = true;
    mapping(address => uint16) mintWallets;

    event mintEvent(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    constructor() ERC721("Garen", "GRN") {}

    /**
     * isMinted token - return boolean if token is minted
     * @param tokenId the token of the item
     */
    function isMinted(uint256 tokenId) external view returns (bool) {
        require(tokenId < MAX_SUPPLY, "tokenId outside collection bounds");
        return _exists(tokenId);
    }

    function mint() public payable {
        require(
            mintWallets[msg.sender] < MAX_MINT_PER_PERSON,
            "Acceded the maximum amount of mints per person"
        );
        require(msg.value == MINT_PRICE, "Wrong amount sent");
        require(isSaleOn, "Sale is not available");

        _tokenIdCounter.increment();
        mintWallets[msg.sender]++;
        emit mintEvent(address(this), msg.sender, 5);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function toggleSaleState() public onlyOwner {
        isSaleOn = !isSaleOn;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        require(isSaleOn, "Sale is not available");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
