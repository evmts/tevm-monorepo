// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../utils/StringUtils.sol";

/**
 * @title AccessControl
 * @dev Contract module that allows children to implement role-based access control
 */
contract AccessControl {
    using StringUtils for string;

    // Role => Address => HasRole
    mapping(string => mapping(address => bool)) private _roles;
    
    // Role => count of addresses with role
    mapping(string => uint256) private _roleCount;
    
    // Role => Administrators who can grant and revoke
    mapping(string => mapping(address => bool)) private _roleAdmins;
    
    // Events
    event RoleGranted(string indexed role, address indexed account, address indexed sender);
    event RoleRevoked(string indexed role, address indexed account, address indexed sender);
    event RoleAdminChanged(string indexed role, address indexed account, bool isAdmin);

    constructor() {
        // Creator is admin of all roles by default
        _roleAdmins["ADMIN"][msg.sender] = true;
        _roles["ADMIN"][msg.sender] = true;
        _roleCount["ADMIN"] = 1;
        
        emit RoleGranted("ADMIN", msg.sender, msg.sender);
        emit RoleAdminChanged("ADMIN", msg.sender, true);
    }

    /**
     * @dev Check if an account has a specific role
     * @param role The role to check
     * @param account The account to check
     * @return bool True if the account has the role
     */
    function hasRole(string memory role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    /**
     * @dev Returns the number of accounts that have a specific role
     * @param role The role to query
     * @return uint256 The number of accounts that have the role
     */
    function getRoleMemberCount(string memory role) public view returns (uint256) {
        return _roleCount[role];
    }

    /**
     * @dev Grants a role to an account
     * @param role The role to grant
     * @param account The account to grant the role to
     */
    function grantRole(string memory role, address account) public {
        // Only Admin role can grant roles or role-specific admins
        require(
            hasRole("ADMIN", msg.sender) || _roleAdmins[role][msg.sender],
            "AccessControl: sender must be an admin to grant roles"
        );
        
        _grantRole(role, account);
    }

    /**
     * @dev Revokes a role from an account
     * @param role The role to revoke
     * @param account The account to revoke the role from
     */
    function revokeRole(string memory role, address account) public {
        require(
            hasRole("ADMIN", msg.sender) || _roleAdmins[role][msg.sender],
            "AccessControl: sender must be an admin to revoke roles"
        );
        
        _revokeRole(role, account);
    }

    /**
     * @dev Sets the admin status for a role
     * @param role The role to set the admin for
     * @param account The account to set as admin
     * @param status True to make admin, false to remove admin
     */
    function setRoleAdmin(string memory role, address account, bool status) public {
        require(
            hasRole("ADMIN", msg.sender),
            "AccessControl: only ADMIN can set role admins"
        );
        
        _roleAdmins[role][account] = status;
        emit RoleAdminChanged(role, account, status);
    }

    /**
     * @dev Check if an account is an admin for a role
     */
    function isRoleAdmin(string memory role, address account) public view returns (bool) {
        return _roleAdmins[role][account] || hasRole("ADMIN", account);
    }

    /**
     * @dev Internal function to grant a role
     */
    function _grantRole(string memory role, address account) internal {
        if (!_roles[role][account]) {
            _roles[role][account] = true;
            _roleCount[role] += 1;
            emit RoleGranted(role, account, msg.sender);
        }
    }

    /**
     * @dev Internal function to revoke a role
     */
    function _revokeRole(string memory role, address account) internal {
        if (_roles[role][account]) {
            _roles[role][account] = false;
            _roleCount[role] -= 1;
            emit RoleRevoked(role, account, msg.sender);
        }
    }
}