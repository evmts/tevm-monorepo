**@tevm/opstack** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/opstack](../README.md) / createL2CrossDomainMessenger

# Function: createL2CrossDomainMessenger()

> **createL2CrossDomainMessenger**(`chainId`): `Omit`\<`Script`\<`"L2CrossDomainMessenger"`, readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _l1CrossDomainMessenger)"`, `"function l1CrossDomainMessenger() view returns (address)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L2CrossDomainMessenger contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"L2CrossDomainMessenger"`, readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _l1CrossDomainMessenger)"`, `"function l1CrossDomainMessenger() view returns (address)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createL2CrossDomainMessenger } from '@tevm/opstack'
const L2CrossDomainMessenger = createL2CrossDomainMessenger()
```

## Source

[extensions/opstack/src/contracts/l2/L2CrossDomainMessenger.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/L2CrossDomainMessenger.ts#L13)
