import { createMemoryClient } from '@tevm/memory-client'
import { EncodingSdk } from './Encoding.s.sol.js'

const memoryClient = createMemoryClient()

// Example encodeCrossDomainMessage
const _nonce = 0n
const _sender = `0x${'69'.repeat(20)}` as const
const _target = `0x${'42'.repeat(20)}` as const
const _value = 420n
const _gasLimit = 420n
const _data = `0x${'99'.repeat(32)}` as const

const { data } = await memoryClient.tevmScript(
	EncodingSdk.read.encodeCrossDomainMessage(_nonce, _sender, _target, _value, _gasLimit, _data),
)

console.log(data)
