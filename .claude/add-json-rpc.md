# Creating a New JSON-RPC Method for Tevm

## Important First Step

Before starting any implementation, always ask the user for:

1. **Complete JSON-RPC specification** - Get detailed information about:
   - Method name (e.g., `tevm_yourMethod`, `anvil_yourMethod`, `debug_yourMethod`)
   - Expected parameters and their types
   - Expected return values and their types
   - Error cases to handle
   - Any standards this method should comply with

2. **Viem documentation** - If the method will be exposed via Viem, ask for:
   - Copy/paste of any existing Viem docs for the method
   - Expected TypeScript interfaces for parameters and return values
   - How the method should integrate with the rest of the Viem API

Understanding these details completely before starting development will save time and ensure the implementation meets expectations.

---

This guide outlines the step-by-step process to create a new JSON-RPC method for Tevm. Follow these steps to implement a complete JSON-RPC endpoint with proper typing, validation, and error handling.

## Example: Understanding `tevm_call`

Let's use `tevm_call` as a reference implementation to understand how RPC methods are structured in Tevm:

### File Structure for `tevm_call`

```
packages/actions/src/Call/
├── callHandler.js            # Core implementation 
├── CallHandlerType.ts        # Type definition for the handler
├── CallParams.ts             # Type for parameters
├── CallResult.ts             # Type for results
├── TevmCallError.ts          # Type for errors
├── callProcedure.js          # JSON-RPC procedure adapter
├── CallJsonRpcProcedure.ts   # Type for JSON-RPC procedure
├── CallJsonRpcRequest.ts     # Type for JSON-RPC request
├── CallJsonRpcResponse.ts    # Type for JSON-RPC response
├── validateCallParams.js     # Parameter validation
├── zCallParams.js            # Zod schema for parameters
└── callHandler.spec.ts       # Tests
```

In the memory-client package:
```
packages/memory-client/src/
├── tevmCall.js               # Client-side wrapper
└── tevmViemActions.js        # Registration with client
```

## Overview of Components

A complete JSON-RPC method in Tevm requires several components:

1. **Handler** - Core implementation function that takes a Tevm node and returns a function that implements the action
2. **Types** - TypeScript type definitions for parameters, results, and errors
3. **JSON-RPC Procedure** - Adapter that converts between JSON-RPC format and internal types
4. **Validation** - Zod schema for validating parameters
5. **Tests** - Comprehensive test suite
6. **Client integration** - Adding the method to the client API

## Step 1: Create Action Handler

Create a file for your handler in the appropriate namespace directory. Let's examine `callHandler.js` as a reference:

```typescript
// From packages/actions/src/Call/callHandler.js (simplified for clarity)

import { createAddress } from '@tevm/address'
import { numberToBytes } from 'viem'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { executeCall } from './executeCall.js'
import { validateCallParams } from './validateCallParams.js'

/**
 * Creates a tree-shakable instance of [`client.tevmCall`] action.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM base client instance.
 * @param {object} [options] - Optional parameters.
 * @param {boolean} [options.throwOnFail=true] - Whether to throw an error on failure.
 * @returns {import('./CallHandlerType.js').CallHandler} The call handler function.
 */
export const callHandler =
  (client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
  async ({ code, deployedBytecode, ...params }) => {
    client.logger.debug(params, 'callHandler: Executing call with params')
    
    // Step 1: Validate parameters
    const validationErrors = validateCallParams(params)
    if (validationErrors.length > 0) {
      client.logger.debug(validationErrors, 'Params do not pass validation')
      return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
        errors: validationErrors,
        executionGasUsed: 0n,
        rawData: '0x',
      })
    }
    
    // Step 2: Process the request options
    const callHandlerRes = await callHandlerOpts(client, params)
    if (callHandlerRes.errors) {
      return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
        errors: callHandlerRes.errors,
        executionGasUsed: 0n,
        rawData: '0x',
      })
    }

    // Step 3: Set up VM environment
    const evmInput = callHandlerRes.data
    const vm = await client.getVm()
    
    // Step 4: Execute the core functionality
    const executedCall = await executeCall(client, evmInput, params)
    if ('errors' in executedCall) {
      return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
        executionGasUsed: 0n,
        rawData: '0x',
        errors: executedCall.errors,
      })
    }

    // Step 5: Format and return the result
    return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
      ...callHandlerResult(executedCall.runTxResult, txResult.hash, executedCall.trace)
    })
  }
```

