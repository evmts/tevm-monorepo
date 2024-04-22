**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > modifyAccountFields

# Function: modifyAccountFields()

> **modifyAccountFields**(`baseState`): (`address`, `accountFields`) => `Promise`\<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`address`, `accountFields`): `Promise`\<`void`\>
>
> ### Parameters
>
> ▪ **address**: `Address`
>
> ▪ **accountFields**: `Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56
>

## Source

[packages/state/src/actions/modifyAccountFields.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/modifyAccountFields.js#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
