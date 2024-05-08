**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > modifyAccountFields

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
> ▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)
>
> ▪ **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56
>

## Source

packages/state/dist/index.d.ts:308

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
