**@tevm/tx** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TxOptions

# Interface: TxOptions

The options for initializing a [Transaction]([object Object]).

## Properties

### allowUnlimitedInitCodeSize

> **allowUnlimitedInitCodeSize**?: `boolean`

Allows unlimited contract code-size init while debugging. This (partially) disables EIP-3860.
Gas cost for initcode size analysis will still be charged. Use with caution.

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:65

***

### common

> **common**?: `Common`

A [Common]([object Object]) object defining the chain and hardfork for the transaction.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: [Common]([object Object]) object set to `mainnet` and the default hardfork as defined in the [Common]([object Object]) class.

Current default hardfork: `istanbul`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:48

***

### freeze

> **freeze**?: `boolean`

A transaction object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the tx parameters.
It also enables tx hash caching when the `hash()` method is called multiple times.

If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:60

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
