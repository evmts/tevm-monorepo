[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / hashMessage

# Function: hashMessage()

> **hashMessage**(`message`): `` `0x${string}` ``

Defined in: packages/utils/types/signature.d.ts:70

Hashes a message according to EIP-191

## Parameters

### message

`string`

The message to hash

## Returns

`` `0x${string}` ``

The message hash

## Example

```js
import { hashMessage } from '@tevm/utils'

const hash = hashMessage('Hello world')
// 0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede
```
