import { join } from 'path'
import { compileContract } from './compileContracts.js'
import { describe, expect, it, vi } from 'vitest'
import type { FileAccessObject } from '../types.js'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import type { ResolvedCompilerConfig } from '@evmts/config'

describe('compileContract', () => {
	const mockLogger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	}

	const fao: FileAccessObject = {
		existsSync,
		readFile,
		readFileSync,
	}

	it('should successfully compile a contract without errors', async () => {
		const config: ResolvedCompilerConfig = {
			foundryProject: false,
			libs: [],
			remappings: {},
		}
		expect(
			await compileContract('./Contract.sol', join(__dirname, '..', 'fixtures', 'basic'), config, false, fao, mockLogger)
		).toMatchInlineSnapshot(`
			{
			  "artifacts": {
			    "WagmiMintExample": {
			      "abi": [
			        {
			          "inputs": [],
			          "stateMutability": "nonpayable",
			          "type": "constructor",
			        },
			        {
			          "anonymous": false,
			          "inputs": [
			            {
			              "indexed": true,
			              "internalType": "address",
			              "name": "owner",
			              "type": "address",
			            },
			            {
			              "indexed": true,
			              "internalType": "address",
			              "name": "approved",
			              "type": "address",
			            },
			            {
			              "indexed": true,
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "Approval",
			          "type": "event",
			        },
			        {
			          "anonymous": false,
			          "inputs": [
			            {
			              "indexed": true,
			              "internalType": "address",
			              "name": "owner",
			              "type": "address",
			            },
			            {
			              "indexed": true,
			              "internalType": "address",
			              "name": "operator",
			              "type": "address",
			            },
			            {
			              "indexed": false,
			              "internalType": "bool",
			              "name": "approved",
			              "type": "bool",
			            },
			          ],
			          "name": "ApprovalForAll",
			          "type": "event",
			        },
			        {
			          "anonymous": false,
			          "inputs": [
			            {
			              "indexed": true,
			              "internalType": "address",
			              "name": "from",
			              "type": "address",
			            },
			            {
			              "indexed": true,
			              "internalType": "address",
			              "name": "to",
			              "type": "address",
			            },
			            {
			              "indexed": true,
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "Transfer",
			          "type": "event",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "address",
			              "name": "to",
			              "type": "address",
			            },
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "approve",
			          "outputs": [],
			          "stateMutability": "nonpayable",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "address",
			              "name": "owner",
			              "type": "address",
			            },
			          ],
			          "name": "balanceOf",
			          "outputs": [
			            {
			              "internalType": "uint256",
			              "name": "",
			              "type": "uint256",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "getApproved",
			          "outputs": [
			            {
			              "internalType": "address",
			              "name": "",
			              "type": "address",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "address",
			              "name": "owner",
			              "type": "address",
			            },
			            {
			              "internalType": "address",
			              "name": "operator",
			              "type": "address",
			            },
			          ],
			          "name": "isApprovedForAll",
			          "outputs": [
			            {
			              "internalType": "bool",
			              "name": "",
			              "type": "bool",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [],
			          "name": "mint",
			          "outputs": [],
			          "stateMutability": "nonpayable",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "mint",
			          "outputs": [],
			          "stateMutability": "nonpayable",
			          "type": "function",
			        },
			        {
			          "inputs": [],
			          "name": "name",
			          "outputs": [
			            {
			              "internalType": "string",
			              "name": "",
			              "type": "string",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "ownerOf",
			          "outputs": [
			            {
			              "internalType": "address",
			              "name": "",
			              "type": "address",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "address",
			              "name": "from",
			              "type": "address",
			            },
			            {
			              "internalType": "address",
			              "name": "to",
			              "type": "address",
			            },
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "safeTransferFrom",
			          "outputs": [],
			          "stateMutability": "nonpayable",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "address",
			              "name": "from",
			              "type": "address",
			            },
			            {
			              "internalType": "address",
			              "name": "to",
			              "type": "address",
			            },
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			            {
			              "internalType": "bytes",
			              "name": "data",
			              "type": "bytes",
			            },
			          ],
			          "name": "safeTransferFrom",
			          "outputs": [],
			          "stateMutability": "nonpayable",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "address",
			              "name": "operator",
			              "type": "address",
			            },
			            {
			              "internalType": "bool",
			              "name": "approved",
			              "type": "bool",
			            },
			          ],
			          "name": "setApprovalForAll",
			          "outputs": [],
			          "stateMutability": "nonpayable",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "bytes4",
			              "name": "interfaceId",
			              "type": "bytes4",
			            },
			          ],
			          "name": "supportsInterface",
			          "outputs": [
			            {
			              "internalType": "bool",
			              "name": "",
			              "type": "bool",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [],
			          "name": "symbol",
			          "outputs": [
			            {
			              "internalType": "string",
			              "name": "",
			              "type": "string",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "tokenURI",
			          "outputs": [
			            {
			              "internalType": "string",
			              "name": "",
			              "type": "string",
			            },
			          ],
			          "stateMutability": "pure",
			          "type": "function",
			        },
			        {
			          "inputs": [],
			          "name": "totalSupply",
			          "outputs": [
			            {
			              "internalType": "uint256",
			              "name": "",
			              "type": "uint256",
			            },
			          ],
			          "stateMutability": "view",
			          "type": "function",
			        },
			        {
			          "inputs": [
			            {
			              "internalType": "address",
			              "name": "from",
			              "type": "address",
			            },
			            {
			              "internalType": "address",
			              "name": "to",
			              "type": "address",
			            },
			            {
			              "internalType": "uint256",
			              "name": "tokenId",
			              "type": "uint256",
			            },
			          ],
			          "name": "transferFrom",
			          "outputs": [],
			          "stateMutability": "nonpayable",
			          "type": "function",
			        },
			      ],
			      "userdoc": {
			        "kind": "user",
			        "methods": {
			          "mint()": {
			            "notice": "Allows an address to mint",
			          },
			          "mint(uint256)": {
			            "notice": "Returns the token URI for a given token by ID",
			          },
			          "tokenURI(uint256)": {
			            "notice": "Returns the token URI for a given token by ID",
			          },
			        },
			        "notice": "An example token original from the wagmi template",
			        "version": 1,
			      },
			    },
			  },
			  "asts": undefined,
			  "modules": {
			    "./Contract.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			pragma solidity >0.8.16;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol\\";
			// import \\"this shouldn't be imorted\\";

			/// @author Wagmi
			/// @author EVMts
			/// @title  WagmiMintExample
			/// @notice An example token original from the wagmi template
			contract WagmiMintExample is ERC721 {
			    uint256 public totalSupply;

			// import \\"@openzeppelin/contracts/utils/Base64.sol\\";
			    uint256 private nextTokenId = 0;

			    constructor() ERC721(\\"wagmi\\", \\"WAGMI\\") {}

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
			        require(!_exists(tokenId), \\"Token ID is taken\\");
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
			            keccak256(abi.encodePacked(\\"foreground\\", tokenId))
			        ) % 360;
			        uint256 backgroundHue = uint256(
			            keccak256(abi.encodePacked(\\"background\\", tokenId))
			        ) % 360;
			        string memory json = Base64.encode(
			            bytes(
			                abi.encodePacked(
			                    '{\\"name\\": \\"wagmi #',
			                    toString(tokenId),
			                    '\\", \\"image\\": \\"data:image/svg+xml;base64,',
			                    Base64.encode(
			                        bytes(
			                            abi.encodePacked(
			                                '<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"1024\\" height=\\"1024\\" fill=\\"none\\"><path fill=\\"hsl(',
			                                toString(foregroundHue),
			                                ', 100%, 10%)\\" d=\\"M0 0h1024v1024H0z\\" /><g fill=\\"hsl(',
			                                toString(backgroundHue),
			                                ', 100%, 90%)\\"><path d=\\"M903 437.5c0 9.113-7.388 16.5-16.5 16.5s-16.5-7.387-16.5-16.5 7.388-16.5 16.5-16.5 16.5 7.387 16.5 16.5zM698.529 566c6.921 0 12.53-5.596 12.53-12.5v-50c0-6.904 5.609-12.5 12.529-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.53 12.5s12.529-5.596 12.529-12.5v-50c0-6.904 5.609-12.5 12.53-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.529 12.5h37.589c6.92 0 12.529-5.596 12.529-12.5v-75c0-6.904-5.609-12.5-12.529-12.5s-12.53 5.596-12.53 12.5v56.25a6.264 6.264 0 1 1-12.529 0V478.5c0-6.904-5.609-12.5-12.53-12.5H698.529c-6.92 0-12.529 5.596-12.529 12.5v75c0 6.904 5.609 12.5 12.529 12.5z\\" /><path d=\\"M157.655 541c-6.932 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.619-12.5-12.551-12.5S120 471.596 120 478.5v75c0 6.904 5.62 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-50c0-6.904 5.619-12.5 12.552-12.5h144.345c3.465 0 6.276 2.798 6.276 6.25s-2.811 6.25-6.276 6.25H320.828c-6.933 0-12.552 5.596-12.552 12.5v37.5c0 6.904 5.619 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-75c0-6.904-5.619-12.5-12.552-12.5H283.172c-6.932 0-12.551 5.596-12.551 12.5v50c0 6.904-5.619 12.5-12.552 12.5h-25.103c-6.933 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.62-12.5-12.552-12.5s-12.552 5.596-12.552 12.5v50c0 6.904-5.619 12.5-12.551 12.5h-25.104zm301.242-6.25c0 3.452-2.811 6.25-6.276 6.25H339.655c-3.465 0-6.276-2.798-6.276-6.25s2.811-6.25 6.276-6.25h112.966c3.465 0 6.276 2.798 6.276 6.25zM497 553.818c0 6.929 5.628 12.546 12.571 12.546h132a6.28 6.28 0 0 1 6.286 6.272 6.28 6.28 0 0 1-6.286 6.273h-132c-6.943 0-12.571 5.616-12.571 12.546A12.56 12.56 0 0 0 509.571 604h150.858c6.943 0 12.571-5.616 12.571-12.545v-112.91c0-6.928-5.628-12.545-12.571-12.545H509.571c-6.943 0-12.571 5.617-12.571 12.545v75.273zm37.714-62.727c-6.943 0-12.571 5.617-12.571 12.545v25.091c0 6.929 5.628 12.546 12.571 12.546h100.572c6.943 0 12.571-5.617 12.571-12.546v-25.091c0-6.928-5.628-12.545-12.571-12.545H534.714z\\" fill-rule=\\"evenodd\\" /></g></svg>'
			                            )
			                        )
			                    ),
			                    '\\"}'
			                )
			            )
			        );
			        string memory output = string(
			            abi.encodePacked(\\"data:application/json;base64,\\", json)
			        );
			        return output;
			    }

			    function toString(uint256 value) internal pure returns (string memory) {
			        // Inspired by OraclizeAPI's implementation - MIT licence
			        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

			        if (value == 0) {
			            return \\"0\\";
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
			",
			      "id": "./Contract.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			pragma solidity >0.8.16;

			import \\"@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol\\";
			import \\"@openzeppelin/contracts/token/ERC721/ERC721.sol\\";
			import \\"@openzeppelin/contracts/utils/Base64.sol\\";
			// import \\"this shouldn't be imorted\\";

			/// @author Wagmi
			/// @author EVMts
			/// @title  WagmiMintExample
			/// @notice An example token original from the wagmi template
			contract WagmiMintExample is ERC721 {
			    uint256 public totalSupply;

			// import \\"@openzeppelin/contracts/utils/Base64.sol\\";
			    uint256 private nextTokenId = 0;

			    constructor() ERC721(\\"wagmi\\", \\"WAGMI\\") {}

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
			        require(!_exists(tokenId), \\"Token ID is taken\\");
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
			            keccak256(abi.encodePacked(\\"foreground\\", tokenId))
			        ) % 360;
			        uint256 backgroundHue = uint256(
			            keccak256(abi.encodePacked(\\"background\\", tokenId))
			        ) % 360;
			        string memory json = Base64.encode(
			            bytes(
			                abi.encodePacked(
			                    '{\\"name\\": \\"wagmi #',
			                    toString(tokenId),
			                    '\\", \\"image\\": \\"data:image/svg+xml;base64,',
			                    Base64.encode(
			                        bytes(
			                            abi.encodePacked(
			                                '<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"1024\\" height=\\"1024\\" fill=\\"none\\"><path fill=\\"hsl(',
			                                toString(foregroundHue),
			                                ', 100%, 10%)\\" d=\\"M0 0h1024v1024H0z\\" /><g fill=\\"hsl(',
			                                toString(backgroundHue),
			                                ', 100%, 90%)\\"><path d=\\"M903 437.5c0 9.113-7.388 16.5-16.5 16.5s-16.5-7.387-16.5-16.5 7.388-16.5 16.5-16.5 16.5 7.387 16.5 16.5zM698.529 566c6.921 0 12.53-5.596 12.53-12.5v-50c0-6.904 5.609-12.5 12.529-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.53 12.5s12.529-5.596 12.529-12.5v-50c0-6.904 5.609-12.5 12.53-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.529 12.5h37.589c6.92 0 12.529-5.596 12.529-12.5v-75c0-6.904-5.609-12.5-12.529-12.5s-12.53 5.596-12.53 12.5v56.25a6.264 6.264 0 1 1-12.529 0V478.5c0-6.904-5.609-12.5-12.53-12.5H698.529c-6.92 0-12.529 5.596-12.529 12.5v75c0 6.904 5.609 12.5 12.529 12.5z\\" /><path d=\\"M157.655 541c-6.932 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.619-12.5-12.551-12.5S120 471.596 120 478.5v75c0 6.904 5.62 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-50c0-6.904 5.619-12.5 12.552-12.5h144.345c3.465 0 6.276 2.798 6.276 6.25s-2.811 6.25-6.276 6.25H320.828c-6.933 0-12.552 5.596-12.552 12.5v37.5c0 6.904 5.619 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-75c0-6.904-5.619-12.5-12.552-12.5H283.172c-6.932 0-12.551 5.596-12.551 12.5v50c0 6.904-5.619 12.5-12.552 12.5h-25.103c-6.933 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.62-12.5-12.552-12.5s-12.552 5.596-12.552 12.5v50c0 6.904-5.619 12.5-12.551 12.5h-25.104zm301.242-6.25c0 3.452-2.811 6.25-6.276 6.25H339.655c-3.465 0-6.276-2.798-6.276-6.25s2.811-6.25 6.276-6.25h112.966c3.465 0 6.276 2.798 6.276 6.25zM497 553.818c0 6.929 5.628 12.546 12.571 12.546h132a6.28 6.28 0 0 1 6.286 6.272 6.28 6.28 0 0 1-6.286 6.273h-132c-6.943 0-12.571 5.616-12.571 12.546A12.56 12.56 0 0 0 509.571 604h150.858c6.943 0 12.571-5.616 12.571-12.545v-112.91c0-6.928-5.628-12.545-12.571-12.545H509.571c-6.943 0-12.571 5.617-12.571 12.545v75.273zm37.714-62.727c-6.943 0-12.571 5.617-12.571 12.545v25.091c0 6.929 5.628 12.546 12.571 12.546h100.572c6.943 0 12.571-5.617 12.571-12.546v-25.091c0-6.928-5.628-12.545-12.571-12.545H534.714z\\" fill-rule=\\"evenodd\\" /></g></svg>'
			                            )
			                        )
			                    ),
			                    '\\"}'
			                )
			            )
			        );
			        string memory output = string(
			            abi.encodePacked(\\"data:application/json;base64,\\", json)
			        );
			        return output;
			    }

			    function toString(uint256 value) internal pure returns (string memory) {
			        // Inspired by OraclizeAPI's implementation - MIT licence
			        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

			        if (value == 0) {
			            return \\"0\\";
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
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC721/ERC721.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol\\";

			/**
			 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
			 * the Metadata extension, but not including the Enumerable extension, which is available separately as
			 * {ERC721Enumerable}.
			 */
			contract ERC721 is Context, ERC165, IERC721, IERC721Metadata {
			    using Address for address;
			    using Strings for uint256;

			    // Token name
			    string private _name;

			    // Token symbol
			    string private _symbol;

			    // Mapping from token ID to owner address
			    mapping(uint256 => address) private _owners;

			    // Mapping owner address to token count
			    mapping(address => uint256) private _balances;

			    // Mapping from token ID to approved address
			    mapping(uint256 => address) private _tokenApprovals;

			    // Mapping from owner to operator approvals
			    mapping(address => mapping(address => bool)) private _operatorApprovals;

			    /**
			     * @dev Initializes the contract by setting a \`name\` and a \`symbol\` to the token collection.
			     */
			    constructor(string memory name_, string memory symbol_) {
			        _name = name_;
			        _symbol = symbol_;
			    }

			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
			        return
			            interfaceId == type(IERC721).interfaceId ||
			            interfaceId == type(IERC721Metadata).interfaceId ||
			            super.supportsInterface(interfaceId);
			    }

			    /**
			     * @dev See {IERC721-balanceOf}.
			     */
			    function balanceOf(address owner) public view virtual override returns (uint256) {
			        require(owner != address(0), \\"ERC721: address zero is not a valid owner\\");
			        return _balances[owner];
			    }

			    /**
			     * @dev See {IERC721-ownerOf}.
			     */
			    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
			        address owner = _ownerOf(tokenId);
			        require(owner != address(0), \\"ERC721: invalid token ID\\");
			        return owner;
			    }

			    /**
			     * @dev See {IERC721Metadata-name}.
			     */
			    function name() public view virtual override returns (string memory) {
			        return _name;
			    }

			    /**
			     * @dev See {IERC721Metadata-symbol}.
			     */
			    function symbol() public view virtual override returns (string memory) {
			        return _symbol;
			    }

			    /**
			     * @dev See {IERC721Metadata-tokenURI}.
			     */
			    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
			        _requireMinted(tokenId);

			        string memory baseURI = _baseURI();
			        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : \\"\\";
			    }

			    /**
			     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
			     * token will be the concatenation of the \`baseURI\` and the \`tokenId\`. Empty
			     * by default, can be overridden in child contracts.
			     */
			    function _baseURI() internal view virtual returns (string memory) {
			        return \\"\\";
			    }

			    /**
			     * @dev See {IERC721-approve}.
			     */
			    function approve(address to, uint256 tokenId) public virtual override {
			        address owner = ERC721.ownerOf(tokenId);
			        require(to != owner, \\"ERC721: approval to current owner\\");

			        require(
			            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
			            \\"ERC721: approve caller is not token owner or approved for all\\"
			        );

			        _approve(to, tokenId);
			    }

			    /**
			     * @dev See {IERC721-getApproved}.
			     */
			    function getApproved(uint256 tokenId) public view virtual override returns (address) {
			        _requireMinted(tokenId);

			        return _tokenApprovals[tokenId];
			    }

			    /**
			     * @dev See {IERC721-setApprovalForAll}.
			     */
			    function setApprovalForAll(address operator, bool approved) public virtual override {
			        _setApprovalForAll(_msgSender(), operator, approved);
			    }

			    /**
			     * @dev See {IERC721-isApprovedForAll}.
			     */
			    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
			        return _operatorApprovals[owner][operator];
			    }

			    /**
			     * @dev See {IERC721-transferFrom}.
			     */
			    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
			        //solhint-disable-next-line max-line-length
			        require(_isApprovedOrOwner(_msgSender(), tokenId), \\"ERC721: caller is not token owner or approved\\");

			        _transfer(from, to, tokenId);
			    }

			    /**
			     * @dev See {IERC721-safeTransferFrom}.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
			        safeTransferFrom(from, to, tokenId, \\"\\");
			    }

			    /**
			     * @dev See {IERC721-safeTransferFrom}.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
			        require(_isApprovedOrOwner(_msgSender(), tokenId), \\"ERC721: caller is not token owner or approved\\");
			        _safeTransfer(from, to, tokenId, data);
			    }

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`, checking first that contract recipients
			     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
			     *
			     * \`data\` is additional data, it has no specified format and it is sent in call to \`to\`.
			     *
			     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
			     * implement alternative mechanisms to perform token transfer, such as signature-based.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual {
			        _transfer(from, to, tokenId);
			        require(_checkOnERC721Received(from, to, tokenId, data), \\"ERC721: transfer to non ERC721Receiver implementer\\");
			    }

			    /**
			     * @dev Returns the owner of the \`tokenId\`. Does NOT revert if token doesn't exist
			     */
			    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
			        return _owners[tokenId];
			    }

			    /**
			     * @dev Returns whether \`tokenId\` exists.
			     *
			     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
			     *
			     * Tokens start existing when they are minted (\`_mint\`),
			     * and stop existing when they are burned (\`_burn\`).
			     */
			    function _exists(uint256 tokenId) internal view virtual returns (bool) {
			        return _ownerOf(tokenId) != address(0);
			    }

			    /**
			     * @dev Returns whether \`spender\` is allowed to manage \`tokenId\`.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
			        address owner = ERC721.ownerOf(tokenId);
			        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
			    }

			    /**
			     * @dev Safely mints \`tokenId\` and transfers it to \`to\`.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must not exist.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _safeMint(address to, uint256 tokenId) internal virtual {
			        _safeMint(to, tokenId, \\"\\");
			    }

			    /**
			     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[\`_safeMint\`], with an additional \`data\` parameter which is
			     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
			     */
			    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
			        _mint(to, tokenId);
			        require(
			            _checkOnERC721Received(address(0), to, tokenId, data),
			            \\"ERC721: transfer to non ERC721Receiver implementer\\"
			        );
			    }

			    /**
			     * @dev Mints \`tokenId\` and transfers it to \`to\`.
			     *
			     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must not exist.
			     * - \`to\` cannot be the zero address.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _mint(address to, uint256 tokenId) internal virtual {
			        require(to != address(0), \\"ERC721: mint to the zero address\\");
			        require(!_exists(tokenId), \\"ERC721: token already minted\\");

			        _beforeTokenTransfer(address(0), to, tokenId, 1);

			        // Check that tokenId was not minted by \`_beforeTokenTransfer\` hook
			        require(!_exists(tokenId), \\"ERC721: token already minted\\");

			        unchecked {
			            // Will not overflow unless all 2**256 token ids are minted to the same owner.
			            // Given that tokens are minted one by one, it is impossible in practice that
			            // this ever happens. Might change if we allow batch minting.
			            // The ERC fails to describe this case.
			            _balances[to] += 1;
			        }

			        _owners[tokenId] = to;

			        emit Transfer(address(0), to, tokenId);

			        _afterTokenTransfer(address(0), to, tokenId, 1);
			    }

			    /**
			     * @dev Destroys \`tokenId\`.
			     * The approval is cleared when the token is burned.
			     * This is an internal function that does not check if the sender is authorized to operate on the token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _burn(uint256 tokenId) internal virtual {
			        address owner = ERC721.ownerOf(tokenId);

			        _beforeTokenTransfer(owner, address(0), tokenId, 1);

			        // Update ownership in case tokenId was transferred by \`_beforeTokenTransfer\` hook
			        owner = ERC721.ownerOf(tokenId);

			        // Clear approvals
			        delete _tokenApprovals[tokenId];

			        unchecked {
			            // Cannot overflow, as that would require more tokens to be burned/transferred
			            // out than the owner initially received through minting and transferring in.
			            _balances[owner] -= 1;
			        }
			        delete _owners[tokenId];

			        emit Transfer(owner, address(0), tokenId);

			        _afterTokenTransfer(owner, address(0), tokenId, 1);
			    }

			    /**
			     * @dev Transfers \`tokenId\` from \`from\` to \`to\`.
			     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
			     *
			     * Requirements:
			     *
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must be owned by \`from\`.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _transfer(address from, address to, uint256 tokenId) internal virtual {
			        require(ERC721.ownerOf(tokenId) == from, \\"ERC721: transfer from incorrect owner\\");
			        require(to != address(0), \\"ERC721: transfer to the zero address\\");

			        _beforeTokenTransfer(from, to, tokenId, 1);

			        // Check that tokenId was not transferred by \`_beforeTokenTransfer\` hook
			        require(ERC721.ownerOf(tokenId) == from, \\"ERC721: transfer from incorrect owner\\");

			        // Clear approvals from the previous owner
			        delete _tokenApprovals[tokenId];

			        unchecked {
			            // \`_balances[from]\` cannot overflow for the same reason as described in \`_burn\`:
			            // \`from\`'s balance is the number of token held, which is at least one before the current
			            // transfer.
			            // \`_balances[to]\` could overflow in the conditions described in \`_mint\`. That would require
			            // all 2**256 token ids to be minted, which in practice is impossible.
			            _balances[from] -= 1;
			            _balances[to] += 1;
			        }
			        _owners[tokenId] = to;

			        emit Transfer(from, to, tokenId);

			        _afterTokenTransfer(from, to, tokenId, 1);
			    }

			    /**
			     * @dev Approve \`to\` to operate on \`tokenId\`
			     *
			     * Emits an {Approval} event.
			     */
			    function _approve(address to, uint256 tokenId) internal virtual {
			        _tokenApprovals[tokenId] = to;
			        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
			    }

			    /**
			     * @dev Approve \`operator\` to operate on all of \`owner\` tokens
			     *
			     * Emits an {ApprovalForAll} event.
			     */
			    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
			        require(owner != operator, \\"ERC721: approve to caller\\");
			        _operatorApprovals[owner][operator] = approved;
			        emit ApprovalForAll(owner, operator, approved);
			    }

			    /**
			     * @dev Reverts if the \`tokenId\` has not been minted yet.
			     */
			    function _requireMinted(uint256 tokenId) internal view virtual {
			        require(_exists(tokenId), \\"ERC721: invalid token ID\\");
			    }

			    /**
			     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
			     * The call is not executed if the target address is not a contract.
			     *
			     * @param from address representing the previous owner of the given token ID
			     * @param to target address that will receive the tokens
			     * @param tokenId uint256 ID of the token to be transferred
			     * @param data bytes optional data to send along with the call
			     * @return bool whether the call correctly returned the expected magic value
			     */
			    function _checkOnERC721Received(
			        address from,
			        address to,
			        uint256 tokenId,
			        bytes memory data
			    ) private returns (bool) {
			        if (to.isContract()) {
			            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
			                return retval == IERC721Receiver.onERC721Received.selector;
			            } catch (bytes memory reason) {
			                if (reason.length == 0) {
			                    revert(\\"ERC721: transfer to non ERC721Receiver implementer\\");
			                } else {
			                    /// @solidity memory-safe-assembly
			                    assembly {
			                        revert(add(32, reason), mload(reason))
			                    }
			                }
			            }
			        } else {
			            return true;
			        }
			    }

			    /**
			     * @dev Hook that is called before any token transfer. This includes minting and burning. If {ERC721Consecutive} is
			     * used, the hook may be called as part of a consecutive (batch) mint, as indicated by \`batchSize\` greater than 1.
			     *
			     * Calling conditions:
			     *
			     * - When \`from\` and \`to\` are both non-zero, \`\`from\`\`'s tokens will be transferred to \`to\`.
			     * - When \`from\` is zero, the tokens will be minted for \`to\`.
			     * - When \`to\` is zero, \`\`from\`\`'s tokens will be burned.
			     * - \`from\` and \`to\` are never both zero.
			     * - \`batchSize\` is non-zero.
			     *
			     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
			     */
			    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual {}

			    /**
			     * @dev Hook that is called after any token transfer. This includes minting and burning. If {ERC721Consecutive} is
			     * used, the hook may be called as part of a consecutive (batch) mint, as indicated by \`batchSize\` greater than 1.
			     *
			     * Calling conditions:
			     *
			     * - When \`from\` and \`to\` are both non-zero, \`\`from\`\`'s tokens were transferred to \`to\`.
			     * - When \`from\` is zero, the tokens were minted for \`to\`.
			     * - When \`to\` is zero, \`\`from\`\`'s tokens were burned.
			     * - \`from\` and \`to\` are never both zero.
			     * - \`batchSize\` is non-zero.
			     *
			     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
			     */
			    function _afterTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual {}

			    /**
			     * @dev Unsafe write access to the balances, used by extensions that \\"mint\\" tokens using an {ownerOf} override.
			     *
			     * WARNING: Anyone calling this MUST ensure that the balances remain consistent with the ownership. The invariant
			     * being that for any address \`a\` the value returned by \`balanceOf(a)\` must be equal to the number of tokens such
			     * that \`ownerOf(tokenId)\` is \`a\`.
			     */
			    // solhint-disable-next-line func-name-mixedcase
			    function __unsafe_increaseBalance(address account, uint256 amount) internal {
			        _balances[account] += amount;
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC721/ERC721.sol)

			pragma solidity ^0.8.0;

			import \\"./IERC721.sol\\";
			import \\"./IERC721Receiver.sol\\";
			import \\"./extensions/IERC721Metadata.sol\\";
			import \\"../../utils/Address.sol\\";
			import \\"../../utils/Context.sol\\";
			import \\"../../utils/Strings.sol\\";
			import \\"../../utils/introspection/ERC165.sol\\";

			/**
			 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
			 * the Metadata extension, but not including the Enumerable extension, which is available separately as
			 * {ERC721Enumerable}.
			 */
			contract ERC721 is Context, ERC165, IERC721, IERC721Metadata {
			    using Address for address;
			    using Strings for uint256;

			    // Token name
			    string private _name;

			    // Token symbol
			    string private _symbol;

			    // Mapping from token ID to owner address
			    mapping(uint256 => address) private _owners;

			    // Mapping owner address to token count
			    mapping(address => uint256) private _balances;

			    // Mapping from token ID to approved address
			    mapping(uint256 => address) private _tokenApprovals;

			    // Mapping from owner to operator approvals
			    mapping(address => mapping(address => bool)) private _operatorApprovals;

			    /**
			     * @dev Initializes the contract by setting a \`name\` and a \`symbol\` to the token collection.
			     */
			    constructor(string memory name_, string memory symbol_) {
			        _name = name_;
			        _symbol = symbol_;
			    }

			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
			        return
			            interfaceId == type(IERC721).interfaceId ||
			            interfaceId == type(IERC721Metadata).interfaceId ||
			            super.supportsInterface(interfaceId);
			    }

			    /**
			     * @dev See {IERC721-balanceOf}.
			     */
			    function balanceOf(address owner) public view virtual override returns (uint256) {
			        require(owner != address(0), \\"ERC721: address zero is not a valid owner\\");
			        return _balances[owner];
			    }

			    /**
			     * @dev See {IERC721-ownerOf}.
			     */
			    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
			        address owner = _ownerOf(tokenId);
			        require(owner != address(0), \\"ERC721: invalid token ID\\");
			        return owner;
			    }

			    /**
			     * @dev See {IERC721Metadata-name}.
			     */
			    function name() public view virtual override returns (string memory) {
			        return _name;
			    }

			    /**
			     * @dev See {IERC721Metadata-symbol}.
			     */
			    function symbol() public view virtual override returns (string memory) {
			        return _symbol;
			    }

			    /**
			     * @dev See {IERC721Metadata-tokenURI}.
			     */
			    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
			        _requireMinted(tokenId);

			        string memory baseURI = _baseURI();
			        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : \\"\\";
			    }

			    /**
			     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
			     * token will be the concatenation of the \`baseURI\` and the \`tokenId\`. Empty
			     * by default, can be overridden in child contracts.
			     */
			    function _baseURI() internal view virtual returns (string memory) {
			        return \\"\\";
			    }

			    /**
			     * @dev See {IERC721-approve}.
			     */
			    function approve(address to, uint256 tokenId) public virtual override {
			        address owner = ERC721.ownerOf(tokenId);
			        require(to != owner, \\"ERC721: approval to current owner\\");

			        require(
			            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
			            \\"ERC721: approve caller is not token owner or approved for all\\"
			        );

			        _approve(to, tokenId);
			    }

			    /**
			     * @dev See {IERC721-getApproved}.
			     */
			    function getApproved(uint256 tokenId) public view virtual override returns (address) {
			        _requireMinted(tokenId);

			        return _tokenApprovals[tokenId];
			    }

			    /**
			     * @dev See {IERC721-setApprovalForAll}.
			     */
			    function setApprovalForAll(address operator, bool approved) public virtual override {
			        _setApprovalForAll(_msgSender(), operator, approved);
			    }

			    /**
			     * @dev See {IERC721-isApprovedForAll}.
			     */
			    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
			        return _operatorApprovals[owner][operator];
			    }

			    /**
			     * @dev See {IERC721-transferFrom}.
			     */
			    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
			        //solhint-disable-next-line max-line-length
			        require(_isApprovedOrOwner(_msgSender(), tokenId), \\"ERC721: caller is not token owner or approved\\");

			        _transfer(from, to, tokenId);
			    }

			    /**
			     * @dev See {IERC721-safeTransferFrom}.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
			        safeTransferFrom(from, to, tokenId, \\"\\");
			    }

			    /**
			     * @dev See {IERC721-safeTransferFrom}.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
			        require(_isApprovedOrOwner(_msgSender(), tokenId), \\"ERC721: caller is not token owner or approved\\");
			        _safeTransfer(from, to, tokenId, data);
			    }

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`, checking first that contract recipients
			     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
			     *
			     * \`data\` is additional data, it has no specified format and it is sent in call to \`to\`.
			     *
			     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
			     * implement alternative mechanisms to perform token transfer, such as signature-based.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual {
			        _transfer(from, to, tokenId);
			        require(_checkOnERC721Received(from, to, tokenId, data), \\"ERC721: transfer to non ERC721Receiver implementer\\");
			    }

			    /**
			     * @dev Returns the owner of the \`tokenId\`. Does NOT revert if token doesn't exist
			     */
			    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
			        return _owners[tokenId];
			    }

			    /**
			     * @dev Returns whether \`tokenId\` exists.
			     *
			     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
			     *
			     * Tokens start existing when they are minted (\`_mint\`),
			     * and stop existing when they are burned (\`_burn\`).
			     */
			    function _exists(uint256 tokenId) internal view virtual returns (bool) {
			        return _ownerOf(tokenId) != address(0);
			    }

			    /**
			     * @dev Returns whether \`spender\` is allowed to manage \`tokenId\`.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
			        address owner = ERC721.ownerOf(tokenId);
			        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
			    }

			    /**
			     * @dev Safely mints \`tokenId\` and transfers it to \`to\`.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must not exist.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _safeMint(address to, uint256 tokenId) internal virtual {
			        _safeMint(to, tokenId, \\"\\");
			    }

			    /**
			     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[\`_safeMint\`], with an additional \`data\` parameter which is
			     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
			     */
			    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
			        _mint(to, tokenId);
			        require(
			            _checkOnERC721Received(address(0), to, tokenId, data),
			            \\"ERC721: transfer to non ERC721Receiver implementer\\"
			        );
			    }

			    /**
			     * @dev Mints \`tokenId\` and transfers it to \`to\`.
			     *
			     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must not exist.
			     * - \`to\` cannot be the zero address.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _mint(address to, uint256 tokenId) internal virtual {
			        require(to != address(0), \\"ERC721: mint to the zero address\\");
			        require(!_exists(tokenId), \\"ERC721: token already minted\\");

			        _beforeTokenTransfer(address(0), to, tokenId, 1);

			        // Check that tokenId was not minted by \`_beforeTokenTransfer\` hook
			        require(!_exists(tokenId), \\"ERC721: token already minted\\");

			        unchecked {
			            // Will not overflow unless all 2**256 token ids are minted to the same owner.
			            // Given that tokens are minted one by one, it is impossible in practice that
			            // this ever happens. Might change if we allow batch minting.
			            // The ERC fails to describe this case.
			            _balances[to] += 1;
			        }

			        _owners[tokenId] = to;

			        emit Transfer(address(0), to, tokenId);

			        _afterTokenTransfer(address(0), to, tokenId, 1);
			    }

			    /**
			     * @dev Destroys \`tokenId\`.
			     * The approval is cleared when the token is burned.
			     * This is an internal function that does not check if the sender is authorized to operate on the token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _burn(uint256 tokenId) internal virtual {
			        address owner = ERC721.ownerOf(tokenId);

			        _beforeTokenTransfer(owner, address(0), tokenId, 1);

			        // Update ownership in case tokenId was transferred by \`_beforeTokenTransfer\` hook
			        owner = ERC721.ownerOf(tokenId);

			        // Clear approvals
			        delete _tokenApprovals[tokenId];

			        unchecked {
			            // Cannot overflow, as that would require more tokens to be burned/transferred
			            // out than the owner initially received through minting and transferring in.
			            _balances[owner] -= 1;
			        }
			        delete _owners[tokenId];

			        emit Transfer(owner, address(0), tokenId);

			        _afterTokenTransfer(owner, address(0), tokenId, 1);
			    }

			    /**
			     * @dev Transfers \`tokenId\` from \`from\` to \`to\`.
			     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
			     *
			     * Requirements:
			     *
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must be owned by \`from\`.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _transfer(address from, address to, uint256 tokenId) internal virtual {
			        require(ERC721.ownerOf(tokenId) == from, \\"ERC721: transfer from incorrect owner\\");
			        require(to != address(0), \\"ERC721: transfer to the zero address\\");

			        _beforeTokenTransfer(from, to, tokenId, 1);

			        // Check that tokenId was not transferred by \`_beforeTokenTransfer\` hook
			        require(ERC721.ownerOf(tokenId) == from, \\"ERC721: transfer from incorrect owner\\");

			        // Clear approvals from the previous owner
			        delete _tokenApprovals[tokenId];

			        unchecked {
			            // \`_balances[from]\` cannot overflow for the same reason as described in \`_burn\`:
			            // \`from\`'s balance is the number of token held, which is at least one before the current
			            // transfer.
			            // \`_balances[to]\` could overflow in the conditions described in \`_mint\`. That would require
			            // all 2**256 token ids to be minted, which in practice is impossible.
			            _balances[from] -= 1;
			            _balances[to] += 1;
			        }
			        _owners[tokenId] = to;

			        emit Transfer(from, to, tokenId);

			        _afterTokenTransfer(from, to, tokenId, 1);
			    }

			    /**
			     * @dev Approve \`to\` to operate on \`tokenId\`
			     *
			     * Emits an {Approval} event.
			     */
			    function _approve(address to, uint256 tokenId) internal virtual {
			        _tokenApprovals[tokenId] = to;
			        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
			    }

			    /**
			     * @dev Approve \`operator\` to operate on all of \`owner\` tokens
			     *
			     * Emits an {ApprovalForAll} event.
			     */
			    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
			        require(owner != operator, \\"ERC721: approve to caller\\");
			        _operatorApprovals[owner][operator] = approved;
			        emit ApprovalForAll(owner, operator, approved);
			    }

			    /**
			     * @dev Reverts if the \`tokenId\` has not been minted yet.
			     */
			    function _requireMinted(uint256 tokenId) internal view virtual {
			        require(_exists(tokenId), \\"ERC721: invalid token ID\\");
			    }

			    /**
			     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
			     * The call is not executed if the target address is not a contract.
			     *
			     * @param from address representing the previous owner of the given token ID
			     * @param to target address that will receive the tokens
			     * @param tokenId uint256 ID of the token to be transferred
			     * @param data bytes optional data to send along with the call
			     * @return bool whether the call correctly returned the expected magic value
			     */
			    function _checkOnERC721Received(
			        address from,
			        address to,
			        uint256 tokenId,
			        bytes memory data
			    ) private returns (bool) {
			        if (to.isContract()) {
			            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
			                return retval == IERC721Receiver.onERC721Received.selector;
			            } catch (bytes memory reason) {
			                if (reason.length == 0) {
			                    revert(\\"ERC721: transfer to non ERC721Receiver implementer\\");
			                } else {
			                    /// @solidity memory-safe-assembly
			                    assembly {
			                        revert(add(32, reason), mload(reason))
			                    }
			                }
			            }
			        } else {
			            return true;
			        }
			    }

			    /**
			     * @dev Hook that is called before any token transfer. This includes minting and burning. If {ERC721Consecutive} is
			     * used, the hook may be called as part of a consecutive (batch) mint, as indicated by \`batchSize\` greater than 1.
			     *
			     * Calling conditions:
			     *
			     * - When \`from\` and \`to\` are both non-zero, \`\`from\`\`'s tokens will be transferred to \`to\`.
			     * - When \`from\` is zero, the tokens will be minted for \`to\`.
			     * - When \`to\` is zero, \`\`from\`\`'s tokens will be burned.
			     * - \`from\` and \`to\` are never both zero.
			     * - \`batchSize\` is non-zero.
			     *
			     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
			     */
			    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual {}

			    /**
			     * @dev Hook that is called after any token transfer. This includes minting and burning. If {ERC721Consecutive} is
			     * used, the hook may be called as part of a consecutive (batch) mint, as indicated by \`batchSize\` greater than 1.
			     *
			     * Calling conditions:
			     *
			     * - When \`from\` and \`to\` are both non-zero, \`\`from\`\`'s tokens were transferred to \`to\`.
			     * - When \`from\` is zero, the tokens were minted for \`to\`.
			     * - When \`to\` is zero, \`\`from\`\`'s tokens were burned.
			     * - \`from\` and \`to\` are never both zero.
			     * - \`batchSize\` is non-zero.
			     *
			     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
			     */
			    function _afterTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual {}

			    /**
			     * @dev Unsafe write access to the balances, used by extensions that \\"mint\\" tokens using an {ownerOf} override.
			     *
			     * WARNING: Anyone calling this MUST ensure that the balances remain consistent with the ownership. The invariant
			     * being that for any address \`a\` the value returned by \`balanceOf(a)\` must be equal to the number of tokens such
			     * that \`ownerOf(tokenId)\` is \`a\`.
			     */
			    // solhint-disable-next-line func-name-mixedcase
			    function __unsafe_increaseBalance(address account, uint256 amount) internal {
			        _balances[account] += amount;
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC721/IERC721.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol\\";

			/**
			 * @dev Required interface of an ERC721 compliant contract.
			 */
			interface IERC721 is IERC165 {
			    /**
			     * @dev Emitted when \`tokenId\` token is transferred from \`from\` to \`to\`.
			     */
			    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

			    /**
			     * @dev Emitted when \`owner\` enables \`approved\` to manage the \`tokenId\` token.
			     */
			    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

			    /**
			     * @dev Emitted when \`owner\` enables or disables (\`approved\`) \`operator\` to manage all of its assets.
			     */
			    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

			    /**
			     * @dev Returns the number of tokens in \`\`owner\`\`'s account.
			     */
			    function balanceOf(address owner) external view returns (uint256 balance);

			    /**
			     * @dev Returns the owner of the \`tokenId\` token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function ownerOf(uint256 tokenId) external view returns (address owner);

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If the caller is not \`from\`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`, checking first that contract recipients
			     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If the caller is not \`from\`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId) external;

			    /**
			     * @dev Transfers \`tokenId\` token from \`from\` to \`to\`.
			     *
			     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
			     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
			     * understand this adds an external call which potentially creates a reentrancy vulnerability.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must be owned by \`from\`.
			     * - If the caller is not \`from\`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
			     *
			     * Emits a {Transfer} event.
			     */
			    function transferFrom(address from, address to, uint256 tokenId) external;

			    /**
			     * @dev Gives permission to \`to\` to transfer \`tokenId\` token to another account.
			     * The approval is cleared when the token is transferred.
			     *
			     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
			     *
			     * Requirements:
			     *
			     * - The caller must own the token or be an approved operator.
			     * - \`tokenId\` must exist.
			     *
			     * Emits an {Approval} event.
			     */
			    function approve(address to, uint256 tokenId) external;

			    /**
			     * @dev Approve or remove \`operator\` as an operator for the caller.
			     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
			     *
			     * Requirements:
			     *
			     * - The \`operator\` cannot be the caller.
			     *
			     * Emits an {ApprovalForAll} event.
			     */
			    function setApprovalForAll(address operator, bool approved) external;

			    /**
			     * @dev Returns the account approved for \`tokenId\` token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function getApproved(uint256 tokenId) external view returns (address operator);

			    /**
			     * @dev Returns if the \`operator\` is allowed to manage all of the assets of \`owner\`.
			     *
			     * See {setApprovalForAll}
			     */
			    function isApprovedForAll(address owner, address operator) external view returns (bool);
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC721/IERC721.sol)

			pragma solidity ^0.8.0;

			import \\"../../utils/introspection/IERC165.sol\\";

			/**
			 * @dev Required interface of an ERC721 compliant contract.
			 */
			interface IERC721 is IERC165 {
			    /**
			     * @dev Emitted when \`tokenId\` token is transferred from \`from\` to \`to\`.
			     */
			    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

			    /**
			     * @dev Emitted when \`owner\` enables \`approved\` to manage the \`tokenId\` token.
			     */
			    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

			    /**
			     * @dev Emitted when \`owner\` enables or disables (\`approved\`) \`operator\` to manage all of its assets.
			     */
			    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

			    /**
			     * @dev Returns the number of tokens in \`\`owner\`\`'s account.
			     */
			    function balanceOf(address owner) external view returns (uint256 balance);

			    /**
			     * @dev Returns the owner of the \`tokenId\` token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function ownerOf(uint256 tokenId) external view returns (address owner);

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If the caller is not \`from\`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`, checking first that contract recipients
			     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If the caller is not \`from\`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId) external;

			    /**
			     * @dev Transfers \`tokenId\` token from \`from\` to \`to\`.
			     *
			     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
			     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
			     * understand this adds an external call which potentially creates a reentrancy vulnerability.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must be owned by \`from\`.
			     * - If the caller is not \`from\`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
			     *
			     * Emits a {Transfer} event.
			     */
			    function transferFrom(address from, address to, uint256 tokenId) external;

			    /**
			     * @dev Gives permission to \`to\` to transfer \`tokenId\` token to another account.
			     * The approval is cleared when the token is transferred.
			     *
			     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
			     *
			     * Requirements:
			     *
			     * - The caller must own the token or be an approved operator.
			     * - \`tokenId\` must exist.
			     *
			     * Emits an {Approval} event.
			     */
			    function approve(address to, uint256 tokenId) external;

			    /**
			     * @dev Approve or remove \`operator\` as an operator for the caller.
			     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
			     *
			     * Requirements:
			     *
			     * - The \`operator\` cannot be the caller.
			     *
			     * Emits an {ApprovalForAll} event.
			     */
			    function setApprovalForAll(address operator, bool approved) external;

			    /**
			     * @dev Returns the account approved for \`tokenId\` token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function getApproved(uint256 tokenId) external view returns (address operator);

			    /**
			     * @dev Returns if the \`operator\` is allowed to manage all of the assets of \`owner\`.
			     *
			     * See {setApprovalForAll}
			     */
			    function isApprovedForAll(address owner, address operator) external view returns (bool);
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC721/IERC721Receiver.sol)

			pragma solidity ^0.8.0;

			/**
			 * @title ERC721 token receiver interface
			 * @dev Interface for any contract that wants to support safeTransfers
			 * from ERC721 asset contracts.
			 */
			interface IERC721Receiver {
			    /**
			     * @dev Whenever an {IERC721} \`tokenId\` token is transferred to this contract via {IERC721-safeTransferFrom}
			     * by \`operator\` from \`from\`, this function is called.
			     *
			     * It must return its Solidity selector to confirm the token transfer.
			     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
			     *
			     * The selector can be obtained in Solidity with \`IERC721Receiver.onERC721Received.selector\`.
			     */
			    function onERC721Received(
			        address operator,
			        address from,
			        uint256 tokenId,
			        bytes calldata data
			    ) external returns (bytes4);
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol",
			      "importedIds": [],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC721/IERC721Receiver.sol)

			pragma solidity ^0.8.0;

			/**
			 * @title ERC721 token receiver interface
			 * @dev Interface for any contract that wants to support safeTransfers
			 * from ERC721 asset contracts.
			 */
			interface IERC721Receiver {
			    /**
			     * @dev Whenever an {IERC721} \`tokenId\` token is transferred to this contract via {IERC721-safeTransferFrom}
			     * by \`operator\` from \`from\`, this function is called.
			     *
			     * It must return its Solidity selector to confirm the token transfer.
			     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
			     *
			     * The selector can be obtained in Solidity with \`IERC721Receiver.onERC721Received.selector\`.
			     */
			    function onERC721Received(
			        address operator,
			        address from,
			        uint256 tokenId,
			        bytes calldata data
			    ) external returns (bytes4);
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC721/extensions/ERC721Enumerable.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol\\";

			/**
			 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds
			 * enumerability of all the token ids in the contract as well as all token ids owned by each
			 * account.
			 */
			abstract contract ERC721Enumerable is ERC721, IERC721Enumerable {
			    // Mapping from owner to list of owned token IDs
			    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

			    // Mapping from token ID to index of the owner tokens list
			    mapping(uint256 => uint256) private _ownedTokensIndex;

			    // Array with all token ids, used for enumeration
			    uint256[] private _allTokens;

			    // Mapping from token id to position in the allTokens array
			    mapping(uint256 => uint256) private _allTokensIndex;

			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool) {
			        return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
			    }

			    /**
			     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
			     */
			    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256) {
			        require(index < ERC721.balanceOf(owner), \\"ERC721Enumerable: owner index out of bounds\\");
			        return _ownedTokens[owner][index];
			    }

			    /**
			     * @dev See {IERC721Enumerable-totalSupply}.
			     */
			    function totalSupply() public view virtual override returns (uint256) {
			        return _allTokens.length;
			    }

			    /**
			     * @dev See {IERC721Enumerable-tokenByIndex}.
			     */
			    function tokenByIndex(uint256 index) public view virtual override returns (uint256) {
			        require(index < ERC721Enumerable.totalSupply(), \\"ERC721Enumerable: global index out of bounds\\");
			        return _allTokens[index];
			    }

			    /**
			     * @dev See {ERC721-_beforeTokenTransfer}.
			     */
			    function _beforeTokenTransfer(
			        address from,
			        address to,
			        uint256 firstTokenId,
			        uint256 batchSize
			    ) internal virtual override {
			        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

			        if (batchSize > 1) {
			            // Will only trigger during construction. Batch transferring (minting) is not available afterwards.
			            revert(\\"ERC721Enumerable: consecutive transfers not supported\\");
			        }

			        uint256 tokenId = firstTokenId;

			        if (from == address(0)) {
			            _addTokenToAllTokensEnumeration(tokenId);
			        } else if (from != to) {
			            _removeTokenFromOwnerEnumeration(from, tokenId);
			        }
			        if (to == address(0)) {
			            _removeTokenFromAllTokensEnumeration(tokenId);
			        } else if (to != from) {
			            _addTokenToOwnerEnumeration(to, tokenId);
			        }
			    }

			    /**
			     * @dev Private function to add a token to this extension's ownership-tracking data structures.
			     * @param to address representing the new owner of the given token ID
			     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
			     */
			    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
			        uint256 length = ERC721.balanceOf(to);
			        _ownedTokens[to][length] = tokenId;
			        _ownedTokensIndex[tokenId] = length;
			    }

			    /**
			     * @dev Private function to add a token to this extension's token tracking data structures.
			     * @param tokenId uint256 ID of the token to be added to the tokens list
			     */
			    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
			        _allTokensIndex[tokenId] = _allTokens.length;
			        _allTokens.push(tokenId);
			    }

			    /**
			     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
			     * while the token is not assigned a new owner, the \`_ownedTokensIndex\` mapping is _not_ updated: this allows for
			     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
			     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
			     * @param from address representing the previous owner of the given token ID
			     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
			     */
			    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
			        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
			        // then delete the last slot (swap and pop).

			        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;
			        uint256 tokenIndex = _ownedTokensIndex[tokenId];

			        // When the token to delete is the last token, the swap operation is unnecessary
			        if (tokenIndex != lastTokenIndex) {
			            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

			            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
			            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
			        }

			        // This also deletes the contents at the last position of the array
			        delete _ownedTokensIndex[tokenId];
			        delete _ownedTokens[from][lastTokenIndex];
			    }

			    /**
			     * @dev Private function to remove a token from this extension's token tracking data structures.
			     * This has O(1) time complexity, but alters the order of the _allTokens array.
			     * @param tokenId uint256 ID of the token to be removed from the tokens list
			     */
			    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
			        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
			        // then delete the last slot (swap and pop).

			        uint256 lastTokenIndex = _allTokens.length - 1;
			        uint256 tokenIndex = _allTokensIndex[tokenId];

			        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
			        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
			        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
			        uint256 lastTokenId = _allTokens[lastTokenIndex];

			        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
			        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

			        // This also deletes the contents at the last position of the array
			        delete _allTokensIndex[tokenId];
			        _allTokens.pop();
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC721/extensions/ERC721Enumerable.sol)

			pragma solidity ^0.8.0;

			import \\"../ERC721.sol\\";
			import \\"./IERC721Enumerable.sol\\";

			/**
			 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds
			 * enumerability of all the token ids in the contract as well as all token ids owned by each
			 * account.
			 */
			abstract contract ERC721Enumerable is ERC721, IERC721Enumerable {
			    // Mapping from owner to list of owned token IDs
			    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

			    // Mapping from token ID to index of the owner tokens list
			    mapping(uint256 => uint256) private _ownedTokensIndex;

			    // Array with all token ids, used for enumeration
			    uint256[] private _allTokens;

			    // Mapping from token id to position in the allTokens array
			    mapping(uint256 => uint256) private _allTokensIndex;

			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool) {
			        return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
			    }

			    /**
			     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
			     */
			    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256) {
			        require(index < ERC721.balanceOf(owner), \\"ERC721Enumerable: owner index out of bounds\\");
			        return _ownedTokens[owner][index];
			    }

			    /**
			     * @dev See {IERC721Enumerable-totalSupply}.
			     */
			    function totalSupply() public view virtual override returns (uint256) {
			        return _allTokens.length;
			    }

			    /**
			     * @dev See {IERC721Enumerable-tokenByIndex}.
			     */
			    function tokenByIndex(uint256 index) public view virtual override returns (uint256) {
			        require(index < ERC721Enumerable.totalSupply(), \\"ERC721Enumerable: global index out of bounds\\");
			        return _allTokens[index];
			    }

			    /**
			     * @dev See {ERC721-_beforeTokenTransfer}.
			     */
			    function _beforeTokenTransfer(
			        address from,
			        address to,
			        uint256 firstTokenId,
			        uint256 batchSize
			    ) internal virtual override {
			        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

			        if (batchSize > 1) {
			            // Will only trigger during construction. Batch transferring (minting) is not available afterwards.
			            revert(\\"ERC721Enumerable: consecutive transfers not supported\\");
			        }

			        uint256 tokenId = firstTokenId;

			        if (from == address(0)) {
			            _addTokenToAllTokensEnumeration(tokenId);
			        } else if (from != to) {
			            _removeTokenFromOwnerEnumeration(from, tokenId);
			        }
			        if (to == address(0)) {
			            _removeTokenFromAllTokensEnumeration(tokenId);
			        } else if (to != from) {
			            _addTokenToOwnerEnumeration(to, tokenId);
			        }
			    }

			    /**
			     * @dev Private function to add a token to this extension's ownership-tracking data structures.
			     * @param to address representing the new owner of the given token ID
			     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
			     */
			    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
			        uint256 length = ERC721.balanceOf(to);
			        _ownedTokens[to][length] = tokenId;
			        _ownedTokensIndex[tokenId] = length;
			    }

			    /**
			     * @dev Private function to add a token to this extension's token tracking data structures.
			     * @param tokenId uint256 ID of the token to be added to the tokens list
			     */
			    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
			        _allTokensIndex[tokenId] = _allTokens.length;
			        _allTokens.push(tokenId);
			    }

			    /**
			     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
			     * while the token is not assigned a new owner, the \`_ownedTokensIndex\` mapping is _not_ updated: this allows for
			     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
			     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
			     * @param from address representing the previous owner of the given token ID
			     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
			     */
			    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
			        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
			        // then delete the last slot (swap and pop).

			        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;
			        uint256 tokenIndex = _ownedTokensIndex[tokenId];

			        // When the token to delete is the last token, the swap operation is unnecessary
			        if (tokenIndex != lastTokenIndex) {
			            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

			            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
			            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
			        }

			        // This also deletes the contents at the last position of the array
			        delete _ownedTokensIndex[tokenId];
			        delete _ownedTokens[from][lastTokenIndex];
			    }

			    /**
			     * @dev Private function to remove a token from this extension's token tracking data structures.
			     * This has O(1) time complexity, but alters the order of the _allTokens array.
			     * @param tokenId uint256 ID of the token to be removed from the tokens list
			     */
			    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
			        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
			        // then delete the last slot (swap and pop).

			        uint256 lastTokenIndex = _allTokens.length - 1;
			        uint256 tokenIndex = _allTokensIndex[tokenId];

			        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
			        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
			        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
			        uint256 lastTokenId = _allTokens[lastTokenIndex];

			        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
			        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

			        // This also deletes the contents at the last position of the array
			        delete _allTokensIndex[tokenId];
			        _allTokens.pop();
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC721/extensions/IERC721Enumerable.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol\\";

			/**
			 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
			 * @dev See https://eips.ethereum.org/EIPS/eip-721
			 */
			interface IERC721Enumerable is IERC721 {
			    /**
			     * @dev Returns the total amount of tokens stored by the contract.
			     */
			    function totalSupply() external view returns (uint256);

			    /**
			     * @dev Returns a token ID owned by \`owner\` at a given \`index\` of its token list.
			     * Use along with {balanceOf} to enumerate all of \`\`owner\`\`'s tokens.
			     */
			    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);

			    /**
			     * @dev Returns a token ID at a given \`index\` of all the tokens stored by the contract.
			     * Use along with {totalSupply} to enumerate all tokens.
			     */
			    function tokenByIndex(uint256 index) external view returns (uint256);
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC721/extensions/IERC721Enumerable.sol)

			pragma solidity ^0.8.0;

			import \\"../IERC721.sol\\";

			/**
			 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
			 * @dev See https://eips.ethereum.org/EIPS/eip-721
			 */
			interface IERC721Enumerable is IERC721 {
			    /**
			     * @dev Returns the total amount of tokens stored by the contract.
			     */
			    function totalSupply() external view returns (uint256);

			    /**
			     * @dev Returns a token ID owned by \`owner\` at a given \`index\` of its token list.
			     * Use along with {balanceOf} to enumerate all of \`\`owner\`\`'s tokens.
			     */
			    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);

			    /**
			     * @dev Returns a token ID at a given \`index\` of all the tokens stored by the contract.
			     * Use along with {totalSupply} to enumerate all tokens.
			     */
			    function tokenByIndex(uint256 index) external view returns (uint256);
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (token/ERC721/extensions/IERC721Metadata.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol\\";

			/**
			 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
			 * @dev See https://eips.ethereum.org/EIPS/eip-721
			 */
			interface IERC721Metadata is IERC721 {
			    /**
			     * @dev Returns the token collection name.
			     */
			    function name() external view returns (string memory);

			    /**
			     * @dev Returns the token collection symbol.
			     */
			    function symbol() external view returns (string memory);

			    /**
			     * @dev Returns the Uniform Resource Identifier (URI) for \`tokenId\` token.
			     */
			    function tokenURI(uint256 tokenId) external view returns (string memory);
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (token/ERC721/extensions/IERC721Metadata.sol)

			pragma solidity ^0.8.0;

			import \\"../IERC721.sol\\";

			/**
			 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
			 * @dev See https://eips.ethereum.org/EIPS/eip-721
			 */
			interface IERC721Metadata is IERC721 {
			    /**
			     * @dev Returns the token collection name.
			     */
			    function name() external view returns (string memory);

			    /**
			     * @dev Returns the token collection symbol.
			     */
			    function symbol() external view returns (string memory);

			    /**
			     * @dev Returns the Uniform Resource Identifier (URI) for \`tokenId\` token.
			     */
			    function tokenURI(uint256 tokenId) external view returns (string memory);
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

			pragma solidity ^0.8.1;

			/**
			 * @dev Collection of functions related to the address type
			 */
			library Address {
			    /**
			     * @dev Returns true if \`account\` is a contract.
			     *
			     * [IMPORTANT]
			     * ====
			     * It is unsafe to assume that an address for which this function returns
			     * false is an externally-owned account (EOA) and not a contract.
			     *
			     * Among others, \`isContract\` will return false for the following
			     * types of addresses:
			     *
			     *  - an externally-owned account
			     *  - a contract in construction
			     *  - an address where a contract will be created
			     *  - an address where a contract lived, but was destroyed
			     *
			     * Furthermore, \`isContract\` will also return true if the target contract within
			     * the same transaction is already scheduled for destruction by \`SELFDESTRUCT\`,
			     * which only has an effect at the end of a transaction.
			     * ====
			     *
			     * [IMPORTANT]
			     * ====
			     * You shouldn't rely on \`isContract\` to protect against flash loan attacks!
			     *
			     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
			     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
			     * constructor.
			     * ====
			     */
			    function isContract(address account) internal view returns (bool) {
			        // This method relies on extcodesize/address.code.length, which returns 0
			        // for contracts in construction, since the code is only stored at the end
			        // of the constructor execution.

			        return account.code.length > 0;
			    }

			    /**
			     * @dev Replacement for Solidity's \`transfer\`: sends \`amount\` wei to
			     * \`recipient\`, forwarding all available gas and reverting on errors.
			     *
			     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
			     * of certain opcodes, possibly making contracts go over the 2300 gas limit
			     * imposed by \`transfer\`, making them unable to receive funds via
			     * \`transfer\`. {sendValue} removes this limitation.
			     *
			     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
			     *
			     * IMPORTANT: because control is transferred to \`recipient\`, care must be
			     * taken to not create reentrancy vulnerabilities. Consider using
			     * {ReentrancyGuard} or the
			     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
			     */
			    function sendValue(address payable recipient, uint256 amount) internal {
			        require(address(this).balance >= amount, \\"Address: insufficient balance\\");

			        (bool success, ) = recipient.call{value: amount}(\\"\\");
			        require(success, \\"Address: unable to send value, recipient may have reverted\\");
			    }

			    /**
			     * @dev Performs a Solidity function call using a low level \`call\`. A
			     * plain \`call\` is an unsafe replacement for a function call: use this
			     * function instead.
			     *
			     * If \`target\` reverts with a revert reason, it is bubbled up by this
			     * function (like regular Solidity function calls).
			     *
			     * Returns the raw returned data. To convert to the expected return value,
			     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[\`abi.decode\`].
			     *
			     * Requirements:
			     *
			     * - \`target\` must be a contract.
			     * - calling \`target\` with \`data\` must not revert.
			     *
			     * _Available since v3.1._
			     */
			    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, 0, \\"Address: low-level call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`], but with
			     * \`errorMessage\` as a fallback revert reason when \`target\` reverts.
			     *
			     * _Available since v3.1._
			     */
			    function functionCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, 0, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but also transferring \`value\` wei to \`target\`.
			     *
			     * Requirements:
			     *
			     * - the calling contract must have an ETH balance of at least \`value\`.
			     * - the called Solidity function must be \`payable\`.
			     *
			     * _Available since v3.1._
			     */
			    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, value, \\"Address: low-level call with value failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[\`functionCallWithValue\`], but
			     * with \`errorMessage\` as a fallback revert reason when \`target\` reverts.
			     *
			     * _Available since v3.1._
			     */
			    function functionCallWithValue(
			        address target,
			        bytes memory data,
			        uint256 value,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        require(address(this).balance >= value, \\"Address: insufficient balance for call\\");
			        (bool success, bytes memory returndata) = target.call{value: value}(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but performing a static call.
			     *
			     * _Available since v3.3._
			     */
			    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
			        return functionStaticCall(target, data, \\"Address: low-level static call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
			     * but performing a static call.
			     *
			     * _Available since v3.3._
			     */
			    function functionStaticCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal view returns (bytes memory) {
			        (bool success, bytes memory returndata) = target.staticcall(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but performing a delegate call.
			     *
			     * _Available since v3.4._
			     */
			    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
			        return functionDelegateCall(target, data, \\"Address: low-level delegate call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
			     * but performing a delegate call.
			     *
			     * _Available since v3.4._
			     */
			    function functionDelegateCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        (bool success, bytes memory returndata) = target.delegatecall(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
			     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
			     *
			     * _Available since v4.8._
			     */
			    function verifyCallResultFromTarget(
			        address target,
			        bool success,
			        bytes memory returndata,
			        string memory errorMessage
			    ) internal view returns (bytes memory) {
			        if (success) {
			            if (returndata.length == 0) {
			                // only check isContract if the call was successful and the return data is empty
			                // otherwise we already know that it was a contract
			                require(isContract(target), \\"Address: call to non-contract\\");
			            }
			            return returndata;
			        } else {
			            _revert(returndata, errorMessage);
			        }
			    }

			    /**
			     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
			     * revert reason or using the provided one.
			     *
			     * _Available since v4.3._
			     */
			    function verifyCallResult(
			        bool success,
			        bytes memory returndata,
			        string memory errorMessage
			    ) internal pure returns (bytes memory) {
			        if (success) {
			            return returndata;
			        } else {
			            _revert(returndata, errorMessage);
			        }
			    }

			    function _revert(bytes memory returndata, string memory errorMessage) private pure {
			        // Look for revert reason and bubble it up if present
			        if (returndata.length > 0) {
			            // The easiest way to bubble the revert reason is using memory via assembly
			            /// @solidity memory-safe-assembly
			            assembly {
			                let returndata_size := mload(returndata)
			                revert(add(32, returndata), returndata_size)
			            }
			        } else {
			            revert(errorMessage);
			        }
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol",
			      "importedIds": [],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

			pragma solidity ^0.8.1;

			/**
			 * @dev Collection of functions related to the address type
			 */
			library Address {
			    /**
			     * @dev Returns true if \`account\` is a contract.
			     *
			     * [IMPORTANT]
			     * ====
			     * It is unsafe to assume that an address for which this function returns
			     * false is an externally-owned account (EOA) and not a contract.
			     *
			     * Among others, \`isContract\` will return false for the following
			     * types of addresses:
			     *
			     *  - an externally-owned account
			     *  - a contract in construction
			     *  - an address where a contract will be created
			     *  - an address where a contract lived, but was destroyed
			     *
			     * Furthermore, \`isContract\` will also return true if the target contract within
			     * the same transaction is already scheduled for destruction by \`SELFDESTRUCT\`,
			     * which only has an effect at the end of a transaction.
			     * ====
			     *
			     * [IMPORTANT]
			     * ====
			     * You shouldn't rely on \`isContract\` to protect against flash loan attacks!
			     *
			     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
			     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
			     * constructor.
			     * ====
			     */
			    function isContract(address account) internal view returns (bool) {
			        // This method relies on extcodesize/address.code.length, which returns 0
			        // for contracts in construction, since the code is only stored at the end
			        // of the constructor execution.

			        return account.code.length > 0;
			    }

			    /**
			     * @dev Replacement for Solidity's \`transfer\`: sends \`amount\` wei to
			     * \`recipient\`, forwarding all available gas and reverting on errors.
			     *
			     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
			     * of certain opcodes, possibly making contracts go over the 2300 gas limit
			     * imposed by \`transfer\`, making them unable to receive funds via
			     * \`transfer\`. {sendValue} removes this limitation.
			     *
			     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
			     *
			     * IMPORTANT: because control is transferred to \`recipient\`, care must be
			     * taken to not create reentrancy vulnerabilities. Consider using
			     * {ReentrancyGuard} or the
			     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
			     */
			    function sendValue(address payable recipient, uint256 amount) internal {
			        require(address(this).balance >= amount, \\"Address: insufficient balance\\");

			        (bool success, ) = recipient.call{value: amount}(\\"\\");
			        require(success, \\"Address: unable to send value, recipient may have reverted\\");
			    }

			    /**
			     * @dev Performs a Solidity function call using a low level \`call\`. A
			     * plain \`call\` is an unsafe replacement for a function call: use this
			     * function instead.
			     *
			     * If \`target\` reverts with a revert reason, it is bubbled up by this
			     * function (like regular Solidity function calls).
			     *
			     * Returns the raw returned data. To convert to the expected return value,
			     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[\`abi.decode\`].
			     *
			     * Requirements:
			     *
			     * - \`target\` must be a contract.
			     * - calling \`target\` with \`data\` must not revert.
			     *
			     * _Available since v3.1._
			     */
			    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, 0, \\"Address: low-level call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`], but with
			     * \`errorMessage\` as a fallback revert reason when \`target\` reverts.
			     *
			     * _Available since v3.1._
			     */
			    function functionCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, 0, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but also transferring \`value\` wei to \`target\`.
			     *
			     * Requirements:
			     *
			     * - the calling contract must have an ETH balance of at least \`value\`.
			     * - the called Solidity function must be \`payable\`.
			     *
			     * _Available since v3.1._
			     */
			    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, value, \\"Address: low-level call with value failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[\`functionCallWithValue\`], but
			     * with \`errorMessage\` as a fallback revert reason when \`target\` reverts.
			     *
			     * _Available since v3.1._
			     */
			    function functionCallWithValue(
			        address target,
			        bytes memory data,
			        uint256 value,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        require(address(this).balance >= value, \\"Address: insufficient balance for call\\");
			        (bool success, bytes memory returndata) = target.call{value: value}(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but performing a static call.
			     *
			     * _Available since v3.3._
			     */
			    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
			        return functionStaticCall(target, data, \\"Address: low-level static call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
			     * but performing a static call.
			     *
			     * _Available since v3.3._
			     */
			    function functionStaticCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal view returns (bytes memory) {
			        (bool success, bytes memory returndata) = target.staticcall(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but performing a delegate call.
			     *
			     * _Available since v3.4._
			     */
			    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
			        return functionDelegateCall(target, data, \\"Address: low-level delegate call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
			     * but performing a delegate call.
			     *
			     * _Available since v3.4._
			     */
			    function functionDelegateCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        (bool success, bytes memory returndata) = target.delegatecall(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
			     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
			     *
			     * _Available since v4.8._
			     */
			    function verifyCallResultFromTarget(
			        address target,
			        bool success,
			        bytes memory returndata,
			        string memory errorMessage
			    ) internal view returns (bytes memory) {
			        if (success) {
			            if (returndata.length == 0) {
			                // only check isContract if the call was successful and the return data is empty
			                // otherwise we already know that it was a contract
			                require(isContract(target), \\"Address: call to non-contract\\");
			            }
			            return returndata;
			        } else {
			            _revert(returndata, errorMessage);
			        }
			    }

			    /**
			     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
			     * revert reason or using the provided one.
			     *
			     * _Available since v4.3._
			     */
			    function verifyCallResult(
			        bool success,
			        bytes memory returndata,
			        string memory errorMessage
			    ) internal pure returns (bytes memory) {
			        if (success) {
			            return returndata;
			        } else {
			            _revert(returndata, errorMessage);
			        }
			    }

			    function _revert(bytes memory returndata, string memory errorMessage) private pure {
			        // Look for revert reason and bubble it up if present
			        if (returndata.length > 0) {
			            // The easiest way to bubble the revert reason is using memory via assembly
			            /// @solidity memory-safe-assembly
			            assembly {
			                let returndata_size := mload(returndata)
			                revert(add(32, returndata), returndata_size)
			            }
			        } else {
			            revert(errorMessage);
			        }
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.7.0) (utils/Base64.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Provides a set of functions to operate with Base64 strings.
			 *
			 * _Available since v4.5._
			 */
			library Base64 {
			    /**
			     * @dev Base64 Encoding/Decoding Table
			     */
			    string internal constant _TABLE = \\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\\";

			    /**
			     * @dev Converts a \`bytes\` to its Bytes64 \`string\` representation.
			     */
			    function encode(bytes memory data) internal pure returns (string memory) {
			        /**
			         * Inspired by Brecht Devos (Brechtpd) implementation - MIT licence
			         * https://github.com/Brechtpd/base64/blob/e78d9fd951e7b0977ddca77d92dc85183770daf4/base64.sol
			         */
			        if (data.length == 0) return \\"\\";

			        // Loads the table into memory
			        string memory table = _TABLE;

			        // Encoding takes 3 bytes chunks of binary data from \`bytes\` data parameter
			        // and split into 4 numbers of 6 bits.
			        // The final Base64 length should be \`bytes\` data length multiplied by 4/3 rounded up
			        // - \`data.length + 2\`  -> Round up
			        // - \`/ 3\`              -> Number of 3-bytes chunks
			        // - \`4 *\`              -> 4 characters for each chunk
			        string memory result = new string(4 * ((data.length + 2) / 3));

			        /// @solidity memory-safe-assembly
			        assembly {
			            // Prepare the lookup table (skip the first \\"length\\" byte)
			            let tablePtr := add(table, 1)

			            // Prepare result pointer, jump over length
			            let resultPtr := add(result, 32)

			            // Run over the input, 3 bytes at a time
			            for {
			                let dataPtr := data
			                let endPtr := add(data, mload(data))
			            } lt(dataPtr, endPtr) {

			            } {
			                // Advance 3 bytes
			                dataPtr := add(dataPtr, 3)
			                let input := mload(dataPtr)

			                // To write each character, shift the 3 bytes (18 bits) chunk
			                // 4 times in blocks of 6 bits for each character (18, 12, 6, 0)
			                // and apply logical AND with 0x3F which is the number of
			                // the previous character in the ASCII table prior to the Base64 Table
			                // The result is then added to the table to get the character to write,
			                // and finally write it in the result pointer but with a left shift
			                // of 256 (1 byte) - 8 (1 ASCII char) = 248 bits

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance
			            }

			            // When data \`bytes\` is not exactly 3 bytes long
			            // it is padded with \`=\` characters at the end
			            switch mod(mload(data), 3)
			            case 1 {
			                mstore8(sub(resultPtr, 1), 0x3d)
			                mstore8(sub(resultPtr, 2), 0x3d)
			            }
			            case 2 {
			                mstore8(sub(resultPtr, 1), 0x3d)
			            }
			        }

			        return result;
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol",
			      "importedIds": [],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.7.0) (utils/Base64.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Provides a set of functions to operate with Base64 strings.
			 *
			 * _Available since v4.5._
			 */
			library Base64 {
			    /**
			     * @dev Base64 Encoding/Decoding Table
			     */
			    string internal constant _TABLE = \\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\\";

			    /**
			     * @dev Converts a \`bytes\` to its Bytes64 \`string\` representation.
			     */
			    function encode(bytes memory data) internal pure returns (string memory) {
			        /**
			         * Inspired by Brecht Devos (Brechtpd) implementation - MIT licence
			         * https://github.com/Brechtpd/base64/blob/e78d9fd951e7b0977ddca77d92dc85183770daf4/base64.sol
			         */
			        if (data.length == 0) return \\"\\";

			        // Loads the table into memory
			        string memory table = _TABLE;

			        // Encoding takes 3 bytes chunks of binary data from \`bytes\` data parameter
			        // and split into 4 numbers of 6 bits.
			        // The final Base64 length should be \`bytes\` data length multiplied by 4/3 rounded up
			        // - \`data.length + 2\`  -> Round up
			        // - \`/ 3\`              -> Number of 3-bytes chunks
			        // - \`4 *\`              -> 4 characters for each chunk
			        string memory result = new string(4 * ((data.length + 2) / 3));

			        /// @solidity memory-safe-assembly
			        assembly {
			            // Prepare the lookup table (skip the first \\"length\\" byte)
			            let tablePtr := add(table, 1)

			            // Prepare result pointer, jump over length
			            let resultPtr := add(result, 32)

			            // Run over the input, 3 bytes at a time
			            for {
			                let dataPtr := data
			                let endPtr := add(data, mload(data))
			            } lt(dataPtr, endPtr) {

			            } {
			                // Advance 3 bytes
			                dataPtr := add(dataPtr, 3)
			                let input := mload(dataPtr)

			                // To write each character, shift the 3 bytes (18 bits) chunk
			                // 4 times in blocks of 6 bits for each character (18, 12, 6, 0)
			                // and apply logical AND with 0x3F which is the number of
			                // the previous character in the ASCII table prior to the Base64 Table
			                // The result is then added to the table to get the character to write,
			                // and finally write it in the result pointer but with a left shift
			                // of 256 (1 byte) - 8 (1 ASCII char) = 248 bits

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance
			            }

			            // When data \`bytes\` is not exactly 3 bytes long
			            // it is padded with \`=\` characters at the end
			            switch mod(mload(data), 3)
			            case 1 {
			                mstore8(sub(resultPtr, 1), 0x3d)
			                mstore8(sub(resultPtr, 2), 0x3d)
			            }
			            case 2 {
			                mstore8(sub(resultPtr, 1), 0x3d)
			            }
			        }

			        return result;
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Provides information about the current execution context, including the
			 * sender of the transaction and its data. While these are generally available
			 * via msg.sender and msg.data, they should not be accessed in such a direct
			 * manner, since when dealing with meta-transactions the account sending and
			 * paying for execution may not be the actual sender (as far as an application
			 * is concerned).
			 *
			 * This contract is only required for intermediate, library-like contracts.
			 */
			abstract contract Context {
			    function _msgSender() internal view virtual returns (address) {
			        return msg.sender;
			    }

			    function _msgData() internal view virtual returns (bytes calldata) {
			        return msg.data;
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol",
			      "importedIds": [],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Provides information about the current execution context, including the
			 * sender of the transaction and its data. While these are generally available
			 * via msg.sender and msg.data, they should not be accessed in such a direct
			 * manner, since when dealing with meta-transactions the account sending and
			 * paying for execution may not be the actual sender (as far as an application
			 * is concerned).
			 *
			 * This contract is only required for intermediate, library-like contracts.
			 */
			abstract contract Context {
			    function _msgSender() internal view virtual returns (address) {
			        return msg.sender;
			    }

			    function _msgData() internal view virtual returns (bytes calldata) {
			        return msg.data;
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/Strings.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol\\";

			/**
			 * @dev String operations.
			 */
			library Strings {
			    bytes16 private constant _SYMBOLS = \\"0123456789abcdef\\";
			    uint8 private constant _ADDRESS_LENGTH = 20;

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` decimal representation.
			     */
			    function toString(uint256 value) internal pure returns (string memory) {
			        unchecked {
			            uint256 length = Math.log10(value) + 1;
			            string memory buffer = new string(length);
			            uint256 ptr;
			            /// @solidity memory-safe-assembly
			            assembly {
			                ptr := add(buffer, add(32, length))
			            }
			            while (true) {
			                ptr--;
			                /// @solidity memory-safe-assembly
			                assembly {
			                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
			                }
			                value /= 10;
			                if (value == 0) break;
			            }
			            return buffer;
			        }
			    }

			    /**
			     * @dev Converts a \`int256\` to its ASCII \`string\` decimal representation.
			     */
			    function toString(int256 value) internal pure returns (string memory) {
			        return string(abi.encodePacked(value < 0 ? \\"-\\" : \\"\\", toString(SignedMath.abs(value))));
			    }

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation.
			     */
			    function toHexString(uint256 value) internal pure returns (string memory) {
			        unchecked {
			            return toHexString(value, Math.log256(value) + 1);
			        }
			    }

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation with fixed length.
			     */
			    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
			        bytes memory buffer = new bytes(2 * length + 2);
			        buffer[0] = \\"0\\";
			        buffer[1] = \\"x\\";
			        for (uint256 i = 2 * length + 1; i > 1; --i) {
			            buffer[i] = _SYMBOLS[value & 0xf];
			            value >>= 4;
			        }
			        require(value == 0, \\"Strings: hex length insufficient\\");
			        return string(buffer);
			    }

			    /**
			     * @dev Converts an \`address\` with fixed length of 20 bytes to its not checksummed ASCII \`string\` hexadecimal representation.
			     */
			    function toHexString(address addr) internal pure returns (string memory) {
			        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
			    }

			    /**
			     * @dev Returns true if the two strings are equal.
			     */
			    function equal(string memory a, string memory b) internal pure returns (bool) {
			        return keccak256(bytes(a)) == keccak256(bytes(b));
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol",
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/Strings.sol)

			pragma solidity ^0.8.0;

			import \\"./math/Math.sol\\";
			import \\"./math/SignedMath.sol\\";

			/**
			 * @dev String operations.
			 */
			library Strings {
			    bytes16 private constant _SYMBOLS = \\"0123456789abcdef\\";
			    uint8 private constant _ADDRESS_LENGTH = 20;

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` decimal representation.
			     */
			    function toString(uint256 value) internal pure returns (string memory) {
			        unchecked {
			            uint256 length = Math.log10(value) + 1;
			            string memory buffer = new string(length);
			            uint256 ptr;
			            /// @solidity memory-safe-assembly
			            assembly {
			                ptr := add(buffer, add(32, length))
			            }
			            while (true) {
			                ptr--;
			                /// @solidity memory-safe-assembly
			                assembly {
			                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
			                }
			                value /= 10;
			                if (value == 0) break;
			            }
			            return buffer;
			        }
			    }

			    /**
			     * @dev Converts a \`int256\` to its ASCII \`string\` decimal representation.
			     */
			    function toString(int256 value) internal pure returns (string memory) {
			        return string(abi.encodePacked(value < 0 ? \\"-\\" : \\"\\", toString(SignedMath.abs(value))));
			    }

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation.
			     */
			    function toHexString(uint256 value) internal pure returns (string memory) {
			        unchecked {
			            return toHexString(value, Math.log256(value) + 1);
			        }
			    }

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation with fixed length.
			     */
			    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
			        bytes memory buffer = new bytes(2 * length + 2);
			        buffer[0] = \\"0\\";
			        buffer[1] = \\"x\\";
			        for (uint256 i = 2 * length + 1; i > 1; --i) {
			            buffer[i] = _SYMBOLS[value & 0xf];
			            value >>= 4;
			        }
			        require(value == 0, \\"Strings: hex length insufficient\\");
			        return string(buffer);
			    }

			    /**
			     * @dev Converts an \`address\` with fixed length of 20 bytes to its not checksummed ASCII \`string\` hexadecimal representation.
			     */
			    function toHexString(address addr) internal pure returns (string memory) {
			        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
			    }

			    /**
			     * @dev Returns true if the two strings are equal.
			     */
			    function equal(string memory a, string memory b) internal pure returns (bool) {
			        return keccak256(bytes(a)) == keccak256(bytes(b));
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol\\";

			/**
			 * @dev Implementation of the {IERC165} interface.
			 *
			 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
			 * for the additional interface id that will be supported. For example:
			 *
			 * \`\`\`solidity
			 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
			 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
			 * }
			 * \`\`\`
			 *
			 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
			 */
			abstract contract ERC165 is IERC165 {
			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
			        return interfaceId == type(IERC165).interfaceId;
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol",
			      "importedIds": [
			        "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol",
			      ],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165.sol)

			pragma solidity ^0.8.0;

			import \\"./IERC165.sol\\";

			/**
			 * @dev Implementation of the {IERC165} interface.
			 *
			 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
			 * for the additional interface id that will be supported. For example:
			 *
			 * \`\`\`solidity
			 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
			 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
			 * }
			 * \`\`\`
			 *
			 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
			 */
			abstract contract ERC165 is IERC165 {
			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
			        return interfaceId == type(IERC165).interfaceId;
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Interface of the ERC165 standard, as defined in the
			 * https://eips.ethereum.org/EIPS/eip-165[EIP].
			 *
			 * Implementers can declare support of contract interfaces, which can then be
			 * queried by others ({ERC165Checker}).
			 *
			 * For an implementation, see {ERC165}.
			 */
			interface IERC165 {
			    /**
			     * @dev Returns true if this contract implements the interface defined by
			     * \`interfaceId\`. See the corresponding
			     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
			     * to learn more about how these ids are created.
			     *
			     * This function call must use less than 30 000 gas.
			     */
			    function supportsInterface(bytes4 interfaceId) external view returns (bool);
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol",
			      "importedIds": [],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Interface of the ERC165 standard, as defined in the
			 * https://eips.ethereum.org/EIPS/eip-165[EIP].
			 *
			 * Implementers can declare support of contract interfaces, which can then be
			 * queried by others ({ERC165Checker}).
			 *
			 * For an implementation, see {ERC165}.
			 */
			interface IERC165 {
			    /**
			     * @dev Returns true if this contract implements the interface defined by
			     * \`interfaceId\`. See the corresponding
			     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
			     * to learn more about how these ids are created.
			     *
			     * This function call must use less than 30 000 gas.
			     */
			    function supportsInterface(bytes4 interfaceId) external view returns (bool);
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/math/Math.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Standard math utilities missing in the Solidity language.
			 */
			library Math {
			    enum Rounding {
			        Down, // Toward negative infinity
			        Up, // Toward infinity
			        Zero // Toward zero
			    }

			    /**
			     * @dev Returns the largest of two numbers.
			     */
			    function max(uint256 a, uint256 b) internal pure returns (uint256) {
			        return a > b ? a : b;
			    }

			    /**
			     * @dev Returns the smallest of two numbers.
			     */
			    function min(uint256 a, uint256 b) internal pure returns (uint256) {
			        return a < b ? a : b;
			    }

			    /**
			     * @dev Returns the average of two numbers. The result is rounded towards
			     * zero.
			     */
			    function average(uint256 a, uint256 b) internal pure returns (uint256) {
			        // (a + b) / 2 can overflow.
			        return (a & b) + (a ^ b) / 2;
			    }

			    /**
			     * @dev Returns the ceiling of the division of two numbers.
			     *
			     * This differs from standard division with \`/\` in that it rounds up instead
			     * of rounding down.
			     */
			    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
			        // (a + b - 1) / b can overflow on addition, so we distribute.
			        return a == 0 ? 0 : (a - 1) / b + 1;
			    }

			    /**
			     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
			     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
			     * with further edits by Uniswap Labs also under MIT license.
			     */
			    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
			        unchecked {
			            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
			            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
			            // variables such that product = prod1 * 2^256 + prod0.
			            uint256 prod0; // Least significant 256 bits of the product
			            uint256 prod1; // Most significant 256 bits of the product
			            assembly {
			                let mm := mulmod(x, y, not(0))
			                prod0 := mul(x, y)
			                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
			            }

			            // Handle non-overflow cases, 256 by 256 division.
			            if (prod1 == 0) {
			                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
			                // The surrounding unchecked block does not change this fact.
			                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
			                return prod0 / denominator;
			            }

			            // Make sure the result is less than 2^256. Also prevents denominator == 0.
			            require(denominator > prod1, \\"Math: mulDiv overflow\\");

			            ///////////////////////////////////////////////
			            // 512 by 256 division.
			            ///////////////////////////////////////////////

			            // Make division exact by subtracting the remainder from [prod1 prod0].
			            uint256 remainder;
			            assembly {
			                // Compute remainder using mulmod.
			                remainder := mulmod(x, y, denominator)

			                // Subtract 256 bit number from 512 bit number.
			                prod1 := sub(prod1, gt(remainder, prod0))
			                prod0 := sub(prod0, remainder)
			            }

			            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
			            // See https://cs.stackexchange.com/q/138556/92363.

			            // Does not overflow because the denominator cannot be zero at this stage in the function.
			            uint256 twos = denominator & (~denominator + 1);
			            assembly {
			                // Divide denominator by twos.
			                denominator := div(denominator, twos)

			                // Divide [prod1 prod0] by twos.
			                prod0 := div(prod0, twos)

			                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
			                twos := add(div(sub(0, twos), twos), 1)
			            }

			            // Shift in bits from prod1 into prod0.
			            prod0 |= prod1 * twos;

			            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
			            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
			            // four bits. That is, denominator * inv = 1 mod 2^4.
			            uint256 inverse = (3 * denominator) ^ 2;

			            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
			            // in modular arithmetic, doubling the correct bits in each step.
			            inverse *= 2 - denominator * inverse; // inverse mod 2^8
			            inverse *= 2 - denominator * inverse; // inverse mod 2^16
			            inverse *= 2 - denominator * inverse; // inverse mod 2^32
			            inverse *= 2 - denominator * inverse; // inverse mod 2^64
			            inverse *= 2 - denominator * inverse; // inverse mod 2^128
			            inverse *= 2 - denominator * inverse; // inverse mod 2^256

			            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
			            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
			            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
			            // is no longer required.
			            result = prod0 * inverse;
			            return result;
			        }
			    }

			    /**
			     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
			     */
			    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
			        uint256 result = mulDiv(x, y, denominator);
			        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
			            result += 1;
			        }
			        return result;
			    }

			    /**
			     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
			     *
			     * Inspired by Henry S. Warren, Jr.'s \\"Hacker's Delight\\" (Chapter 11).
			     */
			    function sqrt(uint256 a) internal pure returns (uint256) {
			        if (a == 0) {
			            return 0;
			        }

			        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
			        //
			        // We know that the \\"msb\\" (most significant bit) of our target number \`a\` is a power of 2 such that we have
			        // \`msb(a) <= a < 2*msb(a)\`. This value can be written \`msb(a)=2**k\` with \`k=log2(a)\`.
			        //
			        // This can be rewritten \`2**log2(a) <= a < 2**(log2(a) + 1)\`
			        // → \`sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))\`
			        // → \`2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)\`
			        //
			        // Consequently, \`2**(log2(a) / 2)\` is a good first approximation of \`sqrt(a)\` with at least 1 correct bit.
			        uint256 result = 1 << (log2(a) >> 1);

			        // At this point \`result\` is an estimation with one bit of precision. We know the true value is a uint128,
			        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
			        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
			        // into the expected uint128 result.
			        unchecked {
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            return min(result, a / result);
			        }
			    }

			    /**
			     * @notice Calculates sqrt(a), following the selected rounding direction.
			     */
			    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = sqrt(a);
			            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 2, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log2(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >> 128 > 0) {
			                value >>= 128;
			                result += 128;
			            }
			            if (value >> 64 > 0) {
			                value >>= 64;
			                result += 64;
			            }
			            if (value >> 32 > 0) {
			                value >>= 32;
			                result += 32;
			            }
			            if (value >> 16 > 0) {
			                value >>= 16;
			                result += 16;
			            }
			            if (value >> 8 > 0) {
			                value >>= 8;
			                result += 8;
			            }
			            if (value >> 4 > 0) {
			                value >>= 4;
			                result += 4;
			            }
			            if (value >> 2 > 0) {
			                value >>= 2;
			                result += 2;
			            }
			            if (value >> 1 > 0) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log2(value);
			            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 10, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log10(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >= 10 ** 64) {
			                value /= 10 ** 64;
			                result += 64;
			            }
			            if (value >= 10 ** 32) {
			                value /= 10 ** 32;
			                result += 32;
			            }
			            if (value >= 10 ** 16) {
			                value /= 10 ** 16;
			                result += 16;
			            }
			            if (value >= 10 ** 8) {
			                value /= 10 ** 8;
			                result += 8;
			            }
			            if (value >= 10 ** 4) {
			                value /= 10 ** 4;
			                result += 4;
			            }
			            if (value >= 10 ** 2) {
			                value /= 10 ** 2;
			                result += 2;
			            }
			            if (value >= 10 ** 1) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log10(value);
			            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 256, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     *
			     * Adding one to the result gives the number of pairs of hex symbols needed to represent \`value\` as a hex string.
			     */
			    function log256(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >> 128 > 0) {
			                value >>= 128;
			                result += 16;
			            }
			            if (value >> 64 > 0) {
			                value >>= 64;
			                result += 8;
			            }
			            if (value >> 32 > 0) {
			                value >>= 32;
			                result += 4;
			            }
			            if (value >> 16 > 0) {
			                value >>= 16;
			                result += 2;
			            }
			            if (value >> 8 > 0) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log256(value);
			            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
			        }
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol",
			      "importedIds": [],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/math/Math.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Standard math utilities missing in the Solidity language.
			 */
			library Math {
			    enum Rounding {
			        Down, // Toward negative infinity
			        Up, // Toward infinity
			        Zero // Toward zero
			    }

			    /**
			     * @dev Returns the largest of two numbers.
			     */
			    function max(uint256 a, uint256 b) internal pure returns (uint256) {
			        return a > b ? a : b;
			    }

			    /**
			     * @dev Returns the smallest of two numbers.
			     */
			    function min(uint256 a, uint256 b) internal pure returns (uint256) {
			        return a < b ? a : b;
			    }

			    /**
			     * @dev Returns the average of two numbers. The result is rounded towards
			     * zero.
			     */
			    function average(uint256 a, uint256 b) internal pure returns (uint256) {
			        // (a + b) / 2 can overflow.
			        return (a & b) + (a ^ b) / 2;
			    }

			    /**
			     * @dev Returns the ceiling of the division of two numbers.
			     *
			     * This differs from standard division with \`/\` in that it rounds up instead
			     * of rounding down.
			     */
			    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
			        // (a + b - 1) / b can overflow on addition, so we distribute.
			        return a == 0 ? 0 : (a - 1) / b + 1;
			    }

			    /**
			     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
			     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
			     * with further edits by Uniswap Labs also under MIT license.
			     */
			    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
			        unchecked {
			            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
			            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
			            // variables such that product = prod1 * 2^256 + prod0.
			            uint256 prod0; // Least significant 256 bits of the product
			            uint256 prod1; // Most significant 256 bits of the product
			            assembly {
			                let mm := mulmod(x, y, not(0))
			                prod0 := mul(x, y)
			                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
			            }

			            // Handle non-overflow cases, 256 by 256 division.
			            if (prod1 == 0) {
			                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
			                // The surrounding unchecked block does not change this fact.
			                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
			                return prod0 / denominator;
			            }

			            // Make sure the result is less than 2^256. Also prevents denominator == 0.
			            require(denominator > prod1, \\"Math: mulDiv overflow\\");

			            ///////////////////////////////////////////////
			            // 512 by 256 division.
			            ///////////////////////////////////////////////

			            // Make division exact by subtracting the remainder from [prod1 prod0].
			            uint256 remainder;
			            assembly {
			                // Compute remainder using mulmod.
			                remainder := mulmod(x, y, denominator)

			                // Subtract 256 bit number from 512 bit number.
			                prod1 := sub(prod1, gt(remainder, prod0))
			                prod0 := sub(prod0, remainder)
			            }

			            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
			            // See https://cs.stackexchange.com/q/138556/92363.

			            // Does not overflow because the denominator cannot be zero at this stage in the function.
			            uint256 twos = denominator & (~denominator + 1);
			            assembly {
			                // Divide denominator by twos.
			                denominator := div(denominator, twos)

			                // Divide [prod1 prod0] by twos.
			                prod0 := div(prod0, twos)

			                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
			                twos := add(div(sub(0, twos), twos), 1)
			            }

			            // Shift in bits from prod1 into prod0.
			            prod0 |= prod1 * twos;

			            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
			            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
			            // four bits. That is, denominator * inv = 1 mod 2^4.
			            uint256 inverse = (3 * denominator) ^ 2;

			            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
			            // in modular arithmetic, doubling the correct bits in each step.
			            inverse *= 2 - denominator * inverse; // inverse mod 2^8
			            inverse *= 2 - denominator * inverse; // inverse mod 2^16
			            inverse *= 2 - denominator * inverse; // inverse mod 2^32
			            inverse *= 2 - denominator * inverse; // inverse mod 2^64
			            inverse *= 2 - denominator * inverse; // inverse mod 2^128
			            inverse *= 2 - denominator * inverse; // inverse mod 2^256

			            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
			            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
			            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
			            // is no longer required.
			            result = prod0 * inverse;
			            return result;
			        }
			    }

			    /**
			     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
			     */
			    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
			        uint256 result = mulDiv(x, y, denominator);
			        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
			            result += 1;
			        }
			        return result;
			    }

			    /**
			     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
			     *
			     * Inspired by Henry S. Warren, Jr.'s \\"Hacker's Delight\\" (Chapter 11).
			     */
			    function sqrt(uint256 a) internal pure returns (uint256) {
			        if (a == 0) {
			            return 0;
			        }

			        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
			        //
			        // We know that the \\"msb\\" (most significant bit) of our target number \`a\` is a power of 2 such that we have
			        // \`msb(a) <= a < 2*msb(a)\`. This value can be written \`msb(a)=2**k\` with \`k=log2(a)\`.
			        //
			        // This can be rewritten \`2**log2(a) <= a < 2**(log2(a) + 1)\`
			        // → \`sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))\`
			        // → \`2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)\`
			        //
			        // Consequently, \`2**(log2(a) / 2)\` is a good first approximation of \`sqrt(a)\` with at least 1 correct bit.
			        uint256 result = 1 << (log2(a) >> 1);

			        // At this point \`result\` is an estimation with one bit of precision. We know the true value is a uint128,
			        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
			        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
			        // into the expected uint128 result.
			        unchecked {
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            return min(result, a / result);
			        }
			    }

			    /**
			     * @notice Calculates sqrt(a), following the selected rounding direction.
			     */
			    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = sqrt(a);
			            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 2, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log2(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >> 128 > 0) {
			                value >>= 128;
			                result += 128;
			            }
			            if (value >> 64 > 0) {
			                value >>= 64;
			                result += 64;
			            }
			            if (value >> 32 > 0) {
			                value >>= 32;
			                result += 32;
			            }
			            if (value >> 16 > 0) {
			                value >>= 16;
			                result += 16;
			            }
			            if (value >> 8 > 0) {
			                value >>= 8;
			                result += 8;
			            }
			            if (value >> 4 > 0) {
			                value >>= 4;
			                result += 4;
			            }
			            if (value >> 2 > 0) {
			                value >>= 2;
			                result += 2;
			            }
			            if (value >> 1 > 0) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log2(value);
			            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 10, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log10(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >= 10 ** 64) {
			                value /= 10 ** 64;
			                result += 64;
			            }
			            if (value >= 10 ** 32) {
			                value /= 10 ** 32;
			                result += 32;
			            }
			            if (value >= 10 ** 16) {
			                value /= 10 ** 16;
			                result += 16;
			            }
			            if (value >= 10 ** 8) {
			                value /= 10 ** 8;
			                result += 8;
			            }
			            if (value >= 10 ** 4) {
			                value /= 10 ** 4;
			                result += 4;
			            }
			            if (value >= 10 ** 2) {
			                value /= 10 ** 2;
			                result += 2;
			            }
			            if (value >= 10 ** 1) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log10(value);
			            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 256, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     *
			     * Adding one to the result gives the number of pairs of hex symbols needed to represent \`value\` as a hex string.
			     */
			    function log256(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >> 128 > 0) {
			                value >>= 128;
			                result += 16;
			            }
			            if (value >> 64 > 0) {
			                value >>= 64;
			                result += 8;
			            }
			            if (value >> 32 > 0) {
			                value >>= 32;
			                result += 4;
			            }
			            if (value >> 16 > 0) {
			                value >>= 16;
			                result += 2;
			            }
			            if (value >> 8 > 0) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log256(value);
			            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
			        }
			    }
			}
			",
			    },
			    "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol": {
			      "code": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/SignedMath.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Standard signed math utilities missing in the Solidity language.
			 */
			library SignedMath {
			    /**
			     * @dev Returns the largest of two signed numbers.
			     */
			    function max(int256 a, int256 b) internal pure returns (int256) {
			        return a > b ? a : b;
			    }

			    /**
			     * @dev Returns the smallest of two signed numbers.
			     */
			    function min(int256 a, int256 b) internal pure returns (int256) {
			        return a < b ? a : b;
			    }

			    /**
			     * @dev Returns the average of two signed numbers without overflow.
			     * The result is rounded towards zero.
			     */
			    function average(int256 a, int256 b) internal pure returns (int256) {
			        // Formula from the book \\"Hacker's Delight\\"
			        int256 x = (a & b) + ((a ^ b) >> 1);
			        return x + (int256(uint256(x) >> 255) & (a ^ b));
			    }

			    /**
			     * @dev Returns the absolute unsigned value of a signed value.
			     */
			    function abs(int256 n) internal pure returns (uint256) {
			        unchecked {
			            // must be unchecked in order to support \`n = type(int256).min\`
			            return uint256(n >= 0 ? n : -n);
			        }
			    }
			}
			",
			      "id": "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol",
			      "importedIds": [],
			      "rawCode": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/SignedMath.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Standard signed math utilities missing in the Solidity language.
			 */
			library SignedMath {
			    /**
			     * @dev Returns the largest of two signed numbers.
			     */
			    function max(int256 a, int256 b) internal pure returns (int256) {
			        return a > b ? a : b;
			    }

			    /**
			     * @dev Returns the smallest of two signed numbers.
			     */
			    function min(int256 a, int256 b) internal pure returns (int256) {
			        return a < b ? a : b;
			    }

			    /**
			     * @dev Returns the average of two signed numbers without overflow.
			     * The result is rounded towards zero.
			     */
			    function average(int256 a, int256 b) internal pure returns (int256) {
			        // Formula from the book \\"Hacker's Delight\\"
			        int256 x = (a & b) + ((a ^ b) >> 1);
			        return x + (int256(uint256(x) >> 255) & (a ^ b));
			    }

			    /**
			     * @dev Returns the absolute unsigned value of a signed value.
			     */
			    function abs(int256 n) internal pure returns (uint256) {
			        unchecked {
			            // must be unchecked in order to support \`n = type(int256).min\`
			            return uint256(n >= 0 ? n : -n);
			        }
			    }
			}
			",
			    },
			  },
			  "solcInput": {
			    "language": "Solidity",
			    "settings": {
			      "outputSelection": {
			        "*": {
			          "*": [
			            "abi",
			            "userdoc",
			          ],
			        },
			      },
			    },
			    "sources": {
			      "./Contract.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			pragma solidity >0.8.16;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol\\";
			// import \\"this shouldn't be imorted\\";

			/// @author Wagmi
			/// @author EVMts
			/// @title  WagmiMintExample
			/// @notice An example token original from the wagmi template
			contract WagmiMintExample is ERC721 {
			    uint256 public totalSupply;

			// import \\"@openzeppelin/contracts/utils/Base64.sol\\";
			    uint256 private nextTokenId = 0;

			    constructor() ERC721(\\"wagmi\\", \\"WAGMI\\") {}

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
			        require(!_exists(tokenId), \\"Token ID is taken\\");
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
			            keccak256(abi.encodePacked(\\"foreground\\", tokenId))
			        ) % 360;
			        uint256 backgroundHue = uint256(
			            keccak256(abi.encodePacked(\\"background\\", tokenId))
			        ) % 360;
			        string memory json = Base64.encode(
			            bytes(
			                abi.encodePacked(
			                    '{\\"name\\": \\"wagmi #',
			                    toString(tokenId),
			                    '\\", \\"image\\": \\"data:image/svg+xml;base64,',
			                    Base64.encode(
			                        bytes(
			                            abi.encodePacked(
			                                '<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"1024\\" height=\\"1024\\" fill=\\"none\\"><path fill=\\"hsl(',
			                                toString(foregroundHue),
			                                ', 100%, 10%)\\" d=\\"M0 0h1024v1024H0z\\" /><g fill=\\"hsl(',
			                                toString(backgroundHue),
			                                ', 100%, 90%)\\"><path d=\\"M903 437.5c0 9.113-7.388 16.5-16.5 16.5s-16.5-7.387-16.5-16.5 7.388-16.5 16.5-16.5 16.5 7.387 16.5 16.5zM698.529 566c6.921 0 12.53-5.596 12.53-12.5v-50c0-6.904 5.609-12.5 12.529-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.53 12.5s12.529-5.596 12.529-12.5v-50c0-6.904 5.609-12.5 12.53-12.5h25.059c6.92 0 12.529 5.596 12.529 12.5v50c0 6.904 5.609 12.5 12.529 12.5h37.589c6.92 0 12.529-5.596 12.529-12.5v-75c0-6.904-5.609-12.5-12.529-12.5s-12.53 5.596-12.53 12.5v56.25a6.264 6.264 0 1 1-12.529 0V478.5c0-6.904-5.609-12.5-12.53-12.5H698.529c-6.92 0-12.529 5.596-12.529 12.5v75c0 6.904 5.609 12.5 12.529 12.5z\\" /><path d=\\"M157.655 541c-6.932 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.619-12.5-12.551-12.5S120 471.596 120 478.5v75c0 6.904 5.62 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-50c0-6.904 5.619-12.5 12.552-12.5h144.345c3.465 0 6.276 2.798 6.276 6.25s-2.811 6.25-6.276 6.25H320.828c-6.933 0-12.552 5.596-12.552 12.5v37.5c0 6.904 5.619 12.5 12.552 12.5h150.62c6.933 0 12.552-5.596 12.552-12.5v-75c0-6.904-5.619-12.5-12.552-12.5H283.172c-6.932 0-12.551 5.596-12.551 12.5v50c0 6.904-5.619 12.5-12.552 12.5h-25.103c-6.933 0-12.552-5.596-12.552-12.5v-50c0-6.904-5.62-12.5-12.552-12.5s-12.552 5.596-12.552 12.5v50c0 6.904-5.619 12.5-12.551 12.5h-25.104zm301.242-6.25c0 3.452-2.811 6.25-6.276 6.25H339.655c-3.465 0-6.276-2.798-6.276-6.25s2.811-6.25 6.276-6.25h112.966c3.465 0 6.276 2.798 6.276 6.25zM497 553.818c0 6.929 5.628 12.546 12.571 12.546h132a6.28 6.28 0 0 1 6.286 6.272 6.28 6.28 0 0 1-6.286 6.273h-132c-6.943 0-12.571 5.616-12.571 12.546A12.56 12.56 0 0 0 509.571 604h150.858c6.943 0 12.571-5.616 12.571-12.545v-112.91c0-6.928-5.628-12.545-12.571-12.545H509.571c-6.943 0-12.571 5.617-12.571 12.545v75.273zm37.714-62.727c-6.943 0-12.571 5.617-12.571 12.545v25.091c0 6.929 5.628 12.546 12.571 12.546h100.572c6.943 0 12.571-5.617 12.571-12.546v-25.091c0-6.928-5.628-12.545-12.571-12.545H534.714z\\" fill-rule=\\"evenodd\\" /></g></svg>'
			                            )
			                        )
			                    ),
			                    '\\"}'
			                )
			            )
			        );
			        string memory output = string(
			            abi.encodePacked(\\"data:application/json;base64,\\", json)
			        );
			        return output;
			    }

			    function toString(uint256 value) internal pure returns (string memory) {
			        // Inspired by OraclizeAPI's implementation - MIT licence
			        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

			        if (value == 0) {
			            return \\"0\\";
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
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC721/ERC721.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol\\";

			/**
			 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
			 * the Metadata extension, but not including the Enumerable extension, which is available separately as
			 * {ERC721Enumerable}.
			 */
			contract ERC721 is Context, ERC165, IERC721, IERC721Metadata {
			    using Address for address;
			    using Strings for uint256;

			    // Token name
			    string private _name;

			    // Token symbol
			    string private _symbol;

			    // Mapping from token ID to owner address
			    mapping(uint256 => address) private _owners;

			    // Mapping owner address to token count
			    mapping(address => uint256) private _balances;

			    // Mapping from token ID to approved address
			    mapping(uint256 => address) private _tokenApprovals;

			    // Mapping from owner to operator approvals
			    mapping(address => mapping(address => bool)) private _operatorApprovals;

			    /**
			     * @dev Initializes the contract by setting a \`name\` and a \`symbol\` to the token collection.
			     */
			    constructor(string memory name_, string memory symbol_) {
			        _name = name_;
			        _symbol = symbol_;
			    }

			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
			        return
			            interfaceId == type(IERC721).interfaceId ||
			            interfaceId == type(IERC721Metadata).interfaceId ||
			            super.supportsInterface(interfaceId);
			    }

			    /**
			     * @dev See {IERC721-balanceOf}.
			     */
			    function balanceOf(address owner) public view virtual override returns (uint256) {
			        require(owner != address(0), \\"ERC721: address zero is not a valid owner\\");
			        return _balances[owner];
			    }

			    /**
			     * @dev See {IERC721-ownerOf}.
			     */
			    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
			        address owner = _ownerOf(tokenId);
			        require(owner != address(0), \\"ERC721: invalid token ID\\");
			        return owner;
			    }

			    /**
			     * @dev See {IERC721Metadata-name}.
			     */
			    function name() public view virtual override returns (string memory) {
			        return _name;
			    }

			    /**
			     * @dev See {IERC721Metadata-symbol}.
			     */
			    function symbol() public view virtual override returns (string memory) {
			        return _symbol;
			    }

			    /**
			     * @dev See {IERC721Metadata-tokenURI}.
			     */
			    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
			        _requireMinted(tokenId);

			        string memory baseURI = _baseURI();
			        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : \\"\\";
			    }

			    /**
			     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
			     * token will be the concatenation of the \`baseURI\` and the \`tokenId\`. Empty
			     * by default, can be overridden in child contracts.
			     */
			    function _baseURI() internal view virtual returns (string memory) {
			        return \\"\\";
			    }

			    /**
			     * @dev See {IERC721-approve}.
			     */
			    function approve(address to, uint256 tokenId) public virtual override {
			        address owner = ERC721.ownerOf(tokenId);
			        require(to != owner, \\"ERC721: approval to current owner\\");

			        require(
			            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
			            \\"ERC721: approve caller is not token owner or approved for all\\"
			        );

			        _approve(to, tokenId);
			    }

			    /**
			     * @dev See {IERC721-getApproved}.
			     */
			    function getApproved(uint256 tokenId) public view virtual override returns (address) {
			        _requireMinted(tokenId);

			        return _tokenApprovals[tokenId];
			    }

			    /**
			     * @dev See {IERC721-setApprovalForAll}.
			     */
			    function setApprovalForAll(address operator, bool approved) public virtual override {
			        _setApprovalForAll(_msgSender(), operator, approved);
			    }

			    /**
			     * @dev See {IERC721-isApprovedForAll}.
			     */
			    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
			        return _operatorApprovals[owner][operator];
			    }

			    /**
			     * @dev See {IERC721-transferFrom}.
			     */
			    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
			        //solhint-disable-next-line max-line-length
			        require(_isApprovedOrOwner(_msgSender(), tokenId), \\"ERC721: caller is not token owner or approved\\");

			        _transfer(from, to, tokenId);
			    }

			    /**
			     * @dev See {IERC721-safeTransferFrom}.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
			        safeTransferFrom(from, to, tokenId, \\"\\");
			    }

			    /**
			     * @dev See {IERC721-safeTransferFrom}.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
			        require(_isApprovedOrOwner(_msgSender(), tokenId), \\"ERC721: caller is not token owner or approved\\");
			        _safeTransfer(from, to, tokenId, data);
			    }

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`, checking first that contract recipients
			     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
			     *
			     * \`data\` is additional data, it has no specified format and it is sent in call to \`to\`.
			     *
			     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
			     * implement alternative mechanisms to perform token transfer, such as signature-based.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual {
			        _transfer(from, to, tokenId);
			        require(_checkOnERC721Received(from, to, tokenId, data), \\"ERC721: transfer to non ERC721Receiver implementer\\");
			    }

			    /**
			     * @dev Returns the owner of the \`tokenId\`. Does NOT revert if token doesn't exist
			     */
			    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
			        return _owners[tokenId];
			    }

			    /**
			     * @dev Returns whether \`tokenId\` exists.
			     *
			     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
			     *
			     * Tokens start existing when they are minted (\`_mint\`),
			     * and stop existing when they are burned (\`_burn\`).
			     */
			    function _exists(uint256 tokenId) internal view virtual returns (bool) {
			        return _ownerOf(tokenId) != address(0);
			    }

			    /**
			     * @dev Returns whether \`spender\` is allowed to manage \`tokenId\`.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
			        address owner = ERC721.ownerOf(tokenId);
			        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
			    }

			    /**
			     * @dev Safely mints \`tokenId\` and transfers it to \`to\`.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must not exist.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _safeMint(address to, uint256 tokenId) internal virtual {
			        _safeMint(to, tokenId, \\"\\");
			    }

			    /**
			     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[\`_safeMint\`], with an additional \`data\` parameter which is
			     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
			     */
			    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
			        _mint(to, tokenId);
			        require(
			            _checkOnERC721Received(address(0), to, tokenId, data),
			            \\"ERC721: transfer to non ERC721Receiver implementer\\"
			        );
			    }

			    /**
			     * @dev Mints \`tokenId\` and transfers it to \`to\`.
			     *
			     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must not exist.
			     * - \`to\` cannot be the zero address.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _mint(address to, uint256 tokenId) internal virtual {
			        require(to != address(0), \\"ERC721: mint to the zero address\\");
			        require(!_exists(tokenId), \\"ERC721: token already minted\\");

			        _beforeTokenTransfer(address(0), to, tokenId, 1);

			        // Check that tokenId was not minted by \`_beforeTokenTransfer\` hook
			        require(!_exists(tokenId), \\"ERC721: token already minted\\");

			        unchecked {
			            // Will not overflow unless all 2**256 token ids are minted to the same owner.
			            // Given that tokens are minted one by one, it is impossible in practice that
			            // this ever happens. Might change if we allow batch minting.
			            // The ERC fails to describe this case.
			            _balances[to] += 1;
			        }

			        _owners[tokenId] = to;

			        emit Transfer(address(0), to, tokenId);

			        _afterTokenTransfer(address(0), to, tokenId, 1);
			    }

			    /**
			     * @dev Destroys \`tokenId\`.
			     * The approval is cleared when the token is burned.
			     * This is an internal function that does not check if the sender is authorized to operate on the token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _burn(uint256 tokenId) internal virtual {
			        address owner = ERC721.ownerOf(tokenId);

			        _beforeTokenTransfer(owner, address(0), tokenId, 1);

			        // Update ownership in case tokenId was transferred by \`_beforeTokenTransfer\` hook
			        owner = ERC721.ownerOf(tokenId);

			        // Clear approvals
			        delete _tokenApprovals[tokenId];

			        unchecked {
			            // Cannot overflow, as that would require more tokens to be burned/transferred
			            // out than the owner initially received through minting and transferring in.
			            _balances[owner] -= 1;
			        }
			        delete _owners[tokenId];

			        emit Transfer(owner, address(0), tokenId);

			        _afterTokenTransfer(owner, address(0), tokenId, 1);
			    }

			    /**
			     * @dev Transfers \`tokenId\` from \`from\` to \`to\`.
			     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
			     *
			     * Requirements:
			     *
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must be owned by \`from\`.
			     *
			     * Emits a {Transfer} event.
			     */
			    function _transfer(address from, address to, uint256 tokenId) internal virtual {
			        require(ERC721.ownerOf(tokenId) == from, \\"ERC721: transfer from incorrect owner\\");
			        require(to != address(0), \\"ERC721: transfer to the zero address\\");

			        _beforeTokenTransfer(from, to, tokenId, 1);

			        // Check that tokenId was not transferred by \`_beforeTokenTransfer\` hook
			        require(ERC721.ownerOf(tokenId) == from, \\"ERC721: transfer from incorrect owner\\");

			        // Clear approvals from the previous owner
			        delete _tokenApprovals[tokenId];

			        unchecked {
			            // \`_balances[from]\` cannot overflow for the same reason as described in \`_burn\`:
			            // \`from\`'s balance is the number of token held, which is at least one before the current
			            // transfer.
			            // \`_balances[to]\` could overflow in the conditions described in \`_mint\`. That would require
			            // all 2**256 token ids to be minted, which in practice is impossible.
			            _balances[from] -= 1;
			            _balances[to] += 1;
			        }
			        _owners[tokenId] = to;

			        emit Transfer(from, to, tokenId);

			        _afterTokenTransfer(from, to, tokenId, 1);
			    }

			    /**
			     * @dev Approve \`to\` to operate on \`tokenId\`
			     *
			     * Emits an {Approval} event.
			     */
			    function _approve(address to, uint256 tokenId) internal virtual {
			        _tokenApprovals[tokenId] = to;
			        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
			    }

			    /**
			     * @dev Approve \`operator\` to operate on all of \`owner\` tokens
			     *
			     * Emits an {ApprovalForAll} event.
			     */
			    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
			        require(owner != operator, \\"ERC721: approve to caller\\");
			        _operatorApprovals[owner][operator] = approved;
			        emit ApprovalForAll(owner, operator, approved);
			    }

			    /**
			     * @dev Reverts if the \`tokenId\` has not been minted yet.
			     */
			    function _requireMinted(uint256 tokenId) internal view virtual {
			        require(_exists(tokenId), \\"ERC721: invalid token ID\\");
			    }

			    /**
			     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
			     * The call is not executed if the target address is not a contract.
			     *
			     * @param from address representing the previous owner of the given token ID
			     * @param to target address that will receive the tokens
			     * @param tokenId uint256 ID of the token to be transferred
			     * @param data bytes optional data to send along with the call
			     * @return bool whether the call correctly returned the expected magic value
			     */
			    function _checkOnERC721Received(
			        address from,
			        address to,
			        uint256 tokenId,
			        bytes memory data
			    ) private returns (bool) {
			        if (to.isContract()) {
			            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
			                return retval == IERC721Receiver.onERC721Received.selector;
			            } catch (bytes memory reason) {
			                if (reason.length == 0) {
			                    revert(\\"ERC721: transfer to non ERC721Receiver implementer\\");
			                } else {
			                    /// @solidity memory-safe-assembly
			                    assembly {
			                        revert(add(32, reason), mload(reason))
			                    }
			                }
			            }
			        } else {
			            return true;
			        }
			    }

			    /**
			     * @dev Hook that is called before any token transfer. This includes minting and burning. If {ERC721Consecutive} is
			     * used, the hook may be called as part of a consecutive (batch) mint, as indicated by \`batchSize\` greater than 1.
			     *
			     * Calling conditions:
			     *
			     * - When \`from\` and \`to\` are both non-zero, \`\`from\`\`'s tokens will be transferred to \`to\`.
			     * - When \`from\` is zero, the tokens will be minted for \`to\`.
			     * - When \`to\` is zero, \`\`from\`\`'s tokens will be burned.
			     * - \`from\` and \`to\` are never both zero.
			     * - \`batchSize\` is non-zero.
			     *
			     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
			     */
			    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual {}

			    /**
			     * @dev Hook that is called after any token transfer. This includes minting and burning. If {ERC721Consecutive} is
			     * used, the hook may be called as part of a consecutive (batch) mint, as indicated by \`batchSize\` greater than 1.
			     *
			     * Calling conditions:
			     *
			     * - When \`from\` and \`to\` are both non-zero, \`\`from\`\`'s tokens were transferred to \`to\`.
			     * - When \`from\` is zero, the tokens were minted for \`to\`.
			     * - When \`to\` is zero, \`\`from\`\`'s tokens were burned.
			     * - \`from\` and \`to\` are never both zero.
			     * - \`batchSize\` is non-zero.
			     *
			     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
			     */
			    function _afterTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual {}

			    /**
			     * @dev Unsafe write access to the balances, used by extensions that \\"mint\\" tokens using an {ownerOf} override.
			     *
			     * WARNING: Anyone calling this MUST ensure that the balances remain consistent with the ownership. The invariant
			     * being that for any address \`a\` the value returned by \`balanceOf(a)\` must be equal to the number of tokens such
			     * that \`ownerOf(tokenId)\` is \`a\`.
			     */
			    // solhint-disable-next-line func-name-mixedcase
			    function __unsafe_increaseBalance(address account, uint256 amount) internal {
			        _balances[account] += amount;
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC721/IERC721.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol\\";

			/**
			 * @dev Required interface of an ERC721 compliant contract.
			 */
			interface IERC721 is IERC165 {
			    /**
			     * @dev Emitted when \`tokenId\` token is transferred from \`from\` to \`to\`.
			     */
			    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

			    /**
			     * @dev Emitted when \`owner\` enables \`approved\` to manage the \`tokenId\` token.
			     */
			    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

			    /**
			     * @dev Emitted when \`owner\` enables or disables (\`approved\`) \`operator\` to manage all of its assets.
			     */
			    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

			    /**
			     * @dev Returns the number of tokens in \`\`owner\`\`'s account.
			     */
			    function balanceOf(address owner) external view returns (uint256 balance);

			    /**
			     * @dev Returns the owner of the \`tokenId\` token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function ownerOf(uint256 tokenId) external view returns (address owner);

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If the caller is not \`from\`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

			    /**
			     * @dev Safely transfers \`tokenId\` token from \`from\` to \`to\`, checking first that contract recipients
			     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must exist and be owned by \`from\`.
			     * - If the caller is not \`from\`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
			     * - If \`to\` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
			     *
			     * Emits a {Transfer} event.
			     */
			    function safeTransferFrom(address from, address to, uint256 tokenId) external;

			    /**
			     * @dev Transfers \`tokenId\` token from \`from\` to \`to\`.
			     *
			     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
			     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
			     * understand this adds an external call which potentially creates a reentrancy vulnerability.
			     *
			     * Requirements:
			     *
			     * - \`from\` cannot be the zero address.
			     * - \`to\` cannot be the zero address.
			     * - \`tokenId\` token must be owned by \`from\`.
			     * - If the caller is not \`from\`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
			     *
			     * Emits a {Transfer} event.
			     */
			    function transferFrom(address from, address to, uint256 tokenId) external;

			    /**
			     * @dev Gives permission to \`to\` to transfer \`tokenId\` token to another account.
			     * The approval is cleared when the token is transferred.
			     *
			     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
			     *
			     * Requirements:
			     *
			     * - The caller must own the token or be an approved operator.
			     * - \`tokenId\` must exist.
			     *
			     * Emits an {Approval} event.
			     */
			    function approve(address to, uint256 tokenId) external;

			    /**
			     * @dev Approve or remove \`operator\` as an operator for the caller.
			     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
			     *
			     * Requirements:
			     *
			     * - The \`operator\` cannot be the caller.
			     *
			     * Emits an {ApprovalForAll} event.
			     */
			    function setApprovalForAll(address operator, bool approved) external;

			    /**
			     * @dev Returns the account approved for \`tokenId\` token.
			     *
			     * Requirements:
			     *
			     * - \`tokenId\` must exist.
			     */
			    function getApproved(uint256 tokenId) external view returns (address operator);

			    /**
			     * @dev Returns if the \`operator\` is allowed to manage all of the assets of \`owner\`.
			     *
			     * See {setApprovalForAll}
			     */
			    function isApprovedForAll(address owner, address operator) external view returns (bool);
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC721/IERC721Receiver.sol)

			pragma solidity ^0.8.0;

			/**
			 * @title ERC721 token receiver interface
			 * @dev Interface for any contract that wants to support safeTransfers
			 * from ERC721 asset contracts.
			 */
			interface IERC721Receiver {
			    /**
			     * @dev Whenever an {IERC721} \`tokenId\` token is transferred to this contract via {IERC721-safeTransferFrom}
			     * by \`operator\` from \`from\`, this function is called.
			     *
			     * It must return its Solidity selector to confirm the token transfer.
			     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
			     *
			     * The selector can be obtained in Solidity with \`IERC721Receiver.onERC721Received.selector\`.
			     */
			    function onERC721Received(
			        address operator,
			        address from,
			        uint256 tokenId,
			        bytes calldata data
			    ) external returns (bytes4);
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC721/extensions/ERC721Enumerable.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol\\";

			/**
			 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds
			 * enumerability of all the token ids in the contract as well as all token ids owned by each
			 * account.
			 */
			abstract contract ERC721Enumerable is ERC721, IERC721Enumerable {
			    // Mapping from owner to list of owned token IDs
			    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

			    // Mapping from token ID to index of the owner tokens list
			    mapping(uint256 => uint256) private _ownedTokensIndex;

			    // Array with all token ids, used for enumeration
			    uint256[] private _allTokens;

			    // Mapping from token id to position in the allTokens array
			    mapping(uint256 => uint256) private _allTokensIndex;

			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool) {
			        return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
			    }

			    /**
			     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
			     */
			    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256) {
			        require(index < ERC721.balanceOf(owner), \\"ERC721Enumerable: owner index out of bounds\\");
			        return _ownedTokens[owner][index];
			    }

			    /**
			     * @dev See {IERC721Enumerable-totalSupply}.
			     */
			    function totalSupply() public view virtual override returns (uint256) {
			        return _allTokens.length;
			    }

			    /**
			     * @dev See {IERC721Enumerable-tokenByIndex}.
			     */
			    function tokenByIndex(uint256 index) public view virtual override returns (uint256) {
			        require(index < ERC721Enumerable.totalSupply(), \\"ERC721Enumerable: global index out of bounds\\");
			        return _allTokens[index];
			    }

			    /**
			     * @dev See {ERC721-_beforeTokenTransfer}.
			     */
			    function _beforeTokenTransfer(
			        address from,
			        address to,
			        uint256 firstTokenId,
			        uint256 batchSize
			    ) internal virtual override {
			        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

			        if (batchSize > 1) {
			            // Will only trigger during construction. Batch transferring (minting) is not available afterwards.
			            revert(\\"ERC721Enumerable: consecutive transfers not supported\\");
			        }

			        uint256 tokenId = firstTokenId;

			        if (from == address(0)) {
			            _addTokenToAllTokensEnumeration(tokenId);
			        } else if (from != to) {
			            _removeTokenFromOwnerEnumeration(from, tokenId);
			        }
			        if (to == address(0)) {
			            _removeTokenFromAllTokensEnumeration(tokenId);
			        } else if (to != from) {
			            _addTokenToOwnerEnumeration(to, tokenId);
			        }
			    }

			    /**
			     * @dev Private function to add a token to this extension's ownership-tracking data structures.
			     * @param to address representing the new owner of the given token ID
			     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
			     */
			    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
			        uint256 length = ERC721.balanceOf(to);
			        _ownedTokens[to][length] = tokenId;
			        _ownedTokensIndex[tokenId] = length;
			    }

			    /**
			     * @dev Private function to add a token to this extension's token tracking data structures.
			     * @param tokenId uint256 ID of the token to be added to the tokens list
			     */
			    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
			        _allTokensIndex[tokenId] = _allTokens.length;
			        _allTokens.push(tokenId);
			    }

			    /**
			     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
			     * while the token is not assigned a new owner, the \`_ownedTokensIndex\` mapping is _not_ updated: this allows for
			     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
			     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
			     * @param from address representing the previous owner of the given token ID
			     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
			     */
			    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
			        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
			        // then delete the last slot (swap and pop).

			        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;
			        uint256 tokenIndex = _ownedTokensIndex[tokenId];

			        // When the token to delete is the last token, the swap operation is unnecessary
			        if (tokenIndex != lastTokenIndex) {
			            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

			            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
			            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
			        }

			        // This also deletes the contents at the last position of the array
			        delete _ownedTokensIndex[tokenId];
			        delete _ownedTokens[from][lastTokenIndex];
			    }

			    /**
			     * @dev Private function to remove a token from this extension's token tracking data structures.
			     * This has O(1) time complexity, but alters the order of the _allTokens array.
			     * @param tokenId uint256 ID of the token to be removed from the tokens list
			     */
			    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
			        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
			        // then delete the last slot (swap and pop).

			        uint256 lastTokenIndex = _allTokens.length - 1;
			        uint256 tokenIndex = _allTokensIndex[tokenId];

			        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
			        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
			        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
			        uint256 lastTokenId = _allTokens[lastTokenIndex];

			        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
			        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

			        // This also deletes the contents at the last position of the array
			        delete _allTokensIndex[tokenId];
			        _allTokens.pop();
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC721/extensions/IERC721Enumerable.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol\\";

			/**
			 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
			 * @dev See https://eips.ethereum.org/EIPS/eip-721
			 */
			interface IERC721Enumerable is IERC721 {
			    /**
			     * @dev Returns the total amount of tokens stored by the contract.
			     */
			    function totalSupply() external view returns (uint256);

			    /**
			     * @dev Returns a token ID owned by \`owner\` at a given \`index\` of its token list.
			     * Use along with {balanceOf} to enumerate all of \`\`owner\`\`'s tokens.
			     */
			    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);

			    /**
			     * @dev Returns a token ID at a given \`index\` of all the tokens stored by the contract.
			     * Use along with {totalSupply} to enumerate all tokens.
			     */
			    function tokenByIndex(uint256 index) external view returns (uint256);
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (token/ERC721/extensions/IERC721Metadata.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol\\";

			/**
			 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
			 * @dev See https://eips.ethereum.org/EIPS/eip-721
			 */
			interface IERC721Metadata is IERC721 {
			    /**
			     * @dev Returns the token collection name.
			     */
			    function name() external view returns (string memory);

			    /**
			     * @dev Returns the token collection symbol.
			     */
			    function symbol() external view returns (string memory);

			    /**
			     * @dev Returns the Uniform Resource Identifier (URI) for \`tokenId\` token.
			     */
			    function tokenURI(uint256 tokenId) external view returns (string memory);
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

			pragma solidity ^0.8.1;

			/**
			 * @dev Collection of functions related to the address type
			 */
			library Address {
			    /**
			     * @dev Returns true if \`account\` is a contract.
			     *
			     * [IMPORTANT]
			     * ====
			     * It is unsafe to assume that an address for which this function returns
			     * false is an externally-owned account (EOA) and not a contract.
			     *
			     * Among others, \`isContract\` will return false for the following
			     * types of addresses:
			     *
			     *  - an externally-owned account
			     *  - a contract in construction
			     *  - an address where a contract will be created
			     *  - an address where a contract lived, but was destroyed
			     *
			     * Furthermore, \`isContract\` will also return true if the target contract within
			     * the same transaction is already scheduled for destruction by \`SELFDESTRUCT\`,
			     * which only has an effect at the end of a transaction.
			     * ====
			     *
			     * [IMPORTANT]
			     * ====
			     * You shouldn't rely on \`isContract\` to protect against flash loan attacks!
			     *
			     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
			     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
			     * constructor.
			     * ====
			     */
			    function isContract(address account) internal view returns (bool) {
			        // This method relies on extcodesize/address.code.length, which returns 0
			        // for contracts in construction, since the code is only stored at the end
			        // of the constructor execution.

			        return account.code.length > 0;
			    }

			    /**
			     * @dev Replacement for Solidity's \`transfer\`: sends \`amount\` wei to
			     * \`recipient\`, forwarding all available gas and reverting on errors.
			     *
			     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
			     * of certain opcodes, possibly making contracts go over the 2300 gas limit
			     * imposed by \`transfer\`, making them unable to receive funds via
			     * \`transfer\`. {sendValue} removes this limitation.
			     *
			     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
			     *
			     * IMPORTANT: because control is transferred to \`recipient\`, care must be
			     * taken to not create reentrancy vulnerabilities. Consider using
			     * {ReentrancyGuard} or the
			     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
			     */
			    function sendValue(address payable recipient, uint256 amount) internal {
			        require(address(this).balance >= amount, \\"Address: insufficient balance\\");

			        (bool success, ) = recipient.call{value: amount}(\\"\\");
			        require(success, \\"Address: unable to send value, recipient may have reverted\\");
			    }

			    /**
			     * @dev Performs a Solidity function call using a low level \`call\`. A
			     * plain \`call\` is an unsafe replacement for a function call: use this
			     * function instead.
			     *
			     * If \`target\` reverts with a revert reason, it is bubbled up by this
			     * function (like regular Solidity function calls).
			     *
			     * Returns the raw returned data. To convert to the expected return value,
			     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[\`abi.decode\`].
			     *
			     * Requirements:
			     *
			     * - \`target\` must be a contract.
			     * - calling \`target\` with \`data\` must not revert.
			     *
			     * _Available since v3.1._
			     */
			    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, 0, \\"Address: low-level call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`], but with
			     * \`errorMessage\` as a fallback revert reason when \`target\` reverts.
			     *
			     * _Available since v3.1._
			     */
			    function functionCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, 0, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but also transferring \`value\` wei to \`target\`.
			     *
			     * Requirements:
			     *
			     * - the calling contract must have an ETH balance of at least \`value\`.
			     * - the called Solidity function must be \`payable\`.
			     *
			     * _Available since v3.1._
			     */
			    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
			        return functionCallWithValue(target, data, value, \\"Address: low-level call with value failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[\`functionCallWithValue\`], but
			     * with \`errorMessage\` as a fallback revert reason when \`target\` reverts.
			     *
			     * _Available since v3.1._
			     */
			    function functionCallWithValue(
			        address target,
			        bytes memory data,
			        uint256 value,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        require(address(this).balance >= value, \\"Address: insufficient balance for call\\");
			        (bool success, bytes memory returndata) = target.call{value: value}(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but performing a static call.
			     *
			     * _Available since v3.3._
			     */
			    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
			        return functionStaticCall(target, data, \\"Address: low-level static call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
			     * but performing a static call.
			     *
			     * _Available since v3.3._
			     */
			    function functionStaticCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal view returns (bytes memory) {
			        (bool success, bytes memory returndata) = target.staticcall(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
			     * but performing a delegate call.
			     *
			     * _Available since v3.4._
			     */
			    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
			        return functionDelegateCall(target, data, \\"Address: low-level delegate call failed\\");
			    }

			    /**
			     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
			     * but performing a delegate call.
			     *
			     * _Available since v3.4._
			     */
			    function functionDelegateCall(
			        address target,
			        bytes memory data,
			        string memory errorMessage
			    ) internal returns (bytes memory) {
			        (bool success, bytes memory returndata) = target.delegatecall(data);
			        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
			    }

			    /**
			     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
			     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
			     *
			     * _Available since v4.8._
			     */
			    function verifyCallResultFromTarget(
			        address target,
			        bool success,
			        bytes memory returndata,
			        string memory errorMessage
			    ) internal view returns (bytes memory) {
			        if (success) {
			            if (returndata.length == 0) {
			                // only check isContract if the call was successful and the return data is empty
			                // otherwise we already know that it was a contract
			                require(isContract(target), \\"Address: call to non-contract\\");
			            }
			            return returndata;
			        } else {
			            _revert(returndata, errorMessage);
			        }
			    }

			    /**
			     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
			     * revert reason or using the provided one.
			     *
			     * _Available since v4.3._
			     */
			    function verifyCallResult(
			        bool success,
			        bytes memory returndata,
			        string memory errorMessage
			    ) internal pure returns (bytes memory) {
			        if (success) {
			            return returndata;
			        } else {
			            _revert(returndata, errorMessage);
			        }
			    }

			    function _revert(bytes memory returndata, string memory errorMessage) private pure {
			        // Look for revert reason and bubble it up if present
			        if (returndata.length > 0) {
			            // The easiest way to bubble the revert reason is using memory via assembly
			            /// @solidity memory-safe-assembly
			            assembly {
			                let returndata_size := mload(returndata)
			                revert(add(32, returndata), returndata_size)
			            }
			        } else {
			            revert(errorMessage);
			        }
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.7.0) (utils/Base64.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Provides a set of functions to operate with Base64 strings.
			 *
			 * _Available since v4.5._
			 */
			library Base64 {
			    /**
			     * @dev Base64 Encoding/Decoding Table
			     */
			    string internal constant _TABLE = \\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\\";

			    /**
			     * @dev Converts a \`bytes\` to its Bytes64 \`string\` representation.
			     */
			    function encode(bytes memory data) internal pure returns (string memory) {
			        /**
			         * Inspired by Brecht Devos (Brechtpd) implementation - MIT licence
			         * https://github.com/Brechtpd/base64/blob/e78d9fd951e7b0977ddca77d92dc85183770daf4/base64.sol
			         */
			        if (data.length == 0) return \\"\\";

			        // Loads the table into memory
			        string memory table = _TABLE;

			        // Encoding takes 3 bytes chunks of binary data from \`bytes\` data parameter
			        // and split into 4 numbers of 6 bits.
			        // The final Base64 length should be \`bytes\` data length multiplied by 4/3 rounded up
			        // - \`data.length + 2\`  -> Round up
			        // - \`/ 3\`              -> Number of 3-bytes chunks
			        // - \`4 *\`              -> 4 characters for each chunk
			        string memory result = new string(4 * ((data.length + 2) / 3));

			        /// @solidity memory-safe-assembly
			        assembly {
			            // Prepare the lookup table (skip the first \\"length\\" byte)
			            let tablePtr := add(table, 1)

			            // Prepare result pointer, jump over length
			            let resultPtr := add(result, 32)

			            // Run over the input, 3 bytes at a time
			            for {
			                let dataPtr := data
			                let endPtr := add(data, mload(data))
			            } lt(dataPtr, endPtr) {

			            } {
			                // Advance 3 bytes
			                dataPtr := add(dataPtr, 3)
			                let input := mload(dataPtr)

			                // To write each character, shift the 3 bytes (18 bits) chunk
			                // 4 times in blocks of 6 bits for each character (18, 12, 6, 0)
			                // and apply logical AND with 0x3F which is the number of
			                // the previous character in the ASCII table prior to the Base64 Table
			                // The result is then added to the table to get the character to write,
			                // and finally write it in the result pointer but with a left shift
			                // of 256 (1 byte) - 8 (1 ASCII char) = 248 bits

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance

			                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
			                resultPtr := add(resultPtr, 1) // Advance
			            }

			            // When data \`bytes\` is not exactly 3 bytes long
			            // it is padded with \`=\` characters at the end
			            switch mod(mload(data), 3)
			            case 1 {
			                mstore8(sub(resultPtr, 1), 0x3d)
			                mstore8(sub(resultPtr, 2), 0x3d)
			            }
			            case 2 {
			                mstore8(sub(resultPtr, 1), 0x3d)
			            }
			        }

			        return result;
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Provides information about the current execution context, including the
			 * sender of the transaction and its data. While these are generally available
			 * via msg.sender and msg.data, they should not be accessed in such a direct
			 * manner, since when dealing with meta-transactions the account sending and
			 * paying for execution may not be the actual sender (as far as an application
			 * is concerned).
			 *
			 * This contract is only required for intermediate, library-like contracts.
			 */
			abstract contract Context {
			    function _msgSender() internal view virtual returns (address) {
			        return msg.sender;
			    }

			    function _msgData() internal view virtual returns (bytes calldata) {
			        return msg.data;
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/Strings.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol\\";
			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol\\";

			/**
			 * @dev String operations.
			 */
			library Strings {
			    bytes16 private constant _SYMBOLS = \\"0123456789abcdef\\";
			    uint8 private constant _ADDRESS_LENGTH = 20;

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` decimal representation.
			     */
			    function toString(uint256 value) internal pure returns (string memory) {
			        unchecked {
			            uint256 length = Math.log10(value) + 1;
			            string memory buffer = new string(length);
			            uint256 ptr;
			            /// @solidity memory-safe-assembly
			            assembly {
			                ptr := add(buffer, add(32, length))
			            }
			            while (true) {
			                ptr--;
			                /// @solidity memory-safe-assembly
			                assembly {
			                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
			                }
			                value /= 10;
			                if (value == 0) break;
			            }
			            return buffer;
			        }
			    }

			    /**
			     * @dev Converts a \`int256\` to its ASCII \`string\` decimal representation.
			     */
			    function toString(int256 value) internal pure returns (string memory) {
			        return string(abi.encodePacked(value < 0 ? \\"-\\" : \\"\\", toString(SignedMath.abs(value))));
			    }

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation.
			     */
			    function toHexString(uint256 value) internal pure returns (string memory) {
			        unchecked {
			            return toHexString(value, Math.log256(value) + 1);
			        }
			    }

			    /**
			     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation with fixed length.
			     */
			    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
			        bytes memory buffer = new bytes(2 * length + 2);
			        buffer[0] = \\"0\\";
			        buffer[1] = \\"x\\";
			        for (uint256 i = 2 * length + 1; i > 1; --i) {
			            buffer[i] = _SYMBOLS[value & 0xf];
			            value >>= 4;
			        }
			        require(value == 0, \\"Strings: hex length insufficient\\");
			        return string(buffer);
			    }

			    /**
			     * @dev Converts an \`address\` with fixed length of 20 bytes to its not checksummed ASCII \`string\` hexadecimal representation.
			     */
			    function toHexString(address addr) internal pure returns (string memory) {
			        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
			    }

			    /**
			     * @dev Returns true if the two strings are equal.
			     */
			    function equal(string memory a, string memory b) internal pure returns (bool) {
			        return keccak256(bytes(a)) == keccak256(bytes(b));
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165.sol)

			pragma solidity ^0.8.0;

			import \\"/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol\\";

			/**
			 * @dev Implementation of the {IERC165} interface.
			 *
			 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
			 * for the additional interface id that will be supported. For example:
			 *
			 * \`\`\`solidity
			 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
			 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
			 * }
			 * \`\`\`
			 *
			 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
			 */
			abstract contract ERC165 is IERC165 {
			    /**
			     * @dev See {IERC165-supportsInterface}.
			     */
			    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
			        return interfaceId == type(IERC165).interfaceId;
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Interface of the ERC165 standard, as defined in the
			 * https://eips.ethereum.org/EIPS/eip-165[EIP].
			 *
			 * Implementers can declare support of contract interfaces, which can then be
			 * queried by others ({ERC165Checker}).
			 *
			 * For an implementation, see {ERC165}.
			 */
			interface IERC165 {
			    /**
			     * @dev Returns true if this contract implements the interface defined by
			     * \`interfaceId\`. See the corresponding
			     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
			     * to learn more about how these ids are created.
			     *
			     * This function call must use less than 30 000 gas.
			     */
			    function supportsInterface(bytes4 interfaceId) external view returns (bool);
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.9.0) (utils/math/Math.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Standard math utilities missing in the Solidity language.
			 */
			library Math {
			    enum Rounding {
			        Down, // Toward negative infinity
			        Up, // Toward infinity
			        Zero // Toward zero
			    }

			    /**
			     * @dev Returns the largest of two numbers.
			     */
			    function max(uint256 a, uint256 b) internal pure returns (uint256) {
			        return a > b ? a : b;
			    }

			    /**
			     * @dev Returns the smallest of two numbers.
			     */
			    function min(uint256 a, uint256 b) internal pure returns (uint256) {
			        return a < b ? a : b;
			    }

			    /**
			     * @dev Returns the average of two numbers. The result is rounded towards
			     * zero.
			     */
			    function average(uint256 a, uint256 b) internal pure returns (uint256) {
			        // (a + b) / 2 can overflow.
			        return (a & b) + (a ^ b) / 2;
			    }

			    /**
			     * @dev Returns the ceiling of the division of two numbers.
			     *
			     * This differs from standard division with \`/\` in that it rounds up instead
			     * of rounding down.
			     */
			    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
			        // (a + b - 1) / b can overflow on addition, so we distribute.
			        return a == 0 ? 0 : (a - 1) / b + 1;
			    }

			    /**
			     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
			     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
			     * with further edits by Uniswap Labs also under MIT license.
			     */
			    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
			        unchecked {
			            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
			            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
			            // variables such that product = prod1 * 2^256 + prod0.
			            uint256 prod0; // Least significant 256 bits of the product
			            uint256 prod1; // Most significant 256 bits of the product
			            assembly {
			                let mm := mulmod(x, y, not(0))
			                prod0 := mul(x, y)
			                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
			            }

			            // Handle non-overflow cases, 256 by 256 division.
			            if (prod1 == 0) {
			                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
			                // The surrounding unchecked block does not change this fact.
			                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
			                return prod0 / denominator;
			            }

			            // Make sure the result is less than 2^256. Also prevents denominator == 0.
			            require(denominator > prod1, \\"Math: mulDiv overflow\\");

			            ///////////////////////////////////////////////
			            // 512 by 256 division.
			            ///////////////////////////////////////////////

			            // Make division exact by subtracting the remainder from [prod1 prod0].
			            uint256 remainder;
			            assembly {
			                // Compute remainder using mulmod.
			                remainder := mulmod(x, y, denominator)

			                // Subtract 256 bit number from 512 bit number.
			                prod1 := sub(prod1, gt(remainder, prod0))
			                prod0 := sub(prod0, remainder)
			            }

			            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
			            // See https://cs.stackexchange.com/q/138556/92363.

			            // Does not overflow because the denominator cannot be zero at this stage in the function.
			            uint256 twos = denominator & (~denominator + 1);
			            assembly {
			                // Divide denominator by twos.
			                denominator := div(denominator, twos)

			                // Divide [prod1 prod0] by twos.
			                prod0 := div(prod0, twos)

			                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
			                twos := add(div(sub(0, twos), twos), 1)
			            }

			            // Shift in bits from prod1 into prod0.
			            prod0 |= prod1 * twos;

			            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
			            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
			            // four bits. That is, denominator * inv = 1 mod 2^4.
			            uint256 inverse = (3 * denominator) ^ 2;

			            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
			            // in modular arithmetic, doubling the correct bits in each step.
			            inverse *= 2 - denominator * inverse; // inverse mod 2^8
			            inverse *= 2 - denominator * inverse; // inverse mod 2^16
			            inverse *= 2 - denominator * inverse; // inverse mod 2^32
			            inverse *= 2 - denominator * inverse; // inverse mod 2^64
			            inverse *= 2 - denominator * inverse; // inverse mod 2^128
			            inverse *= 2 - denominator * inverse; // inverse mod 2^256

			            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
			            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
			            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
			            // is no longer required.
			            result = prod0 * inverse;
			            return result;
			        }
			    }

			    /**
			     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
			     */
			    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
			        uint256 result = mulDiv(x, y, denominator);
			        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
			            result += 1;
			        }
			        return result;
			    }

			    /**
			     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
			     *
			     * Inspired by Henry S. Warren, Jr.'s \\"Hacker's Delight\\" (Chapter 11).
			     */
			    function sqrt(uint256 a) internal pure returns (uint256) {
			        if (a == 0) {
			            return 0;
			        }

			        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
			        //
			        // We know that the \\"msb\\" (most significant bit) of our target number \`a\` is a power of 2 such that we have
			        // \`msb(a) <= a < 2*msb(a)\`. This value can be written \`msb(a)=2**k\` with \`k=log2(a)\`.
			        //
			        // This can be rewritten \`2**log2(a) <= a < 2**(log2(a) + 1)\`
			        // → \`sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))\`
			        // → \`2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)\`
			        //
			        // Consequently, \`2**(log2(a) / 2)\` is a good first approximation of \`sqrt(a)\` with at least 1 correct bit.
			        uint256 result = 1 << (log2(a) >> 1);

			        // At this point \`result\` is an estimation with one bit of precision. We know the true value is a uint128,
			        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
			        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
			        // into the expected uint128 result.
			        unchecked {
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            result = (result + a / result) >> 1;
			            return min(result, a / result);
			        }
			    }

			    /**
			     * @notice Calculates sqrt(a), following the selected rounding direction.
			     */
			    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = sqrt(a);
			            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 2, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log2(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >> 128 > 0) {
			                value >>= 128;
			                result += 128;
			            }
			            if (value >> 64 > 0) {
			                value >>= 64;
			                result += 64;
			            }
			            if (value >> 32 > 0) {
			                value >>= 32;
			                result += 32;
			            }
			            if (value >> 16 > 0) {
			                value >>= 16;
			                result += 16;
			            }
			            if (value >> 8 > 0) {
			                value >>= 8;
			                result += 8;
			            }
			            if (value >> 4 > 0) {
			                value >>= 4;
			                result += 4;
			            }
			            if (value >> 2 > 0) {
			                value >>= 2;
			                result += 2;
			            }
			            if (value >> 1 > 0) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log2(value);
			            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 10, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log10(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >= 10 ** 64) {
			                value /= 10 ** 64;
			                result += 64;
			            }
			            if (value >= 10 ** 32) {
			                value /= 10 ** 32;
			                result += 32;
			            }
			            if (value >= 10 ** 16) {
			                value /= 10 ** 16;
			                result += 16;
			            }
			            if (value >= 10 ** 8) {
			                value /= 10 ** 8;
			                result += 8;
			            }
			            if (value >= 10 ** 4) {
			                value /= 10 ** 4;
			                result += 4;
			            }
			            if (value >= 10 ** 2) {
			                value /= 10 ** 2;
			                result += 2;
			            }
			            if (value >= 10 ** 1) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log10(value);
			            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
			        }
			    }

			    /**
			     * @dev Return the log in base 256, rounded down, of a positive value.
			     * Returns 0 if given 0.
			     *
			     * Adding one to the result gives the number of pairs of hex symbols needed to represent \`value\` as a hex string.
			     */
			    function log256(uint256 value) internal pure returns (uint256) {
			        uint256 result = 0;
			        unchecked {
			            if (value >> 128 > 0) {
			                value >>= 128;
			                result += 16;
			            }
			            if (value >> 64 > 0) {
			                value >>= 64;
			                result += 8;
			            }
			            if (value >> 32 > 0) {
			                value >>= 32;
			                result += 4;
			            }
			            if (value >> 16 > 0) {
			                value >>= 16;
			                result += 2;
			            }
			            if (value >> 8 > 0) {
			                result += 1;
			            }
			        }
			        return result;
			    }

			    /**
			     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
			     * Returns 0 if given 0.
			     */
			    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
			        unchecked {
			            uint256 result = log256(value);
			            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
			        }
			    }
			}
			",
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol": {
			        "content": "// SPDX-License-Identifier: MIT
			// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/SignedMath.sol)

			pragma solidity ^0.8.0;

			/**
			 * @dev Standard signed math utilities missing in the Solidity language.
			 */
			library SignedMath {
			    /**
			     * @dev Returns the largest of two signed numbers.
			     */
			    function max(int256 a, int256 b) internal pure returns (int256) {
			        return a > b ? a : b;
			    }

			    /**
			     * @dev Returns the smallest of two signed numbers.
			     */
			    function min(int256 a, int256 b) internal pure returns (int256) {
			        return a < b ? a : b;
			    }

			    /**
			     * @dev Returns the average of two signed numbers without overflow.
			     * The result is rounded towards zero.
			     */
			    function average(int256 a, int256 b) internal pure returns (int256) {
			        // Formula from the book \\"Hacker's Delight\\"
			        int256 x = (a & b) + ((a ^ b) >> 1);
			        return x + (int256(uint256(x) >> 255) & (a ^ b));
			    }

			    /**
			     * @dev Returns the absolute unsigned value of a signed value.
			     */
			    function abs(int256 n) internal pure returns (uint256) {
			        unchecked {
			            // must be unchecked in order to support \`n = type(int256).min\`
			            return uint256(n >= 0 ? n : -n);
			        }
			    }
			}
			",
			      },
			    },
			  },
			  "solcOutput": {
			    "contracts": {
			      "./Contract.sol": {
			        "WagmiMintExample": {
			          "abi": [
			            {
			              "inputs": [],
			              "stateMutability": "nonpayable",
			              "type": "constructor",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "approved",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Approval",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "indexed": false,
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "ApprovalForAll",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Transfer",
			              "type": "event",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "approve",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "name": "balanceOf",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "getApproved",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "name": "isApprovedForAll",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "mint",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "mint",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "name",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "ownerOf",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			                {
			                  "internalType": "bytes",
			                  "name": "data",
			                  "type": "bytes",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "setApprovalForAll",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "symbol",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenURI",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "pure",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "totalSupply",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "transferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {
			              "mint()": {
			                "notice": "Allows an address to mint",
			              },
			              "mint(uint256)": {
			                "notice": "Returns the token URI for a given token by ID",
			              },
			              "tokenURI(uint256)": {
			                "notice": "Returns the token URI for a given token by ID",
			              },
			            },
			            "notice": "An example token original from the wagmi template",
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol": {
			        "ERC721": {
			          "abi": [
			            {
			              "inputs": [
			                {
			                  "internalType": "string",
			                  "name": "name_",
			                  "type": "string",
			                },
			                {
			                  "internalType": "string",
			                  "name": "symbol_",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "nonpayable",
			              "type": "constructor",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "approved",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Approval",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "indexed": false,
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "ApprovalForAll",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Transfer",
			              "type": "event",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "approve",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "name": "balanceOf",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "getApproved",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "name": "isApprovedForAll",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "name",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "ownerOf",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			                {
			                  "internalType": "bytes",
			                  "name": "data",
			                  "type": "bytes",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "setApprovalForAll",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "symbol",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenURI",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "transferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol": {
			        "IERC721": {
			          "abi": [
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "approved",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Approval",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "indexed": false,
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "ApprovalForAll",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Transfer",
			              "type": "event",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "approve",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "name": "balanceOf",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "balance",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "getApproved",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "name": "isApprovedForAll",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "ownerOf",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			                {
			                  "internalType": "bytes",
			                  "name": "data",
			                  "type": "bytes",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "setApprovalForAll",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "transferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol": {
			        "IERC721Receiver": {
			          "abi": [
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			                {
			                  "internalType": "bytes",
			                  "name": "data",
			                  "type": "bytes",
			                },
			              ],
			              "name": "onERC721Received",
			              "outputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "",
			                  "type": "bytes4",
			                },
			              ],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol": {
			        "ERC721Enumerable": {
			          "abi": [
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "approved",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Approval",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "indexed": false,
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "ApprovalForAll",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Transfer",
			              "type": "event",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "approve",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "name": "balanceOf",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "getApproved",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "name": "isApprovedForAll",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "name",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "ownerOf",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			                {
			                  "internalType": "bytes",
			                  "name": "data",
			                  "type": "bytes",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "setApprovalForAll",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "symbol",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "index",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenByIndex",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "index",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenOfOwnerByIndex",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenURI",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "totalSupply",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "transferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol": {
			        "IERC721Enumerable": {
			          "abi": [
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "approved",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Approval",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "indexed": false,
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "ApprovalForAll",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Transfer",
			              "type": "event",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "approve",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "name": "balanceOf",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "balance",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "getApproved",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "name": "isApprovedForAll",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "ownerOf",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			                {
			                  "internalType": "bytes",
			                  "name": "data",
			                  "type": "bytes",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "setApprovalForAll",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "index",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenByIndex",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "index",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenOfOwnerByIndex",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "totalSupply",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "transferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol": {
			        "IERC721Metadata": {
			          "abi": [
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "approved",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Approval",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "indexed": false,
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "ApprovalForAll",
			              "type": "event",
			            },
			            {
			              "anonymous": false,
			              "inputs": [
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "indexed": true,
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "Transfer",
			              "type": "event",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "approve",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "name": "balanceOf",
			              "outputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "balance",
			                  "type": "uint256",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "getApproved",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			              ],
			              "name": "isApprovedForAll",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "name",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "ownerOf",
			              "outputs": [
			                {
			                  "internalType": "address",
			                  "name": "owner",
			                  "type": "address",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			                {
			                  "internalType": "bytes",
			                  "name": "data",
			                  "type": "bytes",
			                },
			              ],
			              "name": "safeTransferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "operator",
			                  "type": "address",
			                },
			                {
			                  "internalType": "bool",
			                  "name": "approved",
			                  "type": "bool",
			                },
			              ],
			              "name": "setApprovalForAll",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [],
			              "name": "symbol",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "tokenURI",
			              "outputs": [
			                {
			                  "internalType": "string",
			                  "name": "",
			                  "type": "string",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			            {
			              "inputs": [
			                {
			                  "internalType": "address",
			                  "name": "from",
			                  "type": "address",
			                },
			                {
			                  "internalType": "address",
			                  "name": "to",
			                  "type": "address",
			                },
			                {
			                  "internalType": "uint256",
			                  "name": "tokenId",
			                  "type": "uint256",
			                },
			              ],
			              "name": "transferFrom",
			              "outputs": [],
			              "stateMutability": "nonpayable",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol": {
			        "Address": {
			          "abi": [],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol": {
			        "Base64": {
			          "abi": [],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol": {
			        "Context": {
			          "abi": [],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol": {
			        "Strings": {
			          "abi": [],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol": {
			        "ERC165": {
			          "abi": [
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol": {
			        "IERC165": {
			          "abi": [
			            {
			              "inputs": [
			                {
			                  "internalType": "bytes4",
			                  "name": "interfaceId",
			                  "type": "bytes4",
			                },
			              ],
			              "name": "supportsInterface",
			              "outputs": [
			                {
			                  "internalType": "bool",
			                  "name": "",
			                  "type": "bool",
			                },
			              ],
			              "stateMutability": "view",
			              "type": "function",
			            },
			          ],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol": {
			        "Math": {
			          "abi": [],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol": {
			        "SignedMath": {
			          "abi": [],
			          "userdoc": {
			            "kind": "user",
			            "methods": {},
			            "version": 1,
			          },
			        },
			      },
			    },
			    "sources": {
			      "./Contract.sol": {
			        "id": 0,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol": {
			        "id": 1,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol": {
			        "id": 2,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol": {
			        "id": 3,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol": {
			        "id": 4,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol": {
			        "id": 5,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol": {
			        "id": 6,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Address.sol": {
			        "id": 7,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Base64.sol": {
			        "id": 8,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Context.sol": {
			        "id": 9,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/Strings.sol": {
			        "id": 10,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol": {
			        "id": 11,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol": {
			        "id": 12,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/Math.sol": {
			        "id": 13,
			      },
			      "/Users/willcory/evmts-monorepo/solc/node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol": {
			        "id": 14,
			      },
			    },
			  },
			}
		`)
	})
})
