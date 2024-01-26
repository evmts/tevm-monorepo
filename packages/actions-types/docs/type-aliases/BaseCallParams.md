**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BaseCallParams

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
This defaults to `from` address if set otherwise it defaults to the zero address

### depth

> **depth**?: `number`

The call depth. Defaults to `0`

### from

> **from**?: `Address`

The from address for the call. Defaults to the zero address.
It is also possible to set the `origin` and `caller` addresses seperately using
those options. Otherwise both are set to the `from` address

### gas

> **gas**?: `bigint`

The gas price for the call. Defaults to `0`

### gasPrice

> **gasPrice**?: `bigint`

The gas price for the call. Defaults to `0`

### gasRefund

> **gasRefund**?: `bigint`

Refund counter. Defaults to `0`

### origin

> **origin**?: `Address`

The address where the call originated from. Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

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

[params/BaseCallParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/BaseCallParams.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
