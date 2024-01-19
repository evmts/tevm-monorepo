**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [vm](../README.md) > ForkOptions

# Type alias: ForkOptions

> **ForkOptions**: `object`

Options fetch state that isn't available locally.

## Type declaration

### blockTag

> **blockTag**?: `bigint`

The block tag to use for the EVM.
If not passed it will start from the latest
block at the time of forking

### url

> **url**: `string`

A viem PublicClient to use for the EVM.
It will be used to fetch state that isn't available locally.

## Source

vm/vm/dist/index.d.ts:73

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
