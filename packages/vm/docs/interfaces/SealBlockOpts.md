[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / SealBlockOpts

# Interface: SealBlockOpts

Defined in: [packages/vm/src/utils/SealBlockOpts.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/SealBlockOpts.ts#L4)

Options for sealing a block.

## Properties

### mixHash?

> `optional` **mixHash**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/vm/src/utils/SealBlockOpts.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/SealBlockOpts.ts#L15)

For PoW, the mixHash.
Overrides the value passed in the constructor.

***

### nonce?

> `optional` **nonce**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/vm/src/utils/SealBlockOpts.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/SealBlockOpts.ts#L9)

For PoW, the nonce.
Overrides the value passed in the constructor.
