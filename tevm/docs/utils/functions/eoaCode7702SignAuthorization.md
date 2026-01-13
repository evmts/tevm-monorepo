[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / eoaCode7702SignAuthorization

# Function: eoaCode7702SignAuthorization()

> **eoaCode7702SignAuthorization**(`input`, `privateKey`, `ecSign?`): `EOACode7702AuthorizationListBytesItem`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/authorization.d.ts:37

Signs an authorization list item and returns it in `bytes` format.
To get the JSON format, use `authorizationListBytesToJSON([signed])[0] to convert it`

## Parameters

### input

`EOACode7702AuthorizationListItemUnsigned` | `EOACode7702AuthorizationListBytesItemUnsigned`

### privateKey

`Uint8Array`

### ecSign?

(`msg`, `pk`, `ecSignOpts?`) => `Pick`\<`ReturnType`\<*typeof* `secp256k1.sign`\>, `"recovery"` \| `"r"` \| `"s"`\>

## Returns

`EOACode7702AuthorizationListBytesItem`
