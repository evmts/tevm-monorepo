import { getEtherscanLinks } from './getEtherscanLinks'
import { describe, expect, it } from 'vitest'

const addresses: Record<number, `0x${string}`> = {
	1: '0x1',
	5: '0x2',
	10: '0x3',
	56: '0x4',
	137: '0x5',
	250: '0x6',
	280: '0x7',
	288: '0x8',
	324: '0x9',
	420: '0x0',
	1284: '0x1',
	4002: '0x2',
	43114: '0x3',
	42220: '0x4',
	42161: '0x5',
	80001: '0x3',
	84531: '0x3',
	421613: '0x3',
	534353: '0x3',
}

describe(getEtherscanLinks.name, () => {
	it('should return the correct links', () => {
		expect(getEtherscanLinks(addresses)).toMatchInlineSnapshot(`
      [
        [
          "1",
          "https://etherscan.io/address/0x1",
        ],
        [
          "5",
          "https://goerli.etherscan.io/address/0x2",
        ],
        [
          "10",
          "https://optimistic.etherscan.io/address/0x3",
        ],
        [
          "56",
          "https://bscscan.com/address/0x4",
        ],
        [
          "137",
          "https://polygonscan.com/address/0x5",
        ],
        [
          "250",
          "https://ftmscan.com/address/0x6",
        ],
        [
          "280",
          "https://zksync2-mainnet.zkscan.io/address/0x7",
        ],
        [
          "288",
          "https://bobascan.com/address/0x8",
        ],
        [
          "324",
          "https://zksync2-mainnet.zkscan.io/address/0x9",
        ],
        [
          "420",
          "https://goerli-explorer.optimism.io/address/0x0",
        ],
        [
          "1284",
          "https://moonscan.io/address/0x1",
        ],
        [
          "4002",
          "https://testnet.ftmscan.com/address/0x2",
        ],
        [
          "42161",
          "https://arbiscan.io/address/0x5",
        ],
        [
          "42220",
          "https://celoscan.io/address/0x4",
        ],
        [
          "43114",
          "https://explorer.avax.network/address/0x3",
        ],
        [
          "80001",
          "https://mumbai.polygonscan.com/address/0x3",
        ],
        [
          "84531",
          "https://goerli.basescan.org/address/0x3",
        ],
        [
          "421613",
          "https://goerli-rollup-explorer.arbitrum.io/address/0x3",
        ],
        [
          "534353",
          "https://blockscout.scroll.io/address/0x3",
        ],
      ]
    `)
	})
})
