#!/usr/bin/env bash
#
# atualizacoes.sh
#
# Script unificado para aplicar correções, reiniciar serviços, gerar backups,
# arquivar documentação e — agora — executar rollback automático a partir do
# backup mais recente.
#
# Local esperado: executar a partir do diretório DOC do projeto:
#   cd /path/to/DesignSoftwareLetrarIA/DOC
#
# Uso:
#   ./atualizacoes.sh --help
#
# Principais comandos:
#   --backup            : cria backup (scripts + MD) e um dump SQL do banco
#   --apply-fixdb       : aplica correção de banco (remove FK story_id, altera coluna)
#   --apply-fixcors     : aplica correção CORS + rebuild
#   --apply-all         : pipeline: (opcional backup) -> fixdb -> fixcors -> restart
#   --rollback          : restaura o backup mais recente (DB + arquivos arquivados)
#   --status / --logs   : mostra status e logs
#   --dry-run           : mostra ações sem executar
#   -y / --yes          : não pedir confirmações interativas
#
# Antes de executar:
# - Tenha Docker / Docker Compose configurados e containers nominalmente nomeados
#   conforme docker-compose.dev.yml (serviço 'db' e 'backend' presumidos).
# - Recomendo rodar inicialmente com --dry-run para revisar ações.
#
# Segurança:
# - Rollback sobrescreverá o estado atual do banco com o dump restaurado.
# - Use backups antes de operações destrutivas.
#
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOC_DIR="$(pwd)"
BACKUP_DIR="${DOC_DIR}/backups"
ARCHIVE_DIR="${DOC_DIR}/archived_docs"
LOG_DIR="${DOC_DIR}/logs"
mkdir -p "${BACKUP_DIR}" "${ARCHIVE_DIR}" "${LOG_DIR}"

DRY_RUN=false
AUTO_YES=false
DO_BACKUP=false
DO_ARCHIVE=false

# Files to back up (scripts and generated docs)
SCRIPT_FILES=(fix-database.sh fix-and-restart.sh restart-backend.sh test-delete-professional.sh atualizacoes.sh)
DOC_FILES=(APLIQUE_AGORA.md COMANDOS_RAPIDOS.md CORRECAO_DELETE_PROFISSIONAL.md CORRECAO_FINAL.md EXECUTE_ISTO.txt LEIA_ISTO_PRIMEIRO.md SOLUCAO_DEFINITIVA.md SUMARIO_CORRECOES.md TRANSCRICAO_FIX_README.md TRANSCRICOES_ARQUIVO.md)

timestamp() { date +"%Y%m%d_%H%M%S"; }

log() {
  echo -e "$@" | tee -a "${LOG_DIR}/atualizacoes_$(timestamp).log"
}

die() {
  echo -e "${RED}ERROR:${NC} $*" | tee -a "${LOG_DIR}/atualizacoes_$(timestamp).log" >&2
  exit 1
}

run_or_echo() {
  # $* is command
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} $*"
  else
    log "${BLUE}[RUN]${NC} $*"
    eval "$@"
  fi
}

confirm_or_die() {
  local prompt="$1"
  if [ "${AUTO_YES}" = true ]; then
    log "${YELLOW}[AUTO]${NC} continuing without prompt"
    return 0
  fi
  echo -n "${prompt} (type 'sim' to confirm) > "
  read -r ans
  if [ "${ans}" != "sim" ]; then
    log "${YELLOW}Cancelled by user.${NC}"
    return 1
  fi
  return 0
}

ensure_doc_dir() {
  if [ ! -f "docker-compose.dev.yml" ]; then
    die "docker-compose.dev.yml not found in $(pwd). Run this script from DOC/ directory."
  fi
}

