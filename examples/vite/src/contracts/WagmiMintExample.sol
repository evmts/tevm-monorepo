// SPDX-License-Identifier: MIT
pragma solidity >0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/// @author Wagmi
/// @author EVMts
/// @title  WagmiMintExample
/// @notice An example token original from the wagmi template
contract WagmiMintExample is ERC721 {
    uint256 public totalSupply;

    uint256 private nextTokenId = 0;

    constructor() ERC721("wagmi", "WAGMI") {}

    /// @notice Allows an address to mint
    function mint() external {
        uint256 tokenId = nextTokenId;
        while (_exists(tokenId)) {
            unchecked {
                tokenId++;
            }
        }
        _safeMint(msg.sender, tokenId);
        unchecked {
            totalSupply++;
            nextTokenId = tokenId + 1;
        }
    }

    /// @notice Returns the token URI for a given token by ID
    /// @param tokenId Token ID to mint.
    function mint(uint256 tokenId) external {
        require(!_exists(tokenId), "Token ID is taken");
        _safeMint(msg.sender, tokenId);
        unchecked {
            totalSupply++;
        }
    }

    /// @notice Returns the token URI for a given token by ID
    /// @param tokenId Token ID to query.
    /// @return uri_ Token URI for the given token by ID.
    function tokenURI(
        uint256 tokenId
    ) public pure override returns (string memory) {
        uint256 foregroundHue = uint256(
            keccak256(abi.encodePacked("foreground", tokenId))
        ) % 360;
        uint256 backgroundHue = uint256(
            keccak256(abi.encodePacked("background", tokenId))
        ) % 360;
        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "wagmi #',
                    toString(tokenId),
                    '", "image": "data:image/svg+xml;base64,',
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" fill="none"><path fill="hsl(',
                                toString(foregroundHue),
                                ', 100%, 10%)" d="M0 0h1024v1024H0z" /><g fill="hsl(',
                                toString(backgroundHue),
                                ', 100%, 90%)"><path d="M903 437.5c0 9.113-7.388 16.5-16.5 16.5s-16.5-7.387-16.5-16.5 7.388-16.5 16.5-16.5 16.5 7.387 16.5 16.5zM698.529 566c6.921 0 12.53-5.596 12.53-12.5v-50c0-6.904 5.609-12.5 12.529-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.53 12.5s12.529-5.596 12.529-12.5v-50c0-6.904 5.609-12.5 12.53-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.529 12.5h37.589c6.92 0 12.529-5.596 12.529-12.5v-75c0-6.904-5.609-12.5-12.529-12.5s-12.53 5.596-12.53 12.5v56.25a6.264 6.264 0 1 1-12.529 0V478.5c0-6.904-5.609-12.5-12.53-12.5H698.529c-6.92 0-12.529 5.596-12.529 12.5v75c0 6.904 5.609 12.5 12.529 12.5z" /><path d="M157.655 541c-6.932 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.619-12.5-12.551-12.5S120 471.596 120 478.5v75c0 6.904 5.62 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-50c0-6.904 5.619-12.5 12.552-12.5h144.345c3.465 0 6.276 2.798 6.276 6.25s-2.811 6.25-6.276 6.25H320.828c-6.933 0-12.552 5.596-12.552 12.5v37.5c0 6.904 5.619 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-75c0-6.904-5.619-12.5-12.552-12.5H283.172c-6.932 0-12.551 5.596-12.551 12.5v50c0 6.904-5.619 12.5-12.552 12.5h-25.103c-6.933 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.62-12.5-12.552-12.5s-12.552 5.596-12.552 12.5v50c0 6.904-5.619 12.5-12.551 12.5h-25.104zm301.242-6.25c0 3.452-2.811 6.25-6.276 6.25H339.655c-3.465 0-6.276-2.798-6.276-6.25s2.811-6.25 6.276-6.25h112.966c3.465 0 6.276 2.798 6.276 6.25zM497 553.818c0 6.929 5.628 12.546 12.571 12.546h132a6.28 6.28 0 0 1 6.286 6.272 6.28 6.28 0 0 1-6.286 6.273h-132c-6.943 0-12.571 5.616-12.571 12.546A12.56 12.56 0 0 0 509.571 604h150.858c6.943 0 12.571-5.616 12.571-12.545v-112.91c0-6.928-5.628-12.545-12.571-12.545H509.571c-6.943 0-12.571 5.617-12.571 12.545v75.273zm37.714-62.727c-6.943 0-12.571 5.617-12.571 12.545v25.091c0 6.929 5.628 12.546 12.571 12.546h100.572c6.943 0 12.571-5.617 12.571-12.546v-25.091c0-6.928-5.628-12.545-12.571-12.545H534.714z" fill-rule="evenodd" /></g></svg>'
                            )
                        )
                    ),
                    '"}'
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
