FROM rust:1.54 as builder
WORKDIR /app
ADD . /app
RUN cargo build --release

# Prod stage
FROM gcr.io/distroless/cc
COPY --from=builder /app/target/release/rust-auth /
CMD ["./rust-auth"]