Now let's create a template for your new handler:

```typescript
// src/YourNamespace/yourMethodHandler.js

import { BaseError, InternalError } from '@tevm/errors'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateYourMethodParams } from './validateYourMethodParams.js'

/**
 * Creates a handler for your new action.
 *
 * @param {import("@tevm/node").TevmNode} client - The TEVM client instance.
 * @param {object} [options] - Optional settings.
 * @param {boolean} [options.throwOnFail=true] - Whether to throw an error if the action fails.
 * @returns {import('./YourMethodHandlerType.js').YourMethodHandler} - The handler function.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { yourMethodHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * const yourMethod = yourMethodHandler(client)
 *
 * const result = await yourMethod({ param1: 'value1', param2: 'value2' })
 * ```
 */
export const yourMethodHandler =
  (client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
  async (params) => {
    try {
      client.logger.debug(params, 'yourMethodHandler: executing with params')
      
      // Validate parameters
      const validationErrors = validateYourMethodParams(params)
      if (validationErrors.length > 0) {
        client.logger.debug(validationErrors, 'Params do not pass validation')
        return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
          errors: validationErrors,
          // Include default result values
          resultField1: '',
          resultField2: '',
        })
      }
      
      // Access the VM and other resources
      const vm = await client.getVm()
      
      // For example: Interact with the state manager
      const stateManager = vm.stateManager
      
      // Implement your core logic
      // ...
      
      // Return formatted results
      return {
        resultField1: 'result value 1',
        resultField2: 'result value 2',
      }
    } catch (e) {
      if (/** @type {BaseError}*/ (e)._tag) {
        return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
          resultField1: '',
          resultField2: '',
          errors: [/**@type {any} */ (e)],
        })
      }
      return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
        resultField1: '',
        resultField2: '',
        errors: [e instanceof InternalError ? e : new InternalError('Unexpected error', { cause: e })],
      })
    }
  }
```

## Step 2: Define Types

Let's look at how types are defined for `tevm_call` and then create types for your method.

### Example from `tevm_call`:

```typescript
// From packages/actions/src/Call/CallHandlerType.ts
import type { CallParams } from './CallParams.js'
import type { CallResult } from './CallResult.js'

/**
 * Executes a call against the VM, similar to `eth_call` but with more options.
 *
 * @param {CallParams} action - The parameters for the call.
 * @returns {Promise<CallResult>} The result of the call.
 * @throws {TevmCallError} If `throwOnFail` is true and action fails.
 */
export type CallHandler = (action: CallParams) => Promise<CallResult>
```

```typescript
// From packages/actions/src/Call/CallParams.ts
import type { BaseCallParams } from '../BaseCall/BaseCallParams.js'
import type { Hex } from '../common/index.js'

/**
 * TEVM parameters to execute a call on the VM.
 */
export type CallParams<TThrowOnFail extends boolean = boolean> = BaseCallParams<TThrowOnFail> & {
  /**
   * An optional CREATE2 salt.
   */
  readonly salt?: Hex
  /**
   * The input data for the call.
   */
  readonly data?: Hex
  /**
   * The encoded code to deploy with for a deployless call.
   */
  readonly code?: Hex
  /**
   * The deployed bytecode to put into state before the call.
   */
  readonly deployedBytecode?: Hex
}
```

```typescript
// From packages/actions/src/Call/CallResult.ts
import type { TevmCallError } from './TevmCallError.js'

/**
 * Result of executing a call.
 */
export type CallResult = {
  /**
   * The raw data returned from the call.
   */
  readonly rawData: `0x${string}`
  /**
   * The amount of gas used during execution.
   */
  readonly executionGasUsed: bigint
  // ... [other properties omitted for brevity]
  /**
   * Any errors that occurred during execution.
   */
  readonly errors?: Array<TevmCallError>
}
```

Now, let's create your types:

```typescript
// src/YourNamespace/YourMethodHandlerType.ts

