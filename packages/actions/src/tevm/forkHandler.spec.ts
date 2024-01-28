import type { ForkParams } from '@tevm/actions-types'
import { forkHandler } from './forkHandler.js'
import { describe, expect, it, jest } from 'bun:test'

describe('forkHandler', () => {
  it('should fork a network', async () => {
    const register = jest.fn()
    register.mockImplementationOnce(() => 100_000_000n)
    const params: ForkParams = {
      url: 'https://mainnet.infura.io/v3/1234567890',
      blockTag: 'earliest'
    }
    expect(await forkHandler({ register })(params))
      .toEqual({ forkId: 100_000_000n })
    expect(register).toHaveBeenCalledWith(params)
  })
})
