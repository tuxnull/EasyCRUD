use actix_session::Session;
use actix_web::{HttpResponse, Responder};
use std::fs;
use crate::middleware::auth::{checkSessionAuth};

pub async fn index(session: Session) -> impl Responder {

    if(!checkSessionAuth(session)) {
        return HttpResponse::Found().insert_header(("Location", "/login")).finish();
    }

    let contents = fs::read_to_string("./static/index.html")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}

pub async fn indexJS() -> impl Responder {

    let contents = fs::read_to_string("./static/main.js")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}