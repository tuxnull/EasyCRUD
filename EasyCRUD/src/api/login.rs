use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use actix_session::Session;
use serde::Deserialize;
use crate::middleware::auth::checkSQLAuth;


#[derive(Deserialize)]
pub struct LoginData {
    username: String,
    password: String,
}

pub async fn login(session: Session, form: web::Form<LoginData>) -> impl Responder {

    let username = form.username.clone();
    let password = form.password.clone();

    if !checkSQLAuth(username, password) {
        println!("SQL authentication failed!");
        return HttpResponse::Unauthorized().body("SQL Connection failed");
    }

    session.insert("username", form.username.clone()).unwrap();
    session.insert("password", form.password.clone()).unwrap();

    HttpResponse::Ok().body(format!("username: {}", form.username))

}