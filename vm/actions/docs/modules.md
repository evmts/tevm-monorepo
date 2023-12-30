[@tevm/actions](README.md) / Exports

# @tevm/actions

## Table of contents

### Classes

- [ContractDoesNotExistError](classes/ContractDoesNotExistError.md)

### Type Aliases

- [PutAccountAction](modules.md#putaccountaction)
- [PutAccountResponse](modules.md#putaccountresponse)
- [PutContractCodeAction](modules.md#putcontractcodeaction)
- [PutContractCodeResponse](modules.md#putcontractcoderesponse)
- [RunCallAction](modules.md#runcallaction)
- [RunCallResponse](modules.md#runcallresponse)
- [RunContractCallAction](modules.md#runcontractcallaction)
- [RunContractCallResponse](modules.md#runcontractcallresponse)
- [RunScriptAction](modules.md#runscriptaction)
- [RunScriptError](modules.md#runscripterror)
- [RunScriptResponse](modules.md#runscriptresponse)

### Variables

- [DEFAULT\_BALANCE](modules.md#default_balance)
- [DEFAULT\_CALLER](modules.md#default_caller)
- [DEFAULT\_GAS\_LIMIT](modules.md#default_gas_limit)
- [PutAccountActionValidator](modules.md#putaccountactionvalidator)
- [PutContractCodeActionValidator](modules.md#putcontractcodeactionvalidator)
- [RunCallActionValidator](modules.md#runcallactionvalidator)
- [RunContractCallActionValidator](modules.md#runcontractcallactionvalidator)
- [RunScriptActionValidator](modules.md#runscriptactionvalidator)

## Type Aliases

### PutAccountAction

Ƭ **PutAccountAction**: `Object`

Tevm action to put an account into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Address` |
| `balance?` | `bigint` |

#### Defined in

[vm/actions/src/actions/PutAccountAction.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/actions/PutAccountAction.ts#L6)

___

### PutAccountResponse

Ƭ **PutAccountResponse**: `Account`

Tevm response type for the PutAccount action

#### Defined in

vm/actions/src/responses/PutAccountResponse.ts:6

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

[vm/actions/src/actions/PutContractCodeAction.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/actions/PutContractCodeAction.ts#L6)

___

### PutContractCodeResponse

Ƭ **PutContractCodeResponse**: `Uint8Array`

#### Defined in

vm/actions/src/responses/PutContractCodeResponse.ts:1

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
| `to?` | `Address` |
| `value?` | `bigint` |

#### Defined in

[vm/actions/src/actions/RunCallAction.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/actions/RunCallAction.ts#L6)

___

### RunCallResponse

Ƭ **RunCallResponse**: `EVMResult`

#### Defined in

vm/actions/src/responses/RunCallResponse.ts:3

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

[vm/actions/src/actions/RunContractCallAction.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/actions/RunContractCallAction.ts#L7)

___

### RunContractCallResponse

Ƭ **RunContractCallResponse**\<`TAbi`, `TFunctionName`\>: `Object`

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

vm/actions/src/responses/RunContractCallResponse.ts:5

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

[vm/actions/src/actions/RunScriptAction.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/actions/RunScriptAction.ts#L7)

___

### RunScriptError

Ƭ **RunScriptError**: `Error`

#### Defined in

[vm/actions/src/errors/RunScriptError.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/errors/RunScriptError.ts#L1)

___

### RunScriptResponse

Ƭ **RunScriptResponse**\<`TAbi`, `TFunctionName`\>: [`RunContractCallResponse`](modules.md#runcontractcallresponse)\<`TAbi`, `TFunctionName`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

vm/actions/src/responses/RunScriptResponse.ts:4

## Variables

### DEFAULT\_BALANCE

• `Const` **DEFAULT\_BALANCE**: `bigint`

#### Defined in

[vm/actions/src/constants/DEFAULT_BALANCE.js:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/constants/DEFAULT_BALANCE.js#L3)

___

### DEFAULT\_CALLER

• `Const` **DEFAULT\_CALLER**: ``"0x0000000000000000000000000000000000000000"``

#### Defined in

[vm/actions/src/constants/DEFAULT_CALLER.js:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/constants/DEFAULT_CALLER.js#L1)

___

### DEFAULT\_GAS\_LIMIT

• `Const` **DEFAULT\_GAS\_LIMIT**: `bigint`

#### Defined in

[vm/actions/src/constants/DEFAULT_GAS_LIMIT.js:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/constants/DEFAULT_GAS_LIMIT.js#L1)

___

### PutAccountActionValidator

• `Const` **PutAccountActionValidator**: `ZodObject`\<\{ `account`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `balance`: `ZodDefault`\<`ZodOptional`\<`ZodBigInt`\>\>  }, ``"strip"``, `ZodTypeAny`, \{ `account`: \`0x$\{string}\` ; `balance`: `bigint`  }, \{ `account`: `string` ; `balance?`: `bigint`  }\>

#### Defined in

[vm/actions/src/validators/PutAccountActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/validators/PutAccountActionValidator.js#L5)

___

### PutContractCodeActionValidator

• `Const` **PutContractCodeActionValidator**: `ZodObject`\<\{ `contractAddress`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `deployedBytecode`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>  }, ``"strip"``, `ZodTypeAny`, \{ `contractAddress`: \`0x$\{string}\` ; `deployedBytecode`: \`0x$\{string}\`  }, \{ `contractAddress`: `string` ; `deployedBytecode`: `string`  }\>

#### Defined in

[vm/actions/src/validators/PutContractCodeActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/validators/PutContractCodeActionValidator.js#L5)

___

### RunCallActionValidator

• `Const` **RunCallActionValidator**: `ZodObject`\<\{ `caller`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `data`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `to`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `caller`: \`0x$\{string}\` ; `data`: \`0x$\{string}\` ; `gasLimit?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `to?`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `caller`: `string` ; `data`: `string` ; `gasLimit?`: `bigint` ; `origin?`: `string` ; `to?`: `string` ; `value?`: `bigint`  }\>

#### Defined in

[vm/actions/src/validators/RunCallActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/validators/RunCallActionValidator.js#L5)

___

### RunContractCallActionValidator

• `Const` **RunContractCallActionValidator**: `ZodObject`\<\{ `abi`: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `contractAddress`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `functionName`: `ZodOptional`\<`ZodString`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: readonly (\{ `inputs`: readonly AbiParameter[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: readonly AbiEventParameter[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  })[] ; `args?`: `any`[] ; `caller?`: \`0x$\{string}\` ; `contractAddress`: \`0x$\{string}\` ; `functionName?`: `string` ; `gasLimit?`: `bigint`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `caller?`: `string` ; `contractAddress`: `string` ; `functionName?`: `string` ; `gasLimit?`: `bigint`  }\>

#### Defined in

[vm/actions/src/validators/RunContractCallActionValidator.js:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/validators/RunContractCallActionValidator.js#L4)

___

### RunScriptActionValidator

• `Const` **RunScriptActionValidator**: `ZodObject`\<\{ `abi`: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `deployedBytecode`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `functionName`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: readonly (\{ `inputs`: readonly AbiParameter[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: readonly AbiEventParameter[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  })[] ; `args?`: `any`[] ; `caller?`: \`0x$\{string}\` ; `deployedBytecode`: \`0x$\{string}\` ; `functionName`: `string`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `caller?`: `string` ; `deployedBytecode`: `string` ; `functionName`: `string`  }\>

#### Defined in

[vm/actions/src/validators/RunScriptActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/validators/RunScriptActionValidator.js#L5)
