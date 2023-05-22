const _HelloWorld2 = {
	abi: [
		{
			inputs: [],
			name: 'greet2',
			outputs: [
				{
					internalType: 'string',
					name: '',
					type: 'string',
				},
			],
			stateMutability: 'pure',
			type: 'function',
		},
	],
	bytecode: {
		object:
			'0x608060405234801561001057600080fd5b5060ea8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806380cc6ac114602d575b600080fd5b604080518082018252600b81527f48656c6c6f20576f726c6400000000000000000000000000000000000000000060208201529051606a91906073565b60405180910390f35b600060208083528351808285015260005b81811015609e578581018301518582016040015282016084565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116850101925050509291505056fea164736f6c6343000811000a',
		sourceMap: '145:120:0:-:0;;;;;;;;;;;;;;;;;;;',
		linkReferences: {},
	},
	deployedBytecode: {
		object:
			'0x6080604052348015600f57600080fd5b506004361060285760003560e01c806380cc6ac114602d575b600080fd5b604080518082018252600b81527f48656c6c6f20576f726c6400000000000000000000000000000000000000000060208201529051606a91906073565b60405180910390f35b600060208083528351808285015260005b81811015609e578581018301518582016040015282016084565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116850101925050509291505056fea164736f6c6343000811000a',
		sourceMap:
			'145:120:0:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;172:91;236:20;;;;;;;;;;;;;;;;172:91;;;;236:20;172:91;:::i;:::-;;;;;;;;14:607:1;126:4;155:2;184;173:9;166:21;216:6;210:13;259:6;254:2;243:9;239:18;232:34;284:1;294:140;308:6;305:1;302:13;294:140;;;403:14;;;399:23;;393:30;369:17;;;388:2;365:26;358:66;323:10;;294:140;;;298:3;483:1;478:2;469:6;458:9;454:22;450:31;443:42;612:2;542:66;537:2;529:6;525:15;521:88;510:9;506:104;502:113;494:121;;;;14:607;;;;:::o',
		linkReferences: {},
	},
	methodIdentifiers: {
		'greet2()': '80cc6ac1',
	},
	rawMetadata:
		'{"compiler":{"version":"0.8.17+commit.8df45f5f"},"language":"Solidity","output":{"abi":[{"inputs":[],"name":"greet2","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}],"devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"src/test/fixtures/HelloWorld.sol":"HelloWorld2"},"evmVersion":"london","libraries":{},"metadata":{"bytecodeHash":"none"},"optimizer":{"enabled":true,"runs":1000000},"remappings":[":@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/"]},"sources":{"src/test/fixtures/HelloWorld.sol":{"keccak256":"0x0971286d63af137da3bab48d7f700764d2f2de9adddd5dc3ba0af5cff0eaa697","urls":["bzz-raw://f9583dbd0564251763a7d9dc06da4a2b3e2fae129abba81b9d59abe020186028","dweb:/ipfs/QmRf7maix5pp4iHgfkiKpXzbNr9DjjVoSvuA3efY3mbjds"]}},"version":1}',
	metadata: {
		compiler: {
			version: '0.8.17+commit.8df45f5f',
		},
		language: 'Solidity',
		output: {
			abi: [
				{
					inputs: [],
					stateMutability: 'pure',
					type: 'function',
					name: 'greet2',
					outputs: [
						{
							internalType: 'string',
							name: '',
							type: 'string',
						},
					],
				},
			],
			devdoc: {
				kind: 'dev',
				methods: {},
				version: 1,
			},
			userdoc: {
				kind: 'user',
				methods: {},
				version: 1,
			},
		},
		settings: {
			remappings: [
				':@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/',
			],
			optimizer: {
				enabled: true,
				runs: 1000000,
			},
			metadata: {
				bytecodeHash: 'none',
			},
			compilationTarget: {
				'src/test/fixtures/HelloWorld.sol': 'HelloWorld2',
			},
			libraries: {},
		},
		sources: {
			'src/test/fixtures/HelloWorld.sol': {
				keccak256:
					'0x0971286d63af137da3bab48d7f700764d2f2de9adddd5dc3ba0af5cff0eaa697',
				urls: [
					'bzz-raw://f9583dbd0564251763a7d9dc06da4a2b3e2fae129abba81b9d59abe020186028',
					'dweb:/ipfs/QmRf7maix5pp4iHgfkiKpXzbNr9DjjVoSvuA3efY3mbjds',
				],
				license: null,
			},
		},
		version: 1,
	},
	ast: {
		absolutePath: 'src/test/fixtures/HelloWorld.sol',
		id: 20,
		exportedSymbols: {
			HelloWorld: [10],
			HelloWorld2: [19],
		},
		nodeType: 'SourceUnit',
		src: '0:266:0',
		nodes: [
			{
				id: 1,
				nodeType: 'PragmaDirective',
				src: '0:23:0',
				nodes: [],
				literals: ['solidity', '0.8', '.17'],
			},
			{
				id: 10,
				nodeType: 'ContractDefinition',
				src: '25:118:0',
				nodes: [
					{
						id: 9,
						nodeType: 'FunctionDefinition',
						src: '51:90:0',
						nodes: [],
						body: {
							id: 8,
							nodeType: 'Block',
							src: '104:37:0',
							nodes: [],
							statements: [
								{
									expression: {
										hexValue: '48656c6c6f20576f726c64',
										id: 6,
										isConstant: false,
										isLValue: false,
										isPure: true,
										kind: 'string',
										lValueRequested: false,
										nodeType: 'Literal',
										src: '121:13:0',
										typeDescriptions: {
											typeIdentifier:
												't_stringliteral_592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
											typeString: 'literal_string "Hello World"',
										},
										value: 'Hello World',
									},
									functionReturnParameters: 5,
									id: 7,
									nodeType: 'Return',
									src: '114:20:0',
								},
							],
						},
						functionSelector: 'cfae3217',
						implemented: true,
						kind: 'function',
						modifiers: [],
						name: 'greet',
						nameLocation: '60:5:0',
						parameters: {
							id: 2,
							nodeType: 'ParameterList',
							parameters: [],
							src: '65:2:0',
						},
						returnParameters: {
							id: 5,
							nodeType: 'ParameterList',
							parameters: [
								{
									constant: false,
									id: 4,
									mutability: 'mutable',
									name: '',
									nameLocation: '-1:-1:-1',
									nodeType: 'VariableDeclaration',
									scope: 9,
									src: '89:13:0',
									stateVariable: false,
									storageLocation: 'memory',
									typeDescriptions: {
										typeIdentifier: 't_string_memory_ptr',
										typeString: 'string',
									},
									typeName: {
										id: 3,
										name: 'string',
										nodeType: 'ElementaryTypeName',
										src: '89:6:0',
										typeDescriptions: {
											typeIdentifier: 't_string_storage_ptr',
											typeString: 'string',
										},
									},
									visibility: 'internal',
								},
							],
							src: '88:15:0',
						},
						scope: 10,
						stateMutability: 'pure',
						virtual: false,
						visibility: 'public',
					},
				],
				abstract: false,
				baseContracts: [],
				canonicalName: 'HelloWorld',
				contractDependencies: [],
				contractKind: 'contract',
				fullyImplemented: true,
				linearizedBaseContracts: [10],
				name: 'HelloWorld',
				nameLocation: '34:10:0',
				scope: 20,
				usedErrors: [],
			},
			{
				id: 19,
				nodeType: 'ContractDefinition',
				src: '145:120:0',
				nodes: [
					{
						id: 18,
						nodeType: 'FunctionDefinition',
						src: '172:91:0',
						nodes: [],
						body: {
							id: 17,
							nodeType: 'Block',
							src: '226:37:0',
							nodes: [],
							statements: [
								{
									expression: {
										hexValue: '48656c6c6f20576f726c64',
										id: 15,
										isConstant: false,
										isLValue: false,
										isPure: true,
										kind: 'string',
										lValueRequested: false,
										nodeType: 'Literal',
										src: '243:13:0',
										typeDescriptions: {
											typeIdentifier:
												't_stringliteral_592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
											typeString: 'literal_string "Hello World"',
										},
										value: 'Hello World',
									},
									functionReturnParameters: 14,
									id: 16,
									nodeType: 'Return',
									src: '236:20:0',
								},
							],
						},
						functionSelector: '80cc6ac1',
						implemented: true,
						kind: 'function',
						modifiers: [],
						name: 'greet2',
						nameLocation: '181:6:0',
						parameters: {
							id: 11,
							nodeType: 'ParameterList',
							parameters: [],
							src: '187:2:0',
						},
						returnParameters: {
							id: 14,
							nodeType: 'ParameterList',
							parameters: [
								{
									constant: false,
									id: 13,
									mutability: 'mutable',
									name: '',
									nameLocation: '-1:-1:-1',
									nodeType: 'VariableDeclaration',
									scope: 18,
									src: '211:13:0',
									stateVariable: false,
									storageLocation: 'memory',
									typeDescriptions: {
										typeIdentifier: 't_string_memory_ptr',
										typeString: 'string',
									},
									typeName: {
										id: 12,
										name: 'string',
										nodeType: 'ElementaryTypeName',
										src: '211:6:0',
										typeDescriptions: {
											typeIdentifier: 't_string_storage_ptr',
											typeString: 'string',
										},
									},
									visibility: 'internal',
								},
							],
							src: '210:15:0',
						},
						scope: 19,
						stateMutability: 'pure',
						virtual: false,
						visibility: 'public',
					},
				],
				abstract: false,
				baseContracts: [],
				canonicalName: 'HelloWorld2',
				contractDependencies: [],
				contractKind: 'contract',
				fullyImplemented: true,
				linearizedBaseContracts: [19],
				name: 'HelloWorld2',
				nameLocation: '154:11:0',
				scope: 20,
				usedErrors: [],
			},
		],
	},
	id: 0,
} as const
export declare const HelloWorld2: typeof _HelloWorld2
const _HelloWorld = {
	abi: [
		{
			inputs: [],
			name: 'greet',
			outputs: [
				{
					internalType: 'string',
					name: '',
					type: 'string',
				},
			],
			stateMutability: 'pure',
			type: 'function',
		},
	],
	bytecode: {
		object:
			'0x608060405234801561001057600080fd5b5060ea8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063cfae321714602d575b600080fd5b604080518082018252600b81527f48656c6c6f20576f726c6400000000000000000000000000000000000000000060208201529051606a91906073565b60405180910390f35b600060208083528351808285015260005b81811015609e578581018301518582016040015282016084565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116850101925050509291505056fea164736f6c6343000811000a',
		sourceMap: '25:118:0:-:0;;;;;;;;;;;;;;;;;;;',
		linkReferences: {},
	},
	deployedBytecode: {
		object:
			'0x6080604052348015600f57600080fd5b506004361060285760003560e01c8063cfae321714602d575b600080fd5b604080518082018252600b81527f48656c6c6f20576f726c6400000000000000000000000000000000000000000060208201529051606a91906073565b60405180910390f35b600060208083528351808285015260005b81811015609e578581018301518582016040015282016084565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116850101925050509291505056fea164736f6c6343000811000a',
		sourceMap:
			'25:118:0:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;51:90;114:20;;;;;;;;;;;;;;;;51:90;;;;114:20;51:90;:::i;:::-;;;;;;;;14:607:1;126:4;155:2;184;173:9;166:21;216:6;210:13;259:6;254:2;243:9;239:18;232:34;284:1;294:140;308:6;305:1;302:13;294:140;;;403:14;;;399:23;;393:30;369:17;;;388:2;365:26;358:66;323:10;;294:140;;;298:3;483:1;478:2;469:6;458:9;454:22;450:31;443:42;612:2;542:66;537:2;529:6;525:15;521:88;510:9;506:104;502:113;494:121;;;;14:607;;;;:::o',
		linkReferences: {},
	},
	methodIdentifiers: {
		'greet()': 'cfae3217',
	},
	rawMetadata:
		'{"compiler":{"version":"0.8.17+commit.8df45f5f"},"language":"Solidity","output":{"abi":[{"inputs":[],"name":"greet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}],"devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"src/test/fixtures/HelloWorld.sol":"HelloWorld"},"evmVersion":"london","libraries":{},"metadata":{"bytecodeHash":"none"},"optimizer":{"enabled":true,"runs":1000000},"remappings":[":@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/"]},"sources":{"src/test/fixtures/HelloWorld.sol":{"keccak256":"0x0971286d63af137da3bab48d7f700764d2f2de9adddd5dc3ba0af5cff0eaa697","urls":["bzz-raw://f9583dbd0564251763a7d9dc06da4a2b3e2fae129abba81b9d59abe020186028","dweb:/ipfs/QmRf7maix5pp4iHgfkiKpXzbNr9DjjVoSvuA3efY3mbjds"]}},"version":1}',
	metadata: {
		compiler: {
			version: '0.8.17+commit.8df45f5f',
		},
		language: 'Solidity',
		output: {
			abi: [
				{
					inputs: [],
					stateMutability: 'pure',
					type: 'function',
					name: 'greet',
					outputs: [
						{
							internalType: 'string',
							name: '',
							type: 'string',
						},
					],
				},
			],
			devdoc: {
				kind: 'dev',
				methods: {},
				version: 1,
			},
			userdoc: {
				kind: 'user',
				methods: {},
				version: 1,
			},
		},
		settings: {
			remappings: [
				':@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/',
			],
			optimizer: {
				enabled: true,
				runs: 1000000,
			},
			metadata: {
				bytecodeHash: 'none',
			},
			compilationTarget: {
				'src/test/fixtures/HelloWorld.sol': 'HelloWorld',
			},
			libraries: {},
		},
		sources: {
			'src/test/fixtures/HelloWorld.sol': {
				keccak256:
					'0x0971286d63af137da3bab48d7f700764d2f2de9adddd5dc3ba0af5cff0eaa697',
				urls: [
					'bzz-raw://f9583dbd0564251763a7d9dc06da4a2b3e2fae129abba81b9d59abe020186028',
					'dweb:/ipfs/QmRf7maix5pp4iHgfkiKpXzbNr9DjjVoSvuA3efY3mbjds',
				],
				license: null,
			},
		},
		version: 1,
	},
	ast: {
		absolutePath: 'src/test/fixtures/HelloWorld.sol',
		id: 20,
		exportedSymbols: {
			HelloWorld: [10],
			HelloWorld2: [19],
		},
		nodeType: 'SourceUnit',
		src: '0:266:0',
		nodes: [
			{
				id: 1,
				nodeType: 'PragmaDirective',
				src: '0:23:0',
				nodes: [],
				literals: ['solidity', '0.8', '.17'],
			},
			{
				id: 10,
				nodeType: 'ContractDefinition',
				src: '25:118:0',
				nodes: [
					{
						id: 9,
						nodeType: 'FunctionDefinition',
						src: '51:90:0',
						nodes: [],
						body: {
							id: 8,
							nodeType: 'Block',
							src: '104:37:0',
							nodes: [],
							statements: [
								{
									expression: {
										hexValue: '48656c6c6f20576f726c64',
										id: 6,
										isConstant: false,
										isLValue: false,
										isPure: true,
										kind: 'string',
										lValueRequested: false,
										nodeType: 'Literal',
										src: '121:13:0',
										typeDescriptions: {
											typeIdentifier:
												't_stringliteral_592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
											typeString: 'literal_string "Hello World"',
										},
										value: 'Hello World',
									},
									functionReturnParameters: 5,
									id: 7,
									nodeType: 'Return',
									src: '114:20:0',
								},
							],
						},
						functionSelector: 'cfae3217',
						implemented: true,
						kind: 'function',
						modifiers: [],
						name: 'greet',
						nameLocation: '60:5:0',
						parameters: {
							id: 2,
							nodeType: 'ParameterList',
							parameters: [],
							src: '65:2:0',
						},
						returnParameters: {
							id: 5,
							nodeType: 'ParameterList',
							parameters: [
								{
									constant: false,
									id: 4,
									mutability: 'mutable',
									name: '',
									nameLocation: '-1:-1:-1',
									nodeType: 'VariableDeclaration',
									scope: 9,
									src: '89:13:0',
									stateVariable: false,
									storageLocation: 'memory',
									typeDescriptions: {
										typeIdentifier: 't_string_memory_ptr',
										typeString: 'string',
									},
									typeName: {
										id: 3,
										name: 'string',
										nodeType: 'ElementaryTypeName',
										src: '89:6:0',
										typeDescriptions: {
											typeIdentifier: 't_string_storage_ptr',
											typeString: 'string',
										},
									},
									visibility: 'internal',
								},
							],
							src: '88:15:0',
						},
						scope: 10,
						stateMutability: 'pure',
						virtual: false,
						visibility: 'public',
					},
				],
				abstract: false,
				baseContracts: [],
				canonicalName: 'HelloWorld',
				contractDependencies: [],
				contractKind: 'contract',
				fullyImplemented: true,
				linearizedBaseContracts: [10],
				name: 'HelloWorld',
				nameLocation: '34:10:0',
				scope: 20,
				usedErrors: [],
			},
			{
				id: 19,
				nodeType: 'ContractDefinition',
				src: '145:120:0',
				nodes: [
					{
						id: 18,
						nodeType: 'FunctionDefinition',
						src: '172:91:0',
						nodes: [],
						body: {
							id: 17,
							nodeType: 'Block',
							src: '226:37:0',
							nodes: [],
							statements: [
								{
									expression: {
										hexValue: '48656c6c6f20576f726c64',
										id: 15,
										isConstant: false,
										isLValue: false,
										isPure: true,
										kind: 'string',
										lValueRequested: false,
										nodeType: 'Literal',
										src: '243:13:0',
										typeDescriptions: {
											typeIdentifier:
												't_stringliteral_592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
											typeString: 'literal_string "Hello World"',
										},
										value: 'Hello World',
									},
									functionReturnParameters: 14,
									id: 16,
									nodeType: 'Return',
									src: '236:20:0',
								},
							],
						},
						functionSelector: '80cc6ac1',
						implemented: true,
						kind: 'function',
						modifiers: [],
						name: 'greet2',
						nameLocation: '181:6:0',
						parameters: {
							id: 11,
							nodeType: 'ParameterList',
							parameters: [],
							src: '187:2:0',
						},
						returnParameters: {
							id: 14,
							nodeType: 'ParameterList',
							parameters: [
								{
									constant: false,
									id: 13,
									mutability: 'mutable',
									name: '',
									nameLocation: '-1:-1:-1',
									nodeType: 'VariableDeclaration',
									scope: 18,
									src: '211:13:0',
									stateVariable: false,
									storageLocation: 'memory',
									typeDescriptions: {
										typeIdentifier: 't_string_memory_ptr',
										typeString: 'string',
									},
									typeName: {
										id: 12,
										name: 'string',
										nodeType: 'ElementaryTypeName',
										src: '211:6:0',
										typeDescriptions: {
											typeIdentifier: 't_string_storage_ptr',
											typeString: 'string',
										},
									},
									visibility: 'internal',
								},
							],
							src: '210:15:0',
						},
						scope: 19,
						stateMutability: 'pure',
						virtual: false,
						visibility: 'public',
					},
				],
				abstract: false,
				baseContracts: [],
				canonicalName: 'HelloWorld2',
				contractDependencies: [],
				contractKind: 'contract',
				fullyImplemented: true,
				linearizedBaseContracts: [19],
				name: 'HelloWorld2',
				nameLocation: '154:11:0',
				scope: 20,
				usedErrors: [],
			},
		],
	},
	id: 0,
} as const
export declare const HelloWorld: typeof _HelloWorld
