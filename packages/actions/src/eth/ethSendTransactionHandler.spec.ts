import { describe, it, expect, beforeEach } from 'vitest'
import { createTevmNode } from '@tevm/node'
import { ethSendTransactionHandler } from './ethSendTransactionHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { createAddress } from '@tevm/address'
import { parseEther } from '@tevm/utils'
import { encodeFunctionData } from 'viem'
import { SimpleContract } from '@tevm/test-utils'
import { contractHandler } from '../Contract/contractHandler.js'

describe('ethSendTransactionHandler', () => {
  let client: ReturnType<typeof createTevmNode>
  let handler: ReturnType<typeof ethSendTransactionHandler>

  beforeEach(() => {
    client = createTevmNode()
    handler = ethSendTransactionHandler(client)
  })

  it('should send a simple transaction', async () => {
    const from = createAddress('0x1234')
    const to = createAddress('0x5678')
    const value = parseEther('1')

    await setAccountHandler(client)({
      address: from.toString(),
      balance: parseEther('10'),
    })

    const result = await handler({
      from: from.toString(),
      to: to.toString(),
      value,
    })

    expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/) // Transaction hash

    await mineHandler(client)()

    const toAccount = await getAccountHandler(client)({ address: to.toString() })
    expect(toAccount.balance).toBe(value)
  })

  it('should handle contract interaction', async () => {
    const from = createAddress('0x1234')
    const contractAddress = createAddress('0x5678')

    await setAccountHandler(client)({
      address: from.toString(),
      balance: parseEther('10'),
    })

    await setAccountHandler(client)({
      address: contractAddress.toString(),
      deployedBytecode: SimpleContract.deployedBytecode,
    })

    const data = encodeFunctionData({
      abi: SimpleContract.abi,
      functionName: 'set',
      args: [42n],
    })

    const result = await handler({
      from: from.toString(),
      to: contractAddress.toString(),
      data,
    })

    expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/) // Transaction hash

    await mineHandler(client)()

    // verify the contract state change
    const {data: changedData} = await contractHandler(client)({ to: contractAddress.toString(), abi: SimpleContract.abi, functionName: 'get' })

    expect(changedData).toBe(42n)
  })
})