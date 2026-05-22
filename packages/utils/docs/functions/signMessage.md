[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / signMessage

# Function: signMessage()

> **signMessage**(`params`): `Promise`\<`Signature`\>

Defined in: [tevm-monorepo/packages/utils/src/signature.js:188](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/signature.js#L188)

Signs a message with a private key

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `message`: `string`; `privateKey`: `` `0x${string}` ``; \} | The parameters |
| `params.message` | `string` | The message to sign |
| `params.privateKey` | `` `0x${string}` `` | The private key |

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
