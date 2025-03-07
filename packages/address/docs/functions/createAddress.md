[**@tevm/address**](../README.md)

***

[@tevm/address](../globals.md) / createAddress

# Function: createAddress()

> **createAddress**(`address`): [`Address`](../classes/Address.md)

Defined in: [packages/address/src/createAddress.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/createAddress.js#L26)

Creates an [Address](../classes/Address.md) for safely interacting with an Ethereum address.
Wraps EthjsAddress with a tevm style API.

## Parameters

### address

The input to create an address from.

`string` | `number` | `bigint` | `Address` | `Uint8Array`\<`ArrayBufferLike`\>

## Returns

[`Address`](../classes/Address.md)

An Address instance.

## Throws

If the input is not a valid address.

## Example

```javascript
import { createAddress } from '@tevm/address'

// From hex string
let address = createAddress(`0x${'00'.repeat(20)}`)
// From number or bigint
address = createAddress(0n)
// From bytes
address = createAddress(new Uint8Array(20))
// From non-hex string
address = createAddress('55'.repeat(20))
```
