[@tevm/zod](README.md) / Exports

# @tevm/zod

## Table of contents

### Variables

- [zAbi](modules.md#zabi)
- [zAddress](modules.md#zaddress)
- [zBaseCallParams](modules.md#zbasecallparams)
- [zBlock](modules.md#zblock)
- [zBlockParam](modules.md#zblockparam)
- [zBytecode](modules.md#zbytecode)
- [zCallParams](modules.md#zcallparams)
- [zContractParams](modules.md#zcontractparams)
- [zGetAccountParams](modules.md#zgetaccountparams)
- [zHex](modules.md#zhex)
- [zJsonRpcRequest](modules.md#zjsonrpcrequest)
- [zNetworkConfig](modules.md#znetworkconfig)
- [zScriptParams](modules.md#zscriptparams)
- [zSetAccountParams](modules.md#zsetaccountparams)
- [zStorageRoot](modules.md#zstorageroot)
- [zStrictHex](modules.md#zstricthex)

### Functions

- [validateBaseCallParams](modules.md#validatebasecallparams)
- [validateCallParams](modules.md#validatecallparams)
- [validateContractParams](modules.md#validatecontractparams)
- [validateGetAccountParams](modules.md#validategetaccountparams)
- [validateLoadStateParams](modules.md#validateloadstateparams)
- [validateScriptParams](modules.md#validatescriptparams)
- [validateSetAccountParams](modules.md#validatesetaccountparams)

## Variables

### zAbi

• `Const` **zAbi**: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  } & \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  } \| \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  } \| \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  } \| \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\>

Zod validator for a valid ABI

#### Defined in

[packages/zod/src/common/zAbi.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zAbi.js#L6)

___

### zAddress

• `Const` **zAddress**: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>

Zod validator for a valid ethereum address

#### Defined in

[packages/zod/src/common/zAddress.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zAddress.js#L6)

___

### zBaseCallParams

• `Const` **zBaseCallParams**: `ZodObject`\<\{ `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `blockTag`: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<``"latest"``\>, `ZodLiteral`\<``"earliest"``\>, `ZodLiteral`\<``"pending"``\>, `ZodLiteral`\<``"safe"``\>, `ZodLiteral`\<``"finalized"``\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>]\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `createTransaction`: `ZodOptional`\<`ZodBoolean`\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `gas`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `blobVersionedHashes?`: \`0x$\{string}\`[] ; `blockTag?`: `bigint` \| \`0x$\{string}\` \| ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"`` ; `caller?`: \`0x$\{string}\` ; `createTransaction?`: `boolean` ; `depth?`: `number` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to?`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `blobVersionedHashes?`: `string`[] ; `blockTag?`: `string` \| `bigint` ; `caller?`: `string` ; `createTransaction?`: `boolean` ; `depth?`: `number` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to?`: `string` ; `value?`: `bigint`  }\>

#### Defined in

[packages/zod/src/params/zBaseCallParams.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zBaseCallParams.js#L6)

___

### zBlock

• `Const` **zBlock**: `ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodBigInt`\> ; `blobGasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `coinbase`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `difficulty`: `ZodBigInt` ; `gasLimit`: `ZodBigInt` ; `number`: `ZodBigInt` ; `timestamp`: `ZodBigInt`  }, ``"strict"``, `ZodTypeAny`, \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase`: \`0x$\{string}\` ; `difficulty`: `bigint` ; `gasLimit`: `bigint` ; `number`: `bigint` ; `timestamp`: `bigint`  }, \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase`: `string` ; `difficulty`: `bigint` ; `gasLimit`: `bigint` ; `number`: `bigint` ; `timestamp`: `bigint`  }\>

Zod validator for a block header specification within actions

#### Defined in

[packages/zod/src/common/zBlock.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zBlock.js#L7)

___

### zBlockParam

• `Const` **zBlockParam**: `ZodUnion`\<[`ZodLiteral`\<``"latest"``\>, `ZodLiteral`\<``"earliest"``\>, `ZodLiteral`\<``"pending"``\>, `ZodLiteral`\<``"safe"``\>, `ZodLiteral`\<``"finalized"``\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>]\>

#### Defined in

[packages/zod/src/params/zBlockParam.js:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zBlockParam.js#L4)

___

### zBytecode

• `Const` **zBytecode**: `ZodEffects`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, \`0x$\{string}\`, `string`\>

Zod validator for valid Ethereum bytecode

#### Defined in

[packages/zod/src/common/zBytecode.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zBytecode.js#L18)

___

### zCallParams

• `Const` **zCallParams**: `ZodObject`\<\{ `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `blockTag`: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<``"latest"``\>, `ZodLiteral`\<``"earliest"``\>, `ZodLiteral`\<``"pending"``\>, `ZodLiteral`\<``"safe"``\>, `ZodLiteral`\<``"finalized"``\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>]\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `createTransaction`: `ZodOptional`\<`ZodBoolean`\> ; `data`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `deployedBytecode`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `gas`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `salt`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `blobVersionedHashes?`: \`0x$\{string}\`[] ; `blockTag?`: `bigint` \| \`0x$\{string}\` \| ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"`` ; `caller?`: \`0x$\{string}\` ; `createTransaction?`: `boolean` ; `data?`: \`0x$\{string}\` ; `deployedBytecode?`: \`0x$\{string}\` ; `depth?`: `number` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `salt?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to?`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `blobVersionedHashes?`: `string`[] ; `blockTag?`: `string` \| `bigint` ; `caller?`: `string` ; `createTransaction?`: `boolean` ; `data?`: `string` ; `deployedBytecode?`: `string` ; `depth?`: `number` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `salt?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to?`: `string` ; `value?`: `bigint`  }\>

Zod validator for a valid call action

#### Defined in

[packages/zod/src/params/zCallParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zCallParams.js#L7)

___

### zContractParams

• `Const` **zContractParams**: `ZodObject`\<\{ `abi`: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  } & \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  } \| \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  } \| \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  } \| \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `blockTag`: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<``"latest"``\>, `ZodLiteral`\<``"earliest"``\>, `ZodLiteral`\<``"pending"``\>, `ZodLiteral`\<``"safe"``\>, `ZodLiteral`\<``"finalized"``\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>]\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `createTransaction`: `ZodOptional`\<`ZodBoolean`\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `functionName`: `ZodString` ; `gas`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: readonly (\{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ constant?: boolean \| undefined; gas?: number \| undefined; payable?: boolean \| undefined; } & (\{ type: "function"; name: string; inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; stateMutability: "pure" \| ... 2 more ... \| "payable"; } \| \{ ...; } \| \{ ...; } \| \{ ...; }))[] ; `args?`: `any`[] ; `blobVersionedHashes?`: \`0x$\{string}\`[] ; `blockTag?`: `bigint` \| \`0x$\{string}\` \| ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"`` ; `caller?`: \`0x$\{string}\` ; `createTransaction?`: `boolean` ; `depth?`: `number` ; `functionName`: `string` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `blobVersionedHashes?`: `string`[] ; `blockTag?`: `string` \| `bigint` ; `caller?`: `string` ; `createTransaction?`: `boolean` ; `depth?`: `number` ; `functionName`: `string` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to`: `string` ; `value?`: `bigint`  }\>

Zod validator for a valid contract action

#### Defined in

[packages/zod/src/params/zContractParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zContractParams.js#L8)

___

### zGetAccountParams

• `Const` **zGetAccountParams**: `ZodObject`\<\{ `address`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> = zAddress; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `address`: \`0x$\{string}\` = zAddress; `throwOnFail?`: `boolean`  }, \{ `address`: `string` = zAddress; `throwOnFail?`: `boolean`  }\>

Zod validator for a valid getAccount action

#### Defined in

[packages/zod/src/params/zGetAccountParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zGetAccountParams.js#L7)

___

### zHex

• `Const` **zHex**: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>

Zod validator for a valid hex string

#### Defined in

[packages/zod/src/common/zHex.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zHex.js#L8)

___

### zJsonRpcRequest

• `Const` **zJsonRpcRequest**: `ZodObject`\<\{ `id`: `ZodOptional`\<`ZodUnion`\<[`ZodString`, `ZodNumber`, `ZodNull`]\>\> ; `jsonrpc`: `ZodLiteral`\<``"2.0"``\> ; `method`: `ZodString` ; `params`: `ZodOptional`\<`ZodUnion`\<[`ZodRecord`\<`ZodString`, `ZodAny`\>, `ZodArray`\<`ZodAny`, ``"many"``\>]\>\>  }, ``"strict"``, `ZodTypeAny`, \{ `id?`: ``null`` \| `string` \| `number` ; `jsonrpc`: ``"2.0"`` ; `method`: `string` ; `params?`: `any`[] \| `Record`\<`string`, `any`\>  }, \{ `id?`: ``null`` \| `string` \| `number` ; `jsonrpc`: ``"2.0"`` ; `method`: `string` ; `params?`: `any`[] \| `Record`\<`string`, `any`\>  }\>

Zod validator for a valid JsonRpcRequest

#### Defined in

[packages/zod/src/common/zJsonRpcRequest.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zJsonRpcRequest.js#L6)

___

### zNetworkConfig

• `Const` **zNetworkConfig**: `ZodObject`\<\{ `blockTag`: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<``"latest"``\>, `ZodLiteral`\<``"earliest"``\>, `ZodLiteral`\<``"pending"``\>, `ZodLiteral`\<``"safe"``\>, `ZodLiteral`\<``"finalized"``\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>]\>\> ; `url`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `blockTag?`: `bigint` \| \`0x$\{string}\` \| ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"`` ; `url`: `string`  }, \{ `blockTag?`: `string` \| `bigint` ; `url`: `string`  }\>

#### Defined in

[packages/zod/src/common/zNetworkConfig.js:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zNetworkConfig.js#L4)

___

### zScriptParams

• `Const` **zScriptParams**: `ZodObject`\<\{ `abi`: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  } & \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  } \| \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  } \| \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  } \| \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `blockTag`: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<``"latest"``\>, `ZodLiteral`\<``"earliest"``\>, `ZodLiteral`\<``"pending"``\>, `ZodLiteral`\<``"safe"``\>, `ZodLiteral`\<``"finalized"``\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>]\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `createTransaction`: `ZodOptional`\<`ZodBoolean`\> ; `deployedBytecode`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `functionName`: `ZodString` ; `gas`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: readonly (\{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ constant?: boolean \| undefined; gas?: number \| undefined; payable?: boolean \| undefined; } & (\{ type: "function"; name: string; inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; stateMutability: "pure" \| ... 2 more ... \| "payable"; } \| \{ ...; } \| \{ ...; } \| \{ ...; }))[] ; `args?`: `any`[] ; `blobVersionedHashes?`: \`0x$\{string}\`[] ; `blockTag?`: `bigint` \| \`0x$\{string}\` \| ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"`` ; `caller?`: \`0x$\{string}\` ; `createTransaction?`: `boolean` ; `deployedBytecode`: \`0x$\{string}\` ; `depth?`: `number` ; `functionName`: `string` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to?`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `blobVersionedHashes?`: `string`[] ; `blockTag?`: `string` \| `bigint` ; `caller?`: `string` ; `createTransaction?`: `boolean` ; `deployedBytecode`: `string` ; `depth?`: `number` ; `functionName`: `string` ; `gas?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `throwOnFail?`: `boolean` ; `to?`: `string` ; `value?`: `bigint`  }\>

Zod validator for a valid script action

#### Defined in

[packages/zod/src/params/zScriptParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zScriptParams.js#L9)

___

### zSetAccountParams

• `Const` **zSetAccountParams**: `ZodObject`\<\{ `address`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `balance`: `ZodOptional`\<`ZodBigInt`\> ; `deployedBytecode`: `ZodOptional`\<`ZodEffects`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, \`0x$\{string}\`, `string`\>\> ; `nonce`: `ZodOptional`\<`ZodBigInt`\> ; `storageRoot`: `ZodOptional`\<`ZodEffects`\<`ZodString`, `string`, `string`\>\> ; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `address`: \`0x$\{string}\` ; `balance?`: `bigint` ; `deployedBytecode?`: \`0x$\{string}\` ; `nonce?`: `bigint` ; `storageRoot?`: `string` ; `throwOnFail?`: `boolean`  }, \{ `address`: `string` ; `balance?`: `bigint` ; `deployedBytecode?`: `string` ; `nonce?`: `bigint` ; `storageRoot?`: `string` ; `throwOnFail?`: `boolean`  }\>

Zod validator for a valid setAccount action

#### Defined in

[packages/zod/src/params/zSetAccountParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zSetAccountParams.js#L8)

___

### zStorageRoot

• `Const` **zStorageRoot**: `ZodEffects`\<`ZodString`, `string`, `string`\>

Zod validator for valid ethereum storage root

#### Defined in

[packages/zod/src/common/zStorageRoot.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zStorageRoot.js#L8)

___

### zStrictHex

• `Const` **zStrictHex**: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>

Hex strings returned by the Ethereum JSON-RPC API

#### Defined in

[packages/zod/src/common/zHex.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zHex.js#L29)

## Functions

### validateBaseCallParams

▸ **validateBaseCallParams**(`action`): `BaseCallError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `BaseCallParams`\<`boolean`\> |

#### Returns

`BaseCallError`[]

#### Defined in

[packages/zod/src/validators/validateBaseCallParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/validators/validateBaseCallParams.js#L7)

___

### validateCallParams

▸ **validateCallParams**(`action`): `CallError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `CallParams`\<`boolean`\> |

#### Returns

`CallError`[]

#### Defined in

[packages/zod/src/validators/validateCallParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/validators/validateCallParams.js#L8)

___

### validateContractParams

▸ **validateContractParams**(`action`): `ContractError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `ContractParams`\<`Abi`, `string`, `boolean`\> |

#### Returns

`ContractError`[]

#### Defined in

[packages/zod/src/validators/validateContractParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/validators/validateContractParams.js#L9)

___

### validateGetAccountParams

▸ **validateGetAccountParams**(`action`): `GetAccountError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `GetAccountParams`\<`boolean`\> |

#### Returns

`GetAccountError`[]

#### Defined in

[packages/zod/src/validators/validateGetAccountParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/validators/validateGetAccountParams.js#L8)

___

### validateLoadStateParams

▸ **validateLoadStateParams**(`action`): `LoadStateError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `LoadStateParams`\<`boolean`\> |

#### Returns

`LoadStateError`[]

#### Defined in

[packages/zod/src/validators/validateLoadStateParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/validators/validateLoadStateParams.js#L7)

___

### validateScriptParams

▸ **validateScriptParams**(`action`): `ScriptError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `ScriptParams`\<`Abi`, `string`, `boolean`\> |

#### Returns

`ScriptError`[]

#### Defined in

[packages/zod/src/validators/validateScriptParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/validators/validateScriptParams.js#L8)

___

### validateSetAccountParams

▸ **validateSetAccountParams**(`action`): `SetAccountError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `SetAccountParams`\<`boolean`\> |

#### Returns

`SetAccountError`[]

#### Defined in

[packages/zod/src/validators/validateSetAccountParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/validators/validateSetAccountParams.js#L8)
