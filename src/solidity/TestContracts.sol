// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title TestContracts
 * @dev Collection of contracts for comprehensive EVM testing
 */

/**
 * @dev Simple storage contract for testing basic functionality
 */
contract SimpleStorage {
    uint256 public value;
    mapping(address => uint256) public balances;
    
    event ValueSet(uint256 newValue);
    event BalanceUpdated(address indexed account, uint256 balance);
    
    constructor(uint256 _initialValue) {
        value = _initialValue;
    }
    
    function setValue(uint256 _value) external {
        value = _value;
        emit ValueSet(_value);
    }
    
    function setBalance(address account, uint256 balance) external {
        balances[account] = balance;
        emit BalanceUpdated(account, balance);
    }
    
    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }
    
    function add(uint256 a, uint256 b) external pure returns (uint256) {
        return a + b;
    }
    
    function revertWithMessage() external pure {
        revert("Custom revert message");
    }
}

/**
 * @dev Contract for testing arithmetic operations and edge cases
 */
contract ArithmeticTester {
    function addOverflow(uint256 a, uint256 b) external pure returns (uint256) {
        unchecked {
            return a + b;
        }
    }
    
    function subUnderflow(uint256 a, uint256 b) external pure returns (uint256) {
        unchecked {
            return a - b;
        }
    }
    
    function mulOverflow(uint256 a, uint256 b) external pure returns (uint256) {
        unchecked {
            return a * b;
        }
    }
    
    function divByZero(uint256 a) external pure returns (uint256) {
        return a / 0;
    }
    
    function modByZero(uint256 a) external pure returns (uint256) {
        return a % 0;
    }
    
    function expOverflow(uint256 base, uint256 exp) external pure returns (uint256) {
        unchecked {
            return base ** exp;
        }
    }
}

/**
 * @dev Contract for testing memory operations
 */
contract MemoryTester {
    function memoryExpansion() external pure returns (bytes memory) {
        bytes memory data = new bytes(1024);
        for (uint i = 0; i < 1024; i++) {
            data[i] = bytes1(uint8(i % 256));
        }
        return data;
    }
    
    function largeCopy() external pure returns (bytes memory) {
        bytes memory source = new bytes(2048);
        bytes memory dest = new bytes(2048);
        
        // Fill source with pattern
        for (uint i = 0; i < 2048; i++) {
            source[i] = bytes1(uint8((i * 3) % 256));
        }
        
        // Copy data
        assembly {
            let sourcePtr := add(source, 0x20)
            let destPtr := add(dest, 0x20)
            let size := mload(source)
            
            for { let i := 0 } lt(i, size) { i := add(i, 32) } {
                mstore(add(destPtr, i), mload(add(sourcePtr, i)))
            }
        }
        
        return dest;
    }
    
    function memoryPattern(uint256 size, uint8 pattern) external pure returns (bytes memory) {
        bytes memory data = new bytes(size);
        for (uint i = 0; i < size; i++) {
            data[i] = bytes1(pattern);
        }
        return data;
    }
}

/**
 * @dev Contract for testing call operations
 */
contract CallTester {
    event CallMade(address target, bool success, bytes returnData);
    
    function externalCall(address target, bytes calldata data) external returns (bool success, bytes memory returnData) {
        (success, returnData) = target.call(data);
        emit CallMade(target, success, returnData);
    }
    
    function delegateCall(address target, bytes calldata data) external returns (bool success, bytes memory returnData) {
        (success, returnData) = target.delegatecall(data);
        emit CallMade(target, success, returnData);
    }
    
    function staticCall(address target, bytes calldata data) external view returns (bool success, bytes memory returnData) {
        (success, returnData) = target.staticcall(data);
    }
    
    function callWithValue(address target, uint256 value, bytes calldata data) external payable returns (bool success, bytes memory returnData) {
        (success, returnData) = target.call{value: value}(data);
        emit CallMade(target, success, returnData);
    }
    
    function recursiveCall(uint256 depth) external returns (uint256) {
        if (depth == 0) return 0;
        
        bytes memory data = abi.encodeWithSignature("recursiveCall(uint256)", depth - 1);
        (bool success, bytes memory returnData) = address(this).call(data);
        
        if (success) {
            return abi.decode(returnData, (uint256)) + 1;
        }
        return 0;
    }
}

/**
 * @dev Contract for testing create operations
 */
