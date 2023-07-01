export function getRandomInt(min = 1, max = 1_000_000_000) {
	const range = max - min + 1
	return Math.floor(Math.random() * range) + min
}
