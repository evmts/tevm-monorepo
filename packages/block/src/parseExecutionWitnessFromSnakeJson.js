/**
 * @param {import("./VerkleExecutionWitnessSnakeJson.js").VerkleExecutionWitnessSnakeJson} params
 * @returns {import("./VerkleExecutionWitness.js").VerkleExecutionWitness}
 */
export function parseExecutionWitnessFromSnakeJson({ state_diff, verkle_proof }) {
	return {
		stateDiff: state_diff.map(({ stem, suffix_diffs }) => ({
			stem,
			suffixDiffs: suffix_diffs.map(({ current_value, new_value, suffix }) => ({
				currentValue: current_value,
				newValue: new_value,
				suffix,
			})),
		})),
		verkleProof: {
			commitmentsByPath: verkle_proof.commitments_by_path,
			d: verkle_proof.d,
			depthExtensionPresent: verkle_proof.depth_extension_present,
			ipaProof: {
				cl: verkle_proof.ipa_proof.cl,
				cr: verkle_proof.ipa_proof.cr,
				finalEvaluation: verkle_proof.ipa_proof.final_evaluation,
			},
			otherStems: verkle_proof.other_stems,
		},
	}
}
