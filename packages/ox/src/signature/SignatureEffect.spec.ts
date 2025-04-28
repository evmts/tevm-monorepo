import { Effect } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { SignatureEffectLive } from './SignatureEffect.js'

describe('SignatureEffect', () => {
	const validSignature = {
		r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
		s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
		yParity: 1,
	}

	const invalidSignature = {
		r: -1n,
		s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
		yParity: 1,
	}

	const serializedHex =
		'0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db801'
	const derHex =
		'0x304402206e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf02204a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8'

	describe('assertEffect', () => {
		it('should assert a valid signature', async () => {
			const program = SignatureEffectLive.assertEffect(validSignature)
			await expect(Effect.runPromise(program)).resolves.toBeUndefined()
		})

		it('should throw for invalid signature', async () => {
			const program = SignatureEffectLive.assertEffect(invalidSignature)
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})

	describe('fromHexEffect/toHexEffect', () => {
		it('should deserialize and serialize properly', async () => {
			const fromProgram = SignatureEffectLive.fromHexEffect(serializedHex)
			const signatureObj = await Effect.runPromise(fromProgram)

			expect(signatureObj.r).toBe(validSignature.r)
			expect(signatureObj.s).toBe(validSignature.s)
			expect(signatureObj.yParity).toBe(validSignature.yParity)

			const toProgram = SignatureEffectLive.toHexEffect(signatureObj)
			const hex = await Effect.runPromise(toProgram)

			expect(hex).toBe(serializedHex)
		})
	})

	describe('fromDerHexEffect/toDerHexEffect', () => {
		it('should convert to and from DER format', async () => {
			const fromProgram = SignatureEffectLive.fromDerHexEffect(derHex)
			const signatureObj = await Effect.runPromise(fromProgram)

			expect(signatureObj.r).toBe(validSignature.r)
			expect(signatureObj.s).toBe(validSignature.s)

			const toProgram = SignatureEffectLive.toDerHexEffect(signatureObj)
			const hex = await Effect.runPromise(toProgram)

			expect(hex).toBe(derHex)
		})
	})

	describe('toLegacyEffect/fromLegacyEffect', () => {
		it('should convert between standard and legacy formats', async () => {
			const toLegacyProgram = SignatureEffectLive.toLegacyEffect(validSignature)
			const legacy = await Effect.runPromise(toLegacyProgram)

			expect(legacy.r).toBe(validSignature.r)
			expect(legacy.s).toBe(validSignature.s)
			expect(legacy.v).toBe(28) // yParity 1 -> v 28

			const fromLegacyProgram = SignatureEffectLive.fromLegacyEffect(legacy)
			const standard = await Effect.runPromise(fromLegacyProgram)

			expect(standard.r).toBe(validSignature.r)
			expect(standard.s).toBe(validSignature.s)
			expect(standard.yParity).toBe(validSignature.yParity)
		})
	})

	describe('toRpcEffect/fromRpcEffect', () => {
		it('should convert between standard and RPC formats', async () => {
			const toRpcProgram = SignatureEffectLive.toRpcEffect(validSignature)
			const rpc = await Effect.runPromise(toRpcProgram)

			expect(rpc.r).toBe(Hex.fromNumber(validSignature.r, { size: 32 }))
			expect(rpc.s).toBe(Hex.fromNumber(validSignature.s, { size: 32 }))
			expect(rpc.yParity).toBe('0x1')

			const fromRpcProgram = SignatureEffectLive.fromRpcEffect(rpc)
			const standard = await Effect.runPromise(fromRpcProgram)

			expect(standard.r).toBe(validSignature.r)
			expect(standard.s).toBe(validSignature.s)
			expect(standard.yParity).toBe(validSignature.yParity)
		})
	})

	describe('validateEffect', () => {
		it('should validate signatures', async () => {
			const validProgram = SignatureEffectLive.validateEffect(validSignature)
			const validResult = await Effect.runPromise(validProgram)
			expect(validResult).toBe(true)

			const invalidProgram = SignatureEffectLive.validateEffect(invalidSignature)
			const invalidResult = await Effect.runPromise(invalidProgram)
			expect(invalidResult).toBe(false)
		})
	})

	describe('vToYParityEffect/yParityToVEffect', () => {
		it('should convert between v and yParity values', async () => {
			const vToYParityProgram = SignatureEffectLive.vToYParityEffect(28)
			const yParity = await Effect.runPromise(vToYParityProgram)
			expect(yParity).toBe(1)

			const yParityToVProgram = SignatureEffectLive.yParityToVEffect(1)
			const v = await Effect.runPromise(yParityToVProgram)
			expect(v).toBe(28)
		})
	})

	describe('toBytesEffect/fromBytesEffect', () => {
		it('should serialize and deserialize with bytes', async () => {
			const toBytesProgram = SignatureEffectLive.toBytesEffect(validSignature)
			const bytes = await Effect.runPromise(toBytesProgram)
			expect(bytes).toBeInstanceOf(Uint8Array)

			const fromBytesProgram = SignatureEffectLive.fromBytesEffect(bytes)
			const sig = await Effect.runPromise(fromBytesProgram)

			expect(sig.r).toBe(validSignature.r)
			expect(sig.s).toBe(validSignature.s)
			expect(sig.yParity).toBe(validSignature.yParity)
		})
	})

	describe('toTupleEffect/fromTupleEffect', () => {
		it('should convert to and from tuple format', async () => {
			const toTupleProgram = SignatureEffectLive.toTupleEffect(validSignature)
			const tuple = await Effect.runPromise(toTupleProgram)

			expect(tuple[0]).toBe('0x01') // yParity = 1
			expect(BigInt(tuple[1])).toBe(validSignature.r)
			expect(BigInt(tuple[2])).toBe(validSignature.s)

			const fromTupleProgram = SignatureEffectLive.fromTupleEffect(tuple)
			const sig = await Effect.runPromise(fromTupleProgram)

			expect(sig.r).toBe(validSignature.r)
			expect(sig.s).toBe(validSignature.s)
			expect(sig.yParity).toBe(validSignature.yParity)
		})
	})
})
