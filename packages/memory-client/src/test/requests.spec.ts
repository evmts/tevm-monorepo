import { describe, expect, it } from 'bun:test'
import type { ContractJsonRpcRequest, ScriptJsonRpcRequest } from '@tevm/procedures-types'
import { getAlchemyUrl } from '@tevm/test-utils'
import { EthjsAddress, numberToHex } from '@tevm/utils'
import { decodeFunctionResult, encodeFunctionData, hexToBigInt, hexToBytes, keccak256, toHex } from '@tevm/utils'
import { createMemoryClient } from '../createMemoryClient.js'
import { DaiContract } from './DaiContract.sol.js'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

const forkConfig = {
  url: getAlchemyUrl(),
  blockTag: 111791332n,
}

describe('Tevm.request', async () => {
  const tevm = createMemoryClient()

  it.skip('should execute a script request', async () => {
    const req = {
      params: [
        {
          data: encodeFunctionData(
            DaiContract.read.balanceOf(contractAddress, {
              contractAddress,
            }),
          ),
          deployedBytecode: DaiContract.deployedBytecode,
        },
      ],
      jsonrpc: '2.0',
      method: 'tevm_script',
      id: 1,
    } as const satisfies ScriptJsonRpcRequest
    const res = await tevm.request(req)
    expect(
      decodeFunctionResult({
        abi: DaiContract.abi,
        data: res.rawData,
        functionName: 'balanceOf',
      }) satisfies bigint,
    ).toBe(0n)
    expect(res.executionGasUsed).toBe(numberToHex(2447n))
    expect(res.logs).toEqual([])
  })

  it.skip('should throw an error if attempting a tevm_contractCall request', async () => {
    const tevm = createMemoryClient()
    const req = {
      params: [
        {
          data: encodeFunctionData(
            DaiContract.read.balanceOf(contractAddress, {
              contractAddress,
            }),
          ),
          to: contractAddress,
        },
      ],
      jsonrpc: '2.0',
      method: 'tevm_NotARequest' as any,
      id: 1,
    } as const satisfies ContractJsonRpcRequest
    const error = await tevm.request(req).catch((e) => e)
    expect(error.code).toMatchSnapshot()
    expect(error.message).toMatchSnapshot()
  })

  it(
    'should execute a contractCall request via using tevm_call',
    async () => {
      const tevm = createMemoryClient({
        loggingLevel: 'trace',
        fork: forkConfig,
      })
      const req = {
        params: [
          {
            data: encodeFunctionData(
              DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d', {
                contractAddress,
              }),
            ),
            to: contractAddress,
            blockTag: '0xf5a353db0403849f5d9fe0bb78df4920556fc5729111540a13303cb538f0fc10',
          },
        ],
        jsonrpc: '2.0',
        method: 'tevm_call',
        id: 1,
      } as const satisfies ContractJsonRpcRequest
      console.log('makng request')
      const res = await tevm.request(req)
      console.log('res returned', res.rawData)
      expect(
        decodeFunctionResult({
          data: res.rawData,
          abi: DaiContract.abi,
          functionName: 'balanceOf',
        }) satisfies bigint,
      ).toBe(1n)
      expect(hexToBigInt(res.executionGasUsed)).toBe(2447n)
      expect(res.logs).toEqual([])
    },
    { timeout: 60_000 },
  )

  it.skip('should execute a call request', async () => {
    const tevm = createMemoryClient()
    const balance = 0x11111111n
    const address1 = '0x1f420000000000000000000000000000000000ff'
    const address2 = '0x2f420000000000000000000000000000000000ff'
    await tevm.setAccount({
      address: address1,
      balance,
    })
    const transferAmount = 0x420n
    const res = await tevm.request({
      params: [
        {
          caller: address1,
          data: '0x0',
          to: address2,
          value: toHex(transferAmount),
          origin: address1,
          createTransaction: true,
        },
      ],
      jsonrpc: '2.0',
      method: 'tevm_call',
      id: 1,
    })
    expect(res.rawData).toEqual('0x')
    await tevm.mine()
    expect((await (await tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address2))))?.balance).toBe(
      transferAmount,
    )
    expect((await (await tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address1))))?.balance).toBe(
      286183069n,
    )
  })

  it.skip('Should execute a putAccount request', async () => {
    const tevm = createMemoryClient()
    const balance = 0x11111111n
    const res = await tevm.request({
      method: 'tevm_setAccount',
      params: [
        {
          address: '0xff420000000000000000000000000000000000ff',
          balance: toHex(balance),
          deployedBytecode: DaiContract.deployedBytecode,
        },
      ],
    })
    expect(res).not.toHaveProperty('error')
    const account = await (await tevm.getVm()).stateManager.getAccount(
      EthjsAddress.fromString('0xff420000000000000000000000000000000000ff'),
    )
    expect(account?.balance).toEqual(balance)
    expect(account?.codeHash).toEqual(hexToBytes(keccak256(DaiContract.deployedBytecode)))
  })
})
