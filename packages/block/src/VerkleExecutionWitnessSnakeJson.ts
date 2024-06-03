import type { VerkleProofSnakeJson } from './VerkleProofSnakeJson.js'
import type { VerkleStateDiffSnakeJson } from './VerkleStateDiffSnakeJson.js'

export type VerkleExecutionWitnessSnakeJson = {
	state_diff: VerkleStateDiffSnakeJson[]
	verkle_proof: VerkleProofSnakeJson
}
