import { TestERC20 } from '@tevm/test-utils'
import { MOCKERC20_ABI, MOCKERC20_BYTECODE } from '../test/contractConstants.js'
import { contractHandler } from './contractHandler.js'
import { setAccountHandler } from './setAccountHandler.js'
import { createBaseClient } from '@tevm/base-client'
import type { ContractError } from '@tevm/errors'
import { describe, expect, it } from 'bun:test'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE =
  TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('contractHandler', () => {
  it('should execute a contract call', async () => {
    const client = createBaseClient()
    // deploy contract
    expect(
      (
        await setAccountHandler(client)({
          address: ERC20_ADDRESS,
          deployedBytecode: ERC20_BYTECODE,
        })
      ).errors,
    ).toBeUndefined()
    // test contract call
    expect(
      await contractHandler(client)({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [ERC20_ADDRESS],
        to: ERC20_ADDRESS,
        gas: 16784800n,
      }),
    ).toEqual({
      amountSpent: 169981n,
      executionGasUsed: 2851n,
      gas: 29975717n,
      totalGasSpent: 24283n,
      data: 0n,
      rawData:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      selfdestruct: new Set(),
      logs: [],
      createdAddresses: new Set(),
    })
  })

  it('should handle errors returned during contract call', async () => {
    const client = createBaseClient()
    // deploy contract
    expect(
      (
        await setAccountHandler(client)({
          address: ERC20_ADDRESS,
          deployedBytecode: ERC20_BYTECODE,
        })
      ).errors,
    ).toBeUndefined()
    // test contract call that should fail from lack of owning any tokens
    const caller = `0x${'23'.repeat(20)}` as const
    expect(
      await contractHandler(client)({
        abi: ERC20_ABI,
        functionName: 'transferFrom',
        args: [caller, caller, 1n],
        to: ERC20_ADDRESS,
        throwOnFail: false,
      }),
    ).toMatchSnapshot()
  })

  it('should handle a contract not existing', async () => {
    const client = createBaseClient()
    const caller = `0x${'23'.repeat(20)}` as const
    expect(
      await contractHandler(client)({
        abi: ERC20_ABI,
        functionName: 'transferFrom',
        args: [caller, caller, 1n],
        to: ERC20_ADDRESS,
        value: 420n,
        throwOnFail: false,
      }),
    ).toEqual({
      ...({} as { data: never }),
      errors: [
        {
          _tag: 'InvalidRequestError',
          message:
            'Contract at address 0x3333333333333333333333333333333333333333 does not exist',
          name: 'InvalidRequestError',
        },
      ],
      executionGasUsed: 0n,
      rawData: '0x',
    })
  })

  it('should handle the invalid contract params', async () => {
    const client = createBaseClient()
    // deploy contract
    expect(
      (
        await setAccountHandler(client)({
          address: ERC20_ADDRESS,
          deployedBytecode: ERC20_BYTECODE,
          throwOnFail: false,
        })
      ).errors,
    ).toBeUndefined()

    expect(
      await contractHandler(client)({
        throwOnFail: false,
      } as any),
    ).toEqual({
      ...({} as { data: never }),
      errors: [
        {
          _tag: 'InvalidAbiError',
          message: 'InvalidAbiError: Required',
          name: 'InvalidAbiError',
        },

        {
          _tag: 'InvalidFunctionNameError',
          ...{ input: 'undefined' },
          message: 'InvalidFunctionNameError: Required',
          name: 'InvalidFunctionNameError',
        },
        {
          _tag: 'InvalidAddressError',
          message: 'InvalidAddressError: Required',
          name: 'InvalidAddressError',
        },
      ],
      executionGasUsed: 0n,
      rawData: '0x',
    })
  })

  it('Handls function data not being encodable', async () => {
    const client = createBaseClient()
    // deploy contract
    expect(
      (
        await setAccountHandler(client)({
          address: ERC20_ADDRESS,
          deployedBytecode: ERC20_BYTECODE,
          throwOnFail: false,
        })
      ).errors,
    ).toBeUndefined()
    // test contract call
    expect(
      await contractHandler(client)({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: ['not correct type' as any],
        to: ERC20_ADDRESS,
        gas: 16784800n,
        throwOnFail: false,
      }),
    ).toMatchSnapshot()
  })
  it('should handle a rever with a helpful revert message', async () => {
    const caller = `0x${'1'.repeat(40)}` as const
    const recipient = `0x${'2'.repeat(40)}` as const
    const amount = BigInt(1e18)
    const token = `0x${'3'.repeat(40)}` as const
    const client = createBaseClient()

    const vm = await client.getVm()

    // Set the token contract
    await setAccountHandler({ getVm: async () => vm } as any)({
      address: token,
      deployedBytecode: MOCKERC20_BYTECODE,
    })

    // No matter if the transaction should succeed or fail, it will throw the same error:
    // `TypeError: Cannot read properties of undefined (reading 'join')`
    // at `@tevm/actions/src/tevm/contractHandler.js:37`
    const { errors } = await contractHandler(client)({
      caller,
      to: token,
      abi: MOCKERC20_ABI,
      // Replace this:
      functionName: 'transfer',
      // ...  with one of these and it should work:
      // functionName: 'mint',
      // functionName: 'approve',
      args: [recipient, amount],
      throwOnFail: false,
    })

    expect(errors).toHaveLength(1)
    const [error] = errors as [ContractError]
    expect(error._tag).toBe('revert')
    expect(error.name).toBe('revert')
    expect(error.message).toBe(
      'Revert: InsufficientBalance',
    )
  })
  it('should be able to debug a reverting call with a trace', async () => {
    const caller = `0x${'1'.repeat(40)}` as const
    const recipient = `0x${'2'.repeat(40)}` as const
    const amount = BigInt(1e18)
    const token = `0x${'3'.repeat(40)}` as const
    const client = createBaseClient()

    // Set the token contract
    await setAccountHandler(client)({
      address: token,
      deployedBytecode: MOCKERC20_BYTECODE,
    })

    const { errors, trace } = await contractHandler(client)({
      createTrace: true,
      from: caller,
      to: token,
      abi: MOCKERC20_ABI,
      // Replace this:
      functionName: 'transfer',
      // ...  with one of these and it should work:
      // functionName: 'mint',
      // functionName: 'approve',
      args: [recipient, amount],
      throwOnFail: false,
    })

    expect(errors).toHaveLength(1)
    const [error] = errors as [ContractError]
    expect(error._tag).toBe('revert')
    expect(error.name).toBe('revert')
    expect(error.message).toBe(
      'Revert: InsufficientBalance',
    )
    const { structLogs, ...restTrace } = trace ?? {}
    expect(structLogs).toMatchSnapshot()
    expect(restTrace).toEqual({
      failed: true,
      gas: 2563n,
      returnValue: '0xf4d678b8',
    })
  })
})
