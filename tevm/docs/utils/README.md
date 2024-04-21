**tevm** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > utils

# Module: utils

## Index

### Classes

- [EthjsAccount](classes/EthjsAccount.md)
- [EthjsAddress](classes/EthjsAddress.md)

### Interfaces

- [GenesisState](interfaces/GenesisState.md)

### Type Aliases

- [BigIntToHex](type-aliases/BigIntToHex.md)
- [JsonSerializable](type-aliases/JsonSerializable.md)
- [JsonSerializableArray](type-aliases/JsonSerializableArray.md)
- [JsonSerializableObject](type-aliases/JsonSerializableObject.md)
- [JsonSerializableSet](type-aliases/JsonSerializableSet.md)
- [SerializeToJson](type-aliases/SerializeToJson.md)
- [SetToHex](type-aliases/SetToHex.md)
- [WithdrawalData](type-aliases/WithdrawalData.md)

### Functions

- [equalsBytes](functions/equalsBytes.md)

## Table of contents

### References

- [Abi](README.md#abi)
- [AbiConstructor](README.md#abiconstructor)
- [AbiEvent](README.md#abievent)
- [AbiFunction](README.md#abifunction)
- [AbiItemType](README.md#abiitemtype)
- [AbiParametersToPrimitiveTypes](README.md#abiparameterstoprimitivetypes)
- [Account](README.md#account)
- [Address](README.md#address)
- [BlockNumber](README.md#blocknumber)
- [BlockTag](README.md#blocktag)
- [ContractFunctionName](README.md#contractfunctionname)
- [CreateEventFilterParameters](README.md#createeventfilterparameters)
- [CreateMemoryDbFn](README.md#creatememorydbfn)
- [DecodeFunctionResultReturnType](README.md#decodefunctionresultreturntype)
- [EncodeFunctionDataParameters](README.md#encodefunctiondataparameters)
- [ExtractAbiEvent](README.md#extractabievent)
- [ExtractAbiEventNames](README.md#extractabieventnames)
- [ExtractAbiEvents](README.md#extractabievents)
- [ExtractAbiFunction](README.md#extractabifunction)
- [ExtractAbiFunctionNames](README.md#extractabifunctionnames)
- [Filter](README.md#filter)
- [FormatAbi](README.md#formatabi)
- [GetEventArgs](README.md#geteventargs)
- [HDAccount](README.md#hdaccount)
- [Hex](README.md#hex)
- [MemoryDb](README.md#memorydb)
- [ParseAbi](README.md#parseabi)
- [boolToBytes](README.md#booltobytes)
- [boolToHex](README.md#booltohex)
- [bytesToBigInt](README.md#bytestobigint)
- [bytesToBigint](README.md#bytestobigint-1)
- [bytesToBool](README.md#bytestobool)
- [bytesToHex](README.md#bytestohex)
- [bytesToNumber](README.md#bytestonumber)
- [createMemoryDb](README.md#creatememorydb)
- [decodeAbiParameters](README.md#decodeabiparameters)
- [decodeErrorResult](README.md#decodeerrorresult)
- [decodeEventLog](README.md#decodeeventlog)
- [decodeFunctionData](README.md#decodefunctiondata)
- [decodeFunctionResult](README.md#decodefunctionresult)
- [encodeAbiParameters](README.md#encodeabiparameters)
- [encodeDeployData](README.md#encodedeploydata)
- [encodeErrorResult](README.md#encodeerrorresult)
- [encodeEventTopics](README.md#encodeeventtopics)
- [encodeFunctionData](README.md#encodefunctiondata)
- [encodeFunctionResult](README.md#encodefunctionresult)
- [encodePacked](README.md#encodepacked)
- [formatAbi](README.md#formatabi-1)
- [formatEther](README.md#formatether)
- [formatGwei](README.md#formatgwei)
- [formatLog](README.md#formatlog)
- [fromBytes](README.md#frombytes)
- [fromHex](README.md#fromhex)
- [fromRlp](README.md#fromrlp)
- [getAddress](README.md#getaddress)
- [hexToBigInt](README.md#hextobigint)
- [hexToBool](README.md#hextobool)
- [hexToBytes](README.md#hextobytes)
- [hexToNumber](README.md#hextonumber)
- [hexToString](README.md#hextostring)
- [isAddress](README.md#isaddress)
- [isBytes](README.md#isbytes)
- [isHex](README.md#ishex)
- [keccak256](README.md#keccak256)
- [mnemonicToAccount](README.md#mnemonictoaccount)
- [numberToHex](README.md#numbertohex)
- [parseAbi](README.md#parseabi-1)
- [parseEther](README.md#parseether)
- [parseGwei](README.md#parsegwei)
- [stringToHex](README.md#stringtohex)
- [toBytes](README.md#tobytes)
- [toHex](README.md#tohex)
- [toRlp](README.md#torlp)

## References

### Abi

Re-exports [Abi](../index/type-aliases/Abi.md)

***

### AbiConstructor

Re-exports [AbiConstructor](../index/type-aliases/AbiConstructor.md)

***

### AbiEvent

Re-exports [AbiEvent](../index/type-aliases/AbiEvent.md)

***

### AbiFunction

Re-exports [AbiFunction](../index/type-aliases/AbiFunction.md)

***

### AbiItemType

Re-exports [AbiItemType](../index/type-aliases/AbiItemType.md)

***

### AbiParametersToPrimitiveTypes

Re-exports [AbiParametersToPrimitiveTypes](../index/type-aliases/AbiParametersToPrimitiveTypes.md)

***

### Account

Re-exports [Account](../index/type-aliases/Account.md)

***

### Address

Re-exports [Address](../index/type-aliases/Address.md)

***

### BlockNumber

Re-exports [BlockNumber](../index/type-aliases/BlockNumber.md)

***

### BlockTag

Re-exports [BlockTag](../index/type-aliases/BlockTag.md)

***

### ContractFunctionName

Re-exports [ContractFunctionName](../index/type-aliases/ContractFunctionName.md)

***

### CreateEventFilterParameters

Re-exports [CreateEventFilterParameters](../index/type-aliases/CreateEventFilterParameters.md)

***

### CreateMemoryDbFn

Re-exports [CreateMemoryDbFn](../index/type-aliases/CreateMemoryDbFn.md)

***

### DecodeFunctionResultReturnType

Re-exports [DecodeFunctionResultReturnType](../index/type-aliases/DecodeFunctionResultReturnType.md)

***

### EncodeFunctionDataParameters

Re-exports [EncodeFunctionDataParameters](../index/type-aliases/EncodeFunctionDataParameters.md)

***

### ExtractAbiEvent

Re-exports [ExtractAbiEvent](../index/type-aliases/ExtractAbiEvent.md)

***

### ExtractAbiEventNames

Re-exports [ExtractAbiEventNames](../index/type-aliases/ExtractAbiEventNames.md)

***

### ExtractAbiEvents

Re-exports [ExtractAbiEvents](../index/type-aliases/ExtractAbiEvents.md)

***

### ExtractAbiFunction

Re-exports [ExtractAbiFunction](../index/type-aliases/ExtractAbiFunction.md)

***

### ExtractAbiFunctionNames

Re-exports [ExtractAbiFunctionNames](../index/type-aliases/ExtractAbiFunctionNames.md)

***

### Filter

Re-exports [Filter](../index/type-aliases/Filter.md)

***

### FormatAbi

Re-exports [FormatAbi](../index/type-aliases/FormatAbi.md)

***

### GetEventArgs

Re-exports [GetEventArgs](../index/type-aliases/GetEventArgs.md)

***

### HDAccount

Re-exports [HDAccount](../index/type-aliases/HDAccount.md)

***

### Hex

Re-exports [Hex](../index/type-aliases/Hex.md)

***

### MemoryDb

Re-exports [MemoryDb](../index/type-aliases/MemoryDb.md)

***

### ParseAbi

Re-exports [ParseAbi](../index/type-aliases/ParseAbi.md)

***

### boolToBytes

Re-exports [boolToBytes](../index/functions/boolToBytes.md)

***

### boolToHex

Re-exports [boolToHex](../index/functions/boolToHex.md)

***

### bytesToBigInt

Renames and re-exports [bytesToBigint](../index/functions/bytesToBigint.md)

***

### bytesToBigint

Re-exports [bytesToBigint](../index/functions/bytesToBigint.md)

***

### bytesToBool

Re-exports [bytesToBool](../index/functions/bytesToBool.md)

***

### bytesToHex

Re-exports [bytesToHex](../index/functions/bytesToHex.md)

***

### bytesToNumber

Re-exports [bytesToNumber](../index/functions/bytesToNumber.md)

***

### createMemoryDb

Re-exports [createMemoryDb](../index/functions/createMemoryDb.md)

***

### decodeAbiParameters

Re-exports [decodeAbiParameters](../index/functions/decodeAbiParameters.md)

***

### decodeErrorResult

Re-exports [decodeErrorResult](../index/functions/decodeErrorResult.md)

***

### decodeEventLog

Re-exports [decodeEventLog](../index/functions/decodeEventLog.md)

***

### decodeFunctionData

Re-exports [decodeFunctionData](../index/functions/decodeFunctionData.md)

***

### decodeFunctionResult

Re-exports [decodeFunctionResult](../index/functions/decodeFunctionResult.md)

***

### encodeAbiParameters

Re-exports [encodeAbiParameters](../index/functions/encodeAbiParameters.md)

***

### encodeDeployData

Re-exports [encodeDeployData](../index/functions/encodeDeployData.md)

***

### encodeErrorResult

Re-exports [encodeErrorResult](../index/functions/encodeErrorResult.md)

***

### encodeEventTopics

Re-exports [encodeEventTopics](../index/functions/encodeEventTopics.md)

***

### encodeFunctionData

Re-exports [encodeFunctionData](../index/functions/encodeFunctionData.md)

***

### encodeFunctionResult

Re-exports [encodeFunctionResult](../index/functions/encodeFunctionResult.md)

***

### encodePacked

Re-exports [encodePacked](../index/functions/encodePacked.md)

***

### formatAbi

Re-exports [formatAbi](../index/functions/formatAbi.md)

***

### formatEther

Re-exports [formatEther](../index/functions/formatEther.md)

***

### formatGwei

Re-exports [formatGwei](../index/functions/formatGwei.md)

***

### formatLog

Re-exports [formatLog](../index/functions/formatLog.md)

***

### fromBytes

Re-exports [fromBytes](../index/functions/fromBytes.md)

***

### fromHex

Re-exports [fromHex](../index/functions/fromHex.md)

***

### fromRlp

Re-exports [fromRlp](../index/functions/fromRlp.md)

***

### getAddress

Re-exports [getAddress](../index/functions/getAddress.md)

***

### hexToBigInt

Re-exports [hexToBigInt](../index/functions/hexToBigInt.md)

***

### hexToBool

Re-exports [hexToBool](../index/functions/hexToBool.md)

***

### hexToBytes

Re-exports [hexToBytes](../index/functions/hexToBytes.md)

***

### hexToNumber

Re-exports [hexToNumber](../index/functions/hexToNumber.md)

***

### hexToString

Re-exports [hexToString](../index/functions/hexToString.md)

***

### isAddress

Re-exports [isAddress](../index/functions/isAddress.md)

***

### isBytes

Re-exports [isBytes](../index/functions/isBytes.md)

***

### isHex

Re-exports [isHex](../index/functions/isHex.md)

***

### keccak256

Re-exports [keccak256](../index/functions/keccak256.md)

***

### mnemonicToAccount

Re-exports [mnemonicToAccount](../index/functions/mnemonicToAccount.md)

***

### numberToHex

Re-exports [numberToHex](../index/functions/numberToHex.md)

***

### parseAbi

Re-exports [parseAbi](../index/functions/parseAbi.md)

***

### parseEther

Re-exports [parseEther](../index/functions/parseEther.md)

***

### parseGwei

Re-exports [parseGwei](../index/functions/parseGwei.md)

***

### stringToHex

Re-exports [stringToHex](../index/functions/stringToHex.md)

***

### toBytes

Re-exports [toBytes](../index/functions/toBytes.md)

***

### toHex

Re-exports [toHex](../index/functions/toHex.md)

***

### toRlp

Re-exports [toRlp](../index/functions/toRlp.md)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
