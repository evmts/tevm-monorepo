// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";

import { TestTable, TestTableData } from "./MUDTestTable.sol";

contract TestSystem is System {
  constructor() {
    StoreCore.initialize();
    TestTable.register();
  }

  function get(uint200 key1, uint8 key2) public view returns (TestTableData memory _table) {
    return TestTable.get(key1, key2);
  }

  function set(
    uint200 key1,
    uint8 key2,
    uint200 val1,
    uint8 val2,
    uint16 val3,
    string memory dyn1,
    bytes memory dyn2,
    int16[] memory dyn3
  ) public {
    TestTable.set(key1, key2, val1, val2, val3, dyn1, dyn2, dyn3);
  }
}
