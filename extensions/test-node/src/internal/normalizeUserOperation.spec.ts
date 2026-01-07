import type { RpcUserOperation } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { normalizeUserOperation } from './normalizeUserOperation.js'

describe('normalizeUserOperation', () => {
	it('should return empty array for minimal user operation', () => {
		const userOp = {} as RpcUserOperation
		const result = normalizeUserOperation(userOp)
		expect(result).toEqual([])
	})

	it('should normalize required EIP-4337 fields', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			nonce: '0x1',
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0xsender123') // sender
		expect(result).toContain('0x1') // nonce
		expect(result).toContain('0xcalldata') // callData
		expect(result).toContain('0x100000') // callGasLimit
		expect(result).toContain('0x50000') // verificationGasLimit
		expect(result).toContain('0x5208') // preVerificationGas
		expect(result).toContain('0x3b9aca00') // maxFeePerGas
		expect(result).toContain('0x3b9aca00') // maxPriorityFeePerGas (appears twice, that's expected)
		expect(result).toContain('0xsignature') // signature
	})

	it('should normalize version 0.6 specific fields', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			nonce: '0x1',
			initCode: '0xINITCODE',
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			paymasterAndData: '0xPAYMASTERDATA',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0xinitcode') // initCode (v0.6)
		expect(result).toContain('0xpaymasterdata') // paymasterAndData (v0.6)
	})

	it('should normalize version 0.7+ specific fields', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			nonce: '0x1',
			factory: '0xFACTORY',
			factoryData: '0xFACTORYDATA',
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			paymaster: '0xPAYMASTER',
			paymasterData: '0xPAYMASTERDATA',
			paymasterVerificationGasLimit: '0x10000',
			paymasterPostOpGasLimit: '0x8000',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0xfactory') // factory (v0.7+)
		expect(result).toContain('0xfactorydata') // factoryData (v0.7+)
		expect(result).toContain('0xpaymaster') // paymaster (v0.7+)
		expect(result).toContain('0xpaymasterdata') // paymasterData (v0.7+)
		expect(result).toContain('0x10000') // paymasterVerificationGasLimit (v0.7+)
		expect(result).toContain('0x8000') // paymasterPostOpGasLimit (v0.7+)
	})

	it('should normalize authorization field (SignedAuthorization)', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			nonce: '0xNONCE',
			authorization: {
				chainId: '0x1',
				address: '0xAUTHADDRESS',
				nonce: '0x5',
				// TODO: upstream to viem, RpcUserOperation type is probably wrong because not serialized
				v: 27n,
				r: '0xRRRRRR',
				s: '0xSSSSS',
				yParity: '0x1',
			},
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0x1') // authorization.chainId
		expect(result).toContain('0xnonce') // nonce
		expect(result).toContain('0xauthaddress') // authorization.address
		expect(result).toContain('0x5') // authorization.nonce
		expect(result).toContain(27n) // authorization.v (number, not normalized)
		expect(result).toContain('0xrrrrrr') // authorization.r
		expect(result).toContain('0xsssss') // authorization.s
		expect(result).toContain('0x1') // authorization.yParity
	})

	it('should normalize eip7702Auth field (RpcAuthorization)', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			nonce: '0xNONCE',
			eip7702Auth: {
				chainId: '0x1',
				address: '0xEIP7702ADDRESS',
				nonce: '0x10',
				r: '0xRRR7702',
				s: '0xSSS7702',
				yParity: '0x0',
			},
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0x1') // eip7702Auth.chainId
		expect(result).toContain('0xnonce') // nonce
		expect(result).toContain('0xeip7702address') // eip7702Auth.address
		expect(result).toContain('0x10') // eip7702Auth.nonce
		expect(result).toContain('0xrrr7702') // eip7702Auth.r
		expect(result).toContain('0xsss7702') // eip7702Auth.s
		expect(result).toContain('0x0') // eip7702Auth.yParity
	})

	it('should handle partial authorization fields', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			// @ts-expect-error - missing fields
			authorization: {
				chainId: '0x1',
				address: '0xAUTHADDRESS',
				// Missing other fields
			},
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0x1') // authorization.chainId
		expect(result).toContain('0xauthaddress') // authorization.address
		// Should not contain undefined values
		expect(result).not.toContain('undefined')
		expect(result).not.toContain('null')
	})

	it('should handle partial eip7702Auth fields', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			// @ts-expect-error - missing fields
			eip7702Auth: {
				address: '0xEIP7702ADDRESS',
				yParity: '0x1',
				// Missing other fields
			},
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0xeip7702address') // eip7702Auth.address
		expect(result).toContain('0x1') // eip7702Auth.yParity
		// Should not contain undefined values
		expect(result).not.toContain('undefined')
		expect(result).not.toContain('null')
	})

	it('should handle mixed case hex values', () => {
		const userOp: RpcUserOperation = {
			sender: '0xAbCdEf123456',
			nonce: '0xDeAdBeEf',
			callData: '0xCAFEBABE',
			callGasLimit: '0xABCDEF',
			verificationGasLimit: '0x123ABC',
			preVerificationGas: '0xFEDCBA',
			maxFeePerGas: '0xABCDEF123456',
			maxPriorityFeePerGas: '0xFEDCBA987654',
			signature: '0xSIGNATUREabcdef',
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0xabcdef123456') // sender normalized
		expect(result).toContain('0xdeadbeef') // nonce normalized
		expect(result).toContain('0xcafebabe') // callData normalized
		expect(result).toContain('0xabcdef') // callGasLimit normalized
		expect(result).toContain('0x123abc') // verificationGasLimit normalized
		expect(result).toContain('0xfedcba') // preVerificationGas normalized
		expect(result).toContain('0xabcdef123456') // maxFeePerGas normalized
		expect(result).toContain('0xfedcba987654') // maxPriorityFeePerGas normalized
		expect(result).toContain('0xsignatureabcdef') // signature normalized
	})

	it('should handle both authorization and eip7702Auth simultaneously', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			// @ts-expect-error - missing fields
			authorization: {
				chainId: '0x1',
				address: '0xAUTHADDRESS',
				nonce: '0x5',
			},
			// @ts-expect-error - missing fields
			eip7702Auth: {
				chainId: '0x2',
				address: '0xEIP7702ADDRESS',
				nonce: '0x10',
			},
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			signature: '0xSIGNATURE',
		}

		const result = normalizeUserOperation(userOp)

		// Should contain values from both authorization types
		expect(result).toContain('0x1') // authorization.chainId
		expect(result).toContain('0xauthaddress') // authorization.address
		expect(result).toContain('0x5') // authorization.nonce
		expect(result).toContain('0x2') // eip7702Auth.chainId
		expect(result).toContain('0xeip7702address') // eip7702Auth.address
		expect(result).toContain('0x10') // eip7702Auth.nonce
	})

	it('should skip undefined and null fields', () => {
		const userOp: RpcUserOperation = {
			sender: '0xSENDER123',
			nonce: '0xNONCE',
			callData: '0xCALLDATA',
			callGasLimit: '0x100000',
			verificationGasLimit: '0x50000',
			preVerificationGas: '0x5208',
			maxFeePerGas: '0x3B9ACA00',
			maxPriorityFeePerGas: '0x3B9ACA00',
			signature: '0xSIGNATURE',
			// These fields are undefined/missing and should be skipped
			initCode: undefined,
			factory: undefined,
		}

		const result = normalizeUserOperation(userOp)

		expect(result).toContain('0xsender123')
		expect(result).toContain('0xnonce')
		expect(result).toContain('0xcalldata')
		// Should not contain undefined values
		expect(result).not.toContain('undefined')
		expect(result).not.toContain('null')
	})
})
