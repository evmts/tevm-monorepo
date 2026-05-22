[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AbiConstructor

# Type Alias: AbiConstructor

> **AbiConstructor** = `object`

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="inputs"></a> `inputs` | readonly `AbiParameter`[] | - |
| <a id="payable"></a> ~~`payable?`~~ | `boolean` | **Deprecated** use `payable` or `nonpayable` from AbiStateMutability instead **See** https://github.com/ethereum/solidity/issues/992 |
| <a id="statemutability"></a> `stateMutability` | `Extract`\<`AbiStateMutability`, `"payable"` \| `"nonpayable"`\> | - |
| <a id="type"></a> `type` | `"constructor"` | - |
