#!/bin/bash
# tunnel.sh — Expõe o frontend via Cloudflare Tunnel
# O backend é acessado internamente pelo proxy do Vite (Docker network)

FRONTEND_PORT=5174
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.dev.yml"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}=== Letrar IA — Cloudflare Tunnel ===${NC}\n"

# Verificar cloudflared
if ! command -v cloudflared &> /dev/null; then
  echo "cloudflared não encontrado. Instalando via brew..."
  brew install cloudflared
fi

# ── Garantir que os containers estão rodando ──────────────────────────────────
echo -e "${YELLOW}[1/2]${NC} Iniciando containers..."
docker compose -f "$COMPOSE_FILE" up -d
echo "  Aguardando serviços ficarem prontos (10s)..."
sleep 10

# ── Iniciar túnel do frontend ─────────────────────────────────────────────────
echo -e "\n${YELLOW}[2/2]${NC} Iniciando túnel do frontend (porta $FRONTEND_PORT)..."
FRONTEND_LOG=$(mktemp)
cloudflared tunnel --url "http://localhost:$FRONTEND_PORT" > "$FRONTEND_LOG" 2>&1 &
FRONTEND_TUNNEL_PID=$!

echo "  Aguardando URL do frontend..."
FRONTEND_URL=""
for i in $(seq 1 40); do
  FRONTEND_URL=$(grep -o 'https://[a-zA-Z0-9-]*\.trycloudflare\.com' "$FRONTEND_LOG" | head -1)
  if [ -n "$FRONTEND_URL" ]; then break; fi
  sleep 1
done

if [ -z "$FRONTEND_URL" ]; then
  echo -e "${RED}Erro: não foi possível obter a URL do frontend.${NC}"
  cat "$FRONTEND_LOG"
  kill $FRONTEND_TUNNEL_PID 2>/dev/null
  exit 1
fi

# ── Resultado ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${GREEN}  Túnel ativo!${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "  Frontend: ${GREEN}$FRONTEND_URL${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo "  Compartilhe este link com os usuários."
echo "  O backend é acessado internamente — sem exposição externa necessária."
echo ""
echo "  Pressione Ctrl+C para encerrar o túnel."
echo ""

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  echo -e "\nEncerrando túnel..."
  kill $FRONTEND_TUNNEL_PID 2>/dev/null
  rm -f "$FRONTEND_LOG"
  echo "Túnel encerrado."
}
trap cleanup INT TERM

wait $FRONTEND_TUNNEL_PID
