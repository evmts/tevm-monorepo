[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AbiFunction

# Type Alias: AbiFunction

> **AbiFunction** = `object`

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:54

ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="constant"></a> ~~`constant?`~~ | `boolean` | **Deprecated** use `pure` or `view` from AbiStateMutability instead **See** https://github.com/ethereum/solidity/issues/992 | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:60 |
| <a id="gas"></a> ~~`gas?`~~ | `number` | **Deprecated** Vyper used to provide gas estimates **See** https://github.com/vyperlang/vyper/issues/2151 | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:65 |
| <a id="inputs"></a> `inputs` | readonly `AbiParameter`[] | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:66 |
| <a id="name"></a> `name` | `string` | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:67 |
| <a id="outputs"></a> `outputs` | readonly `AbiParameter`[] | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:68 |
| <a id="payable"></a> ~~`payable?`~~ | `boolean` | **Deprecated** use `payable` or `nonpayable` from AbiStateMutability instead **See** https://github.com/ethereum/solidity/issues/992 | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:73 |
| <a id="statemutability"></a> `stateMutability` | `AbiStateMutability` | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:74 |
| <a id="type"></a> `type` | `"function"` | - | tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:55 |
