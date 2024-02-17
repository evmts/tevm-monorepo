[@tevm/utils](README.md) / Exports

# @tevm/utils

## Table of contents

### References

- [bytesToBigInt](modules.md#bytestobigint)

### Classes

- [EthjsAccount](classes/EthjsAccount.md)
- [EthjsAddress](classes/EthjsAddress.md)

### Type Aliases

- [Abi](modules.md#abi)
- [AbiConstructor](modules.md#abiconstructor)
- [AbiEvent](modules.md#abievent)
- [AbiFunction](modules.md#abifunction)
- [AbiItemType](modules.md#abiitemtype)
- [AbiParametersToPrimitiveTypes](modules.md#abiparameterstoprimitivetypes)
- [Account](modules.md#account)
- [Address](modules.md#address)
- [BlockNumber](modules.md#blocknumber)
- [BlockTag](modules.md#blocktag)
- [ContractFunctionName](modules.md#contractfunctionname)
- [CreateEventFilterParameters](modules.md#createeventfilterparameters)
- [CreateMemoryDbFn](modules.md#creatememorydbfn)
- [DecodeFunctionResultReturnType](modules.md#decodefunctionresultreturntype)
- [EncodeFunctionDataParameters](modules.md#encodefunctiondataparameters)
- [ExtractAbiEvent](modules.md#extractabievent)
- [ExtractAbiEventNames](modules.md#extractabieventnames)
- [ExtractAbiEvents](modules.md#extractabievents)
- [ExtractAbiFunction](modules.md#extractabifunction)
- [ExtractAbiFunctionNames](modules.md#extractabifunctionnames)
- [Filter](modules.md#filter)
- [FormatAbi](modules.md#formatabi)
- [GetEventArgs](modules.md#geteventargs)
- [HDAccount](modules.md#hdaccount)
- [Hex](modules.md#hex)
- [MemoryDb](modules.md#memorydb)
- [ParseAbi](modules.md#parseabi)

### Functions

- [boolToBytes](modules.md#booltobytes)
- [boolToHex](modules.md#booltohex)
- [bytesToBigint](modules.md#bytestobigint-1)
- [bytesToBool](modules.md#bytestobool)
- [bytesToHex](modules.md#bytestohex)
- [bytesToNumber](modules.md#bytestonumber)
- [createMemoryDb](modules.md#creatememorydb)
- [decodeAbiParameters](modules.md#decodeabiparameters)
- [decodeErrorResult](modules.md#decodeerrorresult)
- [decodeEventLog](modules.md#decodeeventlog)
- [decodeFunctionData](modules.md#decodefunctiondata)
- [decodeFunctionResult](modules.md#decodefunctionresult)
- [encodeAbiParameters](modules.md#encodeabiparameters)
- [encodeDeployData](modules.md#encodedeploydata)
- [encodeErrorResult](modules.md#encodeerrorresult)
- [encodeEventTopics](modules.md#encodeeventtopics)
- [encodeFunctionData](modules.md#encodefunctiondata)
- [encodeFunctionResult](modules.md#encodefunctionresult)
- [encodePacked](modules.md#encodepacked)
- [formatAbi](modules.md#formatabi-1)
- [formatEther](modules.md#formatether)
- [formatGwei](modules.md#formatgwei)
- [formatLog](modules.md#formatlog)
- [fromBytes](modules.md#frombytes)
- [fromHex](modules.md#fromhex)
- [fromRlp](modules.md#fromrlp)
- [getAddress](modules.md#getaddress)
- [hexToBigInt](modules.md#hextobigint)
- [hexToBool](modules.md#hextobool)
- [hexToBytes](modules.md#hextobytes)
- [hexToNumber](modules.md#hextonumber)
- [hexToString](modules.md#hextostring)
- [isAddress](modules.md#isaddress)
- [isBytes](modules.md#isbytes)
- [isHex](modules.md#ishex)
- [keccak256](modules.md#keccak256)
- [mnemonicToAccount](modules.md#mnemonictoaccount)
- [numberToHex](modules.md#numbertohex)
- [parseAbi](modules.md#parseabi-1)
- [parseEther](modules.md#parseether)
- [parseGwei](modules.md#parsegwei)
- [stringToHex](modules.md#stringtohex)
- [toBytes](modules.md#tobytes)
- [toHex](modules.md#tohex)
- [toRlp](modules.md#torlp)

## References

### bytesToBigInt

Renames and re-exports [bytesToBigint](modules.md#bytestobigint-1)

## Type Aliases

### Abi

Ƭ **Abi**: readonly ([`AbiConstructor`](modules.md#abiconstructor) \| `AbiError` \| [`AbiEvent`](modules.md#abievent) \| `AbiFallback` \| [`AbiFunction`](modules.md#abifunction) \| `AbiReceive`)[]

Contract [ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:118

___

### AbiConstructor

Ƭ **AbiConstructor**: `Object`

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputs` | readonly `AbiParameter`[] | - |
| `payable?` | `boolean` | **`Deprecated`** use `payable` or `nonpayable` from AbiStateMutability instead **`See`** https://github.com/ethereum/solidity/issues/992 |
| `stateMutability` | `Extract`\<`AbiStateMutability`, ``"payable"`` \| ``"nonpayable"``\> | - |
| `type` | ``"constructor"`` | - |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:74

___

### AbiEvent

Ƭ **AbiEvent**: `Object`

ABI ["event"](https://docs.soliditylang.org/en/latest/abi-spec.html#events) type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `anonymous?` | `boolean` |
| `inputs` | readonly `AbiEventParameter`[] |
| `name` | `string` |
| `type` | ``"event"`` |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:101

___

### AbiFunction

Ƭ **AbiFunction**: `Object`

ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `constant?` | `boolean` | **`Deprecated`** use `pure` or `view` from AbiStateMutability instead **`See`** https://github.com/ethereum/solidity/issues/992 |
| `gas?` | `number` | **`Deprecated`** Vyper used to provide gas estimates **`See`** https://github.com/vyperlang/vyper/issues/2151 |
| `inputs` | readonly `AbiParameter`[] | - |
| `name` | `string` | - |
| `outputs` | readonly `AbiParameter`[] | - |
| `payable?` | `boolean` | **`Deprecated`** use `payable` or `nonpayable` from AbiStateMutability instead **`See`** https://github.com/ethereum/solidity/issues/992 |
| `stateMutability` | `AbiStateMutability` | - |
| `type` | ``"function"`` | - |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:51

___

### AbiItemType

Ƭ **AbiItemType**: ``"constructor"`` \| ``"error"`` \| ``"event"`` \| ``"fallback"`` \| ``"function"`` \| ``"receive"``

`"type"` name for [Abi](modules.md#abi) items.

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:114

___

### AbiParametersToPrimitiveTypes

Ƭ **AbiParametersToPrimitiveTypes**\<`TAbiParameters`, `TAbiParameterKind`\>: `Pretty`\<\{ [K in keyof TAbiParameters]: AbiParameterToPrimitiveType\<TAbiParameters[K], TAbiParameterKind\> }\>

Converts array of AbiParameter to corresponding TypeScript primitive types.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbiParameters` | extends readonly `AbiParameter`[] | Array of AbiParameter to convert to TypeScript representations |
| `TAbiParameterKind` | extends `AbiParameterKind` = `AbiParameterKind` | Optional AbiParameterKind to narrow by parameter type |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:86

___

### Account

Ƭ **Account**\<`TAddress`\>: `JsonRpcAccount`\<`TAddress`\> \| `LocalAccount`\<`string`, `TAddress`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAddress` | extends [`Address`](modules.md#address) = [`Address`](modules.md#address) |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/accounts/types.d.ts:9

___

### Address

Ƭ **Address**: `ResolvedRegister`[``"AddressType"``]

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:3

___

### BlockNumber

Ƭ **BlockNumber**\<`TQuantity`\>: `TQuantity`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TQuantity` | `bigint` |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/block.d.ts:68

___

### BlockTag

Ƭ **BlockTag**: ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"``

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/block.d.ts:69

___

### ContractFunctionName

Ƭ **ContractFunctionName**\<`abi`, `mutability`\>: [`ExtractAbiFunctionNames`](modules.md#extractabifunctionnames)\<`abi` extends [`Abi`](modules.md#abi) ? `abi` : [`Abi`](modules.md#abi), `mutability`\> extends infer functionName ? [`functionName`] extends [`never`] ? `string` : `functionName` : `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] = [`Abi`](modules.md#abi) |
| `mutability` | extends `AbiStateMutability` = `AbiStateMutability` |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/contract.d.ts:5

___

### CreateEventFilterParameters

Ƭ **CreateEventFilterParameters**\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>: \{ `address?`: [`Address`](modules.md#address) \| [`Address`](modules.md#address)[] ; `fromBlock?`: `TFromBlock` \| [`BlockNumber`](modules.md#blocknumber) \| [`BlockTag`](modules.md#blocktag) ; `toBlock?`: `TToBlock` \| [`BlockNumber`](modules.md#blocknumber) \| [`BlockTag`](modules.md#blocktag)  } & `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> extends infer TEventFilterArgs ? \{ `args`: `TEventFilterArgs` \| `_Args` extends `TEventFilterArgs` ? `_Args` : `never` ; `event`: `TAbiEvent` ; `events?`: `never` ; `strict?`: `TStrict`  } \| \{ `args?`: `never` ; `event?`: `TAbiEvent` ; `events?`: `never` ; `strict?`: `TStrict`  } \| \{ `args?`: `never` ; `event?`: `never` ; `events`: `TAbiEvents` ; `strict?`: `TStrict`  } \| \{ `args?`: `never` ; `event?`: `never` ; `events?`: `never` ; `strict?`: `never`  } : \{ `args?`: `never` ; `event?`: `never` ; `events?`: `never` ; `strict?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbiEvent` | extends [`AbiEvent`](modules.md#abievent) \| `undefined` = `undefined` |
| `TAbiEvents` | extends readonly [`AbiEvent`](modules.md#abievent)[] \| readonly `unknown`[] \| `undefined` = `TAbiEvent` extends [`AbiEvent`](modules.md#abievent) ? [`TAbiEvent`] : `undefined` |
| `TStrict` | extends `boolean` \| `undefined` = `undefined` |
| `TFromBlock` | extends [`BlockNumber`](modules.md#blocknumber) \| [`BlockTag`](modules.md#blocktag) \| `undefined` = `undefined` |
| `TToBlock` | extends [`BlockNumber`](modules.md#blocknumber) \| [`BlockTag`](modules.md#blocktag) \| `undefined` = `undefined` |
| `_EventName` | extends `string` \| `undefined` = `MaybeAbiEventName`\<`TAbiEvent`\> |
| `_Args` | extends `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> \| `undefined` = `undefined` |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/actions/public/createEventFilter.d.ts:13

___

### CreateMemoryDbFn

Ƭ **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb?`: `Map`\<`TKey`, `TValue`\>) => [`MemoryDb`](modules.md#memorydb)\<`TKey`, `TValue`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `string` \| `number` \| `Uint8Array` = `Uint8Array` |
| `TValue` | extends `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| `DBObject` = `Uint8Array` |

#### Type declaration

▸ (`initialDb?`): [`MemoryDb`](modules.md#memorydb)\<`TKey`, `TValue`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `initialDb?` | `Map`\<`TKey`, `TValue`\> |

##### Returns

[`MemoryDb`](modules.md#memorydb)\<`TKey`, `TValue`\>

#### Defined in

[packages/utils/src/CreateMemoryDbFn.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/CreateMemoryDbFn.ts#L4)

___

### DecodeFunctionResultReturnType

Ƭ **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\>: `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\>, `args`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] = [`Abi`](modules.md#abi) |
| `functionName` | extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> \| `undefined` = [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> |
| `args` | extends `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\>\> = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\>\> |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionResult.d.ts:23

___

### EncodeFunctionDataParameters

Ƭ **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\>: \{ `abi`: `abi`  } & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](modules.md#abi)\> extends ``true`` ? `abi`[``"length"``] extends ``1`` ? \{ `functionName?`: `functionName` \| `allFunctionNames`  } : \{ `functionName`: `functionName` \| `allFunctionNames`  } : \{ `functionName?`: `functionName` \| `allFunctionNames`  }\> & `UnionEvaluate`\<readonly [] extends `allArgs` ? \{ `args?`: `allArgs`  } : \{ `args`: `allArgs`  }\> & `hasFunctions` extends ``true`` ? `unknown` : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] = [`Abi`](modules.md#abi) |
| `functionName` | extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> \| `undefined` = [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> |
| `hasFunctions` | `abi` extends [`Abi`](modules.md#abi) ? [`Abi`](modules.md#abi) extends `abi` ? ``true`` : [`ExtractAbiFunctions`\<`abi`\>] extends [`never`] ? ``false`` : ``true`` : ``true`` |
| `allArgs` | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\>\> |
| `allFunctionNames` | [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionData.d.ts:12

___

### ExtractAbiEvent

Ƭ **ExtractAbiEvent**\<`TAbi`, `TEventName`\>: `Extract`\<[`ExtractAbiEvents`](modules.md#extractabievents)\<`TAbi`\>, \{ `name`: `TEventName`  }\>

Extracts [AbiEvent](modules.md#abievent) with name from [Abi](modules.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) | [Abi](modules.md#abi) to extract [AbiEvent](modules.md#abievent) from |
| `TEventName` | extends [`ExtractAbiEventNames`](modules.md#extractabieventnames)\<`TAbi`\> | String name of event to extract from [Abi](modules.md#abi) |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:149

___

### ExtractAbiEventNames

Ƭ **ExtractAbiEventNames**\<`TAbi`\>: [`ExtractAbiEvents`](modules.md#extractabievents)\<`TAbi`\>[``"name"``]

Extracts all [AbiEvent](modules.md#abievent) names from [Abi](modules.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) | [Abi](modules.md#abi) to extract event names from |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:141

___

### ExtractAbiEvents

Ƭ **ExtractAbiEvents**\<`TAbi`\>: `Extract`\<`TAbi`[`number`], \{ `type`: ``"event"``  }\>

Extracts all [AbiEvent](modules.md#abievent) types from [Abi](modules.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) | [Abi](modules.md#abi) to extract events from |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:132

___

### ExtractAbiFunction

Ƭ **ExtractAbiFunction**\<`TAbi`, `TFunctionName`, `TAbiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>, \{ `name`: `TFunctionName`  }\>

Extracts [AbiFunction](modules.md#abifunction) with name from [Abi](modules.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) | [Abi](modules.md#abi) to extract [AbiFunction](modules.md#abifunction) from |
| `TFunctionName` | extends [`ExtractAbiFunctionNames`](modules.md#extractabifunctionnames)\<`TAbi`\> | String name of function to extract from [Abi](modules.md#abi) |
| `TAbiStateMutability` | extends `AbiStateMutability` = `AbiStateMutability` | AbiStateMutability to filter by |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:123

___

### ExtractAbiFunctionNames

Ƭ **ExtractAbiFunctionNames**\<`TAbi`, `TAbiStateMutability`\>: `ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>[``"name"``]

Extracts all [AbiFunction](modules.md#abifunction) names from [Abi](modules.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) | [Abi](modules.md#abi) to extract function names from |
| `TAbiStateMutability` | extends `AbiStateMutability` = `AbiStateMutability` | AbiStateMutability to filter by |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:114

___

### Filter

Ƭ **Filter**\<`TFilterType`, `TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>: \{ `id`: [`Hex`](modules.md#hex) ; `request`: `EIP1193RequestFn`\<`FilterRpcSchema`\> ; `type`: `TFilterType`  } & `TFilterType` extends ``"event"`` ? \{ `fromBlock?`: `TFromBlock` ; `toBlock?`: `TToBlock`  } & `TAbi` extends [`Abi`](modules.md#abi) ? `undefined` extends `TEventName` ? \{ `abi`: `TAbi` ; `args?`: `never` ; `eventName?`: `never` ; `strict`: `TStrict`  } : `TArgs` extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> ? \{ `abi`: `TAbi` ; `args`: `TArgs` ; `eventName`: `TEventName` ; `strict`: `TStrict`  } : \{ `abi`: `TAbi` ; `args?`: `never` ; `eventName`: `TEventName` ; `strict`: `TStrict`  } : \{ `abi?`: `never` ; `args?`: `never` ; `eventName?`: `never` ; `strict?`: `never`  } : {}

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TFilterType` | extends `FilterType` = ``"event"`` |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] \| `undefined` = `undefined` |
| `TEventName` | extends `string` \| `undefined` = `undefined` |
| `TArgs` | extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> \| `undefined` = `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> |
| `TStrict` | extends `boolean` \| `undefined` = `undefined` |
| `TFromBlock` | extends [`BlockNumber`](modules.md#blocknumber) \| [`BlockTag`](modules.md#blocktag) \| `undefined` = `undefined` |
| `TToBlock` | extends [`BlockNumber`](modules.md#blocknumber) \| [`BlockTag`](modules.md#blocktag) \| `undefined` = `undefined` |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/filter.d.ts:11

___

### FormatAbi

Ƭ **FormatAbi**\<`TAbi`\>: [`Abi`](modules.md#abi) extends `TAbi` ? readonly `string`[] : `TAbi` extends readonly [] ? `never` : `TAbi` extends [`Abi`](modules.md#abi) ? \{ [K in keyof TAbi]: FormatAbiItem\<TAbi[K]\> } : readonly `string`[]

Parses JSON ABI into human-readable ABI

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] | ABI |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9

___

### GetEventArgs

Ƭ **GetEventArgs**\<`TAbi`, `TEventName`, `TConfig`, `TAbiEvent`, `TArgs`, `FailedToParseArgs`\>: ``true`` extends `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `TArgs`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |
| `TEventName` | extends `string` |
| `TConfig` | extends `EventParameterOptions` = `DefaultEventParameterOptions` |
| `TAbiEvent` | extends [`AbiEvent`](modules.md#abievent) & \{ `type`: ``"event"``  } = `TAbi` extends [`Abi`](modules.md#abi) ? [`ExtractAbiEvent`](modules.md#extractabievent)\<`TAbi`, `TEventName`\> : [`AbiEvent`](modules.md#abievent) & \{ `type`: ``"event"``  } |
| `TArgs` | `AbiEventParametersToPrimitiveTypes`\<`TAbiEvent`[``"inputs"``], `TConfig`\> |
| `FailedToParseArgs` | [`TArgs`] extends [`never`] ? ``true`` : ``false`` \| readonly `unknown`[] extends `TArgs` ? ``true`` : ``false`` |

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/contract.d.ts:68

___

### HDAccount

Ƭ **HDAccount**: `LocalAccount`\<``"hd"``\> & \{ `getHdKey`: () => `HDKey`  }

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/accounts/types.d.ts:31

___

### Hex

Ƭ **Hex**: \`0x$\{string}\`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/misc.d.ts:2

___

### MemoryDb

Ƭ **MemoryDb**\<`TKey`, `TValue`\>: `DB`\<`TKey`, `TValue`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `string` \| `number` \| `Uint8Array` = `Uint8Array` |
| `TValue` | extends `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| `DBObject` = `Uint8Array` |

#### Defined in

[packages/utils/src/MemoryDb.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/MemoryDb.ts#L3)

___

### ParseAbi

Ƭ **ParseAbi**\<`TSignatures`\>: `string`[] extends `TSignatures` ? [`Abi`](modules.md#abi) : `TSignatures` extends readonly `string`[] ? `TSignatures` extends `Signatures`\<`TSignatures`\> ? `ParseStructs`\<`TSignatures`\> extends infer Structs ? \{ [K in keyof TSignatures]: TSignatures[K] extends string ? ParseSignature\<TSignatures[K], Structs\> : never } extends infer Mapped ? `Filter`\<`Mapped`, `never`\> extends infer Result ? `Result` extends readonly [] ? `never` : `Result` : `never` : `never` : `never` : `never` : `never`

Parses human-readable ABI into JSON [Abi](modules.md#abi)

**`Example`**

```ts
type Result = ParseAbi<
  // ^? type Result = readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  [
    'function balanceOf(address owner) view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 amount)',
  ]
>
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TSignatures` | extends readonly `string`[] | Human-readable ABI |

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:21

## Functions

### boolToBytes

▸ **boolToBytes**(`value`, `opts?`): `Uint8Array`

Encodes a boolean into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#booltobytes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Boolean value to encode. |
| `opts?` | `BoolToBytesOpts` | Options. |

#### Returns

`Uint8Array`

Byte array value.

**`Example`**

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true)
// Uint8Array([1])
```

**`Example`**

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true, { size: 32 })
// Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toBytes.d.ts:62

___

### boolToHex

▸ **boolToHex**(`value`, `opts?`): [`Hex`](modules.md#hex)

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Value to encode. |
| `opts?` | `BoolToHexOpts` | Options. |

#### Returns

[`Hex`](modules.md#hex)

Hex value.

**`Example`**

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true)
// '0x1'
```

**`Example`**

```ts
import { boolToHex } from 'viem'
const data = boolToHex(false)
// '0x0'
```

**`Example`**

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true, { size: 32 })
// '0x0000000000000000000000000000000000000000000000000000000000000001'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:66

___

### bytesToBigint

▸ **bytesToBigint**(`bytes`, `opts?`): `bigint`

Decodes a byte array into a bigint.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | Byte array to decode. |
| `opts?` | `BytesToBigIntOpts` | Options. |

#### Returns

`bigint`

BigInt value.

**`Example`**

```ts
import { bytesToBigInt } from 'viem'
const data = bytesToBigInt(new Uint8Array([1, 164]))
// 420n
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:59

___

### bytesToBool

▸ **bytesToBool**(`bytes_`, `opts?`): `boolean`

Decodes a byte array into a boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes_` | `Uint8Array` | - |
| `opts?` | `BytesToBoolOpts` | Options. |

#### Returns

`boolean`

Boolean value.

**`Example`**

```ts
import { bytesToBool } from 'viem'
const data = bytesToBool(new Uint8Array([1]))
// true
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:79

___

### bytesToHex

▸ **bytesToHex**(`value`, `opts?`): [`Hex`](modules.md#hex)

Encodes a bytes array into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#bytestohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Uint8Array` | Value to encode. |
| `opts?` | `BytesToHexOpts` | Options. |

#### Returns

[`Hex`](modules.md#hex)

Hex value.

**`Example`**

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
// '0x48656c6c6f20576f726c6421'
```

**`Example`**

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:91

___

### bytesToNumber

▸ **bytesToNumber**(`bytes`, `opts?`): `number`

Decodes a byte array into a number.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | Byte array to decode. |
| `opts?` | `BytesToBigIntOpts` | Options. |

#### Returns

`number`

Number value.

**`Example`**

```ts
import { bytesToNumber } from 'viem'
const data = bytesToNumber(new Uint8Array([1, 164]))
// 420
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:96

___

### createMemoryDb

▸ **createMemoryDb**(`initialDb?`): [`MemoryDb`](modules.md#memorydb)\<`Uint8Array`, `Uint8Array`\>

A simple ethereumjs DB instance that uses an in memory Map as it's backend
Pass in an initial DB optionally to prepoulate the DB.

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialDb?` | `Map`\<`Uint8Array`, `Uint8Array`\> |

#### Returns

[`MemoryDb`](modules.md#memorydb)\<`Uint8Array`, `Uint8Array`\>

#### Defined in

[packages/utils/src/createMemoryDb.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/createMemoryDb.js#L28)

___

### decodeAbiParameters

▸ **decodeAbiParameters**\<`TParams`\>(`params`, `data`): `DecodeAbiParametersReturnType`\<`TParams`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends readonly `AbiParameter`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `data` | `Uint8Array` \| \`0x$\{string}\` |

#### Returns

`DecodeAbiParametersReturnType`\<`TParams`\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeAbiParameters.d.ts:14

___

### decodeErrorResult

▸ **decodeErrorResult**\<`TAbi`\>(`parameters`): `DecodeErrorResultReturnType`\<`TAbi`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeErrorResultParameters`\<`TAbi`\> |

#### Returns

`DecodeErrorResultReturnType`\<`TAbi`\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeErrorResult.d.ts:26

___

### decodeEventLog

▸ **decodeEventLog**\<`abi`, `eventName`, `topics`, `data`, `strict`\>(`parameters`): `DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |
| `eventName` | extends `undefined` \| `string` = `undefined` |
| `topics` | extends \`0x$\{string}\`[] = \`0x$\{string}\`[] |
| `data` | extends `undefined` \| \`0x$\{string}\` = `undefined` |
| `strict` | extends `boolean` = ``true`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeEventLogParameters`\<`abi`, `eventName`, `topics`, `data`, `strict`\> |

#### Returns

`DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeEventLog.d.ts:32

___

### decodeFunctionData

▸ **decodeFunctionData**\<`abi`\>(`parameters`): `DecodeFunctionDataReturnType`\<`abi`, [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionDataParameters`\<`abi`\> |

#### Returns

`DecodeFunctionDataReturnType`\<`abi`, [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionData.d.ts:25

___

### decodeFunctionResult

▸ **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): [`DecodeFunctionResultReturnType`](modules.md#decodefunctionresultreturntype)\<`abi`, `functionName`, `args`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |
| `args` | extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends [`Abi`](modules.md#abi) ? [`Abi`](modules.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\> |

#### Returns

[`DecodeFunctionResultReturnType`](modules.md#decodefunctionresultreturntype)\<`abi`, `functionName`, `args`\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionResult.d.ts:25

___

### encodeAbiParameters

▸ **encodeAbiParameters**\<`TParams`\>(`params`, `values`): `EncodeAbiParametersReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends readonly `unknown`[] \| readonly `AbiParameter`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `values` | `TParams` extends readonly `AbiParameter`[] ? \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<TParams[K], AbiParameterKind\> }[K] } : `never` |

#### Returns

`EncodeAbiParametersReturnType`

**`Description`**

Encodes a list of primitive values into an ABI-encoded hex value.

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeAbiParameters.d.ts:17

___

### encodeDeployData

▸ **encodeDeployData**\<`abi`\>(`parameters`): `EncodeDeployDataReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeDeployDataParameters`\<`abi`, `abi` extends [`Abi`](modules.md#abi) ? [`Abi`](modules.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `type`: ``"constructor"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractConstructorArgs`\<`abi`\>\> |

#### Returns

`EncodeDeployDataReturnType`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeDeployData.d.ts:21

___

### encodeErrorResult

▸ **encodeErrorResult**\<`abi`, `errorName`\>(`parameters`): `EncodeErrorResultReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |
| `errorName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeErrorResultParameters`\<`abi`, `errorName`, `abi` extends [`Abi`](modules.md#abi) ? [`Abi`](modules.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `type`: ``"error"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractErrorArgs`\<`abi`, `errorName` extends `ContractErrorName`\<`abi`\> ? `errorName` : `ContractErrorName`\<`abi`\>\>, `ContractErrorName`\<`abi`\>\> |

#### Returns

`EncodeErrorResultReturnType`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeErrorResult.d.ts:23

___

### encodeEventTopics

▸ **encodeEventTopics**\<`abi`, `eventName`\>(`parameters`): \`0x$\{string}\`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |
| `eventName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeEventTopicsParameters`\<`abi`, `eventName`, `abi` extends [`Abi`](modules.md#abi) ? [`Abi`](modules.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `type`: ``"event"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractEventArgs`\<`abi`, `eventName` extends `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\>, `ContractEventName`\<`abi`\>\> |

#### Returns

\`0x$\{string}\`[]

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeEventTopics.d.ts:24

___

### encodeFunctionData

▸ **encodeFunctionData**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionDataReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`EncodeFunctionDataParameters`](modules.md#encodefunctiondataparameters)\<`abi`, `functionName`, `abi` extends [`Abi`](modules.md#abi) ? [`Abi`](modules.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionDataReturnType`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionData.d.ts:27

___

### encodeFunctionResult

▸ **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends [`Abi`](modules.md#abi) ? [`Abi`](modules.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, [`ContractFunctionName`](modules.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionResultReturnType`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionResult.d.ts:21

___

### encodePacked

▸ **encodePacked**\<`TPackedAbiTypes`\>(`types`, `values`): [`Hex`](modules.md#hex)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TPackedAbiTypes` | extends readonly `unknown`[] \| readonly `PackedAbiType`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `types` | `TPackedAbiTypes` |
| `values` | `EncodePackedValues`\<`TPackedAbiTypes`\> |

#### Returns

[`Hex`](modules.md#hex)

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodePacked.d.ts:17

___

### formatAbi

▸ **formatAbi**\<`TAbi`\>(`abi`): [`FormatAbi`](modules.md#formatabi)\<`TAbi`\>

Parses JSON ABI into human-readable ABI

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](modules.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `abi` | `TAbi` | ABI |

#### Returns

[`FormatAbi`](modules.md#formatabi)\<`TAbi`\>

Human-readable ABI

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/formatAbi.d.ts:18

___

### formatEther

▸ **formatEther**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther

#### Parameters

| Name | Type |
| :------ | :------ |
| `wei` | `bigint` |
| `unit?` | ``"wei"`` \| ``"gwei"`` |

#### Returns

`string`

**`Example`**

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/formatEther.d.ts:14

___

### formatGwei

▸ **formatGwei**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of gwei.

- Docs: https://viem.sh/docs/utilities/formatGwei

#### Parameters

| Name | Type |
| :------ | :------ |
| `wei` | `bigint` |
| `unit?` | ``"wei"`` |

#### Returns

`string`

**`Example`**

```ts
import { formatGwei } from 'viem'

formatGwei(1000000000n)
// '1'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/formatGwei.d.ts:14

___

### formatLog

▸ **formatLog**(`log`, `«destructured»?`): `Log`

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `Partial`\<`RpcLog`\> |
| `«destructured»` | `Object` |
| › `args?` | `unknown` |
| › `eventName?` | `string` |

#### Returns

`Log`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/formatters/log.d.ts:5

___

### fromBytes

▸ **fromBytes**\<`TTo`\>(`bytes`, `toOrOpts`): `FromBytesReturnType`\<`TTo`\>

Decodes a byte array into a UTF-8 string, hex value, number, bigint or boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes
- Example: https://viem.sh/docs/utilities/fromBytes#usage

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends ``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"hex"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | Byte array to decode. |
| `toOrOpts` | `FromBytesParameters`\<`TTo`\> | Type to convert to or options. |

#### Returns

`FromBytesReturnType`\<`TTo`\>

Decoded value.

**`Example`**

```ts
import { fromBytes } from 'viem'
const data = fromBytes(new Uint8Array([1, 164]), 'number')
// 420
```

**`Example`**

```ts
import { fromBytes } from 'viem'
const data = fromBytes(
  new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  'string'
)
// 'Hello world'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:37

___

### fromHex

▸ **fromHex**\<`TTo`\>(`hex`, `toOrOpts`): `FromHexReturnType`\<`TTo`\>

Decodes a hex string into a string, number, bigint, boolean, or byte array.

- Docs: https://viem.sh/docs/utilities/fromHex
- Example: https://viem.sh/docs/utilities/fromHex#usage

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends ``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"bytes"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex string to decode. |
| `toOrOpts` | `FromHexParameters`\<`TTo`\> | Type to convert to or options. |

#### Returns

`FromHexReturnType`\<`TTo`\>

Decoded value.

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x1a4', 'number')
// 420
```

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c6421', 'string')
// 'Hello world'
```

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
  size: 32,
  to: 'string'
})
// 'Hello world'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:47

___

### fromRlp

▸ **fromRlp**\<`to`\>(`value`, `to?`): `FromRlpReturnType`\<`to`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `to` | extends `To` = ``"hex"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Uint8Array` \| \`0x$\{string}\` |
| `to?` | `to` \| `To` |

#### Returns

`FromRlpReturnType`\<`to`\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromRlp.d.ts:12

___

### getAddress

▸ **getAddress**(`address`, `chainId?`): [`Address`](modules.md#address)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chainId?` | `number` |

#### Returns

[`Address`](modules.md#address)

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/address/getAddress.d.ts:9

___

### hexToBigInt

▸ **hexToBigInt**(`hex`, `opts?`): `bigint`

Decodes a hex value into a bigint.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobigint

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex value to decode. |
| `opts?` | `HexToBigIntOpts` | Options. |

#### Returns

`bigint`

BigInt value.

**`Example`**

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x1a4', { signed: true })
// 420n
```

**`Example`**

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420n
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:74

___

### hexToBool

▸ **hexToBool**(`hex_`, `opts?`): `boolean`

Decodes a hex value into a boolean.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobool

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex_` | \`0x$\{string}\` | - |
| `opts?` | `HexToBoolOpts` | Options. |

#### Returns

`boolean`

Boolean value.

**`Example`**

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x01')
// true
```

**`Example`**

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
// true
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:99

___

### hexToBytes

▸ **hexToBytes**(`hex_`, `opts?`): `ByteArray`

Encodes a hex string into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#hextobytes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex_` | \`0x$\{string}\` | - |
| `opts?` | `HexToBytesOpts` | Options. |

#### Returns

`ByteArray`

Byte array value.

**`Example`**

```ts
import { hexToBytes } from 'viem'
const data = hexToBytes('0x48656c6c6f20776f726c6421')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

**`Example`**

```ts
import { hexToBytes } from 'viem'
const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toBytes.d.ts:87

___

### hexToNumber

▸ **hexToNumber**(`hex`, `opts?`): `number`

Decodes a hex string into a number.

- Docs: https://viem.sh/docs/utilities/fromHex#hextonumber

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex value to decode. |
| `opts?` | `HexToBigIntOpts` | Options. |

#### Returns

`number`

Number value.

**`Example`**

```ts
import { hexToNumber } from 'viem'
const data = hexToNumber('0x1a4')
// 420
```

**`Example`**

```ts
import { hexToNumber } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:121

___

### hexToString

▸ **hexToString**(`hex`, `opts?`): `string`

Decodes a hex value into a UTF-8 string.

- Docs: https://viem.sh/docs/utilities/fromHex#hextostring

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex value to decode. |
| `opts?` | `HexToStringOpts` | Options. |

#### Returns

`string`

String value.

**`Example`**

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c6421')
// 'Hello world!'
```

**`Example`**

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
 size: 32,
})
// 'Hello world'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:148

___

### isAddress

▸ **isAddress**(`address`): address is \`0x$\{string}\`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

address is \`0x$\{string}\`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/address/isAddress.d.ts:4

___

### isBytes

▸ **isBytes**(`value`): value is Uint8Array

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

value is Uint8Array

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/data/isBytes.d.ts:4

___

### isHex

▸ **isHex**(`value`, `«destructured»?`): value is \`0x$\{string}\`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `«destructured»` | `Object` |
| › `strict?` | `boolean` |

#### Returns

value is \`0x$\{string}\`

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/data/isHex.d.ts:4

___

### keccak256

▸ **keccak256**\<`TTo`\>(`value`, `to_?`): `Keccak256Hash`\<`TTo`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends `To` = ``"hex"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Uint8Array` \| \`0x$\{string}\` |
| `to_?` | `TTo` |

#### Returns

`Keccak256Hash`\<`TTo`\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/hash/keccak256.d.ts:9

___

### mnemonicToAccount

▸ **mnemonicToAccount**(`mnemonic`, `opts?`): [`HDAccount`](modules.md#hdaccount)

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string` |
| `opts?` | `HDOptions` |

#### Returns

[`HDAccount`](modules.md#hdaccount)

A HD Account.

**`Description`**

Creates an Account from a mnemonic phrase.

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/accounts/mnemonicToAccount.d.ts:10

___

### numberToHex

▸ **numberToHex**(`value_`, `opts?`): [`Hex`](modules.md#hex)

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value_` | `number` \| `bigint` | - |
| `opts?` | `NumberToHexOpts` | Options. |

#### Returns

[`Hex`](modules.md#hex)

Hex value.

**`Example`**

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420)
// '0x1a4'
```

**`Example`**

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420, { size: 32 })
// '0x00000000000000000000000000000000000000000000000000000000000001a4'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:122

___

### parseAbi

▸ **parseAbi**\<`TSignatures`\>(`signatures`): [`ParseAbi`](modules.md#parseabi)\<`TSignatures`\>

Parses human-readable ABI into JSON [Abi](modules.md#abi)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TSignatures` | extends readonly `string`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signatures` | `TSignatures`[``"length"``] extends ``0`` ? [``"Error: At least one signature required"``] : `Signatures`\<`TSignatures`\> extends `TSignatures` ? `TSignatures` : `Signatures`\<`TSignatures`\> | Human-Readable ABI |

#### Returns

[`ParseAbi`](modules.md#parseabi)\<`TSignatures`\>

Parsed [Abi](modules.md#abi)

**`Example`**

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

#### Defined in

node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37

___

### parseEther

▸ **parseEther**(`ether`, `unit?`): `bigint`

Converts a string representation of ether to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseEther

#### Parameters

| Name | Type |
| :------ | :------ |
| `ether` | `string` |
| `unit?` | ``"wei"`` \| ``"gwei"`` |

#### Returns

`bigint`

**`Example`**

```ts
import { parseEther } from 'viem'

parseEther('420')
// 420000000000000000000n
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/parseEther.d.ts:15

___

### parseGwei

▸ **parseGwei**(`ether`, `unit?`): `bigint`

Converts a string representation of gwei to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseGwei

#### Parameters

| Name | Type |
| :------ | :------ |
| `ether` | `string` |
| `unit?` | ``"wei"`` |

#### Returns

`bigint`

**`Example`**

```ts
import { parseGwei } from 'viem'

parseGwei('420')
// 420000000000n
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/parseGwei.d.ts:15

___

### stringToHex

▸ **stringToHex**(`value_`, `opts?`): [`Hex`](modules.md#hex)

Encodes a UTF-8 string into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#stringtohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value_` | `string` | - |
| `opts?` | `StringToHexOpts` | Options. |

#### Returns

[`Hex`](modules.md#hex)

Hex value.

**`Example`**

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!')
// '0x48656c6c6f20576f726c6421'
```

**`Example`**

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!', { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:147

___

### toBytes

▸ **toBytes**(`value`, `opts?`): `ByteArray`

Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes
- Example: https://viem.sh/docs/utilities/toBytes#usage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` | Value to encode. |
| `opts?` | `ToBytesParameters` | Options. |

#### Returns

`ByteArray`

Byte array value.

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes('Hello world')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes(420)
// Uint8Array([1, 164])
```

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes(420, { size: 4 })
// Uint8Array([0, 0, 1, 164])
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toBytes.d.ts:37

___

### toHex

▸ **toHex**(`value`, `opts?`): [`Hex`](modules.md#hex)

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex
- Example: https://viem.sh/docs/utilities/toHex#usage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` \| `Uint8Array` | Value to encode. |
| `opts?` | `ToHexParameters` | Options. |

#### Returns

[`Hex`](modules.md#hex)

Hex value.

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex('Hello world')
// '0x48656c6c6f20776f726c6421'
```

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex(420)
// '0x1a4'
```

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex('Hello world', { size: 32 })
// '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
```

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:36

___

### toRlp

▸ **toRlp**\<`to`\>(`bytes`, `to?`): `ToRlpReturnType`\<`to`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `to` | extends `To` = ``"hex"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `RecursiveArray`\<`Uint8Array`\> \| `RecursiveArray`\<\`0x$\{string}\`\> |
| `to?` | `to` \| `To` |

#### Returns

`ToRlpReturnType`\<`to`\>

#### Defined in

node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toRlp.d.ts:10
