---
editUrl: false
next: false
prev: false
title: "EthCallParams"
---

> **EthCallParams**: `object`

Based on the JSON-RPC request for `eth_call` procedure

## Type declaration

### blockOverride?

> `readonly` `optional` **blockOverride**: [`BlockOverrideSet`](/reference/tevm/actions/type-aliases/blockoverrideset/)

The block override set to provide different block values while executing the call

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](/reference/tevm/actions/type-aliases/blockparam/)

The block number hash or block tag

### data?

> `readonly` `optional` **data**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

### from?

> `readonly` `optional` **from**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address from which the transaction is sent. Defaults to zero address

### gas?

> `readonly` `optional` **gas**: `bigint`

The integer of gas provided for the transaction execution

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

The integer of gasPrice used for each paid gas

### stateOverrideSet?

> `readonly` `optional` **stateOverrideSet**: [`StateOverrideSet`](/reference/tevm/actions/type-aliases/stateoverrideset/)

The state override set to provide different state values while executing the call

### to?

> `readonly` `optional` **to**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address to which the transaction is addressed. Defaults to zero address

### value?

> `readonly` `optional` **value**: `bigint`

The integer of value sent with this transaction

## Defined in

[packages/actions/src/eth/EthParams.ts:26](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L26)
