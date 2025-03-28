[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / CustomCrypto

# Interface: CustomCrypto

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:60

## Properties

### ecdsaRecover()?

> `optional` **ecdsaRecover**: (`sig`, `recId`, `hash`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:72

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

### ecdsaSign()?

> `optional` **ecdsaSign**: (`msg`, `pk`) => `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:68

#### Parameters

##### msg

`Uint8Array`

##### pk

`Uint8Array`

#### Returns

`object`

##### recid

> **recid**: `number`

##### signature

> **signature**: `Uint8Array`

***

### ecrecover()?

> `optional` **ecrecover**: (`msgHash`, `v`, `r`, `s`, `chainId`?) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:65

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

> `optional` **ecsign**: (`msg`, `pk`, `chainId`?) => `ECDSASignature`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:67

#### Parameters

##### msg

`Uint8Array`

##### pk

`Uint8Array`

##### chainId?

`bigint`

#### Returns

`ECDSASignature`

***

### keccak256()?

> `optional` **keccak256**: (`msg`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:64

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg**: `KZG`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:73

***

### sha256()?

> `optional` **sha256**: (`msg`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:66

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`
