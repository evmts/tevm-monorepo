import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { numberToHex, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { debugTraceCallJsonRpcProcedure } from './debugTraceCallProcedure.js'

// TODO this test kinda sucks because it isn't tracing anything but since the logic is mostly in callHandler which is tested it's fine for now

describe('debugTraceCallJsonRpcProcedure', () => {
	it('should trace a call and return the expected result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: createAddress('0x1234567890123456789012345678901234567890').toString(),
					data: '0x60806040',
					value: numberToHex(parseEther('1')),
					tracer: 'callTracer',
				},
			],
			id: 1,
		})

		expect(result).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "debug_traceCall",
        "result": {
          "failed": false,
          "gas": "0x0",
          "returnValue": "0x",
          "structLogs": [],
        },
      }
    `)
	})
})
