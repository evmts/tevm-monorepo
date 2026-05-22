[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / RevertErrorParameters

# Type Alias: RevertErrorParameters

> **RevertErrorParameters** = `object`

Parameters for constructing a RevertError.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `EVMError` \| [`BaseError`](../classes/BaseError.md) \| `Error` | - |
| <a id="details"></a> `details?` | `string` | - |
| <a id="docsbaseurl"></a> `docsBaseUrl?` | `string` | - |
| <a id="docspath"></a> `docsPath?` | `string` | - |
| <a id="docsslug"></a> `docsSlug?` | `string` | - |
| <a id="meta"></a> `meta?` | `object` | - |
| <a id="metamessages"></a> `metaMessages?` | `string`[] | - |
| <a id="raw"></a> `raw?` | [`Hex`](../../index/type-aliases/Hex.md) | - The raw data of the revert. |
