//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/* Testing utilities */
import { Test } from "forge-std/Test.sol";
import { AppEntrypoint } from "../src/AppEntrypoint.sol";

contract AssetReceiver_Initializer is Test {
    event AppCreated(
        address indexed creator,
        string indexed appName,
        string indexed version,
        string[] sources,
        string integrity
    );

    event SourcesAppended(
        address indexed creator,
        string indexed appName,
        string indexed version,
        string[] sources
    );

    event MutableDataUpdated(
        address indexed creator,
        string indexed appName,
        string indexed version,
        bytes mutableData
    );

    address alice = address(128);
    address bob = address(256);
    address sally = address(512);
    AppEntrypoint appEntrypoint;

    string appName = "test-app";
    string version = "0.0.0";
    string[] sources = new string[](2);
    string integrity = "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC";
    bytes immutableData = bytes('{"immutable": "test"}');
    bytes mutableData = bytes('{"mutable": "test"}');

    function _setUp() public {
        sources[0] = "ipfs://QmaXzZhcYnsisuue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm";
        sources[1] = "https://my-peformant-dapp.vercel.app/";
        // Give alice and bob some ETH
        vm.deal(alice, 1 ether);

        vm.label(alice, "alice");
        vm.label(bob, "bob");
        vm.label(sally, "sally");
        appEntrypoint = new AppEntrypoint();
    }
}

contract AssetReceiverTest is AssetReceiver_Initializer {
    function setUp() public {
        super._setUp();
    }

    function test_AppEntrypoint_init() external {
        assertEq(appEntrypoint.VERSION(), "0.0.0");
    }

    /**
     * @notice Should be able to create an app
     */
    function test_AppEntrypoint_create_app_happy() external {
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit AppCreated(alice, appName, version, sources, integrity);
        appEntrypoint.createApp(appName, version, sources, integrity, immutableData, mutableData);

        assertEq(appEntrypoint.appToSources(alice, appName, version, 0), sources[0]);
        assertEq(appEntrypoint.appToSources(alice, appName, version, 1), sources[1]);
        assertEq(appEntrypoint.appToIntegrity(alice, appName, version), integrity);
        assertEq(appEntrypoint.appToDataImmutable(alice, appName, version), immutableData);
        assertEq(appEntrypoint.appToDataMutable(alice, appName, version), mutableData);
    }

    /**
     * @notice Should NOT be able to update an app by calling create on an existing app
     */
    function test_AppEntrypoint_create_app_already_exist() external {
        vm.prank(alice);
        appEntrypoint.createApp(appName, version, sources, integrity, immutableData, mutableData);

        vm.prank(alice);
        vm.expectRevert("AppEntrypoint: version already exists");
        appEntrypoint.createApp(appName, version, sources, integrity, immutableData, mutableData);
    }

    /**
     * @notice Should NOT be able to create an app with no integrity
     */
    function test_AppEntrypoint_create_app_integrity_not_set() external {
        string memory integrity = "";

        vm.prank(alice);
        vm.expectRevert("AppEntrypoint: integrity must be set");
        appEntrypoint.createApp(appName, version, sources, integrity, immutableData, mutableData);
    }

    function test_AppEntrypoint_append_sources() external {
        vm.prank(alice);
        appEntrypoint.createApp(appName, version, sources, integrity, immutableData, mutableData);

        string[] memory newSources = new string[](2);
        newSources[0] = "ipfs://Q222222222222uue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm";
        newSources[1] = "https://my-new_peformant-dapp.vercel.app/";

        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit SourcesAppended(alice, appName, version, newSources);
        appEntrypoint.appendSources("test-app", "0.0.0", newSources);

        assertEq(appEntrypoint.appToSources(alice, "test-app", "0.0.0", 0), sources[0]);
        assertEq(appEntrypoint.appToSources(alice, "test-app", "0.0.0", 1), sources[1]);
        assertEq(appEntrypoint.appToSources(alice, "test-app", "0.0.0", 2), newSources[0]);
        assertEq(appEntrypoint.appToSources(alice, "test-app", "0.0.0", 3), newSources[1]);
    }

    function test_AppEntrypoint_update_mutable_data() external {
        vm.prank(alice);
        appEntrypoint.createApp(appName, version, sources, integrity, immutableData, mutableData);

        bytes memory newMutableData = bytes('{"mutable": "test2"}');

        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit MutableDataUpdated(alice, appName, version, newMutableData);
        appEntrypoint.updateMutableData("test-app", "0.0.0", newMutableData);

        assertEq(appEntrypoint.appToDataMutable(alice, "test-app", "0.0.0"), newMutableData);
    }
}
