**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createL1CrossDomainMessenger

# Function: createL1CrossDomainMessenger()

> **createL1CrossDomainMessenger**(`chainId`): `Omit`\<`Script`\<`"L1CrossDomainMessenger"`, readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L1CrossDomainMessenger contract instance from a chainId
Currently only supports chainId 10

## Parameters

▪ **chainId**: `10`= `10`

## Returns

## Example

```ts
import { createL1CrossDomainMessenger } from '@tevm/opstack'
const L1CrossDomainMessenger = createL1CrossDomainMessenger()
```

## Source

[extensions/opstack/src/contracts/l1/L1CrossDomainMessenger.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l1/L1CrossDomainMessenger.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
