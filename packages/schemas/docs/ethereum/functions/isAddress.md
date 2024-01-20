**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isAddress

# Function: isAddress()

> **isAddress**(`address`): `boolean`

Checks if a string is a valid Ethereum address.

## Parameters

▪ **address**: `string`

The address to check.

## Returns

- True if the address is valid.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#address)

## Example

```ts
isAddress('0x1234'); // false
isAddress('0x1234567890123456789012345678901234567890'); // true
```

## Source

[packages/schemas/src/ethereum/SAddress/isAddress.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SAddress/isAddress.js#L23)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
