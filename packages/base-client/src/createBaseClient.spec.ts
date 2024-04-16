import { createBaseClient } from './createBaseClient.js'
import { describe, it, expect } from 'bun:test'

describe('createBaseClient', () => {
  it('Creates a base client', async () => {
    const {
      mode,
      getVm,
      ready,
      extend,
      logger,
      getChain,
      forkUrl,
      getTxPool,
      getChainId,
      setChainId,
      miningConfig,
      getReceiptsManager,
    } = createBaseClient()
    expect(mode).toBe('normal')
    expect(await ready()).toBe(true)
    expect(await getVm().then(vm => vm.evm.runCall({}))).toMatchSnapshot()
    expect(extend).toBeFunction()
    expect(logger.warn).toBeFunction()
    expect(await getChain().then(chain => chain.putBlock)).toBeFunction()
    expect(forkUrl).toBeUndefined()
    expect(await getTxPool().then(pool => pool.pool)).toEqual(new Map())
    expect(await getChainId()).toBe(900)
    setChainId(420)
    expect(await getChainId()).toBe(420)
    expect(miningConfig).toBe({ type: 'manual' })
    expect(await getReceiptsManager().then(manager => manager.getReceipts)).toBeFunction()
  })

  it('Can be extended', async () => {
    const client = createBaseClient().extend(() => ({
      hello: 'world'
    }))
    expect(client.hello).toBe('world')
  })

  it('throws an error if both forkurl and proxyurl are set', () => {
    expect(() => createBaseClient({
      fork: {
        url: 'https://foo.bar'
      },
      proxy: {
        url: 'https://foo.bar'
      }
    })).toThrowError(
      'Unable to initialize BaseClient. Cannot use both fork and proxy options at the same time!',
    )
  })
})
