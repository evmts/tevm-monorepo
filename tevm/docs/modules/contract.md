[tevm](../README.md) / [Modules](../modules.md) / contract

# Module: contract

## Table of contents

### References

- [Contract](contract.md#contract)
- [CreateContract](contract.md#createcontract)
- [CreateContractParams](contract.md#createcontractparams)
- [CreateScript](contract.md#createscript)
- [CreateScriptParams](contract.md#createscriptparams)
- [EventActionCreator](contract.md#eventactioncreator)
- [ReadActionCreator](contract.md#readactioncreator)
- [Script](contract.md#script)
- [WriteActionCreator](contract.md#writeactioncreator)
- [createContract](contract.md#createcontract-1)
- [createScript](contract.md#createscript-1)

### Type Aliases

- [MaybeExtractEventArgsFromAbi](contract.md#maybeextracteventargsfromabi)
- [ValueOf](contract.md#valueof)

## References

### Contract

Re-exports [Contract](index.md#contract)

___

### CreateContract

Re-exports [CreateContract](index.md#createcontract)

___

### CreateContractParams

Re-exports [CreateContractParams](index.md#createcontractparams)

___

### CreateScript

Re-exports [CreateScript](index.md#createscript)

___

### CreateScriptParams

Re-exports [CreateScriptParams](index.md#createscriptparams)

___

### EventActionCreator

Re-exports [EventActionCreator](index.md#eventactioncreator)

___

### ReadActionCreator

Re-exports [ReadActionCreator](index.md#readactioncreator)

___

### Script

Re-exports [Script](index.md#script)

___

### WriteActionCreator

Re-exports [WriteActionCreator](index.md#writeactioncreator)

___

### createContract

Re-exports [createContract](index.md#createcontract-1)

___

### createScript

Re-exports [createScript](index.md#createscript-1)

## Type Aliases

### MaybeExtractEventArgsFromAbi

Ƭ **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `TAbi` extends [`Abi`](index.md#abi) \| readonly `unknown`[] ? `TEventName` extends `string` ? [`GetEventArgs`](index.md#geteventargs)\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Adapted from viem. This is a helper type to extract the event args from an abi

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] \| `undefined` |
| `TEventName` | extends `string` \| `undefined` |

#### Defined in

evmts-monorepo/packages/contract/types/event/EventActionCreator.d.ts:5

___

### ValueOf

Ƭ **ValueOf**\<`T`\>: `T`[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/contract/types/event/EventActionCreator.d.ts:6
