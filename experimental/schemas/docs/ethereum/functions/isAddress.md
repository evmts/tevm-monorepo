[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isAddress

# Function: isAddress()

> **isAddress**(`address`): `boolean`

Checks if a string is a valid Ethereum address.

## Parameters

• **address**: `string`

The address to check.

## Returns

`boolean`

- True if the address is valid.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#address)

## Example

```ts
isAddress('0x1234'); // false
isAddress('0x1234567890123456789012345678901234567890'); // true
```

## Source

[experimental/schemas/src/ethereum/SAddress/isAddress.js:23](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SAddress/isAddress.js#L23)
