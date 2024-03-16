export class FibTs {
	calculate(n: bigint): bigint {
		if (n === 0n) return 0n
		if (n === 1n) return 1n

		let a = 0n
		let b = 1n
		for (let i = 2n; i <= n; i++) {
			const c = a + b
			a = b
			b = c
		}
		return b
	}
}
