[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / verifyMessage

# Function: verifyMessage()

> **verifyMessage**(`params`): `boolean`

Defined in: [packages/utils/src/signature.js:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/signature.js#L162)

Verifies a message signature

## Parameters

### params

The parameters

#### address

`` `0x${string}` ``

The expected signer address

#### message

`string`

The original message

#### signature

`Signature`

The signature

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
