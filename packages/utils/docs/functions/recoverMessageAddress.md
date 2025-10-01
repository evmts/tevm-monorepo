[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / recoverMessageAddress

# Function: recoverMessageAddress()

> **recoverMessageAddress**(`params`): `` `0x${string}` ``

Defined in: [packages/utils/src/signature.js:135](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/signature.js#L135)

Recovers the address from a signed message

## Parameters

### params

The parameters

#### message

`string`

The original message

#### signature

`Signature`

The signature

## Returns

`` `0x${string}` ``

The recovered address

## Throws

If the signature is invalid

## Example

```js
import { recoverMessageAddress } from '@tevm/utils'

const address = recoverMessageAddress({
  message: 'Hello world',
  signature: {
    r: 0x...,
    s: 0x...,
    v: 27
  }
})
```
