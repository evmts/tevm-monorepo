[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createL1Block

# Function: createL1Block()

> **createL1Block**(`chainId`): `Omit`\<`Script`\<`"L1Block"`, readonly [`"function DEPOSITOR_ACCOUNT() view returns (address)"`, `"function baseFeeScalar() view returns (uint32)"`, `"function basefee() view returns (uint256)"`, `"function batcherHash() view returns (bytes32)"`, `"function blobBaseFee() view returns (uint256)"`, `"function blobBaseFeeScalar() view returns (uint32)"`, `"function hash() view returns (bytes32)"`, `"function l1FeeOverhead() view returns (uint256)"`, `"function l1FeeScalar() view returns (uint256)"`, `"function number() view returns (uint64)"`, `"function sequenceNumber() view returns (uint64)"`, `"function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)"`, `"function setL1BlockValuesEcotone()"`, `"function timestamp() view returns (uint64)"`, `"function version() view returns (string)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L1Block contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"L1Block"`, readonly [`"function DEPOSITOR_ACCOUNT() view returns (address)"`, `"function baseFeeScalar() view returns (uint32)"`, `"function basefee() view returns (uint256)"`, `"function batcherHash() view returns (bytes32)"`, `"function blobBaseFee() view returns (uint256)"`, `"function blobBaseFeeScalar() view returns (uint32)"`, `"function hash() view returns (bytes32)"`, `"function l1FeeOverhead() view returns (uint256)"`, `"function l1FeeScalar() view returns (uint256)"`, `"function number() view returns (uint64)"`, `"function sequenceNumber() view returns (uint64)"`, `"function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)"`, `"function setL1BlockValuesEcotone()"`, `"function timestamp() view returns (uint64)"`, `"function version() view returns (string)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createL1Block } from '@tevm/opstack'
const L1Block = createL1Block()
```

## Source

[experimental/opstack/src/contracts/l2/L1Block.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/experimental/opstack/src/contracts/l2/L1Block.ts#L13)
