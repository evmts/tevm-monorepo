[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / CustomCrypto

# Interface: CustomCrypto

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:65

## Properties

### ecdsaRecover?

> `optional` **ecdsaRecover?**: (`sig`, `recId`, `hash`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:73

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

### ecrecover?

> `optional` **ecrecover?**: (`msgHash`, `v`, `r`, `s`, `chainId?`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:70

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

### ecsign?

> `optional` **ecsign?**: (`message`, `secretKey`, `opts?`) => `Uint8Array`\<`ArrayBufferLike`\> & `Uint8Array`\<`ArrayBuffer`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:72

#### Parameters

##### message

`TArg`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### secretKey

`TArg`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### opts?

`TArg`\<`ECDSASignOpts`\>

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> & `Uint8Array`\<`ArrayBuffer`\>

***

### keccak256?

> `optional` **keccak256?**: (`msg`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:69

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg?**: `KZG`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:74

***

### sha256?

> `optional` **sha256?**: (`msg`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/types.d.ts:71

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`
