**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createL1StandardBridge

# Function: createL1StandardBridge()

> **createL1StandardBridge**(`chainId`): `Omit`\<`Script`\<`"L1StandardBridge"`, readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L1StandardBridge contract instance from a chainId
Currently only supports chainId 10

## Parameters

▪ **chainId**: `10`= `10`

## Returns

## Example

```ts
import { createL1StandardBridge } from '@tevm/opstack'
const L1StandardBridge = createL1StandardBridge()
```

## Source

[extensions/opstack/src/contracts/l1/L1StandardBridge.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l1/L1StandardBridge.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
