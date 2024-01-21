**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [common](../README.md) > isUrl

# Function: isUrl()

> **isUrl**(`value`): `boolean`

Type guard that returns true if the provided string is a valid URL.

## Parameters

▪ **value**: `string`

## Returns

## Example

```javascript
import { isUrl } from '@tevm/schemas';
isUrl('https://tevm.dev');  // true
isUrl('not a url'); // false
````

## Source

[experimental/schemas/src/common/SUrl.js:33](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SUrl.js#L33)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
