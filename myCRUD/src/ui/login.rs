use actix_web::{HttpResponse, Responder, HttpRequest};
use std::fs;

pub async fn login() -> impl Responder {

    let contents = fs::read_to_string("./static/login.html")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}

pub async fn loginJS() -> impl Responder {

    let contents = fs::read_to_string("./static/login.js")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}