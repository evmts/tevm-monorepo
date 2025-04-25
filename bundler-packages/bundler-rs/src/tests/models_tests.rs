#[cfg(test)]
mod tests {
    use crate::models::{BundleError, BundleResult, CompileResult, ModuleInfo, ContractArtifact};
    use std::collections::HashMap;
    use std::path::PathBuf;
    use serde_json::json;

    #[test]
    fn test_bundle_error_display() {
        let error_without_path = BundleError {
            message: "Test error message".to_string(),
            path: None,
        };
        
        let error_with_path = BundleError {
            message: "Test error message".to_string(),
            path: Some(PathBuf::from("/path/to/file.sol")),
        };
        
        assert_eq!(error_without_path.to_string(), "Test error message");
        assert_eq!(error_with_path.to_string(), "Test error message (in /path/to/file.sol)");
    }
    
    #[test]
    fn test_bundle_result_serialization() {
        let mut modules = HashMap::new();
        modules.insert("file.sol".to_string(), "// Contract code".to_string());
        
        let result = BundleResult {
            code: "// Generated code".to_string(),
            source_map: Some("// Source map".to_string()),
            modules,
            solc_input: Some(json!({"language": "Solidity"})),
            solc_output: Some(json!({"contracts": {}})),
            asts: None,
        };
        
        let serialized = serde_json::to_string(&result).unwrap();
        let deserialized: BundleResult = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(deserialized.code, "// Generated code");
        assert_eq!(deserialized.source_map, Some("// Source map".to_string()));
        assert_eq!(deserialized.modules.len(), 1);
        assert_eq!(deserialized.modules.get("file.sol").unwrap(), "// Contract code");
        assert!(deserialized.solc_input.is_some());
        assert!(deserialized.solc_output.is_some());
        assert!(deserialized.asts.is_none());
    }
    
    #[test]
    fn test_compile_result_serialization() {
        let mut modules = HashMap::new();
        modules.insert("file.sol".to_string(), ModuleInfo {
            id: "file.sol".to_string(),
            code: "// Contract code".to_string(),
            raw_code: "// Raw contract code".to_string(),
            imported_modules: vec!["imported.sol".to_string()],
        });
        
        let mut artifacts = HashMap::new();
        artifacts.insert("Contract".to_string(), ContractArtifact {
            abi: json!([{"name": "function", "type": "function"}]),
            bytecode: Some("0x123456".to_string()),
            deployed_bytecode: Some("0x789abc".to_string()),
            user_doc: Some(json!({"notice": "Test contract"})),
            dev_doc: Some(json!({"author": "Test Author"})),
        });
        
        let result = CompileResult {
            modules,
            solc_input: json!({"language": "Solidity"}),
            solc_output: json!({"contracts": {}}),
            artifacts,
            asts: None,
        };
        
        let serialized = serde_json::to_string(&result).unwrap();
        let deserialized: CompileResult = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(deserialized.modules.len(), 1);
        assert_eq!(deserialized.modules.get("file.sol").unwrap().id, "file.sol");
        assert_eq!(deserialized.modules.get("file.sol").unwrap().code, "// Contract code");
        assert_eq!(deserialized.modules.get("file.sol").unwrap().raw_code, "// Raw contract code");
        assert_eq!(deserialized.modules.get("file.sol").unwrap().imported_modules.len(), 1);
        assert_eq!(deserialized.modules.get("file.sol").unwrap().imported_modules[0], "imported.sol");
        
        assert_eq!(deserialized.artifacts.len(), 1);
        assert!(deserialized.artifacts.contains_key("Contract"));
        let artifact = &deserialized.artifacts["Contract"];
        assert_eq!(artifact.bytecode, Some("0x123456".to_string()));
        assert_eq!(artifact.deployed_bytecode, Some("0x789abc".to_string()));
        assert!(artifact.user_doc.is_some());
        assert!(artifact.dev_doc.is_some());
    }
    
    #[test]
    fn test_module_info_serialization() {
        let module_info = ModuleInfo {
            id: "file.sol".to_string(),
            code: "// Contract code".to_string(),
            raw_code: "// Raw contract code".to_string(),
            imported_modules: vec!["imported.sol".to_string()],
        };
        
        let serialized = serde_json::to_string(&module_info).unwrap();
        let deserialized: ModuleInfo = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(deserialized.id, "file.sol");
        assert_eq!(deserialized.code, "// Contract code");
        assert_eq!(deserialized.raw_code, "// Raw contract code");
        assert_eq!(deserialized.imported_modules.len(), 1);
        assert_eq!(deserialized.imported_modules[0], "imported.sol");
    }
    
    #[test]
    fn test_contract_artifact_serialization() {
        let artifact = ContractArtifact {
            abi: json!([{"name": "function", "type": "function"}]),
            bytecode: Some("0x123456".to_string()),
            deployed_bytecode: Some("0x789abc".to_string()),
            user_doc: Some(json!({"notice": "Test contract"})),
            dev_doc: Some(json!({"author": "Test Author"})),
        };
        
        let serialized = serde_json::to_string(&artifact).unwrap();
        let deserialized: ContractArtifact = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(deserialized.abi, json!([{"name": "function", "type": "function"}]));
        assert_eq!(deserialized.bytecode, Some("0x123456".to_string()));
        assert_eq!(deserialized.deployed_bytecode, Some("0x789abc".to_string()));
        assert_eq!(deserialized.user_doc, Some(json!({"notice": "Test contract"})));
        assert_eq!(deserialized.dev_doc, Some(json!({"author": "Test Author"})));
    }
}