[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Bloom](../README.md) / accrueBloom

# Function: accrueBloom()

> **accrueBloom**(`bloomA`, `bloomB`): `Effect`\<[`Bloom`](../type-aliases/Bloom.md), `Error`\>

Defined in: [Bloom.ts:164](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Bloom.ts#L164)

Combines two bloom filters using bitwise OR

## Parameters

### bloomA

[`Bloom`](../type-aliases/Bloom.md)

First bloom filter.

### bloomB

[`Bloom`](../type-aliases/Bloom.md)

Second bloom filter.

## Returns

`Effect`\<[`Bloom`](../type-aliases/Bloom.md), `Error`\>
