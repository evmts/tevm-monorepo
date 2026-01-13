[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1Call

# Type Alias: EthSimulateV1Call

> **EthSimulateV1Call** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:365

Parameters for a single simulated call within a block

## Properties

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:397

The hash of the method signature and encoded parameters

***

### from?

> `readonly` `optional` **from**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:369

The address from which the transaction is sent

***

### gas?

> `readonly` `optional` **gas**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:377

The integer of gas provided for the transaction execution

***

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:381

The integer of gasPrice used for each paid gas

***

### maxFeePerGas?

> `readonly` `optional` **maxFeePerGas**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:385

The max fee per gas (EIP-1559)

***

### maxPriorityFeePerGas?

> `readonly` `optional` **maxPriorityFeePerGas**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:389

The max priority fee per gas (EIP-1559)

***

### nonce?

> `readonly` `optional` **nonce**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:401

The nonce of the transaction

***

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:373

The address to which the transaction is addressed

***

### value?

> `readonly` `optional` **value**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:393

The integer of value sent with this transaction
