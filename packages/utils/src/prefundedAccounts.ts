import { type PrivateKeyAccount, privateKeyToAccount } from 'viem/accounts'

export const PREFUNDED_PRIVATE_KEYS = [
	'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // 0
	'0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', // 1
	'0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a', // 2
	'0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6', // 3
	'0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a', // 4
	'0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba', // 5
	'0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e', // 6
	'0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356', // 7
	'0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97', // 8
	'0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6', // 9
] as const

export const PREFUNDED_PUBLIC_KEYS = [
	'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // 0
	'0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // 1
	'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // 2
	'0x90F79bf6EB2c4f870365E785982E1f101E93b906', // 3
	'0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', // 4
	'0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', // 5
	'0x976EA74026E726554dB657fA54763abd0C3a0aa9', // 6
	'0x14dC79964da2C08b23698B3D3cc7Ca32193d9955', // 7
	'0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', // 8
	'0xa0Ee7A142d267C1f36714E4a8F75612F20a79720', // 9
] as const

export const PREFUNDED_ACCOUNTS: [
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
	PrivateKeyAccount,
] = [
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[0]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[1]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[2]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[3]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[4]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[5]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[6]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[7]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[8]),
	privateKeyToAccount(PREFUNDED_PRIVATE_KEYS[9]),
] as const

export const PREFUNDED_SEED = Object.freeze({
	mnemonic: 'test test test test test test test test test test test junk',
	derivationPath: "m/44'/60'/0'/0/",
})
