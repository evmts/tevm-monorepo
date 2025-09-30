[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / dumpStorage

# Variable: dumpStorage

> `const` **dumpStorage**: [`StateAction`](../type-aliases/StateAction.md)\<`"dumpStorage"`\>

Defined in: packages/state/dist/index.d.ts:386

Dumps the RLP-encoded storage values for an `account` specified by `address`.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.
