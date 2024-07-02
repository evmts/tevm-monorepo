import { type Hex } from '@tevm/utils'

export type VerkleProofSnakeJson = {
	commitments_by_path: Hex[]
	d: Hex
	depth_extension_present: Hex
	ipa_proof: {
		cl: Hex[]
		cr: Hex[]
		final_evaluation: Hex
	}
	other_stems: Hex[]
}
