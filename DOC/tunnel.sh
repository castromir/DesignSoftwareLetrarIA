#!/bin/bash
# tunnel.sh — Expõe o frontend via ngrok
# O backend é acessado internamente pelo proxy do Vite (Docker network)
#
# Uso:
#   ./tunnel.sh                          → URL aleatória (muda a cada execução)
#   ./tunnel.sh --domain meu.ngrok-free.app  → URL fixa (domínio estático gratuito)
#   NGROK_DOMAIN=meu.ngrok-free.app ./tunnel.sh → mesmo efeito via env var
#
# Para obter um domínio estático gratuito: https://dashboard.ngrok.com/domains

FRONTEND_PORT=5174
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.dev.yml"
NGROK_API="http://localhost:4040/api/tunnels"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

# Ler domínio fixo de argumento ou variável de ambiente
NGROK_DOMAIN="${NGROK_DOMAIN:-}"
while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) NGROK_DOMAIN="$2"; shift 2 ;;
    *) shift ;;
  esac
done

echo -e "${CYAN}=== Letrar IA — ngrok Tunnel ===${NC}\n"

# Verificar ngrok
if ! command -v ngrok &> /dev/null; then
  echo "ngrok não encontrado. Instalando via brew..."
  brew install ngrok/ngrok/ngrok
fi

# Verificar autenticação
if ! ngrok config check &> /dev/null; then
  echo -e "${RED}ngrok não está autenticado.${NC}"
  echo "Execute: ngrok config add-authtoken <SEU_TOKEN>"
  echo "Crie sua conta grátis em: https://ngrok.com"
  exit 1
fi

# Matar qualquer instância anterior de ngrok
pkill -f "ngrok http" 2>/dev/null || true
sleep 1

# ── Garantir que os containers estão rodando ──────────────────────────────────
echo -e "${YELLOW}[1/2]${NC} Iniciando containers..."
docker compose -f "$COMPOSE_FILE" up -d
echo "  Aguardando serviços ficarem prontos (10s)..."
sleep 10

# ── Iniciar ngrok ─────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[2/2]${NC} Iniciando ngrok (porta $FRONTEND_PORT)..."

if [ -n "$NGROK_DOMAIN" ]; then
  echo "  Usando domínio fixo: $NGROK_DOMAIN"
  ngrok http $FRONTEND_PORT \
    --domain="$NGROK_DOMAIN" \
    --log=stdout \
    --log-format=json \
    > /tmp/ngrok.log 2>&1 &
else
  echo "  Usando URL aleatória (configure --domain para URL fixa)"
  ngrok http $FRONTEND_PORT \
    --log=stdout \
    --log-format=json \
    > /tmp/ngrok.log 2>&1 &
fi
NGROK_PID=$!

echo "  Aguardando URL do ngrok..."
FRONTEND_URL=""
for i in $(seq 1 30); do
  FRONTEND_URL=$(curl -s "$NGROK_API" 2>/dev/null \
    | python3 -c "
import sys, json
try:
  data = json.load(sys.stdin)
  tunnels = data.get('tunnels', [])
  for t in tunnels:
    url = t.get('public_url', '')
    if url.startswith('https'):
      print(url)
      break
except:
  pass
" 2>/dev/null)
  if [ -n "$FRONTEND_URL" ]; then break; fi
  sleep 1
done

if [ -z "$FRONTEND_URL" ]; then
  echo -e "${RED}Erro: não foi possível obter a URL do ngrok.${NC}"
  echo "Verifique o log: cat /tmp/ngrok.log"
  kill $NGROK_PID 2>/dev/null
  exit 1
fi

# ── Resultado ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${GREEN}  ngrok ativo!${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "  Frontend: ${GREEN}$FRONTEND_URL${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo "  Compartilhe este link com os usuários."
if [ -z "$NGROK_DOMAIN" ]; then
  echo ""
  echo -e "  ${YELLOW}Dica:${NC} Para URL permanente, obtenha um domínio estático gratuito:"
  echo "  https://dashboard.ngrok.com/domains"
  echo "  Depois use: ./tunnel.sh --domain seu-dominio.ngrok-free.app"
fi
echo ""
echo "  Painel ngrok: http://localhost:4040"
echo "  Pressione Ctrl+C para encerrar."
echo ""

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  echo -e "\nEncerrando ngrok..."
  kill $NGROK_PID 2>/dev/null
  echo "Encerrado."
}
trap cleanup INT TERM

wait $NGROK_PID
