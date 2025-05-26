[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / CustomCrypto

# Interface: CustomCrypto

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:65

## Properties

### ecdsaRecover()?

> `optional` **ecdsaRecover**: (`sig`, `recId`, `hash`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:75

#### Parameters

##### sig

`Uint8Array`

##### recId

`number`

##### hash

`Uint8Array`

#### Returns

`Uint8Array`

***

### ecrecover()?

> `optional` **ecrecover**: (`msgHash`, `v`, `r`, `s`, `chainId?`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:70

#### Parameters

##### msgHash

`Uint8Array`

##### v

`bigint`

##### r

`Uint8Array`

##### s

`Uint8Array`

##### chainId?

`bigint`

#### Returns

`Uint8Array`

***

### ecsign()?

> `optional` **ecsign**: (`msg`, `pk`, `ecSignOpts?`) => `Pick`\<`ReturnType`\<*typeof* `secp256k1.sign`\>, `"recovery"` \| `"r"` \| `"s"`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:72

#### Parameters

##### msg

`Uint8Array`

##### pk

`Uint8Array`

##### ecSignOpts?

###### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Pick`\<`ReturnType`\<*typeof* `secp256k1.sign`\>, `"recovery"` \| `"r"` \| `"s"`\>

***

### keccak256()?

> `optional` **keccak256**: (`msg`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:69

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg**: `KZG`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:76

***

### sha256()?

> `optional` **sha256**: (`msg`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:71

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### verkle?

> `optional` **verkle**: `VerkleCrypto`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:77
