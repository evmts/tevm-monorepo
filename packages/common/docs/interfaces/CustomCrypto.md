[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / CustomCrypto

# Interface: CustomCrypto

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="ecdsarecover"></a> `ecdsaRecover?` | (`sig`, `recId`, `hash`) => `Uint8Array` | - |
| <a id="ecrecover"></a> `ecrecover?` | (`msgHash`, `v`, `r`, `s`, `chainId?`) => `Uint8Array` | - |
| <a id="ecsign"></a> `ecsign?` | (`message`, `secretKey`, `opts?`) => `Uint8Array`\<`ArrayBufferLike`\> & `Uint8Array`\<`ArrayBuffer`\> | - |
| <a id="keccak256"></a> `keccak256?` | (`msg`) => `Uint8Array` | Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants |
| <a id="kzg"></a> `kzg?` | `KZG` | - |
| <a id="sha256"></a> `sha256?` | (`msg`) => `Uint8Array` | - |
