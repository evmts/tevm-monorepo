import { bench, describe, beforeAll, afterAll } from "vitest";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import os from "os";
import crypto from "crypto";
import { bundler as createBaseBundler } from "@tevm/base-bundler";
import { createCache } from "@tevm/bundler-cache";
import { createSolc } from "@tevm/solc";
import { loadConfig } from "@tevm/config";

// Import the Rust bundler when it's ready
// import { create_bundler as createRustBundler } from "@tevm/bundler-rs";

/**
 * Benchmark that tests the performance of bundler implementations
 * for Solidity contracts, comparing JavaScript (base-bundler) and
 * Rust (bundler-rs) implementations.
 * 
 * This benchmark:
 * 1. Creates test Solidity contracts of varying complexity
 * 2. Sets up both bundler implementations with the same configuration
 * 3. Compares performance of module resolution and code generation
 * 4. Tests both synchronous and asynchronous methods
 */

// Constants for the benchmark
const NUM_CONTRACTS = 5;
const NUM_INTERFACES = 2;
const NUM_LIBRARIES = 3;

/**
 * Generate a typical ERC20 contract
 */
function generateERC20Contract(name: string, importPath?: string): string {
  const importStatement = importPath 
    ? `import { IERC20 } from "${importPath}";\n\n` 
    : '';

  const interfaceDefinition = !importPath
    ? `
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

`
    : '';

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

${importStatement}${interfaceDefinition}
/**
 * @title ${name}
 * @dev Implementation of the ERC20 Token Standard
 */
contract ${name} is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
        _mint(msg.sender, 1000000 * 10 ** uint256(_decimals));
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");
        require(_balances[sender] >= amount, "Transfer amount exceeds balance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "Burn from zero address");
        require(_balances[account] >= amount, "Burn amount exceeds balance");

        _balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "Approve from zero address");
        require(spender != address(0), "Approve to zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}`;
}

/**
 * Generate an interface contract
 */
function generateInterface(name: string): string {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ${name}
 * @dev Interface for the ${name.replace('I', '')} contract
 */
interface ${name} {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}`;
}

/**
 * Generate a utility library
 */
function generateLibrary(name: string): string {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ${name}
 * @dev Utility functions for SafeMath
 */
library ${name} {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }
}`;
}

/**
 * Create a temporary directory structure with contracts for testing
 */
async function createContractTestDirectory() {
  // Create a unique temporary directory
  const tempDir = path.join(
    os.tmpdir(),
    `tevm-bundler-benchmark-${crypto.randomBytes(8).toString("hex")}`,
  );

  await fsPromises.mkdir(tempDir, { recursive: true });
  console.log(`Created test directory: ${tempDir}`);

  // Create subdirectories
  const interfacesDir = path.join(tempDir, "interfaces");
  const librariesDir = path.join(tempDir, "libraries");
  const contractsDir = path.join(tempDir, "contracts");

  await fsPromises.mkdir(interfacesDir, { recursive: true });
  await fsPromises.mkdir(librariesDir, { recursive: true });
  await fsPromises.mkdir(contractsDir, { recursive: true });

  // Create interfaces
  const interfaceNames: string[] = [];
  for (let i = 0; i < NUM_INTERFACES; i++) {
    const name = `IERC${20 + i}`;
    interfaceNames.push(name);
    const filePath = path.join(interfacesDir, `${name}.sol`);
    await fsPromises.writeFile(filePath, generateInterface(name));
  }

  // Create libraries
  const libraryNames: string[] = [];
  for (let i = 0; i < NUM_LIBRARIES; i++) {
    const name = `SafeMath${i + 1}`;
    libraryNames.push(name);
    const filePath = path.join(librariesDir, `${name}.sol`);
    await fsPromises.writeFile(filePath, generateLibrary(name));
  }

  // Create contracts that import interfaces and libraries
  const contractPaths: string[] = [];
  for (let i = 0; i < NUM_CONTRACTS; i++) {
    const name = `Token${i + 1}`;
    const importPath = i % 2 === 0 
      ? `../interfaces/${interfaceNames[i % interfaceNames.length]}.sol`
      : undefined;
    
    const filePath = path.join(contractsDir, `${name}.sol`);
    await fsPromises.writeFile(filePath, generateERC20Contract(name, importPath));
    contractPaths.push(filePath);
  }

  // Create a main contract that imports all others
  const mainContractPath = path.join(tempDir, "MainContract.sol");
  let mainContractContent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

`;

  // Add imports for all contracts
  for (let i = 0; i < NUM_CONTRACTS; i++) {
    mainContractContent += `import "./contracts/Token${i + 1}.sol";\n`;
  }

  // Add a simple contract that uses the imports
  mainContractContent += `
contract MainContract {
    address[] private tokens;
    
    constructor() {
`;

  // Add constructor code that deploys all tokens
  for (let i = 0; i < NUM_CONTRACTS; i++) {
    mainContractContent += `        tokens.push(address(new Token${i + 1}("Token${i + 1}", "TKN${i + 1}")));\n`;
  }

  mainContractContent += `    }
    
    function getTokens() public view returns (address[] memory) {
        return tokens;
    }
}`;

  await fsPromises.writeFile(mainContractPath, mainContractContent);
  
  return {
    tempDir,
    mainContractPath,
    contractPaths,
  };
}

/**
 * Create a FileAccessObject for the bundler
 */
function createFileAccessObject() {
  return {
    // Async methods
    readFile: (filePath: string, encoding: BufferEncoding) => 
      fsPromises.readFile(filePath, { encoding }),
    writeFile: fsPromises.writeFile,
    exists: async (filePath: string) => {
      try {
        await fsPromises.access(filePath);
        return true;
      } catch {
        return false;
      }
    },
    stat: fsPromises.stat,
    mkdir: fsPromises.mkdir,

    // Sync methods
    readFileSync: (filePath: string, encoding: BufferEncoding) => 
      fs.readFileSync(filePath, { encoding }),
    writeFileSync: fs.writeFileSync,
    existsSync: fs.existsSync,
    statSync: fs.statSync,
    mkdirSync: fs.mkdirSync,
  };
}

describe("Bundler Implementation Benchmarks", async () => {
  // Create test directory with contracts
  const { tempDir, mainContractPath } = await createContractTestDirectory();
  console.log(`Created contract test directory: ${tempDir}`);
  console.log(`Main contract: ${mainContractPath}`);

  // Create FileAccessObject for file system access
  const fao = createFileAccessObject();

  // Initialize dependencies for JS bundler
  const config = await loadConfig();
  const solcCompiler = await createSolc();
  const cacheInstance = createCache();

  // Create the JS bundler
  const baseBundler = createBaseBundler(
    config,
    console,
    fao,
    solcCompiler,
    cacheInstance
  );

  // Create the Rust bundler (commented out until it's ready)
  // const rustBundlerOptions = {
  //   remappings: [],
  //   libs: [],
  //   use_cache: true,
  //   debug: false,
  // };
  // const rustBundler = await createRustBundler(rustBundlerOptions, {
  //   readFile: async (path: string) => fao.readFileSync(path, 'utf8'),
  //   writeFile: async (path: string, content: string) => fao.writeFileSync(path, content),
  //   exists: async (path: string) => fao.existsSync(path),
  // });

  // Clean up the temporary directory after tests
  afterAll(async () => {
    try {
      await fsPromises.rm(tempDir, { recursive: true, force: true });
      console.log(`Cleaned up temporary directory: ${tempDir}`);
    } catch (error) {
      console.error(`Error cleaning up temporary directory: ${tempDir}`, error);
    }
  });

  // Test TypeScript module resolution
  bench("JS Bundler - Async TypeScript Resolution", async () => {
    await baseBundler.resolveTsModule(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  bench("JS Bundler - Sync TypeScript Resolution", () => {
    baseBundler.resolveTsModuleSync(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  // Rust bundler benchmarks (commented out until it's ready)
  // bench("Rust Bundler - Async TypeScript Resolution", async () => {
  //   await rustBundler.resolve_ts_module(
  //     mainContractPath,
  //     tempDir,
  //     {
  //       optimize: true,
  //       include_bytecode: true,
  //       include_ast: false,
  //     }
  //   );
  // });

  // Test CommonJS module resolution
  bench("JS Bundler - Async CommonJS Resolution", async () => {
    await baseBundler.resolveCjsModule(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  bench("JS Bundler - Sync CommonJS Resolution", () => {
    baseBundler.resolveCjsModuleSync(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  // Rust bundler benchmarks (commented out until it's ready)
  // bench("Rust Bundler - Async CommonJS Resolution", async () => {
  //   await rustBundler.resolve_cjs_module(
  //     mainContractPath,
  //     tempDir,
  //     {
  //       optimize: true,
  //       include_bytecode: true,
  //       include_ast: false,
  //     }
  //   );
  // });

  // Test ES module resolution
  bench("JS Bundler - Async ESM Resolution", async () => {
    await baseBundler.resolveEsmModule(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  bench("JS Bundler - Sync ESM Resolution", () => {
    baseBundler.resolveEsmModuleSync(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  // Rust bundler benchmarks (commented out until it's ready)
  // bench("Rust Bundler - Async ESM Resolution", async () => {
  //   await rustBundler.resolve_esm_module(
  //     mainContractPath,
  //     tempDir,
  //     {
  //       optimize: true,
  //       include_bytecode: true,
  //       include_ast: false,
  //     }
  //   );
  // });

  // Test TypeScript declaration resolution
  bench("JS Bundler - Async DTS Resolution", async () => {
    await baseBundler.resolveDts(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  bench("JS Bundler - Sync DTS Resolution", () => {
    baseBundler.resolveDtsSync(
      mainContractPath,
      tempDir,
      false, // includeAst
      true   // includeBytecode
    );
  });

  // Rust bundler benchmarks (commented out until it's ready)
  // bench("Rust Bundler - Async DTS Resolution", async () => {
  //   await rustBundler.resolve_dts(
  //     mainContractPath,
  //     tempDir,
  //     {
  //       optimize: true,
  //       include_bytecode: true,
  //       include_ast: false,
  //     }
  //   );
  // });
});