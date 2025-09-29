[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / signMessage

# Function: signMessage()

> **signMessage**(`params`): `Promise`\<`Signature`\>

Defined in: packages/utils/types/signature.d.ts:139

Signs a message with a private key

## Parameters

### params

The parameters

#### message

`string`

The message to sign

#### privateKey

`` `0x${string}` ``

The private key

## Returns

`Promise`\<`Signature`\>

The signature

## Example

```js
import { signMessage } from '@tevm/utils'

const signature = await signMessage({
  privateKey: '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
  message: 'Hello world'
})
```
