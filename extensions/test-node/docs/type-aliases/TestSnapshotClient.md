[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / TestSnapshotClient

# Type Alias: TestSnapshotClient\<TCommon, TAccountOrAddress\>

> **TestSnapshotClient**\<`TCommon`, `TAccountOrAddress`\> = `MemoryClient`\<`TCommon`, `TAccountOrAddress`\> & `TestSnapshotBaseClient`

Defined in: [extensions/test-node/src/types.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L87)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TCommon` *extends* `Common` & `Chain` | `Common` & `Chain` |
| `TAccountOrAddress` *extends* `Account` \| `Address` \| `undefined` | `undefined` |
