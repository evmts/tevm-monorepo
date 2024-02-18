---
editUrl: false
next: false
prev: false
title: "BaseCallParams"
---

> **BaseCallParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Properties shared accross call-like params

## Type declaration

### blobVersionedHashes

> **blobVersionedHashes**?: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)[]

Versioned hashes for each blob in a blob transaction

### blockTag

> **blockTag**?: [`BlockParam`](/reference/tevm/actions-types/type-aliases/blockparam/)

The block number or block tag to execute the call at. Defaults to `latest`

### caller

> **caller**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address that ran this code (`msg.sender`). Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### createTransaction

> **createTransaction**?: `boolean`

Whether or not to update the state or run call in a dry-run. Defaults to `false`

### depth

> **depth**?: `number`

The call depth. Defaults to `0`

### from

> **from**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The from address for the call. Defaults to the zero address.
It is also possible to set the `origin` and `caller` addresses seperately using
those options. Otherwise both are set to the `from` address

### gas

> **gas**?: `bigint`

The gas limit for the call.
Defaults to 0xffffff (16_777_215n)

### gasPrice

> **gasPrice**?: `bigint`

The gas price for the call.

### gasRefund

> **gasRefund**?: `bigint`

Refund counter. Defaults to `0`

### origin

> **origin**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address where the call originated from. Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### selfdestruct

> **selfdestruct**?: `Set`\<[`Address`](/reference/tevm/actions-types/type-aliases/address/)\>

Addresses to selfdestruct. Defaults to the empty set.

### skipBalance

> **skipBalance**?: `boolean`

Set caller to msg.value of less than msg.value
Defaults to false exceipt for when running scripts
where it is set to true

### to

> **to**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

### value

> **value**?: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/BaseCallParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/BaseCallParams.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
