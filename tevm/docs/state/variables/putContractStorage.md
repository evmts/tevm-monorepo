[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / putContractStorage

# Variable: putContractStorage

> `const` **putContractStorage**: [`StateAction`](../type-aliases/StateAction.md)\<`"putContractStorage"`\>

Defined in: packages/state/dist/index.d.ts:491

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is empty or filled with zeros, deletes the value.
