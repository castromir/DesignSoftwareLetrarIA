#!/bin/sh
# Gera certificado autoassinado na primeira inicialização.
# POSIX sh puro — compatível com Alpine/busybox.

CERT_DIR="/etc/nginx/certs"
VM_HOST="${VM_HOST:-localhost}"

mkdir -p "$CERT_DIR"

if [ -f "$CERT_DIR/cert.pem" ] && [ -f "$CERT_DIR/key.pem" ]; then
    echo "[Nginx] Certificado já existe — reutilizando."
    exit 0
fi

echo "[Nginx] Gerando certificado autoassinado para: $VM_HOST"

# Detecta se VM_HOST é um IP ou hostname para preencher o SAN corretamente
if echo "$VM_HOST" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$'; then
    SAN="IP:$VM_HOST"
else
    SAN="DNS:$VM_HOST"
fi

cat > /tmp/openssl.cnf << OPENSSLCONF
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
x509_extensions    = v3_req

[dn]
C  = BR
ST = Dev
O  = LetrarIA
CN = $VM_HOST

[v3_req]
subjectAltName = $SAN
OPENSSLCONF

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_DIR/key.pem" \
    -out "$CERT_DIR/cert.pem" \
    -config /tmp/openssl.cnf

if [ $? -eq 0 ]; then
    echo "[Nginx] Certificado gerado com sucesso ($SAN)."
else
    echo "[Nginx] ERRO ao gerar certificado."
    exit 1
fi
