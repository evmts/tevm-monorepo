[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createL2StandardBridge

# Function: createL2StandardBridge()

> **createL2StandardBridge**(`chainId`): `Omit`\<`Script`\<`"L2StandardBridge"`, readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _otherBridge)"`, `"function l1TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function version() view returns (string)"`, `"function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable"`, `"function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable"`, `"event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`, `"event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L2StandardBridge contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"L2StandardBridge"`, readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _otherBridge)"`, `"function l1TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function version() view returns (string)"`, `"function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable"`, `"function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable"`, `"event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`, `"event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createL2StandardBridge } from '@tevm/opstack'
const L2StandardBridge = createL2StandardBridge()
```

## Source

[experimental/opstack/src/contracts/l2/L2StandardBridge.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/experimental/opstack/src/contracts/l2/L2StandardBridge.ts#L13)
