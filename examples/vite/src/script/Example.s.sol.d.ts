const _Example = {
	abi: [
		{
			inputs: [],
			name: 'IS_SCRIPT',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'contract ERC20',
					name: 'erc20Contract',
					type: 'address',
				},
				{
					internalType: 'address',
					name: 'recipient',
					type: 'address',
				},
				{
					internalType: 'uint256',
					name: 'amount',
					type: 'uint256',
				},
			],
			name: 'run',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
	],
	bytecode: {
		object:
			'0x6080604052600c805460ff1916600117905534801561001d57600080fd5b506103a88061002d6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80638892170a1461003b578063f8ccbf4714610050575b600080fd5b61004e610049366004610314565b610071565b005b600c5461005d9060ff1681565b604051901515815260200160405180910390f35b6040517f350d56bf00000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f5349474e455200000000000000000000000000000000000000000000000000006044820152600090737109709ecfa91a80626ff3989d68f67f5b1dd12d9063350d56bf90606401602060405180830381865afa15801561010a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061012e9190610355565b6040517f7fec2a8d00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152909150737109709ecfa91a80626ff3989d68f67f5b1dd12d90637fec2a8d90602401600060405180830381600087803b1580156101ac57600080fd5b505af11580156101c0573d6000803e3d6000fd5b50506040517f23b872dd00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8481166004830152868116602483015260448201869052871692506323b872dd91506064016020604051808303816000875af1158015610241573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102659190610379565b507f885cb69240a935d632d79c317109709ecfa91a80626ff3989d68f67f5b1dd12d60001c73ffffffffffffffffffffffffffffffffffffffff166376eadd366040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156102d157600080fd5b505af11580156102e5573d6000803e3d6000fd5b5050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461031157600080fd5b50565b60008060006060848603121561032957600080fd5b8335610334816102ef565b92506020840135610344816102ef565b929592945050506040919091013590565b60006020828403121561036757600080fd5b8151610372816102ef565b9392505050565b60006020828403121561038b57600080fd5b8151801515811461037257600080fdfea164736f6c6343000811000a',
		sourceMap:
			'141:326:19:-:0;;;758:28:4;;;-1:-1:-1;;758:28:4;782:4;758:28;;;141:326:19;;;;;;;;;;;;;;;;',
		linkReferences: {},
	},
	deployedBytecode: {
		object:
			'0x608060405234801561001057600080fd5b50600436106100365760003560e01c80638892170a1461003b578063f8ccbf4714610050575b600080fd5b61004e610049366004610314565b610071565b005b600c5461005d9060ff1681565b604051901515815260200160405180910390f35b6040517f350d56bf00000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f5349474e455200000000000000000000000000000000000000000000000000006044820152600090737109709ecfa91a80626ff3989d68f67f5b1dd12d9063350d56bf90606401602060405180830381865afa15801561010a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061012e9190610355565b6040517f7fec2a8d00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152909150737109709ecfa91a80626ff3989d68f67f5b1dd12d90637fec2a8d90602401600060405180830381600087803b1580156101ac57600080fd5b505af11580156101c0573d6000803e3d6000fd5b50506040517f23b872dd00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8481166004830152868116602483015260448201869052871692506323b872dd91506064016020604051808303816000875af1158015610241573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102659190610379565b507f885cb69240a935d632d79c317109709ecfa91a80626ff3989d68f67f5b1dd12d60001c73ffffffffffffffffffffffffffffffffffffffff166376eadd366040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156102d157600080fd5b505af11580156102e5573d6000803e3d6000fd5b5050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461031157600080fd5b50565b60008060006060848603121561032957600080fd5b8335610334816102ef565b92506020840135610344816102ef565b929592945050506040919091013590565b60006020828403121561036757600080fd5b8151610372816102ef565b9392505050565b60006020828403121561038b57600080fd5b8151801515811461037257600080fdfea164736f6c6343000811000a',
		sourceMap:
			'141:326:19:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;174:291;;;;;;:::i;:::-;;:::i;:::-;;758:28:4;;;;;;;;;;;;835:14:20;;828:22;810:41;;798:2;783:18;758:28:4;;;;;;;174:291:19;309:23;;;;;1064:2:20;309:23:19;;;1046:21:20;1103:1;1083:18;;;1076:29;1141:8;1121:18;;;1114:36;292:14:19;;309:13;;;;1167:18:20;;309:23:19;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;342:25;;;;;1635:42:20;1623:55;;342:25:19;;;1605:74:20;292:40:19;;-1:-1:-1;342:17:19;;;;1578:18:20;;342:25:19;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;377:53:19;;;;;:26;1971:15:20;;;377:53:19;;;1953:34:20;2023:15;;;2003:18;;;1996:43;2055:18;;;2048:34;;;377:26:19;;;-1:-1:-1;377:26:19;;-1:-1:-1;1865:18:20;;377:53:19;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;317:28:3;309:37;;440:16:19;;;:18;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;282:183;174:291;;;:::o;14:161:20:-;107:42;100:5;96:54;89:5;86:65;76:93;;165:1;162;155:12;76:93;14:161;:::o;180:485::-;272:6;280;288;341:2;329:9;320:7;316:23;312:32;309:52;;;357:1;354;347:12;309:52;396:9;383:23;415:38;447:5;415:38;:::i;:::-;472:5;-1:-1:-1;529:2:20;514:18;;501:32;542:40;501:32;542:40;:::i;:::-;180:485;;601:7;;-1:-1:-1;;;655:2:20;640:18;;;;627:32;;180:485::o;1196:258::-;1266:6;1319:2;1307:9;1298:7;1294:23;1290:32;1287:52;;;1335:1;1332;1325:12;1287:52;1367:9;1361:16;1386:38;1418:5;1386:38;:::i;:::-;1443:5;1196:258;-1:-1:-1;;;1196:258:20:o;2093:277::-;2160:6;2213:2;2201:9;2192:7;2188:23;2184:32;2181:52;;;2229:1;2226;2219:12;2181:52;2261:9;2255:16;2314:5;2307:13;2300:21;2293:5;2290:32;2280:60;;2336:1;2333;2326:12',
		linkReferences: {},
	},
	methodIdentifiers: {
		'IS_SCRIPT()': 'f8ccbf47',
		'run(address,address,uint256)': '8892170a',
	},
	rawMetadata:
		'{"compiler":{"version":"0.8.17+commit.8df45f5f"},"language":"Solidity","output":{"abi":[{"inputs":[],"name":"IS_SCRIPT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"erc20Contract","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"run","outputs":[],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"src/script/Example.s.sol":"Example"},"evmVersion":"london","libraries":{},"metadata":{"bytecodeHash":"none"},"optimizer":{"enabled":true,"runs":1000000},"remappings":[":@openzeppelin/=node_modules/@openzeppelin/",":@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/",":ds-test/=lib/forge-std/lib/ds-test/src/",":forge-std/=lib/forge-std/src/"]},"sources":{"lib/forge-std/src/Base.sol":{"keccak256":"0x7f6016716c0c6f49e8163af625290c7ef270a045d9b82be04e269035726d3213","license":"MIT","urls":["bzz-raw://bd050537b58640f8545b319928ee66bef9649d1ebd68a3afa1d28a1ce8cea3dd","dweb:/ipfs/QmbBVxERnZ2ciQuRuZ45czd2DRgouCLEhibLWtC2CrH2j4"]},"lib/forge-std/src/Script.sol":{"keccak256":"0xd566affaba92598bcd059dcb3714a968aeedb365ec0d666815e8b38519e0f433","license":"MIT","urls":["bzz-raw://2fb5f7a97d2a7a06e10c198b60f05e64176eb4ef306b72800c168e7a7ec51693","dweb:/ipfs/Qmcep4r7YEU3BwFJNTTxZsdCVzBYdtcVp8oDtmwLoZGRzP"]},"lib/forge-std/src/StdChains.sol":{"keccak256":"0xd9f9791f56c2afcd841237417d5a55fa8b69de2c1b528ddbfc7d7823fe136606","license":"MIT","urls":["bzz-raw://f66271850d38488984ec1e38aeb57df1cda53538b2ddd19e2164c767792905f0","dweb:/ipfs/QmetNJMTfgJ7SCNMwfLrZEwnL3xdNaBY5vMiqrRrUWjjes"]},"lib/forge-std/src/StdCheats.sol":{"keccak256":"0x94d97a78c720a10212552c5f7f27c61ea58eb027bd51dd054efae6925e785269","license":"MIT","urls":["bzz-raw://563fd7373c84d700606fc113d535b1a103e7bad4b0412e6cb515d927fb8f57bc","dweb:/ipfs/QmQEjP2DXCXRC4bxXPonLfF8cq1UvMhdQu5X1JynPntvio"]},"lib/forge-std/src/StdJson.sol":{"keccak256":"0x113bce4d6d0fe7c4e1e3bf2760ba21c075448660a8dae6003f27b9ff86890612","license":"MIT","urls":["bzz-raw://8c8a169ea47398b475696e66d07e354d9997680b5f954418caeeaec5427a131f","dweb:/ipfs/QmSTK6XmjgYZ2CCGZ87AVTowNL3UWfRvqhT6DTbZoKyJzz"]},"lib/forge-std/src/StdMath.sol":{"keccak256":"0xd90ad4fd8aeaeb8929964e686e769fdedd5eded3fc3815df194a0ab9f91a3fb2","license":"MIT","urls":["bzz-raw://7919b70f636c7b805223992f28ad1ad0145d6c1385b5931a3589aface5fe6c92","dweb:/ipfs/QmY7FRaULwoGgFteF8GawjQJRfasNgpWnU2aiMsFrYpuTC"]},"lib/forge-std/src/StdStorage.sol":{"keccak256":"0xb31c4ee03d05c6202f6e354245ac3ab883d954f9f36074902089e1b3e645273d","license":"MIT","urls":["bzz-raw://33bd98bde50b840b8d7d5cebf818176b9f219345078ed5d3bd0071f035efb2e3","dweb:/ipfs/QmPYC7FZvCWCPF2qWg6TXXTTPGEdnT4y5nebPn1AoZ1H4p"]},"lib/forge-std/src/StdUtils.sol":{"keccak256":"0xc3222299fd637498c81ab5c8e15c9327289d3708fb8a7063dd10a55a8813c9cf","license":"MIT","urls":["bzz-raw://b6f5f818e75e8ae5a67b58cff9b351dd790a72d0a5332fb6f425a3561801b6cc","dweb:/ipfs/QmXJEPtMM1AzwCh6u1o1wL2xdi1qRyxsTLt1eVgeC8Y1QH"]},"lib/forge-std/src/Vm.sol":{"keccak256":"0xfd793ebfb854f707ccf9dfec320b3b75d0d73ba54af0dfae727862fe93bc1cfd","license":"MIT","urls":["bzz-raw://9a0a39917aabf39d981b17d1a06c9b82377917c3a0eedce8e9dc00df5c096bf9","dweb:/ipfs/Qme7GpiHd32FFKYNbY4vdhiiciWPV1z1Uwtj1KDQAusxki"]},"lib/forge-std/src/console.sol":{"keccak256":"0x91d5413c2434ca58fd278b6e1e79fd98d10c83931cc2596a6038eee4daeb34ba","license":"MIT","urls":["bzz-raw://91ccea707361e48b9b7a161fe81f496b9932bc471e9c4e4e1e9c283f2453cc70","dweb:/ipfs/QmcB66sZhQ6Kz7MUHcLE78YXRUZxoZnnxZjN6yATsbB2ec"]},"lib/forge-std/src/console2.sol":{"keccak256":"0xcd5706f5a7025825d9fd389c89b49bf571f9abaea8a062dc4048320b5b43bf46","license":"MIT","urls":["bzz-raw://c066485a7d4bd18d44efb4c89274b0959e8066b9a480383a2ce07d7f31555f88","dweb:/ipfs/QmckeYfA5FtAjcxaytq69Dpj6uY57tbQ61kNPPxXi9kgbW"]},"node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol":{"keccak256":"0x4ffc0547c02ad22925310c585c0f166f8759e2648a09e9b489100c42f15dd98d","license":"MIT","urls":["bzz-raw://15f52f51413a9de1ff191e2f6367c62178e1df7806d7880fe857a98b0b66253d","dweb:/ipfs/QmaQG1fwfgUt5E9nu2cccFiV47B2V78MM1tCy1qB7n4MsH"]},"node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol":{"keccak256":"0x9750c6b834f7b43000631af5cc30001c5f547b3ceb3635488f140f60e897ea6b","license":"MIT","urls":["bzz-raw://5a7d5b1ef5d8d5889ad2ed89d8619c09383b80b72ab226e0fe7bde1636481e34","dweb:/ipfs/QmebXWgtEfumQGBdVeM6c71McLixYXQP5Bk6kKXuoY4Bmr"]},"node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol":{"keccak256":"0x8de418a5503946cabe331f35fe242d3201a73f67f77aaeb7110acb1f30423aca","license":"MIT","urls":["bzz-raw://5a376d3dda2cb70536c0a45c208b29b34ac560c4cb4f513a42079f96ba47d2dd","dweb:/ipfs/QmZQg6gn1sUpM8wHzwNvSnihumUCAhxD119MpXeKp8B9s8"]},"node_modules/@openzeppelin/contracts/utils/Context.sol":{"keccak256":"0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7","license":"MIT","urls":["bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92","dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3"]},"src/script/Example.s.sol":{"keccak256":"0xf354b92aebd4489781c7437831dbe81a3724eed3587e53f4c27efbd313dd9fee","urls":["bzz-raw://985c66ca9b1b25ded8eccb5baffcb4857d210023ef4fa69f5303d03110f3d0dc","dweb:/ipfs/QmVtxV8Kqk3vRmmJ5pmHbkc8LXgxW8zP3Xye7Zmt7CSD8w"]}},"version":1}',
	metadata: {
		compiler: {
			version: '0.8.17+commit.8df45f5f',
		},
		language: 'Solidity',
		output: {
			abi: [
				{
					inputs: [],
					stateMutability: 'view',
					type: 'function',
					name: 'IS_SCRIPT',
					outputs: [
						{
							internalType: 'bool',
							name: '',
							type: 'bool',
						},
					],
				},
				{
					inputs: [
						{
							internalType: 'contract ERC20',
							name: 'erc20Contract',
							type: 'address',
						},
						{
							internalType: 'address',
							name: 'recipient',
							type: 'address',
						},
						{
							internalType: 'uint256',
							name: 'amount',
							type: 'uint256',
						},
					],
					stateMutability: 'nonpayable',
					type: 'function',
					name: 'run',
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
				':@openzeppelin/=node_modules/@openzeppelin/',
				':@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/',
				':ds-test/=lib/forge-std/lib/ds-test/src/',
				':forge-std/=lib/forge-std/src/',
			],
			optimizer: {
				enabled: true,
				runs: 1000000,
			},
			metadata: {
				bytecodeHash: 'none',
			},
			compilationTarget: {
				'src/script/Example.s.sol': 'Example',
			},
			libraries: {},
		},
		sources: {
			'lib/forge-std/src/Base.sol': {
				keccak256:
					'0x7f6016716c0c6f49e8163af625290c7ef270a045d9b82be04e269035726d3213',
				urls: [
					'bzz-raw://bd050537b58640f8545b319928ee66bef9649d1ebd68a3afa1d28a1ce8cea3dd',
					'dweb:/ipfs/QmbBVxERnZ2ciQuRuZ45czd2DRgouCLEhibLWtC2CrH2j4',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/Script.sol': {
				keccak256:
					'0xd566affaba92598bcd059dcb3714a968aeedb365ec0d666815e8b38519e0f433',
				urls: [
					'bzz-raw://2fb5f7a97d2a7a06e10c198b60f05e64176eb4ef306b72800c168e7a7ec51693',
					'dweb:/ipfs/Qmcep4r7YEU3BwFJNTTxZsdCVzBYdtcVp8oDtmwLoZGRzP',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/StdChains.sol': {
				keccak256:
					'0xd9f9791f56c2afcd841237417d5a55fa8b69de2c1b528ddbfc7d7823fe136606',
				urls: [
					'bzz-raw://f66271850d38488984ec1e38aeb57df1cda53538b2ddd19e2164c767792905f0',
					'dweb:/ipfs/QmetNJMTfgJ7SCNMwfLrZEwnL3xdNaBY5vMiqrRrUWjjes',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/StdCheats.sol': {
				keccak256:
					'0x94d97a78c720a10212552c5f7f27c61ea58eb027bd51dd054efae6925e785269',
				urls: [
					'bzz-raw://563fd7373c84d700606fc113d535b1a103e7bad4b0412e6cb515d927fb8f57bc',
					'dweb:/ipfs/QmQEjP2DXCXRC4bxXPonLfF8cq1UvMhdQu5X1JynPntvio',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/StdJson.sol': {
				keccak256:
					'0x113bce4d6d0fe7c4e1e3bf2760ba21c075448660a8dae6003f27b9ff86890612',
				urls: [
					'bzz-raw://8c8a169ea47398b475696e66d07e354d9997680b5f954418caeeaec5427a131f',
					'dweb:/ipfs/QmSTK6XmjgYZ2CCGZ87AVTowNL3UWfRvqhT6DTbZoKyJzz',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/StdMath.sol': {
				keccak256:
					'0xd90ad4fd8aeaeb8929964e686e769fdedd5eded3fc3815df194a0ab9f91a3fb2',
				urls: [
					'bzz-raw://7919b70f636c7b805223992f28ad1ad0145d6c1385b5931a3589aface5fe6c92',
					'dweb:/ipfs/QmY7FRaULwoGgFteF8GawjQJRfasNgpWnU2aiMsFrYpuTC',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/StdStorage.sol': {
				keccak256:
					'0xb31c4ee03d05c6202f6e354245ac3ab883d954f9f36074902089e1b3e645273d',
				urls: [
					'bzz-raw://33bd98bde50b840b8d7d5cebf818176b9f219345078ed5d3bd0071f035efb2e3',
					'dweb:/ipfs/QmPYC7FZvCWCPF2qWg6TXXTTPGEdnT4y5nebPn1AoZ1H4p',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/StdUtils.sol': {
				keccak256:
					'0xc3222299fd637498c81ab5c8e15c9327289d3708fb8a7063dd10a55a8813c9cf',
				urls: [
					'bzz-raw://b6f5f818e75e8ae5a67b58cff9b351dd790a72d0a5332fb6f425a3561801b6cc',
					'dweb:/ipfs/QmXJEPtMM1AzwCh6u1o1wL2xdi1qRyxsTLt1eVgeC8Y1QH',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/Vm.sol': {
				keccak256:
					'0xfd793ebfb854f707ccf9dfec320b3b75d0d73ba54af0dfae727862fe93bc1cfd',
				urls: [
					'bzz-raw://9a0a39917aabf39d981b17d1a06c9b82377917c3a0eedce8e9dc00df5c096bf9',
					'dweb:/ipfs/Qme7GpiHd32FFKYNbY4vdhiiciWPV1z1Uwtj1KDQAusxki',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/console.sol': {
				keccak256:
					'0x91d5413c2434ca58fd278b6e1e79fd98d10c83931cc2596a6038eee4daeb34ba',
				urls: [
					'bzz-raw://91ccea707361e48b9b7a161fe81f496b9932bc471e9c4e4e1e9c283f2453cc70',
					'dweb:/ipfs/QmcB66sZhQ6Kz7MUHcLE78YXRUZxoZnnxZjN6yATsbB2ec',
				],
				license: 'MIT',
			},
			'lib/forge-std/src/console2.sol': {
				keccak256:
					'0xcd5706f5a7025825d9fd389c89b49bf571f9abaea8a062dc4048320b5b43bf46',
				urls: [
					'bzz-raw://c066485a7d4bd18d44efb4c89274b0959e8066b9a480383a2ce07d7f31555f88',
					'dweb:/ipfs/QmckeYfA5FtAjcxaytq69Dpj6uY57tbQ61kNPPxXi9kgbW',
				],
				license: 'MIT',
			},
			'node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol': {
				keccak256:
					'0x4ffc0547c02ad22925310c585c0f166f8759e2648a09e9b489100c42f15dd98d',
				urls: [
					'bzz-raw://15f52f51413a9de1ff191e2f6367c62178e1df7806d7880fe857a98b0b66253d',
					'dweb:/ipfs/QmaQG1fwfgUt5E9nu2cccFiV47B2V78MM1tCy1qB7n4MsH',
				],
				license: 'MIT',
			},
			'node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol': {
				keccak256:
					'0x9750c6b834f7b43000631af5cc30001c5f547b3ceb3635488f140f60e897ea6b',
				urls: [
					'bzz-raw://5a7d5b1ef5d8d5889ad2ed89d8619c09383b80b72ab226e0fe7bde1636481e34',
					'dweb:/ipfs/QmebXWgtEfumQGBdVeM6c71McLixYXQP5Bk6kKXuoY4Bmr',
				],
				license: 'MIT',
			},
			'node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol':
				{
					keccak256:
						'0x8de418a5503946cabe331f35fe242d3201a73f67f77aaeb7110acb1f30423aca',
					urls: [
						'bzz-raw://5a376d3dda2cb70536c0a45c208b29b34ac560c4cb4f513a42079f96ba47d2dd',
						'dweb:/ipfs/QmZQg6gn1sUpM8wHzwNvSnihumUCAhxD119MpXeKp8B9s8',
					],
					license: 'MIT',
				},
			'node_modules/@openzeppelin/contracts/utils/Context.sol': {
				keccak256:
					'0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7',
				urls: [
					'bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92',
					'dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3',
				],
				license: 'MIT',
			},
			'src/script/Example.s.sol': {
				keccak256:
					'0xf354b92aebd4489781c7437831dbe81a3724eed3587e53f4c27efbd313dd9fee',
				urls: [
					'bzz-raw://985c66ca9b1b25ded8eccb5baffcb4857d210023ef4fa69f5303d03110f3d0dc',
					'dweb:/ipfs/QmVtxV8Kqk3vRmmJ5pmHbkc8LXgxW8zP3Xye7Zmt7CSD8w',
				],
				license: null,
			},
		},
		version: 1,
	},
	ast: {
		absolutePath: 'src/script/Example.s.sol',
		id: 23581,
		exportedSymbols: {
			ERC20: [23513],
			Example: [23580],
			Script: [230],
		},
		nodeType: 'SourceUnit',
		src: '0:468:19',
		nodes: [
			{
				id: 23536,
				nodeType: 'PragmaDirective',
				src: '0:24:19',
				nodes: [],
				literals: ['solidity', '^', '0.8', '.17'],
			},
			{
				id: 23538,
				nodeType: 'ImportDirective',
				src: '26:44:19',
				nodes: [],
				absolutePath: 'lib/forge-std/src/Script.sol',
				file: 'forge-std/Script.sol',
				nameLocation: '-1:-1:-1',
				scope: 23581,
				sourceUnit: 231,
				symbolAliases: [
					{
						foreign: {
							id: 23537,
							name: 'Script',
							nodeType: 'Identifier',
							overloadedDeclarations: [],
							referencedDeclaration: 230,
							src: '34:6:19',
							typeDescriptions: {},
						},
						nameLocation: '-1:-1:-1',
					},
				],
				unitAlias: '',
			},
			{
				id: 23540,
				nodeType: 'ImportDirective',
				src: '71:68:19',
				nodes: [],
				absolutePath:
					'node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol',
				file: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
				nameLocation: '-1:-1:-1',
				scope: 23581,
				sourceUnit: 23514,
				symbolAliases: [
					{
						foreign: {
							id: 23539,
							name: 'ERC20',
							nodeType: 'Identifier',
							overloadedDeclarations: [],
							referencedDeclaration: 23513,
							src: '79:5:19',
							typeDescriptions: {},
						},
						nameLocation: '-1:-1:-1',
					},
				],
				unitAlias: '',
			},
			{
				id: 23580,
				nodeType: 'ContractDefinition',
				src: '141:326:19',
				nodes: [
					{
						id: 23579,
						nodeType: 'FunctionDefinition',
						src: '174:291:19',
						nodes: [],
						body: {
							id: 23578,
							nodeType: 'Block',
							src: '282:183:19',
							nodes: [],
							statements: [
								{
									assignments: [23553],
									declarations: [
										{
											constant: false,
											id: 23553,
											mutability: 'mutable',
											name: 'signer',
											nameLocation: '300:6:19',
											nodeType: 'VariableDeclaration',
											scope: 23578,
											src: '292:14:19',
											stateVariable: false,
											storageLocation: 'default',
											typeDescriptions: {
												typeIdentifier: 't_address',
												typeString: 'address',
											},
											typeName: {
												id: 23552,
												name: 'address',
												nodeType: 'ElementaryTypeName',
												src: '292:7:19',
												stateMutability: 'nonpayable',
												typeDescriptions: {
													typeIdentifier: 't_address',
													typeString: 'address',
												},
											},
											visibility: 'internal',
										},
									],
									id: 23558,
									initialValue: {
										arguments: [
											{
												hexValue: '5349474e4552',
												id: 23556,
												isConstant: false,
												isLValue: false,
												isPure: true,
												kind: 'string',
												lValueRequested: false,
												nodeType: 'Literal',
												src: '323:8:19',
												typeDescriptions: {
													typeIdentifier:
														't_stringliteral_2aeb38be3df14d720aeb10a2de6df09b0fb3cd5c5ec256283a22d4593110ca40',
													typeString: 'literal_string "SIGNER"',
												},
												value: 'SIGNER',
											},
										],
										expression: {
											argumentTypes: [
												{
													typeIdentifier:
														't_stringliteral_2aeb38be3df14d720aeb10a2de6df09b0fb3cd5c5ec256283a22d4593110ca40',
													typeString: 'literal_string "SIGNER"',
												},
											],
											expression: {
												id: 23554,
												name: 'vm',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 174,
												src: '309:2:19',
												typeDescriptions: {
													typeIdentifier: 't_contract$_Vm_$6766',
													typeString: 'contract Vm',
												},
											},
											id: 23555,
											isConstant: false,
											isLValue: false,
											isPure: false,
											lValueRequested: false,
											memberLocation: '312:10:19',
											memberName: 'envAddress',
											nodeType: 'MemberAccess',
											referencedDeclaration: 5719,
											src: '309:13:19',
											typeDescriptions: {
												typeIdentifier:
													't_function_external_view$_t_string_memory_ptr_$returns$_t_address_$',
												typeString:
													'function (string memory) view external returns (address)',
											},
										},
										id: 23557,
										isConstant: false,
										isLValue: false,
										isPure: false,
										kind: 'functionCall',
										lValueRequested: false,
										nameLocations: [],
										names: [],
										nodeType: 'FunctionCall',
										src: '309:23:19',
										tryCall: false,
										typeDescriptions: {
											typeIdentifier: 't_address',
											typeString: 'address',
										},
									},
									nodeType: 'VariableDeclarationStatement',
									src: '292:40:19',
								},
								{
									expression: {
										arguments: [
											{
												id: 23562,
												name: 'signer',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 23553,
												src: '360:6:19',
												typeDescriptions: {
													typeIdentifier: 't_address',
													typeString: 'address',
												},
											},
										],
										expression: {
											argumentTypes: [
												{
													typeIdentifier: 't_address',
													typeString: 'address',
												},
											],
											expression: {
												id: 23559,
												name: 'vm',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 174,
												src: '342:2:19',
												typeDescriptions: {
													typeIdentifier: 't_contract$_Vm_$6766',
													typeString: 'contract Vm',
												},
											},
											id: 23561,
											isConstant: false,
											isLValue: false,
											isPure: false,
											lValueRequested: false,
											memberLocation: '345:14:19',
											memberName: 'startBroadcast',
											nodeType: 'MemberAccess',
											referencedDeclaration: 6020,
											src: '342:17:19',
											typeDescriptions: {
												typeIdentifier:
													't_function_external_nonpayable$_t_address_$returns$__$',
												typeString: 'function (address) external',
											},
										},
										id: 23563,
										isConstant: false,
										isLValue: false,
										isPure: false,
										kind: 'functionCall',
										lValueRequested: false,
										nameLocations: [],
										names: [],
										nodeType: 'FunctionCall',
										src: '342:25:19',
										tryCall: false,
										typeDescriptions: {
											typeIdentifier: 't_tuple$__$',
											typeString: 'tuple()',
										},
									},
									id: 23564,
									nodeType: 'ExpressionStatement',
									src: '342:25:19',
								},
								{
									expression: {
										arguments: [
											{
												id: 23568,
												name: 'signer',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 23553,
												src: '404:6:19',
												typeDescriptions: {
													typeIdentifier: 't_address',
													typeString: 'address',
												},
											},
											{
												id: 23569,
												name: 'recipient',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 23547,
												src: '412:9:19',
												typeDescriptions: {
													typeIdentifier: 't_address',
													typeString: 'address',
												},
											},
											{
												id: 23570,
												name: 'amount',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 23549,
												src: '423:6:19',
												typeDescriptions: {
													typeIdentifier: 't_uint256',
													typeString: 'uint256',
												},
											},
										],
										expression: {
											argumentTypes: [
												{
													typeIdentifier: 't_address',
													typeString: 'address',
												},
												{
													typeIdentifier: 't_address',
													typeString: 'address',
												},
												{
													typeIdentifier: 't_uint256',
													typeString: 'uint256',
												},
											],
											expression: {
												id: 23565,
												name: 'erc20Contract',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 23545,
												src: '377:13:19',
												typeDescriptions: {
													typeIdentifier: 't_contract$_ERC20_$23513',
													typeString: 'contract ERC20',
												},
											},
											id: 23567,
											isConstant: false,
											isLValue: false,
											isPure: false,
											lValueRequested: false,
											memberLocation: '391:12:19',
											memberName: 'transferFrom',
											nodeType: 'MemberAccess',
											referencedDeclaration: 23126,
											src: '377:26:19',
											typeDescriptions: {
												typeIdentifier:
													't_function_external_nonpayable$_t_address_$_t_address_$_t_uint256_$returns$_t_bool_$',
												typeString:
													'function (address,address,uint256) external returns (bool)',
											},
										},
										id: 23571,
										isConstant: false,
										isLValue: false,
										isPure: false,
										kind: 'functionCall',
										lValueRequested: false,
										nameLocations: [],
										names: [],
										nodeType: 'FunctionCall',
										src: '377:53:19',
										tryCall: false,
										typeDescriptions: {
											typeIdentifier: 't_bool',
											typeString: 'bool',
										},
									},
									id: 23572,
									nodeType: 'ExpressionStatement',
									src: '377:53:19',
								},
								{
									expression: {
										arguments: [],
										expression: {
											argumentTypes: [],
											expression: {
												id: 23573,
												name: 'vm',
												nodeType: 'Identifier',
												overloadedDeclarations: [],
												referencedDeclaration: 174,
												src: '440:2:19',
												typeDescriptions: {
													typeIdentifier: 't_contract$_Vm_$6766',
													typeString: 'contract Vm',
												},
											},
											id: 23575,
											isConstant: false,
											isLValue: false,
											isPure: false,
											lValueRequested: false,
											memberLocation: '443:13:19',
											memberName: 'stopBroadcast',
											nodeType: 'MemberAccess',
											referencedDeclaration: 6028,
											src: '440:16:19',
											typeDescriptions: {
												typeIdentifier:
													't_function_external_nonpayable$__$returns$__$',
												typeString: 'function () external',
											},
										},
										id: 23576,
										isConstant: false,
										isLValue: false,
										isPure: false,
										kind: 'functionCall',
										lValueRequested: false,
										nameLocations: [],
										names: [],
										nodeType: 'FunctionCall',
										src: '440:18:19',
										tryCall: false,
										typeDescriptions: {
											typeIdentifier: 't_tuple$__$',
											typeString: 'tuple()',
										},
									},
									id: 23577,
									nodeType: 'ExpressionStatement',
									src: '440:18:19',
								},
							],
						},
						functionSelector: '8892170a',
						implemented: true,
						kind: 'function',
						modifiers: [],
						name: 'run',
						nameLocation: '183:3:19',
						parameters: {
							id: 23550,
							nodeType: 'ParameterList',
							parameters: [
								{
									constant: false,
									id: 23545,
									mutability: 'mutable',
									name: 'erc20Contract',
									nameLocation: '202:13:19',
									nodeType: 'VariableDeclaration',
									scope: 23579,
									src: '196:19:19',
									stateVariable: false,
									storageLocation: 'default',
									typeDescriptions: {
										typeIdentifier: 't_contract$_ERC20_$23513',
										typeString: 'contract ERC20',
									},
									typeName: {
										id: 23544,
										nodeType: 'UserDefinedTypeName',
										pathNode: {
											id: 23543,
											name: 'ERC20',
											nameLocations: ['196:5:19'],
											nodeType: 'IdentifierPath',
											referencedDeclaration: 23513,
											src: '196:5:19',
										},
										referencedDeclaration: 23513,
										src: '196:5:19',
										typeDescriptions: {
											typeIdentifier: 't_contract$_ERC20_$23513',
											typeString: 'contract ERC20',
										},
									},
									visibility: 'internal',
								},
								{
									constant: false,
									id: 23547,
									mutability: 'mutable',
									name: 'recipient',
									nameLocation: '233:9:19',
									nodeType: 'VariableDeclaration',
									scope: 23579,
									src: '225:17:19',
									stateVariable: false,
									storageLocation: 'default',
									typeDescriptions: {
										typeIdentifier: 't_address',
										typeString: 'address',
									},
									typeName: {
										id: 23546,
										name: 'address',
										nodeType: 'ElementaryTypeName',
										src: '225:7:19',
										stateMutability: 'nonpayable',
										typeDescriptions: {
											typeIdentifier: 't_address',
											typeString: 'address',
										},
									},
									visibility: 'internal',
								},
								{
									constant: false,
									id: 23549,
									mutability: 'mutable',
									name: 'amount',
									nameLocation: '260:6:19',
									nodeType: 'VariableDeclaration',
									scope: 23579,
									src: '252:14:19',
									stateVariable: false,
									storageLocation: 'default',
									typeDescriptions: {
										typeIdentifier: 't_uint256',
										typeString: 'uint256',
									},
									typeName: {
										id: 23548,
										name: 'uint256',
										nodeType: 'ElementaryTypeName',
										src: '252:7:19',
										typeDescriptions: {
											typeIdentifier: 't_uint256',
											typeString: 'uint256',
										},
									},
									visibility: 'internal',
								},
							],
							src: '186:86:19',
						},
						returnParameters: {
							id: 23551,
							nodeType: 'ParameterList',
							parameters: [],
							src: '282:0:19',
						},
						scope: 23580,
						stateMutability: 'nonpayable',
						virtual: false,
						visibility: 'external',
					},
				],
				abstract: false,
				baseContracts: [
					{
						baseName: {
							id: 23541,
							name: 'Script',
							nameLocations: ['161:6:19'],
							nodeType: 'IdentifierPath',
							referencedDeclaration: 230,
							src: '161:6:19',
						},
						id: 23542,
						nodeType: 'InheritanceSpecifier',
						src: '161:6:19',
					},
				],
				canonicalName: 'Example',
				contractDependencies: [],
				contractKind: 'contract',
				fullyImplemented: true,
				linearizedBaseContracts: [23580, 230, 193, 178, 5609, 2314, 766],
				name: 'Example',
				nameLocation: '150:7:19',
				scope: 23581,
				usedErrors: [],
			},
		],
	},
	id: 19,
} as const
export declare const Example: typeof _Example
