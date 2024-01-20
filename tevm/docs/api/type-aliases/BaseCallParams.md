**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [api](../README.md) > BaseCallParams

# Type alias: BaseCallParams

> **BaseCallParams**: `object`

Properties shared accross call-like params

## Type declaration

### blobVersionedHashes

> **blobVersionedHashes**?: `Hex`[]

Versioned hashes for each blob in a blob transaction

### block

> **block**?: `Partial`\<[`Block`](Block.md)\>

The `block` the `tx` belongs to. If omitted a default blank block will be used.

### caller

> **caller**?: `Address`

The address that ran this code (`msg.sender`). Defaults to the zero address.

### depth

> **depth**?: `number`

The call depth. Defaults to `0`

### gasLimit

> **gasLimit**?: `bigint`

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

### gasPrice

> **gasPrice**?: `bigint`

The gas price for the call. Defaults to `0`

### gasRefund

> **gasRefund**?: `bigint`

Refund counter. Defaults to `0`

### origin

> **origin**?: `Address`

The address where the call originated from. Defaults to the zero address.

### selfdestruct

> **selfdestruct**?: `Set`\<`Address`\>

Addresses to selfdestruct. Defaults to the empty set.

### skipBalance

> **skipBalance**?: `boolean`

Set caller to msg.value of less than msg.value
Defaults to false exceipt for when running scripts
where it is set to true

### to

> **to**?: `Address`

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

### value

> **value**?: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

## Source

vm/api/types/params/BaseCallParams.d.ts:6

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
