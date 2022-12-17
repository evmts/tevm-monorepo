// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title  AppEntrypoint
 * @author @evmts
 * @notice Common entrypoint for all applications.
 * @dev    This contract is intended to be used as a standardized entrypoint
 *         For trustless applications.
 *         These applications are mostly immutable with 2 exceptions
 *         1. An optional mutable data field that can be updated at any time
 *            A common way to use this is to store info on if there is a new release
 *         2. Sources can be appended to the list of URI sources
 */
contract AppEntrypoint {
    string public constant VERSION = "0.0.0";

    /**
     * @notice stores entrypoint sources creator => appname => appVersion => sources
     */
    mapping(address => mapping(string => mapping(string => string[]))) public appToSources;

    /**
     * @notice stores entrypoint integrity creator => appname => appVersion => integrity
     */
    mapping(address => mapping(string => mapping(string => string))) public appToIntegrity;

    /**
     * @notice stores entrypoint immutableData creator => appname => appVersion => appDataImmutable
     */
    mapping(address => mapping(string => mapping(string => bytes))) public appToDataImmutable;

    /**
     * @notice stores entrypoint mutableData creator => appname => appVersion => appDataMutable
     */
    mapping(address => mapping(string => mapping(string => bytes))) public appToDataMutable;

    /**
     * @notice Emitted when App is added
     *
     * @param creator creator of the app
     * @param name    Address attestation is about.
     * @param version version of the app
     * @param sources sources of the app
     * @param integrity integrity of the app
     */
    event AppCreated(
        address indexed creator,
        string indexed name,
        string indexed version,
        string[] sources,
        string integrity
    );

    /**
     * @notice Emitted when new sources are appended to app source list
     *
     * @param creator Address that made the attestation.
     * @param appName   Address attestation is about.
     * @param version     Key of the attestation.
     */
    event SourcesAppended(
        address indexed creator,
        string indexed appName,
        string indexed version,
        string[] sources
    );

    /**
     * @notice Emitted when Mutable data is updated
     *
     * @param creator Address that made the attestation.
     * @param appName   Address attestation is about.
     * @param version     Key of the attestation.
     */
    event MutableDataUpdated(
        address indexed creator,
        string indexed appName,
        string indexed version,
        bytes mutableData
    );

    /**
     * @notice Adds an  new app
     *
     * @param appName          Name of the app
     * @param appVersion          Version of the app
     * @param sources          URIs pointing to the entrypoint
     * @param integrity        sha-384 integrity hash of the entrypoint
     * @param immutableData Immutable data that can be optionally set when a version is registered
     * @param mutableData      Mutable data that can be updated at any time
     */
    function createApp(
        string memory appName,
        string memory appVersion,
        string[] memory sources,
        string memory integrity,
        bytes memory immutableData,
        bytes memory mutableData
    ) public {
        require(
            bytes(appToIntegrity[msg.sender][appName][appVersion]).length == 0,
            "AppEntrypoint: version already exists"
        );
        require(bytes(integrity).length > 0, "AppEntrypoint: integrity must be set");

        appToSources[msg.sender][appName][appVersion] = sources;
        appToIntegrity[msg.sender][appName][appVersion] = integrity;
        appToDataImmutable[msg.sender][appName][appVersion] = immutableData;
        appToDataMutable[msg.sender][appName][appVersion] = mutableData;

        emit AppCreated(msg.sender, appName, appVersion, sources, integrity);
    }

    /**
     * @notice Appends new uris to the sources array
     *
     * @param appName    Name of the app
     * @param appVersion      Version of the app
     * @param sources    URIs pointing to the entrypoint
     */
    function appendSources(
        string memory appName,
        string memory appVersion,
        string[] memory sources
    ) public {
        for (uint256 i = 0; i < sources.length; i++) {
            appToSources[msg.sender][appName][appVersion].push(sources[i]);
        }
        emit SourcesAppended(msg.sender, appName, appVersion, sources);
    }

    /**
     * @notice Updates the mutable data for a version
     *
     * @param appName    Name of the app
     * @param appVersion      Version of the app
     * @param mutableData    Mutable data that can be updated at any time
     */
    function updateMutableData(
        string memory appName,
        string memory appVersion,
        bytes memory mutableData
    ) public {
        appToDataMutable[msg.sender][appName][appVersion] = mutableData;
        emit MutableDataUpdated(msg.sender, appName, appVersion, mutableData);
    }
}
