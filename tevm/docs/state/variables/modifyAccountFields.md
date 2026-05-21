[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / modifyAccountFields

# Variable: modifyAccountFields

> `const` **modifyAccountFields**: [`StateAction`](../type-aliases/StateAction.md)\<`"modifyAccountFields"`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:488

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.
