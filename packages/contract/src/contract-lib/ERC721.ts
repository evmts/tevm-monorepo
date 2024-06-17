import { createContract } from '../createContract.js'
const _OzERC721 = {
	name: 'OzERC721',
	humanReadableAbi: [
		'constructor(string name, string symbol)',
		'error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner)',
		'error ERC721InsufficientApproval(address operator, uint256 tokenId)',
		'error ERC721InvalidApprover(address approver)',
		'error ERC721InvalidOperator(address operator)',
		'error ERC721InvalidOwner(address owner)',
		'error ERC721InvalidReceiver(address receiver)',
		'error ERC721InvalidSender(address sender)',
		'error ERC721NonexistentToken(uint256 tokenId)',
		'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
		'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
		'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
		'function approve(address to, uint256 tokenId)',
		'function balanceOf(address owner) view returns (uint256)',
		'function getApproved(uint256 tokenId) view returns (address)',
		'function isApprovedForAll(address owner, address operator) view returns (bool)',
		'function name() view returns (string)',
		'function ownerOf(uint256 tokenId) view returns (address)',
		'function safeTransferFrom(address from, address to, uint256 tokenId)',
		'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
		'function setApprovalForAll(address operator, bool approved)',
		'function supportsInterface(bytes4 interfaceId) view returns (bool)',
		'function symbol() view returns (string)',
		'function tokenURI(uint256 tokenId) view returns (string)',
		'function transferFrom(address from, address to, uint256 tokenId)',
	],
	bytecode:
		'0x608060405234801562000010575f80fd5b5060405162002174380380620021748339818101604052810190620000369190620001ea565b8181815f9081620000489190620004a4565b5080600190816200005a9190620004a4565b505050505062000588565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b620000c6826200007e565b810181811067ffffffffffffffff82111715620000e857620000e76200008e565b5b80604052505050565b5f620000fc62000065565b90506200010a8282620000bb565b919050565b5f67ffffffffffffffff8211156200012c576200012b6200008e565b5b62000137826200007e565b9050602081019050919050565b5f5b838110156200016357808201518184015260208101905062000146565b5f8484015250505050565b5f620001846200017e846200010f565b620000f1565b905082815260208101848484011115620001a357620001a26200007a565b5b620001b084828562000144565b509392505050565b5f82601f830112620001cf57620001ce62000076565b5b8151620001e18482602086016200016e565b91505092915050565b5f80604083850312156200020357620002026200006e565b5b5f83015167ffffffffffffffff81111562000223576200022262000072565b5b6200023185828601620001b8565b925050602083015167ffffffffffffffff81111562000255576200025462000072565b5b6200026385828601620001b8565b9150509250929050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680620002bc57607f821691505b602082108103620002d257620002d162000277565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620003367fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002f9565b620003428683620002f9565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6200038c6200038662000380846200035a565b62000363565b6200035a565b9050919050565b5f819050919050565b620003a7836200036c565b620003bf620003b68262000393565b84845462000305565b825550505050565b5f90565b620003d5620003c7565b620003e28184846200039c565b505050565b5b818110156200040957620003fd5f82620003cb565b600181019050620003e8565b5050565b601f82111562000458576200042281620002d8565b6200042d84620002ea565b810160208510156200043d578190505b620004556200044c85620002ea565b830182620003e7565b50505b505050565b5f82821c905092915050565b5f6200047a5f19846008026200045d565b1980831691505092915050565b5f62000494838362000469565b9150826002028217905092915050565b620004af826200026d565b67ffffffffffffffff811115620004cb57620004ca6200008e565b5b620004d78254620002a4565b620004e48282856200040d565b5f60209050601f8311600181146200051a575f841562000505578287015190505b62000511858262000487565b86555062000580565b601f1984166200052a86620002d8565b5f5b8281101562000553578489015182556001820191506020850194506020810190506200052c565b868310156200057357848901516200056f601f89168262000469565b8355505b6001600288020188555050505b505050505050565b611bde80620005965f395ff3fe608060405234801561000f575f80fd5b50600436106100cd575f3560e01c80636352211e1161008a578063a22cb46511610064578063a22cb46514610221578063b88d4fde1461023d578063c87b56dd14610259578063e985e9c514610289576100cd565b80636352211e146101a357806370a08231146101d357806395d89b4114610203576100cd565b806301ffc9a7146100d157806306fdde0314610101578063081812fc1461011f578063095ea7b31461014f57806323b872dd1461016b57806342842e0e14610187575b5f80fd5b6100eb60048036038101906100e6919061146f565b6102b9565b6040516100f891906114b4565b60405180910390f35b61010961039a565b6040516101169190611557565b60405180910390f35b610139600480360381019061013491906115aa565b610429565b6040516101469190611614565b60405180910390f35b61016960048036038101906101649190611657565b610444565b005b61018560048036038101906101809190611695565b61045a565b005b6101a1600480360381019061019c9190611695565b610559565b005b6101bd60048036038101906101b891906115aa565b610578565b6040516101ca9190611614565b60405180910390f35b6101ed60048036038101906101e891906116e5565b610589565b6040516101fa919061171f565b60405180910390f35b61020b61063f565b6040516102189190611557565b60405180910390f35b61023b60048036038101906102369190611762565b6106cf565b005b610257600480360381019061025291906118cc565b6106e5565b005b610273600480360381019061026e91906115aa565b610702565b6040516102809190611557565b60405180910390f35b6102a3600480360381019061029e919061194c565b610768565b6040516102b091906114b4565b60405180910390f35b5f7f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061038357507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103935750610392826107f6565b5b9050919050565b60605f80546103a8906119b7565b80601f01602080910402602001604051908101604052809291908181526020018280546103d4906119b7565b801561041f5780601f106103f65761010080835404028352916020019161041f565b820191905f5260205f20905b81548152906001019060200180831161040257829003601f168201915b5050505050905090565b5f6104338261085f565b5061043d826108e5565b9050919050565b610456828261045161091e565b610925565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036104ca575f6040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016104c19190611614565b60405180910390fd5b5f6104dd83836104d861091e565b610937565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610553578382826040517f64283d7b00000000000000000000000000000000000000000000000000000000815260040161054a939291906119e7565b60405180910390fd5b50505050565b61057383838360405180602001604052805f8152506106e5565b505050565b5f6105828261085f565b9050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105fa575f6040517f89c62b640000000000000000000000000000000000000000000000000000000081526004016105f19190611614565b60405180910390fd5b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b60606001805461064e906119b7565b80601f016020809104026020016040519081016040528092919081815260200182805461067a906119b7565b80156106c55780601f1061069c576101008083540402835291602001916106c5565b820191905f5260205f20905b8154815290600101906020018083116106a857829003601f168201915b5050505050905090565b6106e16106da61091e565b8383610b42565b5050565b6106f084848461045a565b6106fc84848484610cab565b50505050565b606061070d8261085f565b505f610717610e5d565b90505f8151116107355760405180602001604052805f815250610760565b8061073f84610e73565b604051602001610750929190611a56565b6040516020818303038152906040525b915050919050565b5f60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f8061086a83610f3d565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036108dc57826040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016108d3919061171f565b60405180910390fd5b80915050919050565b5f60045f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b5f33905090565b6109328383836001610f76565b505050565b5f8061094284610f3d565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161461098357610982818486611135565b5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a0e576109c25f855f80610f76565b600160035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825403925050819055505b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610a8d57600160035f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8460025f8681526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610bb257816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610ba99190611614565b60405180910390fd5b8060055f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610c9e91906114b4565b60405180910390a3505050565b5f8373ffffffffffffffffffffffffffffffffffffffff163b1115610e57578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02610cee61091e565b8685856040518563ffffffff1660e01b8152600401610d109493929190611acb565b6020604051808303815f875af1925050508015610d4b57506040513d601f19601f82011682018060405250810190610d489190611b29565b60015b610dcc573d805f8114610d79576040519150601f19603f3d011682016040523d82523d5f602084013e610d7e565b606091505b505f815103610dc457836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610dbb9190611614565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614610e5557836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610e4c9190611614565b60405180910390fd5b505b50505050565b606060405180602001604052805f815250905090565b60605f6001610e81846111f8565b0190505f8167ffffffffffffffff811115610e9f57610e9e6117a8565b5b6040519080825280601f01601f191660200182016040528015610ed15781602001600182028036833780820191505090505b5090505f82602001820190505b600115610f32578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581610f2757610f26611b54565b5b0494505f8503610ede575b819350505050919050565b5f60025f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b8080610fae57505f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156110e0575f610fbd8461085f565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561102757508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561103a57506110388184610768565b155b1561107c57826040517fa9fbf51f0000000000000000000000000000000000000000000000000000000081526004016110739190611614565b60405180910390fd5b81156110de57838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b8360045f8581526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b611140838383611349565b6111f3575f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036111b457806040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016111ab919061171f565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016111ea929190611b81565b60405180910390fd5b505050565b5f805f90507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611254577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161124a57611249611b54565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611291576d04ee2d6d415b85acef8100000000838161128757611286611b54565b5b0492506020810190505b662386f26fc1000083106112c057662386f26fc1000083816112b6576112b5611b54565b5b0492506010810190505b6305f5e10083106112e9576305f5e10083816112df576112de611b54565b5b0492506008810190505b612710831061130e57612710838161130457611303611b54565b5b0492506004810190505b60648310611331576064838161132757611326611b54565b5b0492506002810190505b600a8310611340576001810190505b80915050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561140057508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806113c157506113c08484610768565b5b806113ff57508273ffffffffffffffffffffffffffffffffffffffff166113e7836108e5565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61144e8161141a565b8114611458575f80fd5b50565b5f8135905061146981611445565b92915050565b5f6020828403121561148457611483611412565b5b5f6114918482850161145b565b91505092915050565b5f8115159050919050565b6114ae8161149a565b82525050565b5f6020820190506114c75f8301846114a5565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f5b838110156115045780820151818401526020810190506114e9565b5f8484015250505050565b5f601f19601f8301169050919050565b5f611529826114cd565b61153381856114d7565b93506115438185602086016114e7565b61154c8161150f565b840191505092915050565b5f6020820190508181035f83015261156f818461151f565b905092915050565b5f819050919050565b61158981611577565b8114611593575f80fd5b50565b5f813590506115a481611580565b92915050565b5f602082840312156115bf576115be611412565b5b5f6115cc84828501611596565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6115fe826115d5565b9050919050565b61160e816115f4565b82525050565b5f6020820190506116275f830184611605565b92915050565b611636816115f4565b8114611640575f80fd5b50565b5f813590506116518161162d565b92915050565b5f806040838503121561166d5761166c611412565b5b5f61167a85828601611643565b925050602061168b85828601611596565b9150509250929050565b5f805f606084860312156116ac576116ab611412565b5b5f6116b986828701611643565b93505060206116ca86828701611643565b92505060406116db86828701611596565b9150509250925092565b5f602082840312156116fa576116f9611412565b5b5f61170784828501611643565b91505092915050565b61171981611577565b82525050565b5f6020820190506117325f830184611710565b92915050565b6117418161149a565b811461174b575f80fd5b50565b5f8135905061175c81611738565b92915050565b5f806040838503121561177857611777611412565b5b5f61178585828601611643565b92505060206117968582860161174e565b9150509250929050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6117de8261150f565b810181811067ffffffffffffffff821117156117fd576117fc6117a8565b5b80604052505050565b5f61180f611409565b905061181b82826117d5565b919050565b5f67ffffffffffffffff82111561183a576118396117a8565b5b6118438261150f565b9050602081019050919050565b828183375f83830152505050565b5f61187061186b84611820565b611806565b90508281526020810184848401111561188c5761188b6117a4565b5b611897848285611850565b509392505050565b5f82601f8301126118b3576118b26117a0565b5b81356118c384826020860161185e565b91505092915050565b5f805f80608085870312156118e4576118e3611412565b5b5f6118f187828801611643565b945050602061190287828801611643565b935050604061191387828801611596565b925050606085013567ffffffffffffffff81111561193457611933611416565b5b6119408782880161189f565b91505092959194509250565b5f806040838503121561196257611961611412565b5b5f61196f85828601611643565b925050602061198085828601611643565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806119ce57607f821691505b6020821081036119e1576119e061198a565b5b50919050565b5f6060820190506119fa5f830186611605565b611a076020830185611710565b611a146040830184611605565b949350505050565b5f81905092915050565b5f611a30826114cd565b611a3a8185611a1c565b9350611a4a8185602086016114e7565b80840191505092915050565b5f611a618285611a26565b9150611a6d8284611a26565b91508190509392505050565b5f81519050919050565b5f82825260208201905092915050565b5f611a9d82611a79565b611aa78185611a83565b9350611ab78185602086016114e7565b611ac08161150f565b840191505092915050565b5f608082019050611ade5f830187611605565b611aeb6020830186611605565b611af86040830185611710565b8181036060830152611b0a8184611a93565b905095945050505050565b5f81519050611b2381611445565b92915050565b5f60208284031215611b3e57611b3d611412565b5b5f611b4b84828501611b15565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b5f604082019050611b945f830185611605565b611ba16020830184611710565b939250505056fea2646970667358221220660c47cef4875784ced30d2987fb0203ddda8f97b11c21c4a3205a82e611b4d064736f6c63430008160033',
	deployedBytecode:
		'0x608060405234801561000f575f80fd5b50600436106100cd575f3560e01c80636352211e1161008a578063a22cb46511610064578063a22cb46514610221578063b88d4fde1461023d578063c87b56dd14610259578063e985e9c514610289576100cd565b80636352211e146101a357806370a08231146101d357806395d89b4114610203576100cd565b806301ffc9a7146100d157806306fdde0314610101578063081812fc1461011f578063095ea7b31461014f57806323b872dd1461016b57806342842e0e14610187575b5f80fd5b6100eb60048036038101906100e6919061146f565b6102b9565b6040516100f891906114b4565b60405180910390f35b61010961039a565b6040516101169190611557565b60405180910390f35b610139600480360381019061013491906115aa565b610429565b6040516101469190611614565b60405180910390f35b61016960048036038101906101649190611657565b610444565b005b61018560048036038101906101809190611695565b61045a565b005b6101a1600480360381019061019c9190611695565b610559565b005b6101bd60048036038101906101b891906115aa565b610578565b6040516101ca9190611614565b60405180910390f35b6101ed60048036038101906101e891906116e5565b610589565b6040516101fa919061171f565b60405180910390f35b61020b61063f565b6040516102189190611557565b60405180910390f35b61023b60048036038101906102369190611762565b6106cf565b005b610257600480360381019061025291906118cc565b6106e5565b005b610273600480360381019061026e91906115aa565b610702565b6040516102809190611557565b60405180910390f35b6102a3600480360381019061029e919061194c565b610768565b6040516102b091906114b4565b60405180910390f35b5f7f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061038357507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103935750610392826107f6565b5b9050919050565b60605f80546103a8906119b7565b80601f01602080910402602001604051908101604052809291908181526020018280546103d4906119b7565b801561041f5780601f106103f65761010080835404028352916020019161041f565b820191905f5260205f20905b81548152906001019060200180831161040257829003601f168201915b5050505050905090565b5f6104338261085f565b5061043d826108e5565b9050919050565b610456828261045161091e565b610925565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036104ca575f6040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016104c19190611614565b60405180910390fd5b5f6104dd83836104d861091e565b610937565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610553578382826040517f64283d7b00000000000000000000000000000000000000000000000000000000815260040161054a939291906119e7565b60405180910390fd5b50505050565b61057383838360405180602001604052805f8152506106e5565b505050565b5f6105828261085f565b9050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105fa575f6040517f89c62b640000000000000000000000000000000000000000000000000000000081526004016105f19190611614565b60405180910390fd5b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b60606001805461064e906119b7565b80601f016020809104026020016040519081016040528092919081815260200182805461067a906119b7565b80156106c55780601f1061069c576101008083540402835291602001916106c5565b820191905f5260205f20905b8154815290600101906020018083116106a857829003601f168201915b5050505050905090565b6106e16106da61091e565b8383610b42565b5050565b6106f084848461045a565b6106fc84848484610cab565b50505050565b606061070d8261085f565b505f610717610e5d565b90505f8151116107355760405180602001604052805f815250610760565b8061073f84610e73565b604051602001610750929190611a56565b6040516020818303038152906040525b915050919050565b5f60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f8061086a83610f3d565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036108dc57826040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016108d3919061171f565b60405180910390fd5b80915050919050565b5f60045f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b5f33905090565b6109328383836001610f76565b505050565b5f8061094284610f3d565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161461098357610982818486611135565b5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a0e576109c25f855f80610f76565b600160035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825403925050819055505b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610a8d57600160035f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8460025f8681526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610bb257816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610ba99190611614565b60405180910390fd5b8060055f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610c9e91906114b4565b60405180910390a3505050565b5f8373ffffffffffffffffffffffffffffffffffffffff163b1115610e57578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02610cee61091e565b8685856040518563ffffffff1660e01b8152600401610d109493929190611acb565b6020604051808303815f875af1925050508015610d4b57506040513d601f19601f82011682018060405250810190610d489190611b29565b60015b610dcc573d805f8114610d79576040519150601f19603f3d011682016040523d82523d5f602084013e610d7e565b606091505b505f815103610dc457836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610dbb9190611614565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614610e5557836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610e4c9190611614565b60405180910390fd5b505b50505050565b606060405180602001604052805f815250905090565b60605f6001610e81846111f8565b0190505f8167ffffffffffffffff811115610e9f57610e9e6117a8565b5b6040519080825280601f01601f191660200182016040528015610ed15781602001600182028036833780820191505090505b5090505f82602001820190505b600115610f32578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581610f2757610f26611b54565b5b0494505f8503610ede575b819350505050919050565b5f60025f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b8080610fae57505f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156110e0575f610fbd8461085f565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561102757508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561103a57506110388184610768565b155b1561107c57826040517fa9fbf51f0000000000000000000000000000000000000000000000000000000081526004016110739190611614565b60405180910390fd5b81156110de57838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b8360045f8581526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b611140838383611349565b6111f3575f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036111b457806040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016111ab919061171f565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016111ea929190611b81565b60405180910390fd5b505050565b5f805f90507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611254577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161124a57611249611b54565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611291576d04ee2d6d415b85acef8100000000838161128757611286611b54565b5b0492506020810190505b662386f26fc1000083106112c057662386f26fc1000083816112b6576112b5611b54565b5b0492506010810190505b6305f5e10083106112e9576305f5e10083816112df576112de611b54565b5b0492506008810190505b612710831061130e57612710838161130457611303611b54565b5b0492506004810190505b60648310611331576064838161132757611326611b54565b5b0492506002810190505b600a8310611340576001810190505b80915050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561140057508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806113c157506113c08484610768565b5b806113ff57508273ffffffffffffffffffffffffffffffffffffffff166113e7836108e5565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61144e8161141a565b8114611458575f80fd5b50565b5f8135905061146981611445565b92915050565b5f6020828403121561148457611483611412565b5b5f6114918482850161145b565b91505092915050565b5f8115159050919050565b6114ae8161149a565b82525050565b5f6020820190506114c75f8301846114a5565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f5b838110156115045780820151818401526020810190506114e9565b5f8484015250505050565b5f601f19601f8301169050919050565b5f611529826114cd565b61153381856114d7565b93506115438185602086016114e7565b61154c8161150f565b840191505092915050565b5f6020820190508181035f83015261156f818461151f565b905092915050565b5f819050919050565b61158981611577565b8114611593575f80fd5b50565b5f813590506115a481611580565b92915050565b5f602082840312156115bf576115be611412565b5b5f6115cc84828501611596565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6115fe826115d5565b9050919050565b61160e816115f4565b82525050565b5f6020820190506116275f830184611605565b92915050565b611636816115f4565b8114611640575f80fd5b50565b5f813590506116518161162d565b92915050565b5f806040838503121561166d5761166c611412565b5b5f61167a85828601611643565b925050602061168b85828601611596565b9150509250929050565b5f805f606084860312156116ac576116ab611412565b5b5f6116b986828701611643565b93505060206116ca86828701611643565b92505060406116db86828701611596565b9150509250925092565b5f602082840312156116fa576116f9611412565b5b5f61170784828501611643565b91505092915050565b61171981611577565b82525050565b5f6020820190506117325f830184611710565b92915050565b6117418161149a565b811461174b575f80fd5b50565b5f8135905061175c81611738565b92915050565b5f806040838503121561177857611777611412565b5b5f61178585828601611643565b92505060206117968582860161174e565b9150509250929050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6117de8261150f565b810181811067ffffffffffffffff821117156117fd576117fc6117a8565b5b80604052505050565b5f61180f611409565b905061181b82826117d5565b919050565b5f67ffffffffffffffff82111561183a576118396117a8565b5b6118438261150f565b9050602081019050919050565b828183375f83830152505050565b5f61187061186b84611820565b611806565b90508281526020810184848401111561188c5761188b6117a4565b5b611897848285611850565b509392505050565b5f82601f8301126118b3576118b26117a0565b5b81356118c384826020860161185e565b91505092915050565b5f805f80608085870312156118e4576118e3611412565b5b5f6118f187828801611643565b945050602061190287828801611643565b935050604061191387828801611596565b925050606085013567ffffffffffffffff81111561193457611933611416565b5b6119408782880161189f565b91505092959194509250565b5f806040838503121561196257611961611412565b5b5f61196f85828601611643565b925050602061198085828601611643565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806119ce57607f821691505b6020821081036119e1576119e061198a565b5b50919050565b5f6060820190506119fa5f830186611605565b611a076020830185611710565b611a146040830184611605565b949350505050565b5f81905092915050565b5f611a30826114cd565b611a3a8185611a1c565b9350611a4a8185602086016114e7565b80840191505092915050565b5f611a618285611a26565b9150611a6d8284611a26565b91508190509392505050565b5f81519050919050565b5f82825260208201905092915050565b5f611a9d82611a79565b611aa78185611a83565b9350611ab78185602086016114e7565b611ac08161150f565b840191505092915050565b5f608082019050611ade5f830187611605565b611aeb6020830186611605565b611af86040830185611710565b8181036060830152611b0a8184611a93565b905095945050505050565b5f81519050611b2381611445565b92915050565b5f60208284031215611b3e57611b3d611412565b5b5f611b4b84828501611b15565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b5f604082019050611b945f830185611605565b611ba16020830184611710565b939250505056fea2646970667358221220660c47cef4875784ced30d2987fb0203ddda8f97b11c21c4a3205a82e611b4d064736f6c63430008160033',
} as const
/**
 * Bytecode and ABI for the ERC721 contract from open zeppelin.
 */
export const ERC721 = createContract(_OzERC721)
