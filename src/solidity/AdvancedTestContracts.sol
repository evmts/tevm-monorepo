// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title AdvancedTestContracts
 * @dev Advanced contracts for testing specific EVM features and edge cases
 */

/**
 * @dev Contract for testing EIP-1153 transient storage
 */
contract TransientStorageTester {
    // Regular storage for comparison
    uint256 public persistentValue;
    
    // Event to track operations
    event TransientOperation(string operation, uint256 slot, uint256 value);
    
    function setTransient(uint256 slot, uint256 value) external {
        assembly {
            tstore(slot, value)
        }
        emit TransientOperation("set", slot, value);
    }
    
    function getTransient(uint256 slot) external view returns (uint256 value) {
        assembly {
            value := tload(slot)
        }
    }
    
    function setPersistent(uint256 value) external {
        persistentValue = value;
    }
    
    function testTransientInCall(address target, uint256 slot, uint256 value) external returns (uint256) {
        // Set transient storage
        assembly {
            tstore(slot, value)
        }
        
        // Make external call - transient storage should persist
        bytes memory data = abi.encodeWithSignature("getTransient(uint256)", slot);
        (bool success, bytes memory returnData) = target.call(data);
        
        if (success) {
            return abi.decode(returnData, (uint256));
        }
        return 0;
    }
    
    function transientSurvivesRevert(uint256 slot, uint256 value) external returns (bool) {
        // Set transient storage
        assembly {
            tstore(slot, value)
        }
        
        // Try operation that reverts
        try this.alwaysReverts() {
            return false;
        } catch {
            // Check if transient storage survived
            uint256 retrieved;
            assembly {
                retrieved := tload(slot)
            }
            return retrieved == value;
        }
    }
    
    function alwaysReverts() external pure {
        revert("Always reverts");
    }
}

/**
 * @dev Contract for testing self-destruct functionality
 */
contract SelfDestructTester {
    address public beneficiary;
    uint256 public value;
    
    event WillSelfDestruct(address beneficiary, uint256 balance);
    
    constructor() payable {
        value = 42;
    }
    
    receive() external payable {}
    
    function setBeneficiary(address _beneficiary) external {
        beneficiary = _beneficiary;
    }
    
    function destroyContract() external {
        emit WillSelfDestruct(beneficiary, address(this).balance);
        selfdestruct(payable(beneficiary));
    }
    
    function getValue() external view returns (uint256) {
        return value;
    }
    
    function createAndDestroy(address _beneficiary) external payable returns (address) {
        SelfDestructTester newContract = new SelfDestructTester{value: msg.value}();
        newContract.setBeneficiary(_beneficiary);
        newContract.destroyContract();
        return address(newContract);
    }
}

/**
 * @dev Contract for testing block and environment opcodes
 */
contract EnvironmentTester {
    struct BlockInfo {
        uint256 number;
        uint256 timestamp;
        uint256 difficulty;
        uint256 gasLimit;
        address coinbase;
        bytes32 blockHash;
    }
    
    event BlockInfoCaptured(BlockInfo info);
    
    function captureBlockInfo() external returns (BlockInfo memory info) {
        info = BlockInfo({
            number: block.number,
            timestamp: block.timestamp,
            difficulty: block.difficulty,
            gasLimit: block.gaslimit,
            coinbase: block.coinbase,
            blockHash: blockhash(block.number - 1)
        });
        
        emit BlockInfoCaptured(info);
    }
    
    function getChainId() external view returns (uint256) {
        return block.chainid;
    }
    
    function getBaseFee() external view returns (uint256) {
        return block.basefee;
    }
    
    function testBlockhash(uint256 blockNumber) external view returns (bytes32) {
        return blockhash(blockNumber);
    }
    
    function getMsgInfo() external payable returns (address sender, uint256 value, bytes calldata data, bytes4 sig) {
        return (msg.sender, msg.value, msg.data, msg.sig);
    }
    
    function getTxInfo() external view returns (address origin, uint256 gasPrice) {
        return (tx.origin, tx.gasprice);
    }
    
    function getContractInfo() external view returns (address addr, uint256 balance, bytes32 codeHash, uint256 codeSize) {
        addr = address(this);
        balance = addr.balance;
        
        assembly {
            codeHash := extcodehash(addr)
            codeSize := extcodesize(addr)
        }
    }
}

