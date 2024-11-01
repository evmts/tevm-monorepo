export type ParamsDict = {
  1?: {
    gasConfig?: {
      maxRefundQuotient?: number;
    };
    gasPrices?: {
      basefeeGas?: number;
      expGas?: number;
      expByteGas?: number;
      keccak256Gas?: number;
      keccak256WordGas?: number;
      sloadGas?: number;
      sstoreSetGas?: number;
      sstoreResetGas?: number;
      sstoreRefundGas?: number;
      jumpdestGas?: number;
      logGas?: number;
      logDataGas?: number;
      logTopicGas?: number;
      createGas?: number;
      callGas?: number;
      callStipendGas?: number;
      callValueTransferGas?: number;
      callNewAccountGas?: number;
      selfdestructRefundGas?: number;
      memoryGas?: number;
      quadCoefficientDivGas?: number;
      createDataGas?: number;
      copyGas?: number;
      ecRecoverGas?: number;
      sha256Gas?: number;
      sha256WordGas?: number;
      ripemd160Gas?: number;
      ripemd160WordGas?: number;
      identityGas?: number;
      identityWordGas?: number;
      stopGas?: number;
      addGas?: number;
      mulGas?: number;
      subGas?: number;
      divGas?: number;
      sdivGas?: number;
      modGas?: number;
      smodGas?: number;
      addmodGas?: number;
      mulmodGas?: number;
      signextendGas?: number;
      ltGas?: number;
      gtGas?: number;
      sltGas?: number;
      sgtGas?: number;
      eqGas?: number;
      iszeroGas?: number;
      andGas?: number;
      orGas?: number;
      xorGas?: number;
      notGas?: number;
      byteGas?: number;
      addressGas?: number;
      balanceGas?: number;
      originGas?: number;
      callerGas?: number;
      callvalueGas?: number;
      calldataloadGas?: number;
      calldatasizeGas?: number;
      calldatacopyGas?: number;
      codesizeGas?: number;
      codecopyGas?: number;
      gaspriceGas?: number;
      extcodesizeGas?: number;
      extcodecopyGas?: number;
      blockhashGas?: number;
      coinbaseGas?: number;
      timestampGas?: number;
      numberGas?: number;
      difficultyGas?: number;
      gaslimitGas?: number;
      popGas?: number;
      mloadGas?: number;
      mstoreGas?: number;
      mstore8Gas?: number;
      sstoreGas?: number;
      jumpGas?: number;
      jumpiGas?: number;
      pcGas?: number;
      msizeGas?: number;
      gasGas?: number;
      pushGas?: number;
      dupGas?: number;
      swapGas?: number;
      callcodeGas?: number;
      returnGas?: number;
      invalidGas?: number;
      selfdestructGas?: number;
      prevrandaoGas?: number;
    };
    evm?: {
      stackLimit?: number;
      callCreateDepth?: number;
    };
  };
  606?: { gasPrices?: { delegatecallGas?: number } };
  608?: {
    gasPrices?: {
      sloadGas?: number;
      callGas?: number;
      extcodesizeGas?: number;
      extcodecopyGas?: number;
      balanceGas?: number;
      delegatecallGas?: number;
      callcodeGas?: number;
      selfdestructGas?: number;
    };
  };
  607?: {
    gasPrices?: {
      expByteGas?: number;
    };
    evm?: {
      maxCodeSize?: number;
    };
  };
  609?: {
    gasPrices?: {
      modexpGquaddivisorGas?: number;
      bn254AddGas?: number;
      bn254MulGas?: number;
      bn254PairingGas?: number;
      bn254PairingWordGas?: number;
      revertGas?: number;
      staticcallGas?: number;
      returndatasizeGas?: number;
      returndatacopyGas?: number;
    };
  };
  1013?: {
    gasPrices?: {
      netSstoreNoopGas?: number;
      netSstoreInitGas?: number;
      netSstoreCleanGas?: number;
      netSstoreDirtyGas?: number;
      netSstoreClearRefundGas?: number;
      netSstoreResetRefundGas?: number;
      netSstoreResetClearRefundGas?: number;
      shlGas?: number;
      shrGas?: number;
      sarGas?: number;
      extcodehashGas?: number;
      create2Gas?: number;
    };
  };
  1716?: {
    gasPrices?: {
      netSstoreNoopGas?: null;
      netSstoreInitGas?: null;
      netSstoreCleanGas?: null;
      netSstoreDirtyGas?: null;
      netSstoreClearRefundGas?: null;
      netSstoreResetRefundGas?: null;
      netSstoreResetClearRefundGas?: null;
    };
  };
  1679?: {
    gasPrices?: {
      blake2RoundGas?: number;
      bn254AddGas?: number;
      bn254MulGas?: number;
      bn254PairingGas?: number;
      bn254PairingWordGas?: number;
      sstoreSentryEIP2200Gas?: number;
      sstoreNoopEIP2200Gas?: number;
      sstoreDirtyEIP2200Gas?: number;
      sstoreInitEIP2200Gas?: number;
      sstoreInitRefundEIP2200Gas?: number;
      sstoreCleanEIP2200Gas?: number;
      sstoreCleanRefundEIP2200Gas?: number;
      sstoreClearRefundEIP2200Gas?: number;
      balanceGas?: number;
      extcodehashGas?: number;
      chainidGas?: number;
      selfbalanceGas?: number;
      sloadGas?: number;
    };
  };
  663?: {
    gasPrices?: {
      dupnGas?: number;
      swapnGas?: number;
      exchangeGas?: number;
    };
  };
  1153?: {
    gasPrices?: {
      tstoreGas?: number;
      tloadGas?: number;
    };
  };
  1559?: {
    elasticityMultiplier?: number;
  };
  2565?: {
    gasPrices?: {
      modexpGquaddivisorGas?: number;
    };
  };
  2537?: {
    gasPrices?: {
      bls12381G1AddGas?: number;
      bls12381G1MulGas?: number;
      bls12381G2AddGas?: number;
      bls12381G2MulGas?: number;
      bls12381PairingBaseGas?: number;
      bls12381PairingPerPairGas?: number;
      bls12381MapG1Gas?: number;
      bls12381MapG2Gas?: number;
    };
  };
  2929?: {
    gasPrices?: {
      coldsloadGas?: number;
      coldaccountaccessGas?: number;
      warmstoragereadGas?: number;
      sstoreCleanEIP2200Gas?: number;
      sstoreNoopEIP2200Gas?: number;
      sstoreDirtyEIP2200Gas?: number;
      sstoreInitRefundEIP2200Gas?: number;
      sstoreCleanRefundEIP2200Gas?: number;
      callGas?: number;
      callcodeGas?: number;
      delegatecallGas?: number;
      staticcallGas?: number;
      balanceGas?: number;
      extcodesizeGas?: number;
      extcodecopyGas?: number;
      extcodehashGas?: number;
      sloadGas?: number;
      sstoreGas?: number;
    };
  };
  2935?: {
    evm?: {
      historyStorageAddress?: string;
      historyServeWindow?: number;
    };
  };
  3198?: {
    gasPrices?: {
      basefeeGas?: number;
    };
  };
  3529?: {
    gasConfig?: {
      maxRefundQuotient?: number;
    };
    gasPrices?: {
      selfdestructRefundGas?: number;
      sstoreClearRefundEIP2200Gas?: number;
    };
  };
  3855?: {
    gasPrices?: {
      push0Gas?: number;
    };
  };
  3860?: {
    gasPrices?: {
      initCodeWordGas?: number;
    };
    evm?: {
      maxInitCodeSize?: number;
    };
  };
  4200?: {
    gasPrices?: {
      rjumpGas?: number;
      rjumpiGas?: number;
      rjumpvGas?: number;
    };
  };
  4399?: {
    gasPrices?: {
      prevrandaoGas?: number;
    };
  };
  4750?: {
    gasPrices?: {
      callfGas?: number;
      retfGas?: number;
    };
  };
  4844?: {
    gasPrices?: {
      kzgPointEvaluationPrecompileGas?: number;
      blobhashGas?: number;
    };
    sharding?: {
      blobCommitmentVersionKzg?: number;
      fieldElementsPerBlob?: number;
    };
  };
  5656?: {
    gasPrices?: {
      mcopyGas?: number;
    };
  };
  6206?: {
    gasPrices?: {
      jumpfGas?: number;
    };
  };
   6800?: {
    gasPrices?: {
      createGas?: number;
      coldsloadGas?: number;
    };
  };
  7069?: {
    gasPrices?: {
      extcallGas?: number;
      extdelegatecallGas?: number;
      extstaticcallGas?: number;
      returndataloadGas?: number;
      minRetainedGas?: number;
      minCalleeGas?: number;
    };
  };
  7480?: {
    gasPrices?: {
      dataloadGas?: number;
      dataloadnGas?: number;
      datasizeGas?: number;
      datacopyGas?: number;
    };
  };
  7516?: {
    gasPrices?: {
      blobbasefeeGas?: number;
    };
  };
  7620?: {
    gasPrices?: {
      eofcreateGas?: number;
      returncontractGas?: number;
    };
  };
};
