import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import * as Siwe from './Siwe.js'

describe('Siwe', () => {
  const validMessageParams = {
    domain: 'example.com',
    address: '0x0000000000000000000000000000000000000000',
    statement: 'Sign in with Ethereum',
    uri: 'https://example.com/login',
    version: '1',
    chainId: 1,
    nonce: '123456789',
    issuedAt: new Date().toISOString(),
  }

  it('should create a SIWE message', async () => {
    const program = Siwe.createMessage(validMessageParams)
    const message = await Effect.runPromise(program)

    expect(message).toBeDefined()
    expect(message.domain).toBe(validMessageParams.domain)
    expect(message.address).toBe(validMessageParams.address.toLowerCase())
    expect(message.statement).toBe(validMessageParams.statement)
    expect(message.uri).toBe(validMessageParams.uri)
    expect(message.version).toBe(validMessageParams.version)
    expect(message.chainId).toBe(validMessageParams.chainId)
    expect(message.nonce).toBe(validMessageParams.nonce)
  })

  it('should handle errors in createMessage', async () => {
    // Invalid domain format should throw an error
    const invalidParams = {
      ...validMessageParams,
      domain: '', // Empty domain
    }
    
    const program = Effect.either(Siwe.createMessage(invalidParams))
    const result = await Effect.runPromise(program)
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(Siwe.CreateMessageError)
      expect(result.left.name).toBe('CreateMessageError')
      expect(result.left._tag).toBe('CreateMessageError')
    }
  })

  it('should parse a SIWE message string', async () => {
    // First create a message to get a valid message string
    const createProgram = Siwe.createMessage(validMessageParams)
    const message = await Effect.runPromise(createProgram)
    const messageString = message.toMessage()
    
    // Then parse it
    const parseProgram = Siwe.parseMessage(messageString)
    const parsedMessage = await Effect.runPromise(parseProgram)
    
    expect(parsedMessage).toBeDefined()
    expect(parsedMessage.domain).toBe(validMessageParams.domain)
    expect(parsedMessage.address).toBe(validMessageParams.address.toLowerCase())
    expect(parsedMessage.statement).toBe(validMessageParams.statement)
    expect(parsedMessage.uri).toBe(validMessageParams.uri)
    expect(parsedMessage.version).toBe(validMessageParams.version)
    expect(parsedMessage.chainId).toBe(validMessageParams.chainId)
    expect(parsedMessage.nonce).toBe(validMessageParams.nonce)
  })

  it('should handle errors in parseMessage', async () => {
    // Invalid message format should throw an error
    const invalidMessage = 'This is not a valid SIWE message'
    
    const program = Effect.either(Siwe.parseMessage(invalidMessage))
    const result = await Effect.runPromise(program)
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(Siwe.ParseMessageError)
      expect(result.left.name).toBe('ParseMessageError')
      expect(result.left._tag).toBe('ParseMessageError')
    }
  })

  // Note: We can't fully test verifyMessage without a valid signature
  // but we can at least test the error path
  it('should handle errors in verifyMessage', async () => {
    // Create a message first
    const createProgram = Siwe.createMessage(validMessageParams)
    const message = await Effect.runPromise(createProgram)
    
    // Invalid signature format should throw an error
    const invalidParams = {
      message,
      signature: '0x', // Invalid signature
    }
    
    const program = Effect.either(Siwe.verifyMessage(invalidParams))
    const result = await Effect.runPromise(program)
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(Siwe.VerifyMessageError)
      expect(result.left.name).toBe('VerifyMessageError')
      expect(result.left._tag).toBe('VerifyMessageError')
    }
  })
})