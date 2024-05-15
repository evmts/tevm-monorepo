type DNSRecord = string[]

function hexToAscii(hex: string): string {
	let result = ''
	for (let i = 0; i < hex.length; i += 2) {
		const part = Number.parseInt(hex.substring(i, i + 2), 16)
		if (part) result += String.fromCharCode(part)
	}
	return result
}

export function extractENSRecord(dnsRecords: DNSRecord[]): string[] {
	const txtPrefix = '0x0010'
	const txtRecords: string[] = []

	for (const record of dnsRecords) {
		if (record[0].startsWith(txtPrefix)) {
			const contentStart = txtPrefix.length
			const rawContent = record[0].slice(contentStart)
			let asciiContent = hexToAscii(rawContent)

			asciiContent = asciiContent.split('\t').join()

			const parts = asciiContent.split(',')
			for (const part of parts) {
				if (part.includes('ENS1')) {
					txtRecords.push(part.slice(2))
				}
			}
		}
	}

	return txtRecords
}
