[@tevm/zod](README.md) / Exports

# @tevm/zod

## Table of contents

### Variables

- [zAbi](modules.md#zabi)
- [zAccountParams](modules.md#zaccountparams)
- [zAddress](modules.md#zaddress)
- [zBaseCallParams](modules.md#zbasecallparams)
- [zBlock](modules.md#zblock)
- [zBytecode](modules.md#zbytecode)
- [zCallParams](modules.md#zcallparams)
- [zContractParams](modules.md#zcontractparams)
- [zHex](modules.md#zhex)
- [zJsonRpcRequest](modules.md#zjsonrpcrequest)
- [zScriptParams](modules.md#zscriptparams)
- [zStorageRoot](modules.md#zstorageroot)

### Functions

- [validateAccountParams](modules.md#validateaccountparams)
- [validateBaseCallParams](modules.md#validatebasecallparams)
- [validateCallParams](modules.md#validatecallparams)
- [validateContractParams](modules.md#validatecontractparams)
- [validateScriptParams](modules.md#validatescriptparams)

## Variables

### zAbi

• `Const` **zAbi**: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\>

Zod validator for a valid ABI

#### Defined in

[vm/zod/src/common/zAbi.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/common/zAbi.js#L6)

___

### zAccountParams

• `Const` **zAccountParams**: `ZodObject`\<\{ `address`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `balance`: `ZodOptional`\<`ZodBigInt`\> ; `deployedBytecode`: `ZodOptional`\<`ZodEffects`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, \`0x$\{string}\`, `string`\>\> ; `nonce`: `ZodOptional`\<`ZodBigInt`\> ; `storageRoot`: `ZodOptional`\<`ZodEffects`\<`ZodString`, `string`, `string`\>\>  }, ``"strict"``, `ZodTypeAny`, \{ `address`: \`0x$\{string}\` ; `balance?`: `bigint` ; `deployedBytecode?`: \`0x$\{string}\` ; `nonce?`: `bigint` ; `storageRoot?`: `string`  }, \{ `address`: `string` ; `balance?`: `bigint` ; `deployedBytecode?`: `string` ; `nonce?`: `bigint` ; `storageRoot?`: `string`  }\>

Zod validator for a valid account action

#### Defined in

[vm/zod/src/params/zAccountParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/params/zAccountParams.js#L7)

___

### zAddress

• `Const` **zAddress**: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>

Zod validator for a valid ethereum address

#### Defined in

[vm/zod/src/common/zAddress.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/common/zAddress.js#L6)

___

### zBaseCallParams

• `Const` **zBaseCallParams**: `ZodObject`\<\{ `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `block`: `ZodOptional`\<`ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `blobGasPrice`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `coinbase`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `difficulty`: `ZodOptional`\<`ZodBigInt`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `number`: `ZodOptional`\<`ZodBigInt`\> ; `timestamp`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strict"``, `ZodTypeAny`, \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase?`: \`0x$\{string}\` ; `difficulty?`: `bigint` ; `gasLimit?`: `bigint` ; `number?`: `bigint` ; `timestamp?`: `bigint`  }, \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase?`: `string` ; `difficulty?`: `bigint` ; `gasLimit?`: `bigint` ; `number?`: `bigint` ; `timestamp?`: `bigint`  }\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `blobVersionedHashes?`: \`0x$\{string}\`[] ; `block?`: \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase?`: \`0x$\{string}\` ; `difficulty?`: `bigint` ; `gasLimit?`: `bigint` ; `number?`: `bigint` ; `timestamp?`: `bigint`  } ; `caller?`: \`0x$\{string}\` ; `depth?`: `number` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `to?`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `blobVersionedHashes?`: `string`[] ; `block?`: \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase?`: `string` ; `difficulty?`: `bigint` ; `gasLimit?`: `bigint` ; `number?`: `bigint` ; `timestamp?`: `bigint`  } ; `caller?`: `string` ; `depth?`: `number` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `to?`: `string` ; `value?`: `bigint`  }\>

#### Defined in

[vm/zod/src/params/zBaseCallParams.js:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/params/zBaseCallParams.js#L4)

___

### zBlock

• `Const` **zBlock**: `ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodBigInt`\> ; `blobGasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `coinbase`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `difficulty`: `ZodBigInt` ; `gasLimit`: `ZodBigInt` ; `number`: `ZodBigInt` ; `timestamp`: `ZodBigInt`  }, ``"strict"``, `ZodTypeAny`, \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase`: \`0x$\{string}\` ; `difficulty`: `bigint` ; `gasLimit`: `bigint` ; `number`: `bigint` ; `timestamp`: `bigint`  }, \{ `baseFeePerGas?`: `bigint` ; `blobGasPrice?`: `bigint` ; `coinbase`: `string` ; `difficulty`: `bigint` ; `gasLimit`: `bigint` ; `number`: `bigint` ; `timestamp`: `bigint`  }\>

Zod validator for a block header specification within actions

#### Defined in

[vm/zod/src/common/zBlock.js:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/common/zBlock.js#L7)

___

### zBytecode

• `Const` **zBytecode**: `ZodEffects`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, \`0x$\{string}\`, `string`\>

Zod validator for valid Ethereum bytecode

#### Defined in

[vm/zod/src/common/zBytecode.js:18](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/common/zBytecode.js#L18)

___

### zCallParams

• `Const` **zCallParams**: `ZodObject`\<\{ `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `block`: `ZodOptional`\<`ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `blobGasPrice`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `coinbase`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `difficulty`: `ZodOptional`\<`ZodBigInt`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `number`: `ZodOptional`\<`ZodBigInt`\> ; `timestamp`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strict"``, `ZodTypeAny`, \{ number?: bigint \| undefined; coinbase?: \`0x$\{string}\` \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; }, \{ number?: bigint \| undefined; coinbase?: string \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; }\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `data`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `deployedBytecode`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `salt`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `blobVersionedHashes?`: \`0x$\{string}\`[] ; `block?`: \{ number?: bigint \| undefined; coinbase?: \`0x$\{string}\` \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; } ; `caller?`: \`0x$\{string}\` ; `data?`: \`0x$\{string}\` ; `deployedBytecode?`: \`0x$\{string}\` ; `depth?`: `number` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `salt?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `to?`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `blobVersionedHashes?`: `string`[] ; `block?`: \{ number?: bigint \| undefined; coinbase?: string \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; } ; `caller?`: `string` ; `data?`: `string` ; `deployedBytecode?`: `string` ; `depth?`: `number` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `salt?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `to?`: `string` ; `value?`: `bigint`  }\>

Zod validator for a valid call action

#### Defined in

[vm/zod/src/params/zCallParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/params/zCallParams.js#L7)

___

### zContractParams

• `Const` **zContractParams**: `ZodObject`\<\{ `abi`: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `block`: `ZodOptional`\<`ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `blobGasPrice`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `coinbase`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `difficulty`: `ZodOptional`\<`ZodBigInt`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `number`: `ZodOptional`\<`ZodBigInt`\> ; `timestamp`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strict"``, `ZodTypeAny`, \{ number?: bigint \| undefined; coinbase?: \`0x$\{string}\` \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; }, \{ number?: bigint \| undefined; coinbase?: string \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; }\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `functionName`: `ZodString` ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: readonly (\{ `inputs`: readonly AbiParameter[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: readonly AbiEventParameter[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  })[] ; `args?`: `any`[] ; `blobVersionedHashes?`: \`0x$\{string}\`[] ; `block?`: \{ number?: bigint \| undefined; coinbase?: \`0x$\{string}\` \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; } ; `caller?`: \`0x$\{string}\` ; `depth?`: `number` ; `functionName`: `string` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `to`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `blobVersionedHashes?`: `string`[] ; `block?`: \{ number?: bigint \| undefined; coinbase?: string \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; } ; `caller?`: `string` ; `depth?`: `number` ; `functionName`: `string` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `to`: `string` ; `value?`: `bigint`  }\>

Zod validator for a valid contract action

#### Defined in

[vm/zod/src/params/zContractParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/params/zContractParams.js#L8)

___

### zHex

• `Const` **zHex**: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>

Zod validator for a valid hex string

#### Defined in

[vm/zod/src/common/zHex.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/common/zHex.js#L8)

___

### zJsonRpcRequest

• `Const` **zJsonRpcRequest**: `ZodObject`\<\{ `id`: `ZodOptional`\<`ZodUnion`\<[`ZodString`, `ZodNumber`, `ZodNull`]\>\> ; `jsonrpc`: `ZodLiteral`\<``"2.0"``\> ; `method`: `ZodString` ; `params`: `ZodOptional`\<`ZodUnion`\<[`ZodRecord`\<`ZodString`, `ZodAny`\>, `ZodArray`\<`ZodAny`, ``"many"``\>]\>\>  }, ``"strict"``, `ZodTypeAny`, \{ `id?`: ``null`` \| `string` \| `number` ; `jsonrpc`: ``"2.0"`` ; `method`: `string` ; `params?`: `any`[] \| `Record`\<`string`, `any`\>  }, \{ `id?`: ``null`` \| `string` \| `number` ; `jsonrpc`: ``"2.0"`` ; `method`: `string` ; `params?`: `any`[] \| `Record`\<`string`, `any`\>  }\>

Zod validator for a valid JsonRpcRequest

#### Defined in

[vm/zod/src/common/zJsonRpcRequest.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/common/zJsonRpcRequest.js#L6)

___

### zScriptParams

• `Const` **zScriptParams**: `ZodObject`\<\{ `abi`: `ZodReadonly`\<`ZodArray`\<`ZodUnion`\<[`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"error"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `type`: ``"error"``  }\>, `ZodObject`\<\{ `anonymous`: `ZodOptional`\<`ZodBoolean`\> ; `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiEventParameter`, `ZodTypeDef`, `AbiEventParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `type`: `ZodLiteral`\<``"event"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `anonymous?`: `boolean` ; `inputs`: readonly `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }, \{ `anonymous?`: `boolean` ; `inputs`: `AbiEventParameter`[] ; `name`: `string` ; `type`: ``"event"``  }\>, `ZodEffects`\<`ZodIntersection`\<`ZodObject`\<\{ `constant`: `ZodOptional`\<`ZodBoolean`\> ; `gas`: `ZodOptional`\<`ZodNumber`\> ; `payable`: `ZodOptional`\<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean`  }\>, `ZodDiscriminatedUnion`\<``"type"``, [`ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `name`: `ZodString` ; `outputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"pure"``\>, `ZodLiteral`\<``"view"``\>, `ZodLiteral`\<``"nonpayable"``\>, `ZodLiteral`\<``"payable"``\>]\> ; `type`: `ZodLiteral`\<``"function"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `name`: `string` ; `outputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }, \{ `inputs`: `AbiParameter`[] ; `name`: `string` ; `outputs`: `AbiParameter`[] ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"``  }\>, `ZodObject`\<\{ `inputs`: `ZodReadonly`\<`ZodArray`\<`ZodType`\<`AbiParameter`, `ZodTypeDef`, `AbiParameter`\>, ``"many"``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"constructor"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs`: readonly `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }, \{ `inputs`: `AbiParameter`[] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"constructor"``  }\>, `ZodObject`\<\{ `inputs`: `ZodOptional`\<`ZodTuple`\<[], ``null``\>\> ; `stateMutability`: `ZodUnion`\<[`ZodLiteral`\<``"payable"``\>, `ZodLiteral`\<``"nonpayable"``\>]\> ; `type`: `ZodLiteral`\<``"fallback"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }, \{ `inputs?`: [] ; `stateMutability`: ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"fallback"``  }\>, `ZodObject`\<\{ `stateMutability`: `ZodLiteral`\<``"payable"``\> ; `type`: `ZodLiteral`\<``"receive"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }, \{ `stateMutability`: ``"payable"`` ; `type`: ``"receive"``  }\>]\>\>, \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  }, `unknown`\>]\>, ``"many"``\>\> ; `args`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `blobVersionedHashes`: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>, ``"many"``\>\> ; `block`: `ZodOptional`\<`ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `blobGasPrice`: `ZodOptional`\<`ZodOptional`\<`ZodBigInt`\>\> ; `coinbase`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `difficulty`: `ZodOptional`\<`ZodBigInt`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `number`: `ZodOptional`\<`ZodBigInt`\> ; `timestamp`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strict"``, `ZodTypeAny`, \{ number?: bigint \| undefined; coinbase?: \`0x$\{string}\` \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; }, \{ number?: bigint \| undefined; coinbase?: string \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; }\>\> ; `caller`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `deployedBytecode`: `ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\> ; `depth`: `ZodOptional`\<`ZodNumber`\> ; `functionName`: `ZodOptional`\<`ZodString`\> ; `gasLimit`: `ZodOptional`\<`ZodBigInt`\> ; `gasPrice`: `ZodOptional`\<`ZodBigInt`\> ; `gasRefund`: `ZodOptional`\<`ZodBigInt`\> ; `origin`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `selfdestruct`: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\>\> ; `skipBalance`: `ZodOptional`\<`ZodBoolean`\> ; `to`: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string}\`, `string`\>\> ; `value`: `ZodOptional`\<`ZodBigInt`\>  }, ``"strip"``, `ZodTypeAny`, \{ `abi`: readonly (\{ `inputs`: readonly AbiParameter[] ; `name`: `string` ; `type`: ``"error"``  } \| \{ `anonymous?`: `boolean` ; `inputs`: readonly AbiEventParameter[] ; `name`: `string` ; `type`: ``"event"``  } \| \{ `constant?`: `boolean` ; `gas?`: `number` ; `payable?`: `boolean` ; `stateMutability`: ``"pure"`` \| ``"view"`` \| ``"nonpayable"`` \| ``"payable"`` ; `type`: ``"function"`` \| ``"constructor"`` \| ``"fallback"`` \| ``"receive"``  })[] ; `args?`: `any`[] ; `blobVersionedHashes?`: \`0x$\{string}\`[] ; `block?`: \{ number?: bigint \| undefined; coinbase?: \`0x$\{string}\` \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; } ; `caller?`: \`0x$\{string}\` ; `deployedBytecode`: \`0x$\{string}\` ; `depth?`: `number` ; `functionName?`: `string` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: \`0x$\{string}\` ; `selfdestruct?`: `Set`\<\`0x$\{string}\`\> ; `skipBalance?`: `boolean` ; `to?`: \`0x$\{string}\` ; `value?`: `bigint`  }, \{ `abi`: `unknown`[] ; `args?`: `any`[] ; `blobVersionedHashes?`: `string`[] ; `block?`: \{ number?: bigint \| undefined; coinbase?: string \| undefined; timestamp?: bigint \| undefined; difficulty?: bigint \| undefined; gasLimit?: bigint \| undefined; baseFeePerGas?: bigint \| undefined; blobGasPrice?: bigint \| undefined; } ; `caller?`: `string` ; `deployedBytecode`: `string` ; `depth?`: `number` ; `functionName?`: `string` ; `gasLimit?`: `bigint` ; `gasPrice?`: `bigint` ; `gasRefund?`: `bigint` ; `origin?`: `string` ; `selfdestruct?`: `Set`\<`string`\> ; `skipBalance?`: `boolean` ; `to?`: `string` ; `value?`: `bigint`  }\>

Zod validator for a valid script action

#### Defined in

[vm/zod/src/params/zScriptParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/params/zScriptParams.js#L9)

___

### zStorageRoot

• `Const` **zStorageRoot**: `ZodEffects`\<`ZodString`, `string`, `string`\>

Zod validator for valid ethereum storage root

#### Defined in

[vm/zod/src/common/zStorageRoot.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/common/zStorageRoot.js#L8)

## Functions

### validateAccountParams

▸ **validateAccountParams**(`action`): `AccountError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `AccountParams` |

#### Returns

`AccountError`[]

#### Defined in

[vm/zod/src/validators/validateAccountParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/validators/validateAccountParams.js#L8)

___

### validateBaseCallParams

▸ **validateBaseCallParams**(`action`): `BaseCallError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `BaseCallParams` |

#### Returns

`BaseCallError`[]

#### Defined in

[vm/zod/src/validators/validateBaseCallParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/validators/validateBaseCallParams.js#L7)

___

### validateCallParams

▸ **validateCallParams**(`action`): `CallError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `CallParams` |

#### Returns

`CallError`[]

#### Defined in

[vm/zod/src/validators/validateCallParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/validators/validateCallParams.js#L8)

___

### validateContractParams

▸ **validateContractParams**(`action`): `ContractError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `ContractParams`\<`Abi`, `string`\> |

#### Returns

`ContractError`[]

#### Defined in

[vm/zod/src/validators/validateContractParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/validators/validateContractParams.js#L9)

___

### validateScriptParams

▸ **validateScriptParams**(`action`): `ScriptError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `ScriptParams`\<`Abi`, `string`\> |

#### Returns

`ScriptError`[]

#### Defined in

[vm/zod/src/validators/validateScriptParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/zod/src/validators/validateScriptParams.js#L8)
