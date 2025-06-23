// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ErrorHandlingContracts
 * @dev Comprehensive contracts for testing error conditions and edge cases in the EVM
 */

/**
 * @dev Contract for testing various revert conditions and error messages
 */
contract RevertTester {
    uint256 public value;
    mapping(address => uint256) public balances;
    
    error CustomError(uint256 code, string message);
    error InsufficientBalance(uint256 available, uint256 required);
    
    function setValue(uint256 _value) external {
        require(_value != 0, "Value cannot be zero");
        require(_value < 1000, "Value too large");
        value = _value;
    }
    
    function revertWithMessage() external pure {
        revert("This is a revert message");
    }
    
    function revertWithoutMessage() external pure {
        revert();
    }
    
    function revertWithCustomError(uint256 code) external pure {
        revert CustomError(code, "Custom error occurred");
    }
    
    function requireTest(bool condition) external pure returns (bool) {
        require(condition, "Requirement failed");
        return true;
    }
    
    function assertTest(uint256 a, uint256 b) external pure returns (uint256) {
        assert(a >= b); // Should panic if false
        return a - b;
    }
    
    function transfer(address to, uint256 amount) external {
        if (balances[msg.sender] < amount) {
            revert InsufficientBalance(balances[msg.sender], amount);
        }
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}

/**
 * @dev Contract for testing arithmetic overflow and underflow scenarios
 */
contract OverflowTester {
    uint8 public smallValue = 255;
    uint256 public largeValue = type(uint256).max;
    int256 public signedValue = type(int256).max;
    
    // Unchecked arithmetic (should wrap around)
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
    
    // Checked arithmetic (should revert on overflow)
    function checkedAdd(uint256 a, uint256 b) external pure returns (uint256) {
        return a + b; // Will revert on overflow in 0.8.0+
    }
    
    function checkedSub(uint256 a, uint256 b) external pure returns (uint256) {
        return a - b; // Will revert on underflow in 0.8.0+
    }
    
    function checkedMul(uint256 a, uint256 b) external pure returns (uint256) {
        return a * b; // Will revert on overflow in 0.8.0+
    }
    
    // Test small integer overflow
    function incrementSmallValue() external {
        smallValue++; // Should revert when smallValue is 255
    }
    
    // Test signed integer overflow
    function incrementSignedValue() external {
        signedValue++; // Should revert when signedValue is max int256
    }
    
    function testDivisionByZero(uint256 a) external pure returns (uint256) {
        return a / 0; // Should revert
    }
    
    function testModuloByZero(uint256 a) external pure returns (uint256) {
        return a % 0; // Should revert
    }
}

/**
 * @dev Contract for testing gas consumption and out-of-gas scenarios
 */
contract GasLimitTester {
    uint256[] public largeArray;
    mapping(uint256 => uint256) public largeMapping;
    
    // Consume a lot of gas through storage operations
    function consumeGasWithStorage(uint256 iterations) external {
        for (uint256 i = 0; i < iterations; i++) {
            largeMapping[i] = i * 2;
        }
    }
    
    // Consume gas through array operations
    function consumeGasWithArray(uint256 size) external {
        delete largeArray;
        for (uint256 i = 0; i < size; i++) {
            largeArray.push(i);
        }
    }
    
    // Infinite loop (should run out of gas)
    function infiniteLoop() external pure returns (uint256) {
        uint256 counter = 0;
        while (true) {
            counter++;
        }
        return counter; // Never reached
    }
    
    // Recursive function (should eventually run out of gas)
    function recursiveFunction(uint256 depth) external view returns (uint256) {
        if (depth == 0) {
            return 1;
        }
        return depth * this.recursiveFunction(depth - 1);
    }
    
    // Memory expansion test
    function expandMemory(uint256 size) external pure returns (bytes memory) {
        return new bytes(size);
    }
    
    // Test gas estimation
    function estimateGasUsage() external view returns (uint256) {
        uint256 initialGas = gasleft();
        uint256 result = 0;
        for (uint256 i = 0; i < 100; i++) {
            result += i * i;
        }
        return initialGas - gasleft();
    }
}

/**
 * @dev Contract for testing stack limit and memory limit scenarios
 */
contract StackLimitTester {
    // Deep recursion to test stack limits
    function deepRecursion(uint256 depth) external view returns (uint256) {
        if (depth <= 1) {
            return 1;
        }
        return this.deepRecursion(depth - 1) + this.deepRecursion(depth - 1);
    }
    
    // Function with many local variables
    function manyLocalVariables() external pure returns (uint256) {
        uint256 a = 1; uint256 b = 2; uint256 c = 3; uint256 d = 4;
        uint256 e = 5; uint256 f = 6; uint256 g = 7; uint256 h = 8;
        uint256 i = 9; uint256 j = 10; uint256 k = 11; uint256 l = 12;
        uint256 m = 13; uint256 n = 14; uint256 o = 15; uint256 p = 16;
        
        return a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p;
    }
    
    // Function with many parameters
    function manyParameters(
        uint256 p1, uint256 p2, uint256 p3, uint256 p4,
        uint256 p5, uint256 p6, uint256 p7, uint256 p8,
        uint256 p9, uint256 p10, uint256 p11, uint256 p12,
        uint256 p13, uint256 p14, uint256 p15, uint256 p16
    ) external pure returns (uint256) {
        return p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + 
               p9 + p10 + p11 + p12 + p13 + p14 + p15 + p16;
    }
}

/**
 * @dev Contract for testing invalid opcodes and edge case operations
 */
contract InvalidOpcodeTester {
    // Use inline assembly to test invalid opcodes
    function invalidOpcode() external pure {
        assembly {
            invalid() // INVALID opcode (0xfe)
        }
    }
    
    // Test selfdestruct (now deprecated)
    function selfDestructTest(address payable recipient) external {
        selfdestruct(recipient);
    }
    
    // Test assembly edge cases
    function assemblyEdgeCases() external pure returns (uint256 result) {
        assembly {
            // Test various assembly operations
            let x := 0x12345678
            let y := 0x87654321
            
            // Bitwise operations
            result := and(x, y)
            result := or(result, x)
            result := xor(result, y)
            result := not(result)
            
            // Shifts
            result := shl(4, result)
            result := shr(2, result)
            
            // Arithmetic
            result := add(result, x)
            result := sub(result, y)
            result := mul(result, 2)
            result := div(result, 3)
            result := mod(result, 1000)
        }
    }
    
    // Test memory operations in assembly
    function assemblyMemoryOps() external pure returns (bytes32) {
        assembly {
            // Store data in memory
            mstore(0x80, 0x1234567890abcdef)
            mstore(0xa0, 0xfedcba0987654321)
            
            // Load and return
            let result := mload(0x80)
            mstore(0x00, result)
            return(0x00, 0x20)
        }
    }
}

/**
 * @dev Contract for testing boundary conditions and edge values
 */
contract BoundaryTester {
    // Test with maximum values
    function testMaxValues() external pure returns (uint256, int256, bytes32) {
        uint256 maxUint = type(uint256).max;
        int256 maxInt = type(int256).max;
        bytes32 maxBytes = bytes32(type(uint256).max);
        
        return (maxUint, maxInt, maxBytes);
    }
    
    // Test with minimum values
    function testMinValues() external pure returns (uint256, int256, bytes32) {
        uint256 minUint = type(uint256).min; // 0
        int256 minInt = type(int256).min;
        bytes32 minBytes = bytes32(0);
        
        return (minUint, minInt, minBytes);
    }
    
    // Test edge cases with arrays
    function testEmptyArray() external pure returns (uint256[] memory) {
        return new uint256[](0);
    }
    
    function testSingleElementArray() external pure returns (uint256[] memory) {
        uint256[] memory arr = new uint256[](1);
        arr[0] = 42;
        return arr;
    }
    
    // Test edge cases with strings
    function testEmptyString() external pure returns (string memory) {
        return "";
    }
    
    function testLongString() external pure returns (string memory) {
        return "This is a very long string that tests the boundaries of string handling in the EVM implementation";
    }
    
    // Test edge cases with bytes
    function testEmptyBytes() external pure returns (bytes memory) {
        return "";
    }
    
    function testMaxBytes() external pure returns (bytes memory) {
        bytes memory data = new bytes(1024);
        for (uint256 i = 0; i < 1024; i++) {
            data[i] = bytes1(uint8(i % 256));
        }
        return data;
    }
}