/**
 * @dev Contract for testing logs and events
 */
contract LogTester {
    event SimpleEvent();
    event IndexedEvent(uint256 indexed value, address indexed sender);
    event ComplexEvent(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        uint256 amount,
        string message
    );
    event AnonymousEvent(uint256 value) anonymous;
    
    function emitSimple() external {
        emit SimpleEvent();
    }
    
    function emitIndexed(uint256 value) external {
        emit IndexedEvent(value, msg.sender);
    }
    
    function emitComplex(
        uint256 id,
        address from,
        address to,
        uint256 amount,
        string calldata message
    ) external {
        emit ComplexEvent(id, from, to, amount, message);
    }
    
    function emitAnonymous(uint256 value) external {
        emit AnonymousEvent(value);
    }
    
    function emitMultiple(uint256 count) external {
        for (uint256 i = 0; i < count; i++) {
            emit IndexedEvent(i, msg.sender);
        }
    }
    
    function emitLargeData() external {
        string memory largeMessage = new string(1024);
        bytes memory data = bytes(largeMessage);
        
        // Fill with pattern
        for (uint i = 0; i < data.length; i++) {
            data[i] = bytes1(uint8(65 + (i % 26))); // A-Z pattern
        }
        
        emit ComplexEvent(999, msg.sender, address(0), 0, string(data));
    }
}

/**
 * @dev Contract for testing bytecode analysis and jump destinations
 */
contract JumpTester {
    function simpleJump() external pure returns (uint256) {
        assembly {
            jump(end)
            invalid() // Should not reach this
            end:
        }
        return 42;
    }
    
    function conditionalJump(bool condition) external pure returns (uint256) {
        assembly {
            jumpi(positive, condition)
            mstore(0, 0)
            jump(end)
            positive:
                mstore(0, 1)
            end:
                return(0, 32)
        }
    }
    
    function jumpTable(uint256 index) external pure returns (uint256) {
        assembly {
            switch index
            case 0 { 
                mstore(0, 100)
                return(0, 32)
            }
            case 1 { 
                mstore(0, 200)
                return(0, 32)
            }
            case 2 { 
                mstore(0, 300)
                return(0, 32)
            }
            default { 
                mstore(0, 0)
                return(0, 32)
            }
        }
    }
    
    function nestedJumps() external pure returns (uint256) {
        assembly {
            jump(level1)
            
            level1:
                jump(level2)
                
            level2:
                jump(level3)
                
            level3:
                mstore(0, 777)
                return(0, 32)
        }
    }
    
    function invalidJump() external pure {
        assembly {
            jump(0xDEADBEEF) // Invalid jump destination
        }
    }
}

/**
 * @dev Contract for testing return data and revert functionality
 */
contract ReturnDataTester {
    string constant REVERT_MESSAGE = "Custom revert with data";
    
    function returnsData() external pure returns (uint256, string memory, bytes memory) {
        return (42, "Hello World", hex"deadbeef");
    }
    
    function returnsLargeData() external pure returns (bytes memory) {
        bytes memory data = new bytes(2048);
        for (uint i = 0; i < data.length; i++) {
            data[i] = bytes1(uint8(i % 256));
        }
        return data;
    }
    
    function revertsWithData() external pure {
        revert(REVERT_MESSAGE);
    }
    
    function revertsWithCustomError() external pure {
        revert CustomError(42, "Error details");
    }
    
    function callAndCaptureRevert(address target, bytes calldata data) external returns (bool success, bytes memory returnData) {
        (success, returnData) = target.call(data);
        // Don't revert on failure, return the data
    }
    
    function testReturnDataSize(address target, bytes calldata data) external returns (uint256 size) {
        target.call(data);
        assembly {
            size := returndatasize()
        }
    }
    
    function testReturnDataCopy(address target, bytes calldata data) external returns (bytes memory) {
        target.call(data);
        
        bytes memory returnData;
        assembly {
            let size := returndatasize()
            returnData := mload(0x40)
            mstore(returnData, size)
            mstore(0x40, add(returnData, add(size, 0x20)))
            returndatacopy(add(returnData, 0x20), 0, size)
        }
        
        return returnData;
    }
    
    error CustomError(uint256 code, string message);
}

