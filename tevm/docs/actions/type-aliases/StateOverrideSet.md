[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / StateOverrideSet

# Type Alias: StateOverrideSet

> **StateOverrideSet** = `object`

Defined in: packages/actions/types/common/StateOverrideSet.d.ts:26

The state override set is an optional address-to-state mapping, where each entry specifies some state to be ephemerally overridden prior to executing the call. Each address maps to an object containing:
This option cannot be used when `createTransaction` is set to `true`

The goal of the state override set is manyfold:

It can be used by DApps to reduce the amount of contract code needed to be deployed on chain. Code that simply returns internal state or does pre-defined validations can be kept off chain and fed to the node on-demand.
It can be used for smart contract analysis by extending the code deployed on chain with custom methods and invoking them. This avoids having to download and reconstruct the entire state in a sandbox to run custom code against.
It can be used to debug smart contracts in an already deployed large suite of contracts by selectively overriding some code or state and seeing how execution changes. Specialized tooling will probably be necessary.

## Index Signature

\[`address`: `` `0x${string}` ``\]: `object`

## Example

```ts
{
  "0xd9c9cd5f6779558b6e0ed4e6acf6b1947e7fa1f3": {
    "balance": "0xde0b6b3a7640000"
  },
  "0xebe8efa441b9302a0d7eaecc277c09d20d684540": {
    "code": "0x...",
    "state": {
      "0x...": "0x..."
    }
  }
}
```
