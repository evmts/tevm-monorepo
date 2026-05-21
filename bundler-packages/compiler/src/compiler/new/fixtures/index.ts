import { readFileSync } from "fs";
import { join } from "path";
import type { SolcAst } from "@tevm/solc";
import ComprehensiveContractSolcOutput from "./ComprehensiveContract.solcOutput.js";
import InheritedContractSolcOutput from "./InheritedContract.solcOutput.js";
import SimpleContractSolcOutput from "./SimpleContract.solcOutput.js";
import SimpleContractAstSolcOutput from "./SimpleContractAst.solcOutput.js";
import SimpleYulSolcOutput from "./SimpleYul.solcOutput.js";

export const SimpleContract = {
  source: readFileSync(join(__dirname, 'SimpleContract.sol'), 'utf8'),
  solcOutput: SimpleContractSolcOutput,
  ast: JSON.parse(readFileSync(join(__dirname, 'SimpleContractAst.json'), 'utf8')) as SolcAst,
}

export const SimpleContractAst = {
  source: JSON.parse(readFileSync(join(__dirname, 'SimpleContractAst.json'), 'utf8')) as SolcAst,
  solcOutput: SimpleContractAstSolcOutput,
}

export const ComprehensiveContract = {
  source: readFileSync(join(__dirname, 'ComprehensiveContract.sol'), 'utf8'),
  solcOutput: ComprehensiveContractSolcOutput,
}

export const InheritedContract = {
  source: readFileSync(join(__dirname, 'InheritedContract.sol'), 'utf8'),
  solcOutput: InheritedContractSolcOutput,
}

export const SimpleYul = {
  source: readFileSync(join(__dirname, 'SimpleYul.yul'), 'utf8'),
  solcOutput: SimpleYulSolcOutput,
}