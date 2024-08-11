---
editUrl: false
next: false
prev: false
title: "createAddress"
---

> **createAddress**(`address`): [`Address`](/reference/tevm/address/classes/address/)

Creates an [Address](../../../../../../../reference/tevm/address/classes/address) for safely interacting with an Ethereum
Wraps [EthjsAddress](../../../../../../../reference/tevm/utils/classes/ethjsaddress) with a tevm style API.
toString returns a checksummed address rather than lowercase

## Parameters

• **address**: `number` \| `bigint` \| [`AddressLike`](/reference/tevm/utils/type-aliases/addresslike/)

## Returns

[`Address`](/reference/tevm/address/classes/address/)

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
