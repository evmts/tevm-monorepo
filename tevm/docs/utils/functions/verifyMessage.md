[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / verifyMessage

# Function: verifyMessage()

> **verifyMessage**(`params`): `boolean`

Verifies a message signature

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `address`: `` `0x${string}` ``; `message`: `string`; `signature`: `Signature`; \} | The parameters |
| `params.address` | `` `0x${string}` `` | The expected signer address |
| `params.message` | `string` | The original message |
| `params.signature` | `Signature` | The signature |

## Returns

`boolean`

Whether the signature is valid

## Example

```js
import { verifyMessage } from '@tevm/utils'

const isValid = verifyMessage({
  address: '0xa6fb229e9b0a4e4ef52ea6991adcfc59207c7711',
  message: 'Hello world',
  signature: {
    r: 0x...,
    s: 0x...,
    v: 27
  }
})
```
