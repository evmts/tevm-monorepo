import { Context, Effect, Layer } from 'effect'
import * as Solidity from 'ox/core/Solidity'

// Re-export all the constants
export const {
	arrayRegex,
	bytesRegex,
	integerRegex,
	maxInt8,
	maxInt16,
	maxInt24,
	maxInt32,
	maxInt40,
	maxInt48,
	maxInt56,
	maxInt64,
	maxInt72,
	maxInt80,
	maxInt88,
	maxInt96,
	maxInt104,
	maxInt112,
	maxInt120,
	maxInt128,
	maxInt136,
	maxInt144,
	maxInt152,
	maxInt160,
	maxInt168,
	maxInt176,
	maxInt184,
	maxInt192,
	maxInt200,
	maxInt208,
	maxInt216,
	maxInt224,
	maxInt232,
	maxInt240,
	maxInt248,
	maxInt256,
	minInt8,
	minInt16,
	minInt24,
	minInt32,
	minInt40,
	minInt48,
	minInt56,
	minInt64,
	minInt72,
	minInt80,
	minInt88,
	minInt96,
	minInt104,
	minInt112,
	minInt120,
	minInt128,
	minInt136,
	minInt144,
	minInt152,
	minInt160,
	minInt168,
	minInt176,
	minInt184,
	minInt192,
	minInt200,
	minInt208,
	minInt216,
	minInt224,
	minInt232,
	minInt240,
	minInt248,
	minInt256,
	maxUint8,
	maxUint16,
	maxUint24,
	maxUint32,
	maxUint40,
	maxUint48,
	maxUint56,
	maxUint64,
	maxUint72,
	maxUint80,
	maxUint88,
	maxUint96,
	maxUint104,
	maxUint112,
	maxUint120,
	maxUint128,
	maxUint136,
	maxUint144,
	maxUint152,
	maxUint160,
	maxUint168,
	maxUint176,
	maxUint184,
	maxUint192,
	maxUint200,
	maxUint208,
	maxUint216,
	maxUint224,
	maxUint232,
	maxUint240,
	maxUint248,
	maxUint256,
} = Solidity

/**
 * Interface for SolidityEffect service
 * Note: Since the Solidity module primarily consists of constants,
 * there are no methods to wrap in Effects.
 */
export type SolidityEffectService = {}

/**
 * Tag for SolidityEffectService dependency injection
 */
export const SolidityEffectTag = Context.Tag<SolidityEffectService>('@tevm/ox/SolidityEffect')

/**
 * Live implementation of SolidityEffectService
 */
export const SolidityEffectLive: SolidityEffectService = {
	// No methods to implement
}

/**
 * Layer that provides the SolidityEffectService implementation
 */
export const SolidityEffectLayer = Layer.succeed(SolidityEffectTag, SolidityEffectLive)
