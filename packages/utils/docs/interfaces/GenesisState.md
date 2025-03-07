[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / GenesisState

# Interface: GenesisState

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/genesis.d.ts:33

If you are using a custom chain Common, pass the genesis state.

Pattern 1 (with genesis state see [GenesisState](GenesisState.md) for format):

```javascript
{
  '0x0...01': '0x100', // For EoA
}
```

Pattern 2 (with complex genesis state, containing contract accounts and storage).
Note that in AccountState there are two
accepted types. This allows to easily insert accounts in the genesis state:

A complex genesis state with Contract and EoA states would have the following format:

```javascript
{
  '0x0...01': '0x100', // For EoA
  '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
}
```

## Indexable

\[`key`: `string`\]: `` `0x${string}` `` \| `AccountState`
