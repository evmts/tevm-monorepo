use serde::Deserialize;
use std::path::Path;

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum StringOrVec {
    Single(String),
    Multiple(Vec<String>),
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Config {
    name: Option<String>,
    foundryProject: Option<bool>,
    libs: Option<Vec<string>>,
    remappings: Option<HashMap<string, string>>,
    debug: Option<bool>,
    cacheDir: Option<String>,
    json_as_const: Option<StringOrVec>,
}

#[derive(Debug, Error)]
enum ConfigError {
    #[error("Config file not found: {0}")]
    NotFound(String,)
}

pub fn load_json_config(config_dir: &str) {
    let path = Path::new(config_dir).join("tevm.config.json");

    if !path.exists() {
        return Err(ConfigError::NotFound(path.display().to_string()));
    }

    let content = match fs::read_to_string(&path) {
        Ok(str) => str,
        Err(err) => panic!("TODO handle error"),
    }

    serde_json::from_str::<Config>(&content)
}
