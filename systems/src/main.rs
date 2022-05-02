use actix_web::{web, App, HttpServer};
extern crate pem;

mod handlers;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=debug");

    // Start http server
    HttpServer::new(move || {
        App::new()
            .route("/auth/{id}", web::get().to(handlers::auth_user))
            .route("/verify", web::get().to(handlers::verify))
            .route("/README.txt", web::get().to(handlers::read_me))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
