import { describe, expect, test } from 'vitest'

import { OffchainLookupExample } from '~test/contracts/generated.js'
import { createCcipServer } from '~test/src/ccip.js'
import { accounts } from '~test/src/constants.js'
import {
  createHttpServer,
  deployOffchainLookupExample,
  publicClient,
} from '~test/src/utils.js'
import { getUrl } from '../errors/utils.js'
import type { Hex } from '../types/misc.js'

import { encodeErrorResult } from './abi/encodeErrorResult.js'
import { encodeFunctionData } from './abi/encodeFunctionData.js'
import { ccipFetch, offchainLookup, offchainLookupAbiItem } from './ccip.js'
import { trim } from './data/trim.js'

describe('offchainLookup', () => {
  test('default', async () => {
    const server = await createCcipServer()
    const { contractAddress } = await deployOffchainLookupExample({
      urls: [`${server.url}/{sender}/{data}`],
    })

    // biome-ignore lint/suspicious/noAsyncPromiseExecutor:
    const data = await new Promise<Hex>(async (resolve) => {
      try {
        const data = encodeFunctionData({
          abi: OffchainLookupExample.abi,
          functionName: 'getAddress',
          args: ['jxom.viem'],
        })
        await publicClient.request({
          method: 'eth_call',
          params: [{ data, to: contractAddress! }, 'latest'],
        })
      } catch (err) {
        resolve((err as any).cause.data)
      }
    })

    const result = await offchainLookup(publicClient, {
      data,
      to: contractAddress!,
    })

    expect(trim(result)).toEqual(accounts[0].address)
  })

  test('error: invalid signature', async () => {
    const server = await createCcipServer()
    const { contractAddress } = await deployOffchainLookupExample({
      urls: [`${server.url}/{sender}/{data}`],
    })

    // biome-ignore lint/suspicious/noAsyncPromiseExecutor:
    const data = await new Promise<Hex>(async (resolve) => {
      try {
        const data = encodeFunctionData({
          abi: OffchainLookupExample.abi,
          functionName: 'getAddress',
          args: ['fake.viem'],
        })
        await publicClient.request({
          method: 'eth_call',
          params: [{ data, to: contractAddress! }, 'latest'],
        })
      } catch (err) {
        resolve((err as any).cause.data)
      }
    })

    await expect(() =>
      offchainLookup(publicClient, {
        data,
        to: contractAddress!,
      }),
    ).rejects.toThrowError()
  })

  test('error: sender check', async () => {
    const server = await createCcipServer()
    const data = encodeErrorResult({
      abi: [offchainLookupAbiItem],
      errorName: 'OffchainLookup',
      args: [
        '0x0000000000000000000000000000000000000000',
        [getUrl(server.url)],
        '0xdeadbeef',
        '0xcafebabe',
        '0xdeadbeaf',
      ],
    })
    await expect(() =>
      offchainLookup(publicClient, {
        data,
        to: '0x0000000000000000000000000000000000000001',
      }),
    ).rejects.toMatchInlineSnapshot(`
      [OffchainLookupError: Reverted sender address does not match target contract address (\`to\`).

      Contract address: 0x0000000000000000000000000000000000000001
      OffchainLookup sender address: 0x0000000000000000000000000000000000000000

      Offchain Gateway Call:
        Gateway URL(s):
          http://localhost
        Sender: 0x0000000000000000000000000000000000000000
        Data: 0x556f1830000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000120cafebabe000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010687474703a2f2f6c6f63616c686f7374000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004deadbeef000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004deadbeaf00000000000000000000000000000000000000000000000000000000
        Callback selector: 0xcafebabe
        Extra data: 0xdeadbeaf

      Version: viem@1.0.2]
    `)
  })
})

