[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseAddress

# Function: parseAddress()

> **parseAddress**\<`TAddress`\>(`address`): `TAddress`

Parses an Address returning the address or throwing an InvalidAddressError if invalid.

## Type parameters

• **TAddress** *extends* \`0x$\{string\}\`

## Parameters

• **address**: `TAddress`

The address to parse.

## Returns

`TAddress`

- The parsed address.

## Throws

- If the address is invalid.

## Source

[experimental/schemas/src/ethereum/SAddress/parseAddress.js:17](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SAddress/parseAddress.js#L17)
