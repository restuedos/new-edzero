#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KEYS_DIR="${ROOT}/client-keys"
APP_STORAGE="${ROOT}/storage/private"

mkdir -p "$KEYS_DIR" "$APP_STORAGE"

echo "Generating RSA keypairs..."

# Encryption keypair (client encrypts with public, server decrypts with private)
openssl genrsa -out "$KEYS_DIR/decrypt-private.rsa" 2048 2>/dev/null
openssl rsa -in "$KEYS_DIR/decrypt-private.rsa" -pubout -out "$KEYS_DIR/encryption-public.rsa" 2>/dev/null

# Signing keypair (server signs with private, client verifies with public)
openssl genrsa -out "$KEYS_DIR/sign-private.rsa" 2048 2>/dev/null
openssl rsa -in "$KEYS_DIR/sign-private.rsa" -pubout -out "$KEYS_DIR/verification-public.rsa" 2>/dev/null

chmod 600 "$KEYS_DIR"/*.rsa

# Copy public keys to app
cp "$KEYS_DIR/encryption-public.rsa" "$APP_STORAGE/license-encryption-public.rsa"
cp "$KEYS_DIR/verification-public.rsa" "$APP_STORAGE/license-verification-public.rsa"

echo "Keys generated in $KEYS_DIR"
echo "Public keys copied to $APP_STORAGE"
echo ""
echo "Never commit private keys (*.rsa in client-keys/) to version control."