describe('ccipFetch', async () => {
  test('default', async () => {
    let url
    const server = await createHttpServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      })
      url = req.url
      res.end(JSON.stringify({ data: '0xdeadbeef' }))
    })

    const result = await ccipFetch({
      data: '0xdeadbeef',
      sender: accounts[0].address,
      urls: [`${server.url}/{sender}/{data}`],
    })

    expect(result).toEqual('0xdeadbeef')
    expect(url).toEqual(
      '/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/0xdeadbeef',
    )

    await server.close()
  })

  test('result text', async () => {
    let url
    const server = await createHttpServer((req, res) => {
      url = req.url
      res.end('0xcafebabe')
    })

    const result = await ccipFetch({
      data: '0xdeadbeef',
      sender: accounts[0].address,
      urls: [`${server.url}/{sender}/{data}`],
    })

    expect(result).toEqual('0xcafebabe')
    expect(url).toEqual(
      '/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/0xdeadbeef',
    )

    await server.close()
  })

  test('post method', async () => {
    let body = ''
    const server = await createHttpServer((req, res) => {
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'application/json',
        })
        res.end(JSON.stringify({ data: '0xcafebabe' }))
      })
    })

    const result = await ccipFetch({
      data: '0xdeadbeef',
      sender: accounts[0].address,
      urls: [server.url],
    })

    expect(result).toEqual('0xcafebabe')
    expect(body).toEqual(
      '{"data":"0xdeadbeef","sender":"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"}',
    )

    await server.close()
  })

  test('multiple urls', async () => {
    let count = 0
    let url
    const server1 = await createHttpServer((_req, res) => {
      count++
      res.writeHead(500)
      res.end()
    })
    const server2 = await createHttpServer((_req, res) => {
      count++
      res.writeHead(408)
      res.end()
    })
    const server3 = await createHttpServer((req, res) => {
      count++
      res.writeHead(200, {
        'Content-Type': 'application/json',
      })
      url = req.url
      res.end(JSON.stringify({ data: '0xcafebabe' }))
    })

    const result = await ccipFetch({
      data: '0xdeadbeef',
      sender: accounts[0].address,
      urls: [
        `${server1.url}/{sender}/{data}`,
        `${server2.url}/{sender}/{data}`,
        `${server3.url}/{sender}/{data}`,
      ],
    })

    expect(count).toBe(3)
    expect(result).toEqual('0xcafebabe')
    expect(url).toEqual(
      '/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/0xdeadbeef',
    )

    await server1.close()
    await server2.close()
    await server3.close()
  })

  test('error: fetch error', async () => {
    const server = await createHttpServer((_req, res) => {
      res.end('what is this data?')
    })
    await expect(() =>
      ccipFetch({
        data: '0xdeadbeef',
        sender: accounts[0].address,
        urls: ['fakeurl'],
      }),
    ).rejects.toMatchInlineSnapshot(`
      [HttpRequestError: HTTP request failed.

      URL: http://localhost
      Request body: {"data":"0xdeadbeef","sender":"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"}

      Details: Failed to parse URL from fakeurl
      Version: viem@1.0.2]
    `)

    await server.close()
  })

  test('error: malformed gateway response', async () => {
    const server = await createHttpServer((_req, res) => {
      res.end('what is this data?')
    })
    await expect(() =>
      ccipFetch({
        data: '0xdeadbeef',
        sender: accounts[0].address,
        urls: [`${server.url}/{sender}/{data}`],
      }),
    ).rejects.toMatchInlineSnapshot(`
      [OffchainLookupResponseMalformedError: Offchain gateway response is malformed. Response data must be a hex value.

      Gateway URL: http://localhost
      Response: "what is this data?"

      Version: viem@1.0.2]
    `)

    await server.close()
  })

  test('error: http error', async () => {
    let count = 0
    const server1 = await createHttpServer((_req, res) => {
      count++
      res.writeHead(500)
      res.end()
    })
    const server2 = await createHttpServer((_req, res) => {
      count++
      res.writeHead(408)
      res.end()
    })
    const server3 = await createHttpServer((_req, res) => {
      count++
      res.writeHead(403)
      res.end()
    })

    await expect(() =>
      ccipFetch({
        data: '0xdeadbeef',
        sender: accounts[0].address,
        urls: [
          `${server1.url}/{sender}/{data}`,
          `${server2.url}/{sender}/{data}`,
          `${server3.url}/{sender}/{data}`,
        ],
      }),
    ).rejects.toMatchInlineSnapshot(`
      [HttpRequestError: HTTP request failed.

      Status: 403
      URL: http://localhost

      Details: Forbidden
      Version: viem@1.0.2]
    `)
    expect(count).toBe(3)

    await server1.close()
    await server2.close()
    await server3.close()
  })
})
