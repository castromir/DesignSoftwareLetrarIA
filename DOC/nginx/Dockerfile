FROM nginx:alpine

RUN apk add --no-cache openssl

# Gera certificado autoassinado em tempo de build
# VM_HOST não está disponível aqui, mas qualquer CN serve para dev —
# o navegador aceita o aviso uma vez e o microfone funciona normalmente.
RUN mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/certs/key.pem \
        -out /etc/nginx/certs/cert.pem \
        -subj "/C=BR/ST=Dev/O=LetrarIA/CN=letraria"

COPY nginx.conf /etc/nginx/conf.d/default.conf
