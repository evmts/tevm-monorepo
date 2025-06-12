// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ErrorContract {
    // Custom errors (each has unique 4-byte selector)
    error SimpleError();
    error ErrorWithSingleParam(uint256 amount);
    error ErrorWithMultipleParams(string message, bytes32 hash, address[] users);

    // Array for runtime bounds testing
    uint256[] private dynamicArray = [1, 2];

    // =================
    // CUSTOM ERRORS (unique selectors)
    // =================

    function revertWithSimpleCustomError() external {
        revert SimpleError();
    }

    function revertWithCustomErrorSingleParam() external {
        revert ErrorWithSingleParam(100);
    }

    function revertWithCustomErrorMultipleParams() external {
        address[] memory users = new address[](2);
        users[0] = address(1);
        users[1] = address(2);
        revert ErrorWithMultipleParams(
            "Something went wrong",
            keccak256("test"),
            users
        );
    }

    // =================
    // ERROR(STRING) - Selector: 0x08c379a0
    // =================

    function revertWithStringError() external {
        revert("This is a string error message");
    }

    function revertWithRequireAndMessage() external {
        require(false, "Require failed with message");
    }

    // =================
    // EMPTY REVERT
    // =================

    function revertWithoutMessage() external {
        revert(); // Empty revert data
    }

    function revertWithRequireNoMessage() external {
        require(false); // Also empty revert
    }

    // =================
    // PANIC ERRORS - Selector: 0x4e487b71
    // =================

    function panicWithAssertFailure() external {
        assert(false); // Panic code 0x01
    }

    function panicWithArithmeticOverflow() external {
        uint256 max = type(uint256).max;
        max + 1; // Panic code 0x11
    }

    function panicWithDivisionByZero() external {
        uint256 x = 10;
        x / 0; // Panic code 0x12
    }

    function panicWithArrayOutOfBounds() external {
        uint256 index = 5; // Dynamic to avoid compile-time error
        dynamicArray[index]; // Panic code 0x32
    }

    // =================
    // OTHER ERRORS
    // =================

    function errorOutOfGas() external {
        while (true) {
            keccak256("consume gas");
        }
    }

    function errorWithInvalidOpcode() external {
        assembly {
            invalid()
        }
    }
}