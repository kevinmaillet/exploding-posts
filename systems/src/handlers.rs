use actix_web::{cookie, web, Error, HttpMessage, HttpRequest, HttpResponse, Result};
use chrono::Utc;
use cookie::{Cookie, SameSite};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::fs;

/// Our claims struct, it needs to derive `Serialize` and/or `Deserialize`
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: i64,
}

//GET auth/:username
pub async fn auth_user(user_id: web::Path<String>) -> Result<HttpResponse, Error> {
    let user = user_id.into_inner();

    let my_claims = Claims {
        sub: user.to_owned(),
        exp: Utc::now().timestamp() + 60 * 60 * 24,
    };

    let header = Header::new(Algorithm::RS256);

    let token = encode(
        &header,
        &my_claims,
        &EncodingKey::from_rsa_pem(include_bytes!("private.pem")).unwrap(),
    )
    .unwrap();

    const PUBLIC_TEXT: &str = include_str!("./public.pem");

    let contents = PUBLIC_TEXT;

    // let contents = fs::read_to_string(PUBLIC_TEXT).expect("Something went wrong reading the file");

    let mut res = HttpResponse::Ok().content_type("text/plain").body(contents);

    res.add_cookie(
        &Cookie::build("token", token)
            .path("/")
            .same_site(SameSite::None)
            .secure(true)
            .http_only(true)
            .finish(),
    )
    .unwrap();

    Ok(res)
}

//GET verify
pub async fn verify(req: HttpRequest) -> Result<HttpResponse, Error> {
    let cookie_token = req
        .cookie("token")
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("no cookie"))?;
    let token = cookie_token.value();

    match decode::<Claims>(
        &token.to_string(),
        &DecodingKey::from_rsa_pem(include_bytes!("public.pem")).unwrap(),
        &Validation::new(Algorithm::RS256),
    ) {
        Ok(result) => Ok(HttpResponse::Ok().body(result.claims.sub)),
        Err(err) => Err(actix_web::error::ErrorUnauthorized(err)),
    }
}

//GET README.txt
pub async fn read_me() -> Result<HttpResponse, Error> {
    const README: &str = include_str!("./README.txt");

    let contents = README;

    // let contents = fs::read_to_string(README).expect("Something went wrong reading the file");

    Ok(HttpResponse::Ok().body(contents))
}
