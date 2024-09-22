[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseAddressSafe

# Function: parseAddressSafe()

> **parseAddressSafe**\<`TAddress`\>(`address`): `Effect`\<`never`, [`InvalidAddressError`](../classes/InvalidAddressError.md), `TAddress`\>

## Type Parameters

• **TAddress** *extends* \`0x$\{string\}\`

## Parameters

• **address**: `TAddress`

The address to parse.

## Returns

`Effect`\<`never`, [`InvalidAddressError`](../classes/InvalidAddressError.md), `TAddress`\>

- An effect that resolves to the parsed address.

## Defined in

[experimental/schemas/src/ethereum/SAddress/parseAddressSafe.js:19](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SAddress/parseAddressSafe.js#L19)
