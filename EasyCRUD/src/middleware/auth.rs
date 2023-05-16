use actix_session::Session;
use config::Config;
use sqlx::{MySqlPool, Connection};
use crate::middleware::settings::getConfig;

pub fn checkSessionAuth(session: Session) -> bool {

    let uname = match session.get::<String>("username") {
        Ok(Some(uname)) => uname,
        _ => {
            println!("Username not set in session!"); 
            return false
        }
    };

    let upass = match session.get::<String>("password") {
        Ok(Some(upass)) => upass,
        _ => {
            println!("Password not set in session!"); 
            return false
        }
    };
    
    true
}

pub async fn checkSQLAuth(username: String, password: String) -> bool {

    let settings = getConfig();

    let host = settings.get_string("mysql.host").unwrap();
    let port = settings.get_int("mysql.port").unwrap();

    let url_strng = format!("mysql://{}:{}@{}:{}", username, password, host, port);
    let url = url_strng.as_str();

    let conn = match MySqlPool::connect(url).await {
        Ok(conn) => conn,
        _ => return false
    };

    true
}