# -------------------------
# Backup: scripts/MD + DB dump
# -------------------------
do_backup() {
  ensure_doc_dir
  local ts
  ts="$(timestamp)"
  local target="${BACKUP_DIR}/backup_${ts}"
  local sqlfile="${target}/db_backup_${ts}.sql"

  log "${GREEN}Creating backup at: ${target}${NC}"
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} would create directory: ${target}"
  else
    mkdir -p "${target}"
  fi

  # copy script files
  for f in "${SCRIPT_FILES[@]}"; do
    if [ -f "${f}" ]; then
      if [ "${DRY_RUN}" = true ]; then
        log "${YELLOW}[DRY-RUN]${NC} would copy ${f} -> ${target}/"
      else
        cp -a "${f}" "${target}/" || true
      fi
    fi
  done

  # copy doc files
  for m in "${DOC_FILES[@]}"; do
    if [ -f "${m}" ]; then
      if [ "${DRY_RUN}" = true ]; then
        log "${YELLOW}[DRY-RUN]${NC} would copy ${m} -> ${target}/"
      else
        cp -a "${m}" "${target}/" || true
      fi
    fi
  done

  # create DB dump via docker compose (requires service 'db')
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} would run: docker compose -f docker-compose.dev.yml exec -T db pg_dump -U letraria_user letraria_db > ${sqlfile}"
  else
    # ensure DB container running (start db if needed)
    if ! docker compose -f docker-compose.dev.yml ps db | grep -q "Up"; then
      log "${YELLOW}DB container not running. Starting db...${NC}"
      docker compose -f docker-compose.dev.yml up -d db
      log "${BLUE}Waiting 8s for DB to accept connections...${NC}"
      sleep 8
    fi

    # Ensure required Postgres extension exists before any DB operations
    log "${BLUE}Ensuring pg_trgm extension exists in database (required for some indexes)...${NC}"
    if ! docker compose -f docker-compose.dev.yml exec -T db psql -U letraria_user -d letraria_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;" > /dev/null 2>&1; then
      log "${YELLOW}Warning: failed to create or verify pg_trgm extension. Continuing but check DB logs if issues occur.${NC}"
    else
      log "${GREEN}pg_trgm extension verified/created.${NC}"
    fi

    log "Dumping database to ${sqlfile} ..."
    if ! docker compose -f docker-compose.dev.yml exec -T db pg_dump -U letraria_user letraria_db > "${sqlfile}" 2>>"${LOG_DIR}/backup_pg_dump.log"; then
      log "${RED}Warning: pg_dump failed. Check ${LOG_DIR}/backup_pg_dump.log${NC}"
      # leave backup dir but indicate failure
    else
      log "${GREEN}Database dump saved: ${sqlfile}${NC}"
    fi
  fi

  log "${GREEN}Backup completed: ${target}${NC}"
}

# -------------------------
# Archive docs
# -------------------------
do_archive_docs() {
  ensure_doc_dir
  local ts
  ts="$(timestamp)"
  local dest="${ARCHIVE_DIR}/archived_${ts}"
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} would create ${dest} and move MD files there"
  else
    mkdir -p "${dest}"
  fi

  for m in "${DOC_FILES[@]}"; do
    if [ -f "${m}" ]; then
      if [ "${DRY_RUN}" = true ]; then
        log "${YELLOW}[DRY-RUN]${NC} would mv ${m} -> ${dest}/"
      else
        mv -v "${m}" "${dest}/" || true
      fi
    fi
  done

  log "${GREEN}Archived docs to: ${dest}${NC}"
}

# -------------------------
# Integrated DB fix (inline)
# -------------------------
apply_fixdb() {
  ensure_doc_dir
  if ! confirm_or_die "Apply DB fix (remove FK on recordings.story_id and set story_id to UUID NOT NULL)?"; then
    return 1
  fi

  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} Would run SQL to drop FK, ALTER COLUMN to UUID NOT NULL and CREATE INDEX IF NOT EXISTS idx_recordings_story_id"
    return 0
  fi

  # ensure db running; start if necessary
  if ! docker compose -f docker-compose.dev.yml ps db | grep -q "Up"; then
    log "${YELLOW}DB container not running. Starting db...${NC}"
    docker compose -f docker-compose.dev.yml up -d db
    log "${BLUE}Waiting 8s for DB to accept connections...${NC}"
    sleep 8
  fi

  # Before applying DDL/changes, ensure pg_trgm extension is available.
  log "${BLUE}Ensuring pg_trgm extension is present before applying DB changes...${NC}"
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} would run: docker compose -f docker-compose.dev.yml exec -T db psql -U letraria_user -d letraria_db -c \"CREATE EXTENSION IF NOT EXISTS pg_trgm;\""
  else
    if docker compose -f docker-compose.dev.yml exec -T db psql -U letraria_user -d letraria_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;" > /dev/null 2>&1; then
      log "${GREEN}pg_trgm extension ensured.${NC}"
    else
      log "${YELLOW}Warning: failed to create/verify pg_trgm extension. Continuing but DB operations may fail if extension is required.${NC}"
    fi
  fi

  log "${BLUE}Applying DB changes...${NC}"
  docker compose -f docker-compose.dev.yml exec -T db psql -U letraria_user -d letraria_db <<'EOSQL'
