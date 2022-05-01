use jsonwebtoken::errors::ErrorKind;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

/// Our claims struct, it needs to derive `Serialize` and/or `Deserialize`
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
}

let my_claims = Claims {
    sub: "test@gmail.com".to_owned(),
};

let header = Header::new(Algorithm::RS256);

let token = encode(
    &header,
    &my_claims,
    &EncodingKey::from_rsa_pem(include_bytes!("private2.pem")).unwrap(),
)
.unwrap();