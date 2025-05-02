[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Bloom](../README.md) / accrue

# Function: accrue()

> **accrue**(`bloom`, `input`, `inputType`): `Effect`\<[`Bloom`](../type-aliases/Bloom.md), `Error`\>

Defined in: [Bloom.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Bloom.ts#L126)

Adds an item to the bloom filter

## Parameters

### bloom

[`Bloom`](../type-aliases/Bloom.md)

The bloom filter.

### input

`Uint8Array`

The input bytes to add.

### inputType

[`BloomInputType`](../enumerations/BloomInputType.md) = `BloomInputType.Raw`

Whether the input is raw or already hashed.

## Returns

`Effect`\<[`Bloom`](../type-aliases/Bloom.md), `Error`\>
