/**
 * TODO:  Heaps more test cases :D
 *        - Complex calldata types
 *        - Complex return types (tuple/structs)
 *        - Calls against blocks
 */
import { describe, expect, test } from 'vitest'

import { ErrorsExample } from '~test/contracts/generated.js'
import { baycContractConfig, wagmiContractConfig } from '~test/src/abis.js'
import { address, forkBlockNumber } from '~test/src/constants.js'
import { deployErrorExample, publicClient } from '~test/src/utils.js'

import { readContract } from './readContract.js'

describe('wagmi', () => {
  test('default', async () => {
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'balanceOf',
        args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'],
      }),
    ).toEqual(3n)
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'getApproved',
        args: [420n],
      }),
    ).toEqual('0x0000000000000000000000000000000000000000')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'isApprovedForAll',
        args: [
          '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
          '0x0000000000000000000000000000000000000000',
        ],
      }),
    ).toEqual(false)
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'name',
      }),
    ).toEqual('wagmi')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'ownerOf',
        args: [420n],
      }),
    ).toEqual('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'supportsInterface',
        args: ['0x1a452251'],
      }),
    ).toEqual(false)
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'symbol',
      }),
    ).toEqual('WAGMI')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'tokenURI',
        args: [420n],
      }),
    ).toMatchInlineSnapshot(
      '"data:application/json;base64,eyJuYW1lIjogIndhZ21pICM0MjAiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l4TURJMElpQm9aV2xuYUhROUlqRXdNalFpSUdacGJHdzlJbTV2Ym1VaVBqeHdZWFJvSUdacGJHdzlJbWh6YkNneE1UY3NJREV3TUNVc0lERXdKU2tpSUdROUlrMHdJREJvTVRBeU5IWXhNREkwU0RCNklpQXZQanhuSUdacGJHdzlJbWh6YkNneU9EZ3NJREV3TUNVc0lEa3dKU2tpUGp4d1lYUm9JR1E5SWswNU1ETWdORE0zTGpWak1DQTVMakV4TXkwM0xqTTRPQ0F4Tmk0MUxURTJMalVnTVRZdU5YTXRNVFl1TlMwM0xqTTROeTB4Tmk0MUxURTJMalVnTnk0ek9EZ3RNVFl1TlNBeE5pNDFMVEUyTGpVZ01UWXVOU0EzTGpNNE55QXhOaTQxSURFMkxqVjZUVFk1T0M0MU1qa2dOVFkyWXpZdU9USXhJREFnTVRJdU5UTXROUzQxT1RZZ01USXVOVE10TVRJdU5YWXROVEJqTUMwMkxqa3dOQ0ExTGpZd09TMHhNaTQxSURFeUxqVXlPUzB4TWk0MWFESTFMakExT1dNMkxqa3lJREFnTVRJdU5USTVJRFV1TlRrMklERXlMalV5T1NBeE1pNDFkalV3WXpBZ05pNDVNRFFnTlM0Mk1Ea2dNVEl1TlNBeE1pNDFNeUF4TWk0MWN6RXlMalV5T1MwMUxqVTVOaUF4TWk0MU1qa3RNVEl1TlhZdE5UQmpNQzAyTGprd05DQTFMall3T1MweE1pNDFJREV5TGpVekxURXlMalZvTWpVdU1EVTVZell1T1RJZ01DQXhNaTQxTWprZ05TNDFPVFlnTVRJdU5USTVJREV5TGpWMk5UQmpNQ0EyTGprd05DQTFMall3T1NBeE1pNDFJREV5TGpVeU9TQXhNaTQxYURNM0xqVTRPV00yTGpreUlEQWdNVEl1TlRJNUxUVXVOVGsySURFeUxqVXlPUzB4TWk0MWRpMDNOV013TFRZdU9UQTBMVFV1TmpBNUxURXlMalV0TVRJdU5USTVMVEV5TGpWekxURXlMalV6SURVdU5UazJMVEV5TGpVeklERXlMalYyTlRZdU1qVmhOaTR5TmpRZ05pNHlOalFnTUNBeElERXRNVEl1TlRJNUlEQldORGM0TGpWak1DMDJMamt3TkMwMUxqWXdPUzB4TWk0MUxURXlMalV6TFRFeUxqVklOams0TGpVeU9XTXROaTQ1TWlBd0xURXlMalV5T1NBMUxqVTVOaTB4TWk0MU1qa2dNVEl1TlhZM05XTXdJRFl1T1RBMElEVXVOakE1SURFeUxqVWdNVEl1TlRJNUlERXlMalY2SWlBdlBqeHdZWFJvSUdROUlrMHhOVGN1TmpVMUlEVTBNV010Tmk0NU16SWdNQzB4TWk0MU5USXROUzQxT1RZdE1USXVOVFV5TFRFeUxqVjJMVFV3WXpBdE5pNDVNRFF0TlM0Mk1Ua3RNVEl1TlMweE1pNDFOVEV0TVRJdU5WTXhNakFnTkRjeExqVTVOaUF4TWpBZ05EYzRMalYyTnpWak1DQTJMamt3TkNBMUxqWXlJREV5TGpVZ01USXVOVFV5SURFeUxqVm9NVFV3TGpZeVl6WXVPVE16SURBZ01USXVOVFV5TFRVdU5UazJJREV5TGpVMU1pMHhNaTQxZGkwMU1HTXdMVFl1T1RBMElEVXVOakU1TFRFeUxqVWdNVEl1TlRVeUxURXlMalZvTVRRMExqTTBOV016TGpRMk5TQXdJRFl1TWpjMklESXVOems0SURZdU1qYzJJRFl1TWpWekxUSXVPREV4SURZdU1qVXROaTR5TnpZZ05pNHlOVWd6TWpBdU9ESTRZeTAyTGprek15QXdMVEV5TGpVMU1pQTFMalU1TmkweE1pNDFOVElnTVRJdU5YWXpOeTQxWXpBZ05pNDVNRFFnTlM0Mk1Ua2dNVEl1TlNBeE1pNDFOVElnTVRJdU5XZ3hOVEF1TmpKak5pNDVNek1nTUNBeE1pNDFOVEl0TlM0MU9UWWdNVEl1TlRVeUxURXlMalYyTFRjMVl6QXROaTQ1TURRdE5TNDJNVGt0TVRJdU5TMHhNaTQxTlRJdE1USXVOVWd5T0RNdU1UY3lZeTAyTGprek1pQXdMVEV5TGpVMU1TQTFMalU1TmkweE1pNDFOVEVnTVRJdU5YWTFNR013SURZdU9UQTBMVFV1TmpFNUlERXlMalV0TVRJdU5UVXlJREV5TGpWb0xUSTFMakV3TTJNdE5pNDVNek1nTUMweE1pNDFOVEl0TlM0MU9UWXRNVEl1TlRVeUxURXlMalYyTFRVd1l6QXROaTQ1TURRdE5TNDJNaTB4TWk0MUxURXlMalUxTWkweE1pNDFjeTB4TWk0MU5USWdOUzQxT1RZdE1USXVOVFV5SURFeUxqVjJOVEJqTUNBMkxqa3dOQzAxTGpZeE9TQXhNaTQxTFRFeUxqVTFNU0F4TWk0MWFDMHlOUzR4TURSNmJUTXdNUzR5TkRJdE5pNHlOV013SURNdU5EVXlMVEl1T0RFeElEWXVNalV0Tmk0eU56WWdOaTR5TlVnek16a3VOalUxWXkwekxqUTJOU0F3TFRZdU1qYzJMVEl1TnprNExUWXVNamMyTFRZdU1qVnpNaTQ0TVRFdE5pNHlOU0EyTGpJM05pMDJMakkxYURFeE1pNDVOalpqTXk0ME5qVWdNQ0EyTGpJM05pQXlMamM1T0NBMkxqSTNOaUEyTGpJMWVrMDBPVGNnTlRVekxqZ3hPR013SURZdU9USTVJRFV1TmpJNElERXlMalUwTmlBeE1pNDFOekVnTVRJdU5UUTJhREV6TW1FMkxqSTRJRFl1TWpnZ01DQXdJREVnTmk0eU9EWWdOaTR5TnpJZ05pNHlPQ0EyTGpJNElEQWdNQ0F4TFRZdU1qZzJJRFl1TWpjemFDMHhNekpqTFRZdU9UUXpJREF0TVRJdU5UY3hJRFV1TmpFMkxURXlMalUzTVNBeE1pNDFORFpCTVRJdU5UWWdNVEl1TlRZZ01DQXdJREFnTlRBNUxqVTNNU0EyTURSb01UVXdMamcxT0dNMkxqazBNeUF3SURFeUxqVTNNUzAxTGpZeE5pQXhNaTQxTnpFdE1USXVOVFExZGkweE1USXVPVEZqTUMwMkxqa3lPQzAxTGpZeU9DMHhNaTQxTkRVdE1USXVOVGN4TFRFeUxqVTBOVWcxTURrdU5UY3hZeTAyTGprME15QXdMVEV5TGpVM01TQTFMall4TnkweE1pNDFOekVnTVRJdU5UUTFkamMxTGpJM00zcHRNemN1TnpFMExUWXlMamN5TjJNdE5pNDVORE1nTUMweE1pNDFOekVnTlM0Mk1UY3RNVEl1TlRjeElERXlMalUwTlhZeU5TNHdPVEZqTUNBMkxqa3lPU0ExTGpZeU9DQXhNaTQxTkRZZ01USXVOVGN4SURFeUxqVTBObWd4TURBdU5UY3lZell1T1RReklEQWdNVEl1TlRjeExUVXVOakUzSURFeUxqVTNNUzB4TWk0MU5EWjJMVEkxTGpBNU1XTXdMVFl1T1RJNExUVXVOakk0TFRFeUxqVTBOUzB4TWk0MU56RXRNVEl1TlRRMVNEVXpOQzQzTVRSNklpQm1hV3hzTFhKMWJHVTlJbVYyWlc1dlpHUWlJQzgrUEM5blBqd3ZjM1puUGc9PSJ9"',
    )
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        blockNumber: forkBlockNumber,
        functionName: 'totalSupply',
      }),
    ).toEqual(558n)
  })

  test('overloaded function', async () => {
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        abi: [
          {
            inputs: [{ type: 'uint256', name: 'x' }],
            name: 'balanceOf',
            outputs: [{ type: 'address', name: 'x' }],
            stateMutability: 'pure',
            type: 'function',
          },
          ...wagmiContractConfig.abi,
        ],
        functionName: 'balanceOf',
        args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'],
      }),
    ).toEqual(3n)
  })
})

