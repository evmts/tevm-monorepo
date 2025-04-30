import { describe, it, expect, beforeAll } from 'vitest'
import { createTevmEvm, TevmEvm } from './index'

describe('TevmEvm E2E', () => {
  let evm: TevmEvm

  beforeAll(async () => {
    evm = createTevmEvm()
    await evm.init()
  })

  it('should initialize properly', () => {
    expect(evm).toBeInstanceOf(TevmEvm)
  })

  it('should set account balance', async () => {
    const sender = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const amount = '1000000000000000000' // 1 ETH
    
    // Set sender balance
    await expect(evm.setAccountBalance(sender, amount)).resolves.not.toThrow()
  })
  
  it('should handle EVM calls and report errors correctly', async () => {
    // Setup accounts
    const sender = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const recipient = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    const amount = '1000000000000000000' // 1 ETH

    // Execute a transfer (this will fail due to gas fees, but we're testing the error handling)
    const result = await evm.call({
      from: sender,
      to: recipient,
      gasLimit: '21000',
      value: amount,
      data: '0x'
    })

    // We expect this to fail because the sender needs funds for gas too
    expect(result.success).toBe(false)
    expect(result.error).toContain('Transaction failed')
  })

  it('should reset the EVM state', async () => {
    await expect(evm.reset()).resolves.not.toThrow()
  })
})