contract CreateTester {
    event ContractCreated(address newContract);
    
    function createSimple() external returns (address) {
        SimpleStorage simple = new SimpleStorage(42);
        emit ContractCreated(address(simple));
        return address(simple);
    }
    
    function createWithSalt(bytes32 salt) external returns (address) {
        SimpleStorage simple = new SimpleStorage{salt: salt}(100);
        emit ContractCreated(address(simple));
        return address(simple);
    }
    
    function createAndTest() external returns (uint256) {
        SimpleStorage simple = new SimpleStorage(123);
        return simple.value();
    }
    
    function createFailing() external returns (address) {
        // This will fail if there's not enough gas
        new MemoryTester();
        return address(0);
    }
}

/**
 * @dev Contract for testing precompiled contracts
 */
contract PrecompileTester {
    function testSha256(bytes calldata data) external view returns (bytes32) {
        return sha256(data);
    }
    
    function testRipemd160(bytes calldata data) external view returns (bytes20) {
        return ripemd160(data);
    }
    
    function testIdentity(bytes calldata data) external pure returns (bytes memory) {
        bytes memory result = new bytes(data.length);
        
        assembly {
            let success := staticcall(gas(), 0x04, add(data, 0x20), data.length, add(result, 0x20), data.length)
            if iszero(success) { revert(0, 0) }
        }
        
        return result;
    }
    
    function testEcrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external pure returns (address) {
        return ecrecover(hash, v, r, s);
    }
    
    function testModExp(bytes calldata data) external view returns (bytes memory) {
        bytes memory result = new bytes(32);
        
        assembly {
            let success := staticcall(gas(), 0x05, add(data, 0x20), data.length, add(result, 0x20), 32)
            if iszero(success) { revert(0, 0) }
        }
        
        return result;
    }
}

/**
 * @dev Contract for testing gas consumption patterns
 */
contract GasTester {
    mapping(uint256 => uint256) public storage_slots;
    
    function storageTest(uint256 key, uint256 value) external {
        storage_slots[key] = value;
    }
    
    function storageWarmup(uint256[] calldata keys) external view returns (uint256 sum) {
        for (uint i = 0; i < keys.length; i++) {
            sum += storage_slots[keys[i]];
        }
    }
    
    function memoryExpansionCost(uint256 size) external pure returns (uint256) {
        bytes memory data = new bytes(size);
        return data.length;
    }
    
    function computeIntensive(uint256 iterations) external pure returns (uint256) {
        uint256 result = 1;
        for (uint256 i = 0; i < iterations; i++) {
            result = (result * 1103515245 + 12345) % (2**31);
        }
        return result;
    }
    
    function nestedCalls(uint256 depth) external view returns (uint256) {
        if (depth == 0) return block.number;
        
        return this.nestedCalls(depth - 1) + 1;
    }
}

/**
 * @dev Contract for testing edge cases and error conditions
 */
contract EdgeCaseTester {
    fallback() external payable {
        revert("Fallback called");
    }
    
    receive() external payable {
        // Accept ETH
    }
    
    function invalidOpcode() external pure {
        assembly {
            invalid()
        }
    }
    
    function outOfGas() external pure {
        assembly {
            for { let i := 0 } lt(i, 1000000) { i := add(i, 1) } {
                keccak256(0, 0)
            }
        }
    }
    
    function stackOverflow() external pure returns (uint256) {
        assembly {
            // Push many values to cause stack overflow
            for { let i := 0 } lt(i, 1025) { i := add(i, 1) } {
                dup1(i)
            }
        }
        return 1;
    }
    
    function jumpToInvalidDestination() external pure {
        assembly {
            jump(0xDEADBEEF)
        }
    }
    
    function accessInvalidMemory() external pure returns (bytes32) {
        assembly {
            return(0xFFFFFFFFFFFFFFF, 32)
        }
    }
}

/**
 * @dev Helper contract that can be called by other contracts
 */
contract HelperContract {
    uint256 public counter;
    address public lastCaller;
    
    function increment() external returns (uint256) {
        counter++;
        lastCaller = msg.sender;
        return counter;
    }
    
    function getValue() external view returns (uint256) {
        return counter;
    }
    
    function revertOnOdd() external view {
        require(counter % 2 == 0, "Counter is odd");
    }
    
    function receiveEther() external payable returns (uint256) {
        return msg.value;
    }
}