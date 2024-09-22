---
editUrl: false
next: false
prev: false
title: "JsonBlock"
---

An object with the block's data represented as strings.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/)

#### Defined in

[packages/block/src/types.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L187)

***

### header?

> `optional` **header**: [`JsonHeader`](/reference/tevm/block/interfaces/jsonheader/)

Header data for the block

#### Defined in

[packages/block/src/types.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L182)

***

### requests?

> `optional` **requests**: `null` \| \`0x$\{string\}\`[]

#### Defined in

[packages/block/src/types.ts:186](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L186)

***

### transactions?

> `optional` **transactions**: [`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)[]

#### Defined in

[packages/block/src/types.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L183)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JsonHeader`](/reference/tevm/block/interfaces/jsonheader/)[]

#### Defined in

[packages/block/src/types.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L184)

***

### withdrawals?

> `optional` **withdrawals**: [`JsonRpcWithdrawal`](/reference/tevm/utils/interfaces/jsonrpcwithdrawal/)[]

#### Defined in

[packages/block/src/types.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L185)
