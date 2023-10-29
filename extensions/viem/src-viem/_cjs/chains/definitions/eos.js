'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.eos = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.eos = (0, chain_js_1.defineChain)({
	id: 17777,
	name: 'EOS EVM',
	network: 'eos',
	nativeCurrency: {
		decimals: 18,
		name: 'EOS',
		symbol: 'EOS',
	},
	rpcUrls: {
		default: { http: ['https://api.evm.eosnetwork.com'] },
		public: { http: ['https://api.evm.eosnetwork.com'] },
	},
	blockExplorers: {
		etherscan: {
			name: 'EOS EVM Explorer',
			url: 'https://explorer.evm.eosnetwork.com',
		},
		default: {
			name: 'EOS EVM Explorer',
			url: 'https://explorer.evm.eosnetwork.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 7943933,
		},
	},
})
//# sourceMappingURL=eos.js.map
