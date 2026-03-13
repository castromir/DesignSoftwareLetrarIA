#!/bin/sh
# Gera certificado autoassinado se ainda não existir

CERT_DIR="/etc/nginx/certs"
CERT_FILE="$CERT_DIR/cert.pem"
KEY_FILE="$CERT_DIR/key.pem"
VM_HOST="${VM_HOST:-localhost}"

mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "[Nginx] Gerando certificado autoassinado para: $VM_HOST"

    # Cria config com SAN para suportar IP e domínio
    cat > /tmp/openssl.cnf <<EOF
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
x509_extensions    = v3_req

[dn]
C  = BR
ST = Dev
L  = Dev
O  = LetrarIA
CN = $VM_HOST

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = $VM_HOST
IP.1  = $VM_HOST
EOF

    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -config /tmp/openssl.cnf 2>/dev/null

    echo "[Nginx] Certificado gerado com sucesso."
else
    echo "[Nginx] Certificado já existe, reutilizando."
fi
