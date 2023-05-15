use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, HttpRequest, Result};
use std::fs;

pub async fn login(req: HttpRequest) -> impl Responder {

    let contents = fs::read_to_string("./static/login.html")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}

pub async fn loginJS(req: HttpRequest) -> impl Responder {

    let contents = fs::read_to_string("./static/login.js")
        .expect("Should have been able to read the file");
    
    HttpResponse::Ok().body(contents)
}