import type { YourMethodParams } from './YourMethodParams.js'
import type { YourMethodResult } from './YourMethodResult.js'

/**
 * Handler for executing your method against the VM.
 *
 * @param {YourMethodParams} params - The parameters for the method.
 * @returns {Promise<YourMethodResult>} The result of the method execution.
 * @throws {YourMethodError} If `throwOnFail` is true and the method fails.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { yourMethodHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * const yourMethod = yourMethodHandler(client)
 *
 * const result = await yourMethod({
 *   param1: 'value1',
 *   param2: 'value2',
 * })
 * ```
 */
export type YourMethodHandler = (params: YourMethodParams) => Promise<YourMethodResult>
```

```typescript
// src/YourNamespace/YourMethodParams.ts

import type { BaseParams } from '../BaseParams/BaseParams.js'
import type { Hex } from '../common/index.js'

/**
 * Parameters for your method
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { createTevmTransport, tevmYourMethod } from 'tevm'
 * 
 * const client = createClient({
 *   transport: createTevmTransport({}),
 * })
 * 
 * const params = {
 *   param1: 'value1',
 *   param2: 'value2',
 * }
 * 
 * await tevmYourMethod(client, params)
 * ```
 */
export type YourMethodParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
  /**
   * Description of your parameter
   */
  readonly param1: string
  
  /**
   * Description of another parameter
   */
  readonly param2?: string

  /**
   * Optional address parameter (if needed)
   */
  readonly address?: Hex
}
```

```typescript
// src/YourNamespace/YourMethodResult.ts

import type { YourMethodError } from './YourMethodError.js'

/**
 * Result from executing your method
 */
export type YourMethodResult = {
  /**
   * Description of the result field
   */
  readonly resultField1: string
  
  /**
   * Description of another result field
   */
  readonly resultField2?: string
  
  /**
   * Any errors that occurred
   */
  readonly errors?: Array<YourMethodError>
}
```

```typescript
// src/YourNamespace/YourMethodError.ts

import type { BaseError, InternalError } from '@tevm/errors'
import type { ValidateYourMethodParamsError } from './validateYourMethodParams.js'

/**
 * All errors that can occur during your method.
 * This type is strongly typed if using `throwOnFail: false`.
 *
 * @example
 * ```typescript
 * import { YourMethodError } from 'tevm/errors'
 * import { createMemoryClient, tevmYourMethod } from 'tevm'
 *
 * const client = createMemoryClient()
 *
 * const result = await tevmYourMethod(client, {
 *   throwOnFail: false,
 *   param1: 'value1',
 * })
 *
 * const errors = result.errors
 * if (errors) {
 *   errors.forEach((error) => console.error(error))
 * }
 * ```
 */
export type YourMethodError = ValidateYourMethodParamsError | InternalError | BaseError
```

## Step 3: Create JSON-RPC Procedure

Let's look at how the JSON-RPC procedure is implemented for `tevm_call` and then create one for your method.

### Example from `tevm_call`:

```typescript
// From packages/actions/src/Call/callProcedure.js

import { hexToBigInt, numberToHex } from '@tevm/utils'
import { parseBlockTag } from '../utils/parseBlockTag.js'
import { callHandler } from './callHandler.js'

/**
 * Creates a Call JSON-RPC Procedure for handling call requests with Ethereumjs EVM
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./CallJsonRpcProcedure.js').CallJsonRpcProcedure}
 */
export const callProcedure = (client) => async (request) => {
  // Call the handler with mapped parameters
  const { errors = [], ...result } = await callHandler(client)({
    throwOnFail: false,
    // Complex parameter mapping from JSON-RPC format to internal format
    ...(request.params[0].data ? { data: request.params[0].data } : {}),
    ...(request.params[0].to ? { to: request.params[0].to } : {}),
    ...(request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {}),
    ...(request.params[0].from ? { from: request.params[0].from } : {}),
    // ... more parameter mapping
  })

  // Error handling
  if (errors.length > 0) {
    const error = /** @type {import('./TevmCallError.js').TevmCallError}*/ (errors[0])
    return {
      jsonrpc: '2.0',
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message),
        },
      },
      method: 'tevm_call',
      ...(request.id === undefined ? {} : { id: request.id }),
    }
  }

  // Format results for JSON-RPC response
  // Convert bigint values to hex strings
  const toHex = (value) => /**@type {import('@tevm/utils').Hex}*/ (numberToHex(value))
  
  return {
    jsonrpc: '2.0',
    result: {
      executionGasUsed: toHex(result.executionGasUsed),
      rawData: result.rawData,
      // Conditionally include other result fields
      ...(result.selfdestruct ? { selfdestruct: [...result.selfdestruct] } : {}),
      ...(result.gasRefund ? { gasRefund: toHex(result.gasRefund) } : {}),
      // ... more result fields
    },
    method: 'tevm_call',
    ...(request.id === undefined ? {} : { id: request.id }),
  }
}
```

Now, let's create your procedure:

```typescript
// src/YourNamespace/yourMethodProcedure.js

import { hexToBigInt, numberToHex } from '@tevm/utils'
import { yourMethodHandler } from './yourMethodHandler.js'

/**
 * Creates a YourMethod JSON-RPC Procedure for handling method requests
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./YourMethodJsonRpcProcedure.js').YourMethodJsonRpcProcedure}
 */
export const yourMethodProcedure = (client) => async (request) => {
  // Map the JSON-RPC parameters to your handler parameters
  const { errors = [], ...result } = await yourMethodHandler(client)({
    throwOnFail: false,
    // Map JSON-RPC parameters to internal parameter format
    param1: request.params[0],
    param2: request.params[1],
    // If using address parameters with bigint values
    ...(request.params[2] ? { address: request.params[2] } : {}),
  })

  // Handle errors
  if (errors.length > 0) {
    const error = /** @type {import('./YourMethodError.js').YourMethodError}*/ (errors[0])
    return {
      jsonrpc: '2.0',
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message),
        },
      },
      method: 'namespace_yourMethod',
      ...(request.id === undefined ? {} : { id: request.id }),
    }
  }

  // Convert any bigint values to hex strings for JSON response
  // Format the result object for JSON-RPC response
  return {
    jsonrpc: '2.0',
    result: {
      resultField1: result.resultField1,
      ...(result.resultField2 ? { resultField2: result.resultField2 } : {}),
      // If you have bigint fields that need conversion to hex:
      // resultField3: numberToHex(result.resultField3),
    },
    method: 'namespace_yourMethod',
    ...(request.id === undefined ? {} : { id: request.id }),
  }
}
```

Define the JSON-RPC types:

```typescript
// src/YourNamespace/YourMethodJsonRpcProcedure.ts

import type { YourMethodJsonRpcRequest } from './YourMethodJsonRpcRequest.js'
import type { YourMethodJsonRpcResponse } from './YourMethodJsonRpcResponse.js'

/**
 * YourMethod JSON-RPC procedure executes your method against the Tevm VM
 */
export type YourMethodJsonRpcProcedure = (request: YourMethodJsonRpcRequest) => Promise<YourMethodJsonRpcResponse>
```

```typescript
// src/YourNamespace/YourMethodJsonRpcRequest.ts

import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC request for `namespace_yourMethod`
 */
export type YourMethodJsonRpcRequest = JsonRpcRequest<
  'namespace_yourMethod',
  [
    param1: string,
    param2?: string,
    address?: `0x${string}`,
  ]
>
```

```typescript
// src/YourNamespace/YourMethodJsonRpcResponse.ts

import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { YourMethodResult } from './YourMethodResult.js'
import type { YourMethodError } from './YourMethodError.js'

/**
 * JSON-RPC response for `namespace_yourMethod` procedure
 */
export type YourMethodJsonRpcResponse = JsonRpcResponse<
  'namespace_yourMethod', 
  SerializeToJson<YourMethodResult>, 
  YourMethodError['code']
>
```

## Step 4: Add Validation

Let's examine how validation is implemented for `tevm_call` and then create validation for your method.

### Example from `tevm_call`:

```typescript
// From packages/actions/src/Call/zCallParams.js

import { zBaseCallParams } from '../BaseCall/zBaseCallParams.js'
import { zHex } from '../internal/zod/zHex.js'

