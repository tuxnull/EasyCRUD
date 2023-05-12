use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use actix_session::Session;
use crate::middleware::auth::checkSessionAuth;

pub async fn executeSQL(session: Session) -> impl Responder {

    if !checkSessionAuth(session) {
        println!("Session is not authenticated!");
        return HttpResponse::Unauthorized().body("Unauthorized - Not logged in");
    }

    HttpResponse::Ok().body("Hello world!")
}