\set ON_ERROR_STOP on

BEGIN;

DO $$
DECLARE
    constraint_name_var TEXT;
BEGIN
    SELECT constraint_name INTO constraint_name_var
    FROM information_schema.table_constraints
    WHERE table_name = 'recordings'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name LIKE '%story%'
    LIMIT 1;

    IF constraint_name_var IS NOT NULL THEN
        EXECUTE 'ALTER TABLE recordings DROP CONSTRAINT ' || constraint_name_var;
        RAISE NOTICE '✓ Constraint FK removida: %', constraint_name_var;
    ELSE
        RAISE NOTICE '✓ Constraint FK não existe ou já foi removida';
    END IF;
END $$;

ALTER TABLE recordings ALTER COLUMN story_id TYPE UUID;
ALTER TABLE recordings ALTER COLUMN story_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_recordings_story_id ON recordings(story_id);

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'recordings'
  AND column_name = 'story_id';

COMMIT;

\echo ''
\echo '========================================'
\echo '✓ Correção aplicada com sucesso!'
\echo '========================================'
EOSQL

  log "${GREEN}DB fix applied.${NC}"

  # Restart backend to pick up DB changes
  log "${BLUE}Restarting backend container...${NC}"
  if ! docker compose -f docker-compose.dev.yml ps backend | grep -q "Up"; then
    log "${YELLOW}Backend container not running; will start containers instead of restart.${NC}"
    docker compose -f docker-compose.dev.yml up -d --build
  else
    docker compose -f docker-compose.dev.yml restart backend
  fi
  sleep 5
  log "${GREEN}Backend restarted.${NC}"
}

# -------------------------
# Integrated CORS fix + rebuild (inline)
# -------------------------
apply_fixcors() {
  ensure_doc_dir
  if ! confirm_or_die "Apply CORS fix and rebuild (down + up -d --build)?"; then
    return 1
  fi

  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} Would: scan backend Python files for XML tags, remove them if present, check docker-compose CORS config, docker compose down && up -d --build, and run basic CORS tests."
    return 0
  fi

  log "${BLUE}Scanning for XML tags in backend Python sources...${NC}"
  if grep -r "</parameter>\|</invoke>" backend/ 2>/dev/null; then
    log "${YELLOW}Found XML tags in Python files. Removing...${NC}"
    find backend/ -name "*.py" -type f -exec sed -i '/<\/parameter>/d' {} \;
    find backend/ -name "*.py" -type f -exec sed -i '/<\/invoke>/d' {} \;
    log "${GREEN}Tags removed.${NC}"
  else
    log "${GREEN}No XML tags found.${NC}"
  fi

  log "${BLUE}Checking docker-compose CORS config...${NC}"
  local cors_cfg
  cors_cfg="$(grep -n \"CORS_ORIGINS\" docker-compose.dev.yml || true)"
  if [ -z "${cors_cfg}" ]; then
    log "${RED}CORS_ORIGINS not found in docker-compose.dev.yml${NC}"
  else
    log "${GREEN}CORS config found:${NC} ${cors_cfg}"
  fi

  log "${YELLOW}Stopping all services (docker compose down)...${NC}"
  docker compose -f docker-compose.dev.yml down

  log "${YELLOW}Waiting 3 seconds...${NC}"
  sleep 3

  log "${YELLOW}Rebuilding and starting services...${NC}"
  docker compose -f docker-compose.dev.yml up -d --build

  log "${BLUE}Waiting 20 seconds for services to become healthy...${NC}"
  for i in $(seq 20 -1 1); do
    echo -ne "\rWaiting: ${i}s "
    sleep 1
  done
  echo

  log "${BLUE}Showing container status...${NC}"
  docker compose -f docker-compose.dev.yml ps

  log "${BLUE}Checking backend CORS env (inside container)...${NC}"
  if docker compose -f docker-compose.dev.yml exec -T backend env | grep -q "CORS_ORIGINS"; then
    docker compose -f docker-compose.dev.yml exec -T backend env | grep "CORS_ORIGINS" || true
  else
    log "${RED}CORS_ORIGINS not exposed in backend env${NC}"
  fi

  log "${BLUE}Showing last backend logs...${NC}"
  docker compose -f docker-compose.dev.yml logs --tail=30 backend || true

  log "${BLUE}Testing backend health and CORS via OPTIONS...${NC}"
  if curl -s -f http://localhost:8888/health >/dev/null 2>&1; then
    log "${GREEN}Backend health OK${NC}"
  else
    log "${RED}Backend health check failed (http://localhost:8888/health)${NC}"
  fi

  # Basic CORS OPTIONS test
  local cors_test
  cors_test="$(curl -s -H "Origin: http://localhost:5174" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS http://localhost:8888/recordings/ -i 2>/dev/null || true)"
  if echo "${cors_test}" | grep -qi "Access-Control-Allow-Origin"; then
    log "${GREEN}CORS headers appear to be present.${NC}"
  else
    log "${YELLOW}CORS headers not detected in OPTIONS response. Check backend configuration.${NC}"
  fi
}

