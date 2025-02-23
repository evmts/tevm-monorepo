[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [common](../README.md) / parseUrlSafe

# Function: parseUrlSafe()

> **parseUrlSafe**\<`TUrl`\>(`url`): `Effect`\<`never`, [`InvalidUrlError`](../classes/InvalidUrlError.md), `TUrl`\>

Safely parses a Url into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type Parameters

• **TUrl** *extends* `string`

## Parameters

• **url**: `TUrl`

## Returns

`Effect`\<`never`, [`InvalidUrlError`](../classes/InvalidUrlError.md), `TUrl`\>

## Example

```javascript
import { parseUrlSafe } from '@tevm/schemas';
const parsedUrlEffect = parseUrlSafe('https://tevm.sh');
```

## Defined in

[experimental/schemas/src/common/SUrl.js:91](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SUrl.js#L91)
