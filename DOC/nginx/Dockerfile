FROM nginx:alpine

RUN apk add --no-cache openssl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY generate-certs.sh /docker-entrypoint.d/10-generate-certs.sh
RUN chmod +x /docker-entrypoint.d/10-generate-certs.sh
