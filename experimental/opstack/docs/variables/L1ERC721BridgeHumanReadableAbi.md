[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / L1ERC721BridgeHumanReadableAbi

# Variable: L1ERC721BridgeHumanReadableAbi

> `const` **L1ERC721BridgeHumanReadableAbi**: readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`]

## Source

[extensions/opstack/src/contracts/l1/L1ERC721Bridge.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l1/L1ERC721Bridge.ts#L31)
