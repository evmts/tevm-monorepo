[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / CustomCrypto

# Interface: CustomCrypto

## Properties

### ecdsaRecover?

> `optional` **ecdsaRecover?**: (`sig`, `recId`, `hash`) => `Uint8Array`

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

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg?**: `KZG`

***

### sha256?

> `optional` **sha256?**: (`msg`) => `Uint8Array`

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`
