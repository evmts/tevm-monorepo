[@tevm/vm](README.md) / Exports

# @tevm/vm

## Table of contents

### Classes

- [Tevm](classes/Tevm.md)

### Type Aliases

- [CreateEVMOptions](modules.md#createevmoptions)
- [PutAccountAction](modules.md#putaccountaction)
- [PutContractCodeAction](modules.md#putcontractcodeaction)
- [RunCallAction](modules.md#runcallaction)
- [RunContractCallAction](modules.md#runcontractcallaction)
- [RunContractCallError](modules.md#runcontractcallerror)
- [RunContractCallResult](modules.md#runcontractcallresult)
- [RunScriptAction](modules.md#runscriptaction)
- [RunScriptError](modules.md#runscripterror)
- [RunScriptResult](modules.md#runscriptresult)

### Variables

- [CallActionValidator](modules.md#callactionvalidator)
- [PutAccountActionValidator](modules.md#putaccountactionvalidator)
- [PutContractCodeActionValidator](modules.md#putcontractcodeactionvalidator)
- [RunContractCallActionValidator](modules.md#runcontractcallactionvalidator)
- [RunScriptActionValidator](modules.md#runscriptactionvalidator)

## Type Aliases

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customPrecompiles?` | `CustomPrecompile`[] |
| `fork?` | `ForkOptions` |

#### Defined in

[vm/vm/src/tevm.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L41)

___

### PutAccountAction

Ƭ **PutAccountAction**: `Object`

Tevm action to put an account into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Address` |
| `balance?` | `bigint` |

#### Defined in

[vm/vm/src/actions/putAccount.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putAccount.ts#L25)

___

### PutContractCodeAction

Ƭ **PutContractCodeAction**: `Object`

Tevm action to put contract code into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contractAddress` | `Address` |
| `deployedBytecode` | `Hex` |

#### Defined in

[vm/vm/src/actions/putContractCode.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putContractCode.ts#L16)

___

### RunCallAction

Ƭ **RunCallAction**: `Object`

Tevm action to execute a call on the vm

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caller` | `Address` |
| `data` | `Hex` |
| `gasLimit?` | `bigint` |
| `origin?` | `Address` |
| `to` | `Address` |
| `value?` | `bigint` |

#### Defined in

[vm/vm/src/actions/runCall.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runCall.ts#L31)

___

### RunContractCallAction

Ƭ **RunContractCallAction**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `caller?`: `Address` ; `contractAddress`: `Address` ; `gasLimit?`: `bigint`  }

Tevm action to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[vm/vm/src/actions/runContractCall.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L38)

___

### RunContractCallError

Ƭ **RunContractCallError**: `Error`

#### Defined in

[vm/vm/src/actions/runContractCall.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L48)

___

### RunContractCallResult

Ƭ **RunContractCallResult**\<`TAbi`, `TFunctionName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `DecodeFunctionResultReturnType`\<`TAbi`, `TFunctionName`\> |
| `gasUsed` | `BigInt` |
| `logs` | `Log`[] |

#### Defined in

[vm/vm/src/actions/runContractCall.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L50)

___

### RunScriptAction

Ƭ **RunScriptAction**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `caller?`: `Address` ; `deployedBytecode`: `Hex`  }

Tevm action to deploy and execute a script or contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[vm/vm/src/actions/runScript.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L30)

___

### RunScriptError

Ƭ **RunScriptError**: `Error`

#### Defined in

[vm/vm/src/actions/runScript.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L39)

___

### RunScriptResult

Ƭ **RunScriptResult**\<`TAbi`, `TFunctionName`\>: [`RunContractCallResult`](modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[vm/vm/src/actions/runScript.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L41)

## Variables

### CallActionValidator

• `Const` **CallActionValidator**: `ZodObject`\<\{ `caller`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `data`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `to`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `caller`: \`0x$\{string}\` ; `data`: \`0x$\{string}\` ; `gasLimit?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `to`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `caller`: `string` ; `data`: `string` ; `gasLimit?`: `bigint` ; `origin?`: `string` ; `to`: `string` ; `value?`: `bigint`  }\>

#### Defined in

[vm/vm/src/actions/runCall.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runCall.ts#L19)

___

### PutAccountActionValidator

• `Const` **PutAccountActionValidator**: `ZodObject`\<\{ `account`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `balance`: `ZodDefault`\<`ZodOptional`\<`ZodBigInt`\>\>  }, ``"strip"``, `ZodTypeAny`, \{ `account`: \`0x$\{string}\` ; `balance`: `bigint`  }, \{ `account`: `string` ; `balance?`: `bigint`  }\>

#### Defined in

[vm/vm/src/actions/putAccount.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putAccount.ts#L13)

___

### PutContractCodeActionValidator

• `Const` **PutContractCodeActionValidator**: `ZodObject`\<\{ `contractAddress`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `deployedBytecode`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>  }, ``"strip"``, `ZodTypeAny`, \{ `contractAddress`: \`0x$\{string}\` ; `deployedBytecode`: \`0x$\{string}\`  }, \{ `contractAddress`: `string` ; `deployedBytecode`: `string`  }\>

#### Defined in

[vm/vm/src/actions/putContractCode.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putContractCode.ts#L8)

___

### RunContractCallActionValidator

• `Const` **RunContractCallActionValidator**: `ZodObject`\<\{ `abi`: `ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodArray`\<`ZodIntersection`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, `ZodObject`\<\{ `indexed`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `indexed?`: `boolean`  }, \{ `indexed?`: `boolean`  }\>\>, ``"many"``\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: \{ `indexed?`: `boolean` ; `internalType?`: `string` ; `name?`: `string` ; `type`: `string`  }[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: \{ `indexed?`: `boolean` ; `internalType?`: `string` ; `name?`: `string` ; `type`: `string`  }[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"``  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"``  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `name`: `ZodString` ; `outputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: `AbiParameter`[] ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  }, `unknown`\>]\>, ``"many"``\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `contractAddress`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `functionName`: `ZodOptional`\<`ZodString`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: (\{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: \{ `indexed?`: `boolean` ; `internalType?`: `string` ; `name?`: `string` ; `type`: `string`  }[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  })[] ; `args?`: `any`[] ; `caller?`: \`0x$\{string}\` ; `contractAddress`: \`0x$\{string}\` ; `functionName?`: `string` ; `gasLimit?`: `bigint`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `caller?`: `string` ; `contractAddress`: `string` ; `functionName?`: `string` ; `gasLimit?`: `bigint`  }\>

#### Defined in

[vm/vm/src/actions/runContractCall.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L20)

___

### RunScriptActionValidator

• `Const` **RunScriptActionValidator**: `ZodObject`\<\{ `abi`: `ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodArray`\<`ZodIntersection`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, `ZodObject`\<\{ `indexed`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `indexed?`: `boolean`  }, \{ `indexed?`: `boolean`  }\>\>, ``"many"``\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: \{ `indexed?`: `boolean` ; `internalType?`: `string` ; `name?`: `string` ; `type`: `string`  }[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: \{ `indexed?`: `boolean` ; `internalType?`: `string` ; `name?`: `string` ; `type`: `string`  }[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"``  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"``  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `name`: `ZodString` ; `outputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: `AbiParameter`[] ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  }, `unknown`\>]\>, ``"many"``\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `deployedBytecode`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `functionName`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: (\{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: \{ `indexed?`: `boolean` ; `internalType?`: `string` ; `name?`: `string` ; `type`: `string`  }[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  })[] ; `args?`: `any`[] ; `caller?`: \`0x$\{string}\` ; `deployedBytecode`: \`0x$\{string}\` ; `functionName`: `string`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `caller?`: `string` ; `deployedBytecode`: `string` ; `functionName`: `string`  }\>

#### Defined in

[vm/vm/src/actions/runScript.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L14)
