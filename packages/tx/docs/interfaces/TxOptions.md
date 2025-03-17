[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / TxOptions

# Interface: TxOptions

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:42

The options for initializing a Transaction.

## Properties

### allowUnlimitedInitCodeSize?

> `optional` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:87

Allows unlimited contract code-size init while debugging. This (partially) disables EIP-3860.
Gas cost for initcode size analysis will still be charged. Use with caution.

***

### common?

> `optional` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:53

A Common object defining the chain and hardfork for the transaction.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the default hardfork as defined in the Common class.

Current default hardfork: `istanbul`

***

### freeze?

> `optional` **freeze**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:82

A transaction object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the tx parameters.
It also enables tx hash caching when the `hash()` method is called multiple times.

If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

***

### params?

> `optional` **params**: `ParamsDict`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:70

Tx parameters sorted by EIP can be found in the exported `paramsTx` dictionary,
which is internally passed to the associated `@ethereumjs/common` instance which
manages parameter selection based on the hardfork and EIP settings.

This option allows providing a custom set of parameters. Note that parameters
get fully overwritten, so you need to extend the default parameter dict
to provide the full parameter set.

It is recommended to deep-clone the params object for this to avoid side effects:

```ts
const params = JSON.parse(JSON.stringify(paramsTx))
params['1']['txGas'] = 30000 // 21000
```
