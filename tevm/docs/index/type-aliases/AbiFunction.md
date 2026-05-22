[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AbiFunction

# Type Alias: AbiFunction

> **AbiFunction** = `object`

ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="constant"></a> ~~`constant?`~~ | `boolean` | **Deprecated** use `pure` or `view` from AbiStateMutability instead **See** https://github.com/ethereum/solidity/issues/992 |
| <a id="gas"></a> ~~`gas?`~~ | `number` | **Deprecated** Vyper used to provide gas estimates **See** https://github.com/vyperlang/vyper/issues/2151 |
| <a id="inputs"></a> `inputs` | readonly `AbiParameter`[] | - |
| <a id="name"></a> `name` | `string` | - |
| <a id="outputs"></a> `outputs` | readonly `AbiParameter`[] | - |
| <a id="payable"></a> ~~`payable?`~~ | `boolean` | **Deprecated** use `payable` or `nonpayable` from AbiStateMutability instead **See** https://github.com/ethereum/solidity/issues/992 |
| <a id="statemutability"></a> `stateMutability` | `AbiStateMutability` | - |
| <a id="type"></a> `type` | `"function"` | - |
