[**@tevm/address**](../README.md) • **Docs**

***

[@tevm/address](../globals.md) / createAddress

# Function: createAddress()

> **createAddress**(`address`): [`Address`](../classes/Address.md)

Creates an [Address](../classes/Address.md) for safely interacting with an Ethereum
Wraps EthjsAddress with a tevm style API.
toString returns a checksummed address rather than lowercase

## Parameters

• **address**: `number` \| `bigint` \| `AddressLike`

## Returns

[`Address`](../classes/Address.md)

## Example

```typescript
import { createAddress } from '@tevm/address'`

// takes hex string
let address = createAddress(`0x${'00'.repeat(20)}`)
// takes number and bigint
address = createAddress(0)
// takes bytes
address = createAddress(new Uint8Array()))
// non hex string
address = createAddress('55'.repeat(20))
```

## Throws

if the input is not a valid address}

## Defined in

[packages/address/src/createAddress.js:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/createAddress.js#L27)
