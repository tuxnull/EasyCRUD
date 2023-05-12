use actix_session::Session;
use config::Config;
use mysql::*;
use crate::middleware::settings::getConfig;

pub fn checkSessionAuth(session: Session) -> bool {

    let uname = match session.get::<String>("username") {
        Ok(Some(uname)) => uname,
        _ => return false
    };

    let upass = match session.get::<String>("password") {
        Ok(Some(upass)) => upass,
        _ => return false
    };
    
    true
}

pub fn checkSQLAuth(username: String, password: String) -> bool {

    let settings = getConfig();

    let host = settings.get_string("mysql.host").unwrap();
    let port = settings.get_int("mysql.port").unwrap();

    let url_strng = format!("mysql://{}:{}@{}:{}", username, password, host, port);
    let url = url_strng.as_str();

    let pool = match Pool::new(url){
        Ok(pool) => pool,
        Err(_) => return false
    };

    let mut conn = match pool.get_conn(){
        Ok(conn) => conn,
        Err(_) => return false
    };

    true
}