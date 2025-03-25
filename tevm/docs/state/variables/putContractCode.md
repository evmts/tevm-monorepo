[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / putContractCode

# Variable: putContractCode

> `const` **putContractCode**: [`StateAction`](../type-aliases/StateAction.md)\<`"putContractCode"`\>

Defined in: packages/state/dist/index.d.ts:482

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.
