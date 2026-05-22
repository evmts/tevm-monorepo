[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / SealBlockOpts

# Interface: SealBlockOpts

Defined in: [packages/vm/src/utils/SealBlockOpts.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/SealBlockOpts.ts#L4)

Options for sealing a block.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="mixhash"></a> `mixHash?` | `Uint8Array`\<`ArrayBufferLike`\> | For PoW, the mixHash. Overrides the value passed in the constructor. | [packages/vm/src/utils/SealBlockOpts.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/SealBlockOpts.ts#L15) |
| <a id="nonce"></a> `nonce?` | `Uint8Array`\<`ArrayBufferLike`\> | For PoW, the nonce. Overrides the value passed in the constructor. | [packages/vm/src/utils/SealBlockOpts.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/SealBlockOpts.ts#L9) |
