**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseAddressSafe

# Function: parseAddressSafe()

> **parseAddressSafe**\<`TAddress`\>(`address`): `Effect`\<`never`, [`InvalidAddressError`](../classes/InvalidAddressError.md), `TAddress`\>

Parses an Address safely into an effect.

## Type parameters

▪ **TAddress** extends \`0x${string}\`

## Parameters

▪ **address**: `TAddress`

The address to parse.

## Returns

- An effect that resolves to the parsed address.

## Source

[packages/schemas/src/ethereum/SAddress/parseAddressSafe.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SAddress/parseAddressSafe.js#L19)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
