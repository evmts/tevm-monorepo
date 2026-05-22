[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AbiConstructor

# Type Alias: AbiConstructor

> **AbiConstructor** = `object`

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:77

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="inputs"></a> `inputs` | readonly `AbiParameter`[] | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:79 |
| <a id="payable"></a> ~~`payable?`~~ | `boolean` | **Deprecated** use `payable` or `nonpayable` from AbiStateMutability instead **See** https://github.com/ethereum/solidity/issues/992 | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:84 |
| <a id="statemutability"></a> `stateMutability` | `Extract`\<`AbiStateMutability`, `"payable"` \| `"nonpayable"`\> | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:85 |
| <a id="type"></a> `type` | `"constructor"` | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:78 |