/**
 * @internal
 * Zod validator for a valid call action
 */
export const zCallParams = zBaseCallParams
  .extend({
    data: zHex.optional().describe('the data to send'),
    salt: zHex.optional().describe('the salt to use for the call'),
    code: zHex.optional().describe('the encoded deployment code to use for the call'),
    deployedBytecode: zHex
      .optional()
      .describe('the deployed bytecode to put into state. Use code if you want to encode the deployment code'),
  })
  .refine(
    (params) => {
      if (params.code && params.deployedBytecode) {
        return false
      }
      return true
    },
    { message: 'Cannot have both code and deployedBytecode set' },
  )
  .refine(
    (params) => {
      if (params.createTransaction && params.stateOverrideSet) {
        return false
      }
      if (params.createTransaction && params.blockOverrideSet) {
        return false
      }
      return true
    },
    {
      message: 'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
    },
  )
  .describe('Params to make a call to the tevm EVM')
```

```typescript
// From packages/actions/src/Call/validateCallParams.js

import { InvalidBytecodeError, InvalidDataError, InvalidSaltError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { zCallParams } from './zCallParams.js'

/**
 * @internal
 * @typedef {InvalidSaltError| InvalidDataError| InvalidBytecodeError | import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateCallParamsError
 */

/**
 * @internal
 * @param {import('../Call/CallParams.js').CallParams} action
 */
export const validateCallParams = (action) => {
  /**
   * @type {Array<ValidateCallParamsError>}
   */
  const errors = validateBaseCallParams(action)

  const parsedParams = zCallParams.safeParse(action)

  if (parsedParams.success === false) {
    const formattedErrors = parsedParams.error.format()

    if (formattedErrors.salt) {
      formattedErrors.salt._errors.forEach((error) => {
        errors.push(new InvalidSaltError(error))
      })
    }
    if (formattedErrors.data) {
      formattedErrors.data._errors.forEach((error) => {
        errors.push(new InvalidDataError(error))
      })
    }
    if (formattedErrors.code) {
      formattedErrors.code._errors.forEach((error) => {
        errors.push(new InvalidBytecodeError(error))
      })
    }
    if (formattedErrors._errors) {
      formattedErrors._errors.forEach((error) => {
        errors.push(new InvalidBytecodeError(error))
      })
    }
  }

  return errors
}
```

Now, let's create validation for your method:

```typescript
// src/YourNamespace/zYourMethodParams.js

import { z } from 'zod'
import { zBaseParams } from '../BaseParams/zBaseParams.js'
import { zHex } from '../internal/zod/zHex.js'

/**
 * @internal
 * Zod validator for valid parameters for your method
 */
export const zYourMethodParams = zBaseParams
  .extend({
    param1: z.string()
      .min(1, { message: 'param1 must not be empty' })
      .describe('the first parameter for your method'),
    param2: z.string()
      .optional()
      .describe('the second parameter for your method'),
    address: zHex
      .optional()
      .describe('optional address parameter'),
  })
  // You can add refinements for more complex validation rules
  .refine(
    (params) => {
      // Example: custom validation rule
      if (params.param1 === 'invalid_value') {
        return false
      }
      return true
    },
    { message: 'param1 cannot be "invalid_value"' }
  )
  .describe('Parameters for your method')
```

Create a validation function:

```typescript
// src/YourNamespace/validateYourMethodParams.js

import { InvalidParamError, InvalidAddressError } from '@tevm/errors'
import { validateBaseParams } from '../BaseParams/validateBaseParams.js'
import { zYourMethodParams } from './zYourMethodParams.js'

/**
 * @internal
 * @typedef {InvalidParamError | InvalidAddressError | import('../BaseParams/validateBaseParams.js').ValidateBaseParamsError} ValidateYourMethodParamsError
 */

/**
 * @internal
 * @param {import('./YourMethodParams.js').YourMethodParams} params
 * @returns {Array<ValidateYourMethodParamsError>}
 */
export const validateYourMethodParams = (params) => {
  /**
   * @type {Array<ValidateYourMethodParamsError>}
   */
  const errors = validateBaseParams(params)

  const parsedParams = zYourMethodParams.safeParse(params)

  if (parsedParams.success === false) {
    const formattedErrors = parsedParams.error.format()

    if (formattedErrors.param1) {
      formattedErrors.param1._errors.forEach((error) => {
        errors.push(new InvalidParamError(`Invalid param1: ${error}`))
      })
    }
    
    if (formattedErrors.param2) {
      formattedErrors.param2._errors.forEach((error) => {
        errors.push(new InvalidParamError(`Invalid param2: ${error}`))
      })
    }
    
    if (formattedErrors.address) {
      formattedErrors.address._errors.forEach((error) => {
        errors.push(new InvalidAddressError(`Invalid address: ${error}`))
      })
    }
    
    if (formattedErrors._errors) {
      formattedErrors._errors.forEach((error) => {
        errors.push(new InvalidParamError(error))
      })
    }
  }

  return errors
}
```

## Step 5: Register the Procedure

Let's look at how procedures are registered in the `createHandlers.js` file, and then add your procedure.

### Example from `createHandlers.js`

```typescript
// From packages/actions/src/createHandlers.js

import { callProcedure } from './Call/callProcedure.js'
import { contractProcedure } from './Contract/contractProcedure.js'
import { deployProcedure } from './Deploy/deployProcedure.js'
import { dumpStateProcedure } from './DumpState/dumpStateProcedure.js'
// ... more imports

/**
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @returns {Record<string, (request: any) => Promise<any>>}
 */
export const createHandlers = (client) => {
  return {
    // tevm methods
    tevm_call: callProcedure(client),
    tevm_contract: contractProcedure(client),
    tevm_dumpState: dumpStateProcedure(client),
    
    // anvil methods
    anvil_setBalance: anvilSetBalanceJsonRpcProcedure(client),
    
    // debug methods
    debug_traceCall: debugTraceCallJsonRpcProcedure(client),
    
    // ... more handlers
  }
}
```

Now, add your procedure to the `createHandlers` function:

```typescript
// src/createHandlers.js

// Add to imports
import { yourMethodProcedure } from './YourNamespace/yourMethodProcedure.js'

/**
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @returns {Record<string, (request: any) => Promise<any>>}
 */
export const createHandlers = (client) => {
  return {
    // Existing handlers...
    
    // Your new handler - use the appropriate namespace prefix
    namespace_yourMethod: yourMethodProcedure(client),
    
    // Or if it's a tevm-specific method
    // tevm_yourMethod: yourMethodProcedure(client),
    
    // Or if it's an anvil-compatible method
    // anvil_yourMethod: yourMethodProcedure(client),
    
    // Or if it's a debug method
    // debug_yourMethod: yourMethodProcedure(client),
  }
}
```

## Step 6: Add to MemoryClient (if applicable)

Let's look at how client methods are added to the memory-client package, using `tevmCall` as an example.

### Example from memory-client

```typescript
// From packages/memory-client/src/tevmCall.js

import { callHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmCall` action for viem.
 * Executes a call against the VM. It is similar to `eth_call` but provides more options...
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { tevmCall } from 'tevm/actions'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * const res = await tevmCall(client, {
 *   to: '0x123...',
 *   data: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000,
 *   gasPrice: 1n,
 *   skipBalance: true,
 * })
 * ```
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').CallParams} params - Parameters for the call.
 * @returns {Promise<import('@tevm/actions').CallResult>} The result of the call.
 */
export const tevmCall = async (client, params) => {
  return callHandler(client.transport.tevm)(params)
}
```

```typescript
// From packages/memory-client/src/tevmViemActions.js

import { tevmCall } from './tevmCall.js'
import { tevmContract } from './tevmContract.js'
import { tevmDumpState } from './tevmDumpState.js'
// ... more imports

/**
 * All TEVM actions for use with viem clients.
 */
export const tevmViemActions = /*#__PURE__*/ {
  tevmCall,
  tevmContract,
  tevmDumpState,
  // ... more actions
}
```

```typescript
// From packages/memory-client/src/createMemoryClient.js

import { createClient } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmViemActions } from './tevmViemActions.js'

/**
 * Creates a viem Client with all TEVM functionality, including tree-shakeable methods.
 * This client has all the functionality of a vanilla viem client plus TEVM methods.
 *
 * @param {import('./CreateMemoryClientParams.js').CreateMemoryClientParams} [params] Configuration for the client.
 * @returns {import('./MemoryClient.js').MemoryClient} A client with Tevm and Viem capabilities.
 */
export const createMemoryClient = (params) => {
  return createClient({
    transport: createTevmTransport(params),
  }).extend(tevmViemActions)
}
```

Now, add your client method to the memory-client package:

```typescript
// packages/memory-client/src/tevmYourMethod.js

import { yourMethodHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmYourMethod` action for viem.
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { tevmYourMethod } from 'tevm/actions'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({}),
 *   chain: optimism,
 * })
 *
 * const result = await tevmYourMethod(client, {
 *   param1: 'value1',
 *   param2: 'value2',
 * })
 * ```
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client with TEVM transport.
 * @param {import('@tevm/actions').YourMethodParams} params - Parameters for your method.
 * @returns {Promise<import('@tevm/actions').YourMethodResult>} The result of your method.
 */
export const tevmYourMethod = async (client, params) => {
  return yourMethodHandler(client.transport.tevm)(params)
}
```

Then add it to the client actions in `packages/memory-client/src/tevmViemActions.js`:

```typescript
// packages/memory-client/src/tevmViemActions.js

// Add to imports
import { tevmYourMethod } from './tevmYourMethod.js'

/**
 * All TEVM actions for use with viem clients.
 */
export const tevmViemActions = /*#__PURE__*/ {
  // Existing actions...
  tevmCall,
  tevmContract,
  tevmDumpState,
  
  // Your new action
  tevmYourMethod,
}
```

## Step 7: Add Decorator Support (if needed)

Tevm uses decorators to extend client functionality. Let's look at how decorators work and add one for your method if needed.

### Understanding Tevm Decorators

Decorators in Tevm allow for extending the base client with additional methods. There are two main types:

1. **EIP-1193 Decorators** - Add JSON-RPC request capabilities
2. **Action Decorators** - Add high-level methods to the client

Here's how they work:

```typescript
// From packages/decorators/src/request/requestEip1193.js

/**
 * A decorator that adds the EIP-1193 request method to the client
 * @returns {import('@tevm/node').Extension<import('./Eip1193RequestProvider.js').Eip1193RequestProvider>}
 */
export const requestEip1193 = () => (client) => {
  return {
    request: async (args, options) => {
      // Implementation details...
    },
  }
}
```

```typescript
// From packages/decorators/src/actions/tevmActions.js (simplified)

/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'call'>>}
 */
const callAction = () => (client) => {
  return {
    call: callHandler(client),
  }
}

/**
 * @returns {import('@tevm/node').Extension<import('./TevmActionsApi.js').TevmActionsApi>}
 */
export const tevmActions = () => (client) => {
  return client
    .extend(loadStateAction())
    .extend(contractAction())
    .extend(callAction())
    // ... more actions
}
```

### Creating a Decorator for Your Method

Create a decorator for your method to allow it to be used as a direct client method:

```typescript
// packages/decorators/src/actions/yourMethodAction.js

import { yourMethodHandler } from '@tevm/actions'

/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'yourMethod'>>}
 */
export const yourMethodAction = () => (client) => {
  return {
    yourMethod: yourMethodHandler(client),
  }
}
```

### Update TevmActionsApi

Add your method to the `TevmActionsApi` type in `packages/decorators/src/actions/TevmActionsApi.ts`:

```typescript
// In packages/decorators/src/actions/TevmActionsApi.ts

import type { YourMethodHandler } from '@tevm/actions'

export type TevmActionsApi = {
  // Existing actions...
  
  /**
   * Description of your method's functionality
   * @example
   * const result = await tevm.yourMethod({
   *   param1: 'value1',
   *   param2: 'value2'
   * })
   */
  yourMethod: YourMethodHandler
}
```

### Update tevmActions

Add your action to the `tevmActions` function in `packages/decorators/src/actions/tevmActions.js`:

```typescript
// In tevmActions.js

import { yourMethodAction } from './yourMethodAction.js'

export const tevmActions = () => (client) => {
  return client
    // Existing action extensions...
    .extend(yourMethodAction())
}
```

### Export Your Action

Make sure to export your action in `packages/decorators/src/actions/index.js`:

```typescript
export { yourMethodAction } from './yourMethodAction.js'
```

## Step 8: Write Tests

Create thorough tests for your method:

```typescript
// src/YourNamespace/yourMethodHandler.spec.ts

import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { yourMethodHandler } from './yourMethodHandler.js'

describe('yourMethodHandler', () => {
  it('should execute your method successfully', async () => {
    const tevm = createTevmNode()
    
    const result = await yourMethodHandler(tevm)({
      param1: 'value1',
      param2: 'value2',
    })
    
    expect(result.resultField1).toBe('expected value')
    expect(result.resultField2).toBe('expected value')
  })
  
  it('should validate parameters', async () => {
    const tevm = createTevmNode()
    
    // Test with invalid params
    const result = await yourMethodHandler(tevm)({
      throwOnFail: false,
      param1: '', // Invalid - should be non-empty
    })
    
    expect(result.errors).toBeDefined()
    expect(result.errors?.length).toBeGreaterThan(0)
  })
  
  it('should handle errors appropriately', async () => {
    const tevm = createTevmNode()
    
    // Mock something to throw an error
    const vm = await tevm.getVm()
    const originalMethod = vm.someMethod
    vm.someMethod = () => {
      throw new Error('Test error')
    }
    
    // Test with error-causing scenario
    const result = await yourMethodHandler(tevm)({
      throwOnFail: false,
      param1: 'value1',
    })
    
    expect(result.errors).toBeDefined()
    expect(result.errors?.length).toBe(1)
    expect(result.errors?.[0].message).toContain('Test error')
    
    // Restore original method
    vm.someMethod = originalMethod
  })
})
```

Test the JSON-RPC procedure:

```typescript
// src/YourNamespace/yourMethodProcedure.spec.ts

import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { yourMethodProcedure } from './yourMethodProcedure.js'

describe('yourMethodProcedure', () => {
  it('should handle JSON-RPC requests correctly', async () => {
    const tevm = createTevmNode()
    const procedure = yourMethodProcedure(tevm)
    
    const response = await procedure({
      jsonrpc: '2.0',
      method: 'namespace_yourMethod',
      params: ['value1', 'value2'],
      id: 1,
    })
    
    expect(response.result).toBeDefined()
    expect(response.result?.resultField1).toBe('expected value')
    expect(response.result?.resultField2).toBe('expected value')
    expect(response.id).toBe(1)
    expect(response.jsonrpc).toBe('2.0')
    expect(response.method).toBe('namespace_yourMethod')
  })
  
  it('should handle JSON-RPC request errors correctly', async () => {
    const tevm = createTevmNode()
    const procedure = yourMethodProcedure(tevm)
    
    const response = await procedure({
      jsonrpc: '2.0',
      method: 'namespace_yourMethod',
      params: ['', 'value2'], // Invalid param1
      id: 1,
    })
    
    expect(response.error).toBeDefined()
    expect(response.error?.code).toBeDefined()
    expect(response.error?.message).toBeDefined()
    expect(response.error?.data?.errors).toBeInstanceOf(Array)
    expect(response.id).toBe(1)
    expect(response.jsonrpc).toBe('2.0')
    expect(response.method).toBe('namespace_yourMethod')
  })
})
```

## Reference Examples

When implementing your method, refer to these existing implementations:

1. **tevm_call**: A complex method with many parameters, state interaction, and error handling
2. **anvil_setBalance**: A simple method that maps to an internal action
3. **debug_traceCall**: A method that runs a debug trace on a call
4. **tevm_dumpState**: A method for accessing and serializing VM state

Remember to follow these principles:
- Always validate parameters thoroughly
- Handle errors gracefully with proper typing
- Use `maybeThrowOnFail` for consistent error handling
- For complex VM operations, use a clean VM clone to avoid state corruption
- Add comprehensive tests for happy path and error cases
- Document with clear JSDoc examples

Your JSON-RPC method should follow existing patterns in the codebase for consistency and maintainability.
