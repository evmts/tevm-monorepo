**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseAddressSafe

# Function: parseAddressSafe()

> **parseAddressSafe**\<`TAddress`\>(`address`): `Effect`\<`never`, [`InvalidAddressError`](../classes/InvalidAddressError.md), `TAddress`\>

Parses an Address safely into an effect.

## Type parameters

• **TAddress** extends ```0x${string}```

## Parameters

• **address**: `TAddress`

The address to parse.

## Returns

`Effect`\<`never`, [`InvalidAddressError`](../classes/InvalidAddressError.md), `TAddress`\>

- An effect that resolves to the parsed address.

## Source

[experimental/schemas/src/ethereum/SAddress/parseAddressSafe.js:19](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SAddress/parseAddressSafe.js#L19)
