use actix_session::Session;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, HttpRequest, Result, http::header};
use std::fs;
use crate::middleware::auth::{checkSQLAuth, checkSessionAuth};

pub async fn index(req: HttpRequest, session: Session) -> impl Responder {

    if(!checkSessionAuth(session)) {
        return HttpResponse::Found().insert_header(("Location", "/login")).finish();
    }

    let contents = fs::read_to_string("./static/index.html")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}

pub async fn indexJS(req: HttpRequest) -> impl Responder {

    let contents = fs::read_to_string("./static/main.js")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}