describe('bayc', () => {
  test('revert', async () => {
    await expect(() =>
      readContract(publicClient, {
        ...baycContractConfig,
        functionName: 'tokenOfOwnerByIndex',
        args: [address.vitalik, 5n],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "The contract function \\"tokenOfOwnerByIndex\\" reverted with the following reason:
      EnumerableSet: index out of bounds

      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  tokenOfOwnerByIndex(address owner, uint256 index)
        args:                         (0xd8da6bf26964af9d7eed9e03e53415d37aa96045, 5)

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2"
    `)
  })

  test('revert', async () => {
    await expect(() =>
      readContract(publicClient, {
        ...baycContractConfig,
        functionName: 'ownerOf',
        args: [420213123123n],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "The contract function \\"ownerOf\\" reverted with the following reason:
      ERC721: owner query for nonexistent token

      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  ownerOf(uint256 tokenId)
        args:             (420213123123)

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2"
    `)
  })
})

describe('contract errors', () => {
  test('revert', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'revertRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "revertRead" reverted with the following reason:
      This is a revert message

      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  revertRead()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('assert', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'assertRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "assertRead" reverted with the following reason:
      An \`assert\` condition failed.

      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  assertRead()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('overflow', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'overflowRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "overflowRead" reverted with the following reason:
      Arithmic operation resulted in underflow or overflow.

      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  overflowRead()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('divide by zero', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'divideByZeroRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "divideByZeroRead" reverted with the following reason:
      Division or modulo by zero (e.g. \`5 / 0\` or \`23 % 0\`).

      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  divideByZeroRead()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('require', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'requireRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "requireRead" reverted.

      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  requireRead()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('custom error: simple', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'simpleCustomRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "simpleCustomRead" reverted.

      Error: SimpleError(string message)
                        (bugger)
       
      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  simpleCustomRead()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('custom error: simple (no args)', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'simpleCustomReadNoArgs',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "simpleCustomReadNoArgs" reverted.

      Error: SimpleErrorNoArgs()
       
      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  simpleCustomReadNoArgs()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('custom error: complex', async () => {
    const { contractAddress } = await deployErrorExample()

    await expect(() =>
      readContract(publicClient, {
        abi: ErrorsExample.abi,
        address: contractAddress!,
        functionName: 'complexCustomRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "complexCustomRead" reverted.

      Error: ComplexError((address sender, uint256 bar), string message, uint256 number)
                         ({"sender":"0x0000000000000000000000000000000000000000","bar":"69"}, bugger, 69)
       
      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  complexCustomRead()

      Docs: https://viem.sh/docs/contract/readContract.html
      Version: viem@1.0.2]
    `)
  })

  test('custom error does not exist on abi', async () => {
    const { contractAddress } = await deployErrorExample()

    const abi = ErrorsExample.abi.filter(
      (abiItem) => abiItem.name !== 'SimpleError',
    )

    await expect(() =>
      readContract(publicClient, {
        abi,
        address: contractAddress!,
        functionName: 'simpleCustomRead',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "simpleCustomRead" reverted with the following signature:
      0xf9006398

      Unable to decode signature "0xf9006398" as it was not found on the provided ABI.
      Make sure you are using the correct ABI and that the error exists on it.
      You can look up the decoded signature here: https://openchain.xyz/signatures?query=0xf9006398.
       
      Contract Call:
        address:   0x0000000000000000000000000000000000000000
        function:  simpleCustomRead()

      Docs: https://viem.sh/docs/contract/decodeErrorResult.html
      Version: viem@1.0.2]
    `)
  })
})

test('fake contract address', async () => {
  await expect(() =>
    readContract(publicClient, {
      abi: wagmiContractConfig.abi,
      address: '0x0000000000000000000000000000000000000069',
      functionName: 'totalSupply',
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    "The contract function \\"totalSupply\\" returned no data (\\"0x\\").

    This could be due to any of the following:
      - The contract does not have the function \\"totalSupply\\",
      - The parameters passed to the contract function may be invalid, or
      - The address is not a contract.
     
    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  totalSupply()

    Docs: https://viem.sh/docs/contract/readContract.html
    Version: viem@1.0.2"
  `)
})
