#[cfg(test)]
mod tests {
    use crate::config::{BundlerConfig, SolcOptions, RuntimeOptions, ModuleType, ContractPackage};
    use std::path::PathBuf;

    #[test]
    fn test_bundler_config_default() {
        let config = BundlerConfig::default();
        
        assert!(config.remappings.is_empty());
        assert!(config.libs.is_empty());
        assert!(config.solc_path.is_none());
        assert!(config.solc_version.is_none());
        assert!(config.cache_dir.is_none());
        assert!(config.use_cache);
        assert!(!config.debug);
        assert_eq!(config.contract_package, "@tevm/contract");
    }
    
    #[test]
    fn test_bundler_config_custom() {
        let config = BundlerConfig {
            remappings: vec![("@openzeppelin/".to_string(), "./node_modules/@openzeppelin/".to_string())],
            libs: vec!["./node_modules".to_string()],
            solc_path: Some(PathBuf::from("/usr/local/bin/solc")),
            solc_version: Some("0.8.20".to_string()),
            cache_dir: Some(PathBuf::from("./.cache")),
            use_cache: false,
            debug: true,
            contract_package: "tevm/contract".to_string(),
        };
        
        assert_eq!(config.remappings.len(), 1);
        assert_eq!(config.remappings[0].0, "@openzeppelin/");
        assert_eq!(config.remappings[0].1, "./node_modules/@openzeppelin/");
        assert_eq!(config.libs.len(), 1);
        assert_eq!(config.libs[0], "./node_modules");
        assert_eq!(config.solc_path.unwrap(), PathBuf::from("/usr/local/bin/solc"));
        assert_eq!(config.solc_version.unwrap(), "0.8.20");
        assert_eq!(config.cache_dir.unwrap(), PathBuf::from("./.cache"));
        assert!(!config.use_cache);
        assert!(config.debug);
        assert_eq!(config.contract_package, "tevm/contract");
    }
    
    #[test]
    fn test_solc_options_default() {
        let options = SolcOptions::default();
        
        assert!(options.optimize);
        assert_eq!(options.optimizer_runs, Some(200));
        assert!(options.evm_version.is_none());
        assert!(!options.include_ast);
        assert!(options.include_bytecode);
        assert!(!options.include_source_map);
        assert!(options.include_user_docs);
        assert!(!options.include_dev_docs);
    }
    
    #[test]
    fn test_solc_options_custom() {
        let options = SolcOptions {
            optimize: false,
            optimizer_runs: Some(1000),
            evm_version: Some("paris".to_string()),
            include_ast: true,
            include_bytecode: false,
            include_source_map: true,
            include_user_docs: false,
            include_dev_docs: true,
        };
        
        assert!(!options.optimize);
        assert_eq!(options.optimizer_runs, Some(1000));
        assert_eq!(options.evm_version, Some("paris".to_string()));
        assert!(options.include_ast);
        assert!(!options.include_bytecode);
        assert!(options.include_source_map);
        assert!(!options.include_user_docs);
        assert!(options.include_dev_docs);
    }
    
    #[test]
    fn test_runtime_options_default() {
        let options = RuntimeOptions::default();
        
        assert!(matches!(options.module_type, ModuleType::Ts));
        assert!(matches!(options.contract_package, ContractPackage::TevmContract));
    }
    
    #[test]
    fn test_runtime_options_custom() {
        let options = RuntimeOptions {
            module_type: ModuleType::Dts,
            contract_package: ContractPackage::TevmContractScoped,
        };
        
        assert!(matches!(options.module_type, ModuleType::Dts));
        assert!(matches!(options.contract_package, ContractPackage::TevmContractScoped));
    }
    
    #[test]
    fn test_module_type_from_str() {
        assert!(matches!(ModuleType::from("ts"), ModuleType::Ts));
        assert!(matches!(ModuleType::from("cjs"), ModuleType::Cjs));
        assert!(matches!(ModuleType::from("mjs"), ModuleType::Mjs));
        assert!(matches!(ModuleType::from("dts"), ModuleType::Dts));
        assert!(matches!(ModuleType::from("unknown"), ModuleType::Ts)); // Default to Ts
    }
    
    #[test]
    fn test_contract_package_from_str() {
        assert!(matches!(ContractPackage::from("@tevm/contract"), ContractPackage::TevmContract));
        assert!(matches!(ContractPackage::from("tevm/contract"), ContractPackage::TevmContractScoped));
        assert!(matches!(ContractPackage::from("unknown"), ContractPackage::TevmContract)); // Default to TevmContract
    }
}