// This file was originally adapted from ethereumjs and thus carries the same license
import type { Hex } from '@tevm/utils'

export interface VerkleProof {
	commitmentsByPath: Hex[]
	d: Hex
	depthExtensionPresent: Hex
	ipaProof: {
		cl: Hex[]
		cr: Hex[]
		finalEvaluation: Hex
	}
	otherStems: Hex[]
}
