**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [common](../README.md) > parseUrl

# Function: parseUrl()

> **parseUrl**\<`TUrl`\>(`url`): `TUrl`

Parses a Url and returns the value if no errors.

## Type parameters

▪ **TUrl** extends `string`

## Parameters

▪ **url**: `TUrl`

## Returns

## Example

```javascript
import { parseUrl } from '@tevm/schemas';
const parsedUrl = parseUrl('https://tevm.dev');
```

## Source

[packages/schemas/src/common/SUrl.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SUrl.js#L113)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)