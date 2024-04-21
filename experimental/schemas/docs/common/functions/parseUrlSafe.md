**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [common](../README.md) > parseUrlSafe

# Function: parseUrlSafe()

> **parseUrlSafe**\<`TUrl`\>(`url`): `Effect`\<`never`, [`InvalidUrlError`](../classes/InvalidUrlError.md), `TUrl`\>

Safely parses a Url into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

▪ **TUrl** extends `string`

## Parameters

▪ **url**: `TUrl`

## Returns

## Example

```javascript
import { parseUrlSafe } from '@tevm/schemas';
const parsedUrlEffect = parseUrlSafe('https://tevm.sh');
```

## Source

[experimental/schemas/src/common/SUrl.js:91](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SUrl.js#L91)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
