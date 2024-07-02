/**
 * Approximates `factor * e ** (numerator / denominator)` using Taylor expansion
 * @param {bigint} factor - The factor to multiply the result by
 * @param {bigint} numerator - The numerator of the exponent
 * @param {bigint} denominator - The denominator of the exponent
 * @returns {bigint} The approximate result
 */
export const approximateExponential = (factor, numerator, denominator) => {
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
