use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, cookie::Key};
use actix_session::{Session, SessionMiddleware, storage::{CookieSessionStore}};

mod api;
mod middleware;
mod ui;

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    println!("Starting server!");

    let secret_key = Key::generate();

    HttpServer::new(move || {
        App::new()
            .service(
                web::scope("/api")
                    .route("/executeSQL", web::get().to(api::executeSQL::executeSQL))
                    .route("/login", web::post().to(api::login::login))
                .route("/login", web::get().to(ui::login::login))
            )
            .wrap(SessionMiddleware::new(CookieSessionStore::default(), secret_key.clone()))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}