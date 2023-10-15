import { describe, expect, test } from 'vitest'
import {
  universalResolverResolveAbi,
  universalResolverReverseAbi,
} from '../../constants/abis.js'
import { BaseError } from '../../errors/base.js'
import { ContractFunctionRevertedError } from '../../errors/contract.js'
import { isNullUniversalResolverError } from './errors.js'

describe('isNullUniversalResolverError', () => {
  describe.each([
    {
      callType: 'resolve',
      expected: {
        resolverNotFound: true,
        resolverWildcardNotSupported: true,
        resolverWildcardMessage: true,
        panicReason50: false,
      },
    },
    {
      callType: 'reverse',
      expected: {
        resolverNotFound: true,
        resolverWildcardNotSupported: true,
        resolverWildcardMessage: true,
        panicReason50: true,
      },
    },
  ] as const)('$callType', ({ callType, expected }) => {
    test('resolver not found error', () => {
      expect(
        isNullUniversalResolverError(
          new ContractFunctionRevertedError({
            abi:
              callType === 'resolve'
                ? universalResolverResolveAbi
                : universalResolverReverseAbi,
            // ResolverNotFound()
            data: '0x7199966d',
            functionName: callType,
          }),
          callType,
        ),
      ).toBe(expected.resolverNotFound)
    })

    test('resolver wildcard not supported error', () => {
      expect(
        isNullUniversalResolverError(
          new ContractFunctionRevertedError({
            abi:
              callType === 'resolve'
                ? universalResolverResolveAbi
                : universalResolverReverseAbi,
            // ResolverWildcardNotSupported()
            data: '0x82c2c728',
            functionName: callType,
          }),
          callType,
        ),
      ).toBe(expected.resolverWildcardNotSupported)
    })

    test('wildcard message error reason', () => {
      expect(
        isNullUniversalResolverError(
          new ContractFunctionRevertedError({
            abi:
              callType === 'resolve'
                ? universalResolverResolveAbi
                : universalResolverReverseAbi,
            // Error('UniversalResolver: Wildcard on non-extended resolvers is not supported')
            data: '0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000046556e6976657273616c5265736f6c7665723a2057696c6463617264206f6e206e6f6e2d657874656e646564207265736f6c76657273206973206e6f7420737570706f727465640000000000000000000000000000000000000000000000000000',
            functionName: callType,
          }),
          callType,
        ),
      ).toBe(expected.resolverWildcardMessage)
    })

    test('reverse call type and panic reason 50', () => {
      expect(
        isNullUniversalResolverError(
          new ContractFunctionRevertedError({
            abi:
              callType === 'resolve'
                ? universalResolverResolveAbi
                : universalResolverReverseAbi,
            // Panic(50)
            data: '0x4e487b710000000000000000000000000000000000000000000000000000000000000032',
            functionName: callType,
          }),
          callType,
        ),
      ).toBe(expected.panicReason50)
    })

    test('not base error', () => {
      expect(isNullUniversalResolverError(new Error(), callType)).toBe(false)
    })

    test('not contract reverted error', () => {
      expect(isNullUniversalResolverError(new BaseError(''), callType)).toBe(
        false,
      )
    })
    test('other contract revert reason', () => {
      expect(
        isNullUniversalResolverError(
          new ContractFunctionRevertedError({
            abi:
              callType === 'resolve'
                ? universalResolverResolveAbi
                : universalResolverReverseAbi,
            data: '0x',
            functionName: callType,
          }),
          callType,
        ),
      ).toBe(false)
    })
  })
})
