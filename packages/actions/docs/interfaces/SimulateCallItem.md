[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / SimulateCallItem

# Interface: SimulateCallItem

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L6)

## Properties

### accessList?

> `optional` **accessList**: `AccessList`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L16)

Access list

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L9)

The call data

***

### from?

> `optional` **from**: `` `0x${string}` ``

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L7)

The address the transaction is sent from

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L10)

Gas limit

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L11)

Gas price in wei

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `bigint`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L12)

Maximum fee per gas for EIP-1559 transactions

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `bigint`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L13)

Maximum priority fee per gas for EIP-1559 transactions

***

### nonce?

> `optional` **nonce**: `number`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L15)

Transaction nonce

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L8)

The address the transaction is directed to

***

### value?

> `optional` **value**: `bigint`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L14)

Value sent in wei
