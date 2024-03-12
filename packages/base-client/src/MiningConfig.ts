export type IntervalMining = {
	type: 'interval'
	interval: number
}
export type ManualMining = {
	type: 'manual'
}
export type AutoMining = {
	type: 'auto'
}
export type GasMining = {
	type: 'gas'
	limit: BigInt
}
export type MiningConfig =
	| IntervalMining
	| ManualMining
	| AutoMining
	| GasMining
