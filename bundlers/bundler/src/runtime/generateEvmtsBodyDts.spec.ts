import { generateDtsBody } from './generateEvmtsBodyDts' // replace with your actual module path
import { describe, expect, it } from 'vitest'

describe('generateDtsBody', () => {
	const artifacts = {
		MyContract: {
			abi: {},
			bytecode: '0x60016001',
		},
		AnotherContract: {
			abi: {},
			bytecode: '0x60016002',
		},
		MissingContract: {
			abi: {},
			bytecode: '0x60016003',
		},
	}

	const config = {
		localContracts: {
			contracts: [
				{
					name: 'MyContract',
					addresses: {
						1: '0x123',
						5: '0x456',
					},
				},
				{
					name: 'AnotherContract',
					addresses: {
						10: '0x789',
					},
				},
				{
					name: 'UnlinkedContract',
					addresses: {
						9999: '0x999', // this networkId does not exist in etherscanBaseUris map
					},
				},
			],
		},
	}

	it('should generate correct body with etherscan links', () => {
		expect(generateDtsBody(artifacts, config as any)).toMatchInlineSnapshot(`
      "const _abiMyContract = {} as const;
      const _chainAddressMapMyContract = {\\"1\\":\\"0x123\\",\\"5\\":\\"0x456\\"} as const;
      const _nameMyContract = \\"MyContract\\" as const;
      /**
       * MyContract EvmtsContract
       * @etherscan-1 https://etherscan.io/address/0x123
       * @etherscan-5 https://goerli.etherscan.io/address/0x456
       */
      export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
      const _abiAnotherContract = {} as const;
      const _chainAddressMapAnotherContract = {\\"10\\":\\"0x789\\"} as const;
      const _nameAnotherContract = \\"AnotherContract\\" as const;
      /**
       * AnotherContract EvmtsContract
       * @etherscan-10 https://optimistic.etherscan.io/address/0x789
       */
      export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;
      const _abiMissingContract = {} as const;
      const _chainAddressMapMissingContract = {} as const;
      const _nameMissingContract = \\"MissingContract\\" as const;
      /**
       * MissingContract EvmtsContract
       */
      export const MissingContract: EvmtsContract<typeof _nameMissingContract, typeof _chainAddressMapMissingContract, typeof _abiMissingContract>;"
    `)
	})

	it('should generate correct body when config.localContracts.contracts is undefined', () => {
		const configNoContracts = {
			localContracts: {},
		}

		expect(
			generateDtsBody(artifacts, configNoContracts as any),
		).toMatchInlineSnapshot(`
      "const _abiMyContract = {} as const;
      const _chainAddressMapMyContract = {} as const;
      const _nameMyContract = \\"MyContract\\" as const;
      /**
       * MyContract EvmtsContract
       */
      export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
      const _abiAnotherContract = {} as const;
      const _chainAddressMapAnotherContract = {} as const;
      const _nameAnotherContract = \\"AnotherContract\\" as const;
      /**
       * AnotherContract EvmtsContract
       */
      export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;
      const _abiMissingContract = {} as const;
      const _chainAddressMapMissingContract = {} as const;
      const _nameMissingContract = \\"MissingContract\\" as const;
      /**
       * MissingContract EvmtsContract
       */
      export const MissingContract: EvmtsContract<typeof _nameMissingContract, typeof _chainAddressMapMissingContract, typeof _abiMissingContract>;"
    `)
	})

	it('should generate correct body when contract addresses are undefined', () => {
		const configNoAddresses = {
			localContracts: {
				contracts: [
					{
						name: 'MyContract',
					},
					{
						name: 'UnlinkedContract',
					},
				],
			},
		}

		expect(
			generateDtsBody(artifacts, configNoAddresses as any),
		).toMatchInlineSnapshot(`
      "const _abiMyContract = {} as const;
      const _chainAddressMapMyContract = {} as const;
      const _nameMyContract = \\"MyContract\\" as const;
      /**
       * MyContract EvmtsContract
       */
      export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
      const _abiAnotherContract = {} as const;
      const _chainAddressMapAnotherContract = {} as const;
      const _nameAnotherContract = \\"AnotherContract\\" as const;
      /**
       * AnotherContract EvmtsContract
       */
      export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;
      const _abiMissingContract = {} as const;
      const _chainAddressMapMissingContract = {} as const;
      const _nameMissingContract = \\"MissingContract\\" as const;
      /**
       * MissingContract EvmtsContract
       */
      export const MissingContract: EvmtsContract<typeof _nameMissingContract, typeof _chainAddressMapMissingContract, typeof _abiMissingContract>;"
    `)
	})

	it('should generate correct body when artifact has no corresponding contract configuration', () => {
		const configMissingContractConfig = {
			localContracts: {
				contracts: [
					{
						name: 'MyContract',
						addresses: {
							1: '0x123',
							5: '0x456',
						},
					},
					{
						name: 'UnlinkedContract',
						addresses: {
							9999: '0x999', // this networkId does not exist in etherscanBaseUris map
						},
					},
				],
			},
		}

		expect(
			generateDtsBody(artifacts, configMissingContractConfig as any),
		).toMatchInlineSnapshot(`
        "const _abiMyContract = {} as const;
        const _chainAddressMapMyContract = {\\"1\\":\\"0x123\\",\\"5\\":\\"0x456\\"} as const;
        const _nameMyContract = \\"MyContract\\" as const;
        /**
         * MyContract EvmtsContract
         * @etherscan-1 https://etherscan.io/address/0x123
         * @etherscan-5 https://goerli.etherscan.io/address/0x456
         */
        export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
        const _abiAnotherContract = {} as const;
        const _chainAddressMapAnotherContract = {} as const;
        const _nameAnotherContract = \\"AnotherContract\\" as const;
        /**
         * AnotherContract EvmtsContract
         */
        export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;
        const _abiMissingContract = {} as const;
        const _chainAddressMapMissingContract = {} as const;
        const _nameMissingContract = \\"MissingContract\\" as const;
        /**
         * MissingContract EvmtsContract
         */
        export const MissingContract: EvmtsContract<typeof _nameMissingContract, typeof _chainAddressMapMissingContract, typeof _abiMissingContract>;"
    `)
	})

	it('should generate correct body when contract configuration has no addresses', () => {
		const configMissingAddresses = {
			localContracts: {
				contracts: [
					{
						name: 'MyContract',
					},
					{
						name: 'AnotherContract',
					},
				],
			},
		}

		expect(
			generateDtsBody(artifacts, configMissingAddresses as any),
		).toMatchInlineSnapshot(`
        "const _abiMyContract = {} as const;
        const _chainAddressMapMyContract = {} as const;
        const _nameMyContract = \\"MyContract\\" as const;
        /**
         * MyContract EvmtsContract
         */
        export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
        const _abiAnotherContract = {} as const;
        const _chainAddressMapAnotherContract = {} as const;
        const _nameAnotherContract = \\"AnotherContract\\" as const;
        /**
         * AnotherContract EvmtsContract
         */
        export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;
        const _abiMissingContract = {} as const;
        const _chainAddressMapMissingContract = {} as const;
        const _nameMissingContract = \\"MissingContract\\" as const;
        /**
         * MissingContract EvmtsContract
         */
        export const MissingContract: EvmtsContract<typeof _nameMissingContract, typeof _chainAddressMapMissingContract, typeof _abiMissingContract>;"
    `)
	})

	it('should generate correct body when config.localContracts.contracts is an empty array', () => {
		const configEmptyContracts = {
			localContracts: {
				contracts: [],
			},
		}

		expect(
			generateDtsBody(artifacts, configEmptyContracts as any),
		).toMatchInlineSnapshot(`
    "const _abiMyContract = {} as const;
    const _chainAddressMapMyContract = {} as const;
    const _nameMyContract = \\"MyContract\\" as const;
    /**
     * MyContract EvmtsContract
     */
    export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
    const _abiAnotherContract = {} as const;
    const _chainAddressMapAnotherContract = {} as const;
    const _nameAnotherContract = \\"AnotherContract\\" as const;
    /**
     * AnotherContract EvmtsContract
     */
    export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;
    const _abiMissingContract = {} as const;
    const _chainAddressMapMissingContract = {} as const;
    const _nameMissingContract = \\"MissingContract\\" as const;
    /**
     * MissingContract EvmtsContract
     */
    export const MissingContract: EvmtsContract<typeof _nameMissingContract, typeof _chainAddressMapMissingContract, typeof _abiMissingContract>;"
  `)
	})
})
