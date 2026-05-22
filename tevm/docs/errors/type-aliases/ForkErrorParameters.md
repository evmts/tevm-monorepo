[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / ForkErrorParameters

# Type Alias: ForkErrorParameters

> **ForkErrorParameters** = `object`

Parameters for constructing a ForkError.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="cause"></a> `cause` | [`BaseError`](../classes/BaseError.md) \| `Error` \| \{ `code`: `number` \| `string`; `message`: `string`; \} | - The cause of the error. |
| <a id="details"></a> `details?` | `string` | - |
| <a id="docsbaseurl"></a> `docsBaseUrl?` | `string` | - |
| <a id="docspath"></a> `docsPath?` | `string` | - |
| <a id="docsslug"></a> `docsSlug?` | `string` | - |
| <a id="meta"></a> `meta?` | `object` | - |
| <a id="metamessages"></a> `metaMessages?` | `string`[] | - |
