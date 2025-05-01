// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BankV1 {
    mapping(address account => bool activated) private activatedAccounts;
    mapping(address account => uint256 password) private accountsPasswords;
    mapping(address account => uint256 balance) private accountsBalances;

    /// @notice Create new Account in the Bank
    /// @param password Account password that will be used in authentication when withdrawing
    function createAccount(uint256 password) external {
        activatedAccounts[msg.sender] = true;
        accountsPasswords[msg.sender] = password;
    }

    /// @notice adding provided account balance by the value of sent Ether
    /// @dev Allows anyone to deposit ether to any
    /// @param account The account receiving the deposited Ether
    function depositEther(address account) external payable {
        require(activatedAccounts[account], "Account is not activated yet");
        require(msg.value > 0, "No Ether sent");

        accountsBalances[account] += msg.value;
    }

    /// @notice Withdrawing ether from a given account and send him to the recipent
    /// @dev the sender provide a valid password for the account to withdraw from it
    /// @param account The account to withdraw ether from
    /// @param password The password for that account
    /// @param amount The amount to withdraw
    /// @param recipent The receiver of ether
    function withdrawEther(address account, uint256 password, uint256 amount, address recipent) external {
        require(activatedAccounts[account], "Account is not activated yet");
        require(accountsPasswords[account] == password, "Account is not activated yet");
        require(accountsBalances[account] >= amount, "Amount to withdraw exceeds balance");

        accountsBalances[account] -= amount;
        (bool success,) = recipent.call{value: amount}("");
        require(success, "Withdrawal Failed");
    }
}