/**
 * @dev Contract for testing access lists and gas optimization (EIP-2929)
 */
contract AccessListTester {
    mapping(uint256 => uint256) public storage_map;
    
    event AccessPattern(string operation, uint256 gasUsed);
    
    function warmUpStorage(uint256[] calldata slots) external {
        uint256 gasStart = gasleft();
        
        for (uint i = 0; i < slots.length; i++) {
            storage_map[slots[i]] = i + 1;
        }
        
        uint256 gasUsed = gasStart - gasleft();
        emit AccessPattern("warmup", gasUsed);
    }
    
    function accessWarmStorage(uint256[] calldata slots) external view returns (uint256 sum) {
        uint256 gasStart = gasleft();
        
        for (uint i = 0; i < slots.length; i++) {
            sum += storage_map[slots[i]];
        }
        
        uint256 gasUsed = gasStart - gasleft();
        // Can't emit in view function, so just return sum
    }
    
    function accessColdStorage(uint256 slot) external view returns (uint256) {
        return storage_map[slot];
    }
    
    function externalCallPattern(address[] calldata targets) external returns (uint256 totalGas) {
        uint256 gasStart = gasleft();
        
        for (uint i = 0; i < targets.length; i++) {
            // Make call to warm up address
            targets[i].call(abi.encodeWithSignature("getValue()"));
        }
        
        totalGas = gasStart - gasleft();
        emit AccessPattern("external_calls", totalGas);
    }
    
    function testExtcodesize(address[] calldata targets) external view returns (uint256[] memory sizes) {
        sizes = new uint256[](targets.length);
        
        for (uint i = 0; i < targets.length; i++) {
            assembly {
                let size := extcodesize(mload(add(add(targets, 0x20), mul(i, 0x20))))
                mstore(add(add(sizes, 0x20), mul(i, 0x20)), size)
            }
        }
    }
}

/**
 * @dev Contract for testing CREATE2 and address prediction
 */
contract Create2Tester {
    event ContractCreated(address predicted, address actual, bool matches);
    
    function predictAddress(bytes32 salt, bytes memory bytecode) external view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );
        return address(uint160(uint256(hash)));
    }
    
    function createWithPredictedAddress(bytes32 salt) external returns (address predicted, address actual) {
        // Predict address
        bytes memory bytecode = type(SelfDestructTester).creationCode;
        predicted = predictAddress(salt, bytecode);
        
        // Create contract
        SelfDestructTester created = new SelfDestructTester{salt: salt}();
        actual = address(created);
        
        bool matches = predicted == actual;
        emit ContractCreated(predicted, actual, matches);
        
        return (predicted, actual);
    }
    
    function createMultipleWithSalt(uint256 count, bytes32 baseSalt) external returns (address[] memory addresses) {
        addresses = new address[](count);
        
        for (uint256 i = 0; i < count; i++) {
            bytes32 salt = keccak256(abi.encodePacked(baseSalt, i));
            SelfDestructTester created = new SelfDestructTester{salt: salt}();
            addresses[i] = address(created);
        }
    }
    
    function createAndVerifyCode(bytes32 salt) external returns (bool codeMatches, uint256 codeSize) {
        SelfDestructTester created = new SelfDestructTester{salt: salt}();
        address createdAddr = address(created);
        
        assembly {
            codeSize := extcodesize(createdAddr)
        }
        
        // Check if code was deployed
        codeMatches = codeSize > 0;
        
        return (codeMatches, codeSize);
    }
}