# -------------------------
# Restart backend (simple)
# -------------------------
apply_restart_backend() {
  ensure_doc_dir
  log "${BLUE}Restarting backend (docker compose restart backend)...${NC}"
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} docker compose -f docker-compose.dev.yml restart backend"
    return 0
  fi
  if ! docker compose -f docker-compose.dev.yml ps backend | grep -q "Up"; then
    log "${YELLOW}Backend not running; starting all services...${NC}"
    docker compose -f docker-compose.dev.yml up -d --build
  else
    docker compose -f docker-compose.dev.yml restart backend
  fi
  sleep 3
  log "${GREEN}Backend restart complete.${NC}"
}

# -------------------------
# Rollback: restore latest backup
# -------------------------
do_rollback() {
  ensure_doc_dir
  # Find latest backup dir
  local latest_backup
  latest_backup="$(ls -1d "${BACKUP_DIR}"/backup_* 2>/dev/null | sort -r | head -n1 || true)"
  if [ -z "${latest_backup}" ]; then
    die "No backups found in ${BACKUP_DIR}. Cannot rollback."
  fi

  log "${BLUE}Latest backup directory: ${latest_backup}${NC}"

  # find SQL dump inside backup
  local sqlfile
  sqlfile="$(ls -1 "${latest_backup}"/*.sql 2>/dev/null | sort -r | head -n1 || true)"
  if [ -z "${sqlfile}" ]; then
    die "No SQL dump found in ${latest_backup}. Cannot rollback DB."
  fi

  log "${YELLOW}Rollback will restore SQL dump: ${sqlfile}${NC}"

  if ! confirm_or_die "Proceed with rollback using backup ${latest_backup}? WARNING: this will overwrite current DB state"; then
    return 1
  fi

  # Stop services to avoid conflicts during restore (optional)
  log "${BLUE}Stopping services before restore...${NC}"
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} docker compose -f docker-compose.dev.yml down"
  else
    docker compose -f docker-compose.dev.yml down
  fi

  # Restore DB
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} Would restore DB from ${sqlfile} into container 'db' using: docker compose -f docker-compose.dev.yml exec -T db psql -U letraria_user -d letraria_db"
  else
    # ensure db container is up (in case down removed it)
    docker compose -f docker-compose.dev.yml up -d db
    sleep 6
    log "${BLUE}Restoring database from ${sqlfile}...${NC}"
    if cat "${sqlfile}" | docker compose -f docker-compose.dev.yml exec -T db psql -U letraria_user -d letraria_db 2>>"${LOG_DIR}/rollback_restore.log"; then
      log "${GREEN}Database restored from ${sqlfile}${NC}"
    else
      log "${RED}Database restore reported errors. Check ${LOG_DIR}/rollback_restore.log${NC}"
      # continue to attempt file restore
    fi
  fi

  # Restore archived docs if present: look for newest archived_*
  local latest_archived
  latest_archived="$(ls -1d "${ARCHIVE_DIR}"/archived_* 2>/dev/null | sort -r | head -n1 || true)"
  if [ -n "${latest_archived}" ]; then
    log "${BLUE}Found archived docs directory: ${latest_archived}${NC}"
    if [ "${DRY_RUN}" = true ]; then
      log "${YELLOW}[DRY-RUN]${NC} would move files from ${latest_archived} back to ${DOC_DIR}"
    else
      mv "${latest_archived}"/* "${DOC_DIR}/" 2>/dev/null || true
      log "${GREEN}Restored archived docs to ${DOC_DIR}${NC}"
    fi
  else
    log "${YELLOW}No archived docs to restore.${NC}"
  fi

  # Start services again
  if [ "${DRY_RUN}" = true ]; then
    log "${YELLOW}[DRY-RUN]${NC} docker compose -f docker-compose.dev.yml up -d --build"
  else
    log "${BLUE}Starting services after rollback...${NC}"
    docker compose -f docker-compose.dev.yml up -d --build
  fi

  log "${GREEN}Rollback complete. Verify services and logs.${NC}"
}

# -------------------------
# Helpers: status / logs
# -------------------------
show_status() {
  ensure_doc_dir
  log "${BLUE}Container status:${NC}"
  docker compose -f docker-compose.dev.yml ps || true
  log "${BLUE}Last backend logs:${NC}"
  docker compose -f docker-compose.dev.yml logs --tail=50 backend || true
}

show_logs_follow() {
  ensure_doc_dir
  docker compose -f docker-compose.dev.yml logs -f
}

# -------------------------
# CLI parsing
# -------------------------
usage() {
  cat <<EOF
Usage: ./atualizacoes.sh [options]

Options:
  --help               Show this help
  --dry-run            Show actions without executing
  --backup             Create backup (scripts + docs + DB dump)
  --archive-docs       Move generated MD docs into archived_docs/
  --apply-fixdb        Apply DB fix (drop story_id FK, set UUID NOT NULL, create index)
  --apply-fixcors      Apply CORS fix + rebuild (down + up -d --build)
  --apply-all          Run: (optional) backup -> apply-fixdb -> apply-fixcors -> restart-backend
  --rollback           Restore most recent backup (DB dump + archived docs)
  --status             Show container status and recent backend logs
  --logs               Follow logs for all services
  -y, --yes            Skip confirmations (non-interactive)

Examples:
  # Dry-run the full pipeline
  ./atualizacoes.sh --dry-run --apply-all

  # Create backup and apply only DB fix
  ./atualizacoes.sh --backup --apply-fixdb

  # Apply fix and rebuild
  ./atualizacoes.sh --apply-fixcors

  # Rollback to last backup
  ./atualizacoes.sh --rollback
EOF
}

# parse args
ARGS=()
while (( "$#" )); do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --dry-run) DRY_RUN=true; shift ;;
    --backup) DO_BACKUP=true; shift ;;
    --archive-docs) DO_ARCHIVE=true; shift ;;
    --apply-fixdb) ARGS+=("apply-fixdb"); shift ;;
    --apply-fixcors) ARGS+=("apply-fixcors"); shift ;;
    --apply-all) ARGS+=("apply-all"); shift ;;
    --rollback) ARGS+=("rollback"); shift ;;
    --status) ARGS+=("status"); shift ;;
    --logs) ARGS+=("logs"); shift ;;
    -y|--yes) AUTO_YES=true; shift ;;
    *) echo -e "${RED}Unknown option: $1${NC}"; usage; exit 1 ;;
  esac
done

# ensure DOC dir
ensure_doc_dir

# run backup/archive early if requested
if [ "${DO_BACKUP}" = true ]; then
  if confirm_or_die "Create backup now?"; then
    do_backup
  else
    log "${YELLOW}Backup skipped by user.${NC}"
  fi
fi

if [ "${DO_ARCHIVE}" = true ]; then
  if confirm_or_die "Archive docs now?"; then
    do_archive_docs
  else
    log "${YELLOW}Archive skipped by user.${NC}"
  fi
fi

# if no action requested, show usage
if [ "${#ARGS[@]}" -eq 0 ]; then
  usage
  exit 0
fi

# dispatch
for act in "${ARGS[@]}"; do
  case "${act}" in
    apply-all)
      if [ "${DO_BACKUP}" = true ]; then
        do_backup
      fi
      apply_fixdb
      apply_fixcors
      apply_restart_backend
      if [ "${DO_ARCHIVE}" = true ]; then
        do_archive_docs
      fi
      ;;
    apply-fixdb)
      apply_fixdb
      ;;
    apply-fixcors)
      apply_fixcors
      ;;
    rollback)
      do_rollback
      ;;
    status)
      show_status
      ;;
    logs)
      show_logs_follow
      ;;
    *)
      log "${RED}Unknown action: ${act}${NC}"
      ;;
  esac
done

log "${GREEN}All requested actions completed.${NC}"
exit 0
