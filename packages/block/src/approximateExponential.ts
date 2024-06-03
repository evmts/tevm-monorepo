/**
 * Approximates `factor * e ** (numerator / denominator)` using Taylor expansion
 */
export const approximateExponential = (factor: bigint, numerator: bigint, denominator: bigint) => {
	let i = BigInt(1)
	let output = BigInt(0)
	let numerator_accum = factor * denominator
	while (numerator_accum > BigInt(0)) {
		output += numerator_accum
		numerator_accum = (numerator_accum * numerator) / (denominator * i)
		i++
	}

	return output / denominator
}
