**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > BaseCallParams

# Type alias: BaseCallParams

> **BaseCallParams**: `object`

Properties shared accross call-like params

## Type declaration

### blobVersionedHashes

> **blobVersionedHashes**?: [`Hex`](../../index/type-aliases/Hex.md)[]

Versioned hashes for each blob in a blob transaction

### blockTag

> **blockTag**?: [`BlockParam`](../../index/type-aliases/BlockParam.md)

### caller

> **caller**?: [`Address`](../../index/type-aliases/Address.md)

The address that ran this code (`msg.sender`). Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### depth

> **depth**?: `number`

The call depth. Defaults to `0`

### from

> **from**?: [`Address`](../../index/type-aliases/Address.md)

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

> **origin**?: [`Address`](../../index/type-aliases/Address.md)

The address where the call originated from. Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### selfdestruct

> **selfdestruct**?: `Set`\<[`Address`](../../index/type-aliases/Address.md)\>

Addresses to selfdestruct. Defaults to the empty set.

### skipBalance

> **skipBalance**?: `boolean`

Set caller to msg.value of less than msg.value
Defaults to false exceipt for when running scripts
where it is set to true

### to

> **to**?: [`Address`](../../index/type-aliases/Address.md)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

### value

> **value**?: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

## Source

packages/actions-types/types/params/BaseCallParams.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
