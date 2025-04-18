mod load_foundry_config;
mod load_json_config;
mod load_remappings;
mod merge_configs;

pub fn load_config(config_file_dir: &str) -> Result<TevmConfig, Vec<Err>> {
    let mut errors: Vec<Err> = vec![];
    let json_config = match load_json_config(config_file_dir) {
        Ok(config) => config,
        Err(err) => {
            errors.push(err);
            TevmConfig {}
        }
    };
    let foundry_config = match load_foundry_config(json_config.foundry_project, config_file_dir) {
        Ok(config) => config,
        Err(err) => {
            errors.push(err);
            TevmConfig {}
        }
    };
    let remappings_config = match load_remappings(config_file_dir) {
        Ok(config) => config,
        Err(err) => {
            errors.push(err);
            TevmConfig {}
        }
    };

    merge_configs(json_config, foundry_config, remappings_config)
}
