[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / recoverAddress

# Function: recoverAddress()

> **recoverAddress**(`params`): `` `0x${string}` ``

Defined in: packages/utils/types/signature.d.ts:54

Recovers the address from a signature

## Parameters

### params

The parameters

#### hash

`` `0x${string}` ``

The message hash

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
import { recoverAddress } from '@tevm/utils'

const address = recoverAddress({
  hash: '0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28',
  signature: {
    r: 0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9n,
    s: 0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66n,
    v: 27
  }
})
```
