use std::{path::PathBuf, sync::Arc};

#[derive(Clone)]
pub struct Config {
    pub libs: Arc<Vec<PathBuf>>,
    pub remappings: Arc<Vec<(String, PathBuf)>>,
}

impl From<(Option<Vec<PathBuf>>, Option<Vec<(String, PathBuf)>>)> for Config {
    fn from(data: (Option<Vec<PathBuf>>, Option<Vec<(String, PathBuf)>>)) -> Self {
        let (libs, remappings) = data;
        Config {
            libs: Arc::new(libs.unwrap_or_default()),
            remappings: Arc::new(remappings.unwrap_or_default()),
        }
    }
}

impl From<(Option<Vec<String>>, Option<Vec<(String, String)>>)> for Config {
    fn from(data: (Option<Vec<String>>, Option<Vec<(String, String)>>)) -> Self {
        let (libs, remappings) = data;
        Config {
            libs: Arc::new(
                libs.unwrap_or_default()
                    .into_iter()
                    .map(PathBuf::from)
                    .collect(),
            ),
            remappings: Arc::new(
                remappings
                    .unwrap_or_default()
                    .into_iter()
                    .map(|(k, v)| (k, PathBuf::from(v)))
                    .collect(),
            ),
        }
    }
}
