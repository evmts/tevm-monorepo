**@tevm/opstack** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/opstack](../README.md) / createL2ToL1MessagePasser

# Function: createL2ToL1MessagePasser()

> **createL2ToL1MessagePasser**(`chainId`): `Omit`\<`Script`\<`"L2ToL1MessagePasser"`, readonly [`"receive() external payable"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function burn()"`, `"function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable"`, `"function messageNonce() view returns (uint256)"`, `"function sentMessages(bytes32) view returns (bool)"`, `"function version() view returns (string)"`, `"event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)"`, `"event WithdrawerBalanceBurnt(uint256 indexed amount)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L2ToL1MessagePasser contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"L2ToL1MessagePasser"`, readonly [`"receive() external payable"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function burn()"`, `"function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable"`, `"function messageNonce() view returns (uint256)"`, `"function sentMessages(bytes32) view returns (bool)"`, `"function version() view returns (string)"`, `"event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)"`, `"event WithdrawerBalanceBurnt(uint256 indexed amount)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createL2ToL1MessagePasser } from '@tevm/opstack'
const L2ToL1MessagePasser = createL2ToL1MessagePasser()
```

## Source

[extensions/opstack/src/contracts/l2/L2ToL1MessagePasser.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/L2ToL1MessagePasser.ts#L13)
