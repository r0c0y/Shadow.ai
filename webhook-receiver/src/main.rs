use axum::{
    body::Body,
    extract::{State, Request},
    http::{StatusCode, HeaderMap},
    response::{IntoResponse, Response},
    routing::post,
    Router,
};
use hmac::{Hmac, Mac};
use sha2::Sha256;
use std::env;
use std::sync::Arc;
use dotenv::dotenv;
use tracing::{info, error, warn};

#[derive(Clone)]
struct AppState {
    kestra_webhook_url: String,
    github_secret: String,
    client: reqwest::Client,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    let kestra_webhook_url = env::var("KESTRA_WEBHOOK_URL")
        .expect("KESTRA_WEBHOOK_URL must be set");
    let github_secret = env::var("GITHUB_WEBHOOK_SECRET")
        .expect("GITHUB_WEBHOOK_SECRET must be set");

    let state = Arc::new(AppState {
        kestra_webhook_url,
        github_secret,
        client: reqwest::Client::new(),
    });

    let app = Router::new()
        .route("/webhook", post(github_webhook_handler))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("Listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn github_webhook_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    request: Request<Body>,
) -> Response {
    // 1. Validate Signature
    let signature_header = match headers.get("x-hub-signature-256") {
        Some(h) => h.to_str().unwrap_or(""),
        None => {
            warn!("Missing X-Hub-Signature-256 header");
            return (StatusCode::UNAUTHORIZED, "Missing signature").into_response();
        }
    };

    let body_bytes = match axum::body::to_bytes(request.into_body(), 1024 * 1024 * 25).await { // 25MB limit
        Ok(b) => b,
        Err(e) => {
            error!("Failed to read body: {}", e);
            return (StatusCode::BAD_REQUEST, "Failed to read body").into_response();
        }
    };

    if let Err(e) = verify_signature(&state.github_secret, &body_bytes, signature_header) {
        error!("Signature verification failed: {}", e);
        return (StatusCode::UNAUTHORIZED, "Invalid signature").into_response();
    }

    // 2. Immediate Acknowledgement (202 Accepted)
    // We spawn the forwarding task so we can return immediately
    let state_clone = state.clone();
    let body_vec = body_bytes.to_vec();
    
    // Check if it's a ping event
    if let Some(event) = headers.get("x-github-event") {
        if event == "ping" {
            info!("Received ping event");
            return StatusCode::OK.into_response();
        }
    }

    tokio::spawn(async move {
        forward_to_kestra(state_clone, body_vec).await;
    });

    StatusCode::ACCEPTED.into_response()
}

fn verify_signature(secret: &str, body: &[u8], signature_header: &str) -> Result<(), String> {
    if !signature_header.starts_with("sha256=") {
        return Err("Signature does not start with sha256=".to_string());
    }
    let signature_hex = &signature_header[7..];
    let signature_bytes = hex::decode(signature_hex).map_err(|e| e.to_string())?;

    let mut mac = Hmac::<Sha256>::new_from_slice(secret.as_bytes())
        .map_err(|e| e.to_string())?;
    mac.update(body);

    mac.verify_slice(&signature_bytes).map_err(|e| "Signature mismatch".to_string())
}

async fn forward_to_kestra(state: Arc<AppState>, body: Vec<u8>) {
    info!("Forwarding payload to Kestra...");
    
    // Parse to ensure it's valid JSON (optional, but good for logs)
    let payload: serde_json::Value = match serde_json::from_slice(&body) {
        Ok(v) => v,
        Err(e) => {
            error!("Failed to parse body as JSON: {}", e);
            return;
        }
    };

    let response = state.client.post(&state.kestra_webhook_url)
        .basic_auth("admin", Some("admin"))
        .json(&payload)
        .send()
        .await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                info!("Successfully forwarded to Kestra: {}", resp.status());
            } else {
                error!("Kestra returned error: {}", resp.status());
            }
        }
        Err(e) => {
            error!("Failed to call Kestra: {}", e);
        }
    }
}
