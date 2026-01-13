[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1Call

# Type Alias: EthSimulateV1Call

> **EthSimulateV1Call** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:391](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L391)

Parameters for a single simulated call within a block

## Properties

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthParams.ts:423](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L423)

The hash of the method signature and encoded parameters

***

### from?

> `readonly` `optional` **from**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:395](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L395)

The address from which the transaction is sent

***

### gas?

> `readonly` `optional` **gas**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:403](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L403)

The integer of gas provided for the transaction execution

***

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:407](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L407)

The integer of gasPrice used for each paid gas

***

### maxFeePerGas?

> `readonly` `optional` **maxFeePerGas**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:411](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L411)

The max fee per gas (EIP-1559)

***

### maxPriorityFeePerGas?

> `readonly` `optional` **maxPriorityFeePerGas**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:415](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L415)

The max priority fee per gas (EIP-1559)

***

### nonce?

> `readonly` `optional` **nonce**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L427)

The nonce of the transaction

***

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:399](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L399)

The address to which the transaction is addressed

***

### value?

> `readonly` `optional` **value**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:419](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L419)

The integer of value sent with this transaction
