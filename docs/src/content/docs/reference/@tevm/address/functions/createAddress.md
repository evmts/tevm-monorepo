---
editUrl: false
next: false
prev: false
title: "createAddress"
---

> **createAddress**(`address`): [`Address`](/reference/tevm/address/classes/address/)

Creates an [Address](../../../../../../../reference/tevm/address/classes/address) for safely interacting with an Ethereum address.
Wraps [EthjsAddress](../../../../../../../reference/tevm/utils/classes/ethjsaddress) with a tevm style API.

## Parameters

• **address**: `string` \| `number` \| `bigint` \| [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/) \| `Uint8Array`

The input to create an address from.

## Returns

[`Address`](/reference/tevm/address/classes/address/)

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

## Defined in

[packages/address/src/createAddress.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/createAddress.js#L26)
