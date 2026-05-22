[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / JsonBlock

# Interface: JsonBlock

Defined in: [packages/block/src/types.ts:421](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L421)

An object with the block's data represented as strings.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null` | - | [packages/block/src/types.ts:430](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L430) |
| <a id="header"></a> `header?` | [`JsonHeader`](JsonHeader.md) | Header data for the block | [packages/block/src/types.ts:425](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L425) |
| <a id="requests"></a> `requests?` | `` `0x${string}` ``[] \| `null` | - | [packages/block/src/types.ts:429](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L429) |
| <a id="transactions"></a> `transactions?` | `JSONTx`[] | - | [packages/block/src/types.ts:426](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L426) |
| <a id="uncleheaders"></a> `uncleHeaders?` | [`JsonHeader`](JsonHeader.md)[] | - | [packages/block/src/types.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L427) |
| <a id="withdrawals"></a> `withdrawals?` | `JSONRPCWithdrawal`[] | - | [packages/block/src/types.ts:428](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L428) |
