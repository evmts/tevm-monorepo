[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthCallParams

# Type Alias: EthCallParams

> **EthCallParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L26)

Based on the JSON-RPC request for `eth_call` procedure

## Properties

### blockOverride?

> `readonly` `optional` **blockOverride**: [`BlockOverrideSet`](BlockOverrideSet.md)

Defined in: [packages/actions/src/eth/EthParams.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L64)

The block override set to provide different block values while executing the call

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](BlockParam.md)

Defined in: [packages/actions/src/eth/EthParams.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L56)

The block number hash or block tag

***

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthParams.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L51)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

***

### from?

> `readonly` `optional` **from**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L30)

The address from which the transaction is sent. Defaults to zero address

***

### gas?

> `readonly` `optional` **gas**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L38)

The integer of gas provided for the transaction execution

***

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L42)

The integer of gasPrice used for each paid gas

***

### stateOverrideSet?

> `readonly` `optional` **stateOverrideSet**: [`StateOverrideSet`](StateOverrideSet.md)

Defined in: [packages/actions/src/eth/EthParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L60)

The state override set to provide different state values while executing the call

***

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L34)

The address to which the transaction is addressed. Defaults to zero address

***

### value?

> `readonly` `optional` **value**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L46)

The integer of value sent with this transaction
