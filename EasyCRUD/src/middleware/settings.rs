use config::{Config, ConfigError};

pub fn getConfig() -> Config{
    let settings = Config::builder()
        .add_source(config::File::with_name("config"))
        .build()
        .unwrap();
    settings
}