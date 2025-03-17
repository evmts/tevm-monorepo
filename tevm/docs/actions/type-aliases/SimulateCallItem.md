[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / SimulateCallItem

# Type Alias: SimulateCallItem

> **SimulateCallItem**: `object`

Defined in: packages/actions/types/eth/ethSimulateV1HandlerType.d.ts:1

## Type declaration

### accessList?

> `optional` **accessList**: `AccessList`

- Access list

### data?

> `optional` **data**: `` `0x${string}` ``

- The call data

### from?

> `optional` **from**: `` `0x${string}` ``

- The address the transaction is sent from

### gas?

> `optional` **gas**: `bigint`

- Gas limit

### gasPrice?

> `optional` **gasPrice**: `bigint`

- Gas price in wei

### maxFeePerGas?

> `optional` **maxFeePerGas**: `bigint`

- Maximum fee per gas for EIP-1559 transactions

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `bigint`

- Maximum priority fee per gas for EIP-1559 transactions

### nonce?

> `optional` **nonce**: `number`

- Transaction nonce

### to?

> `optional` **to**: `` `0x${string}` ``

- The address the transaction is directed to

### value?

> `optional` **value**: `bigint`

- Value sent in wei
