# LetrarIA

Pré-requisitos
- Docker e Docker Compose instalados.
- Estar no diretório `DOC/` (onde está `docker-compose.dev.yml` e `atualizacoes.sh`).

1) Subir containers (recomendado antes de rodar qualquer ação)
```/home/marcellor/Projetos/Ufg/DesignSoftwareLetrarIA/DOC/README.md#L1-3
docker compose -f docker-compose.dev.yml up -d
```

2) (Opcional) Garantir extensão pg_trgm no Postgres (se necessário)
```/home/marcellor/Projetos/Ufg/DesignSoftwareLetrarIA/DOC/README.md#L4-6
docker compose -f docker-compose.dev.yml exec -T db psql -U letraria_user -d letraria_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

3) Revisar ações (dry-run)
```/home/marcellor/Projetos/Ufg/DesignSoftwareLetrarIA/DOC/README.md#L7-9
cd DOC
chmod +x atualizacoes.sh
./atualizacoes.sh --dry-run --apply-all
```

4) Criar backup e aplicar correção de banco (seguro)
```/home/marcellor/Projetos/Ufg/DesignSoftwareLetrarIA/DOC/README.md#L10-12
./atualizacoes.sh --backup --apply-fixdb
```

5) Aplicar correção CORS e rebuild
```/home/marcellor/Projetos/Ufg/DesignSoftwareLetrarIA/DOC/README.md#L13-15
./atualizacoes.sh --apply-fixcors
```

6) Rollback (restaura o backup mais recente)
```/home/marcellor/Projetos/Ufg/DesignSoftwareLetrarIA/DOC/README.md#L16-18
./atualizacoes.sh --rollback
```

Comandos úteis de verificação
```/home/marcellor/Projetos/Ufg/DesignSoftwareLetrarIA/DOC/README.md#L19-21
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml logs --tail=50 backend
docker compose -f docker-compose.dev.yml exec db psql -U letraria_user -d letraria_db -c "\d recordings"
```

Locais importantes
- Script unificado: `DOC/atualizacoes.sh`
- Backups: `DOC/backups/backup_<timestamp>/`
- Arquivados: `DOC/archived_docs/`
- Logs do script: `DOC/logs/`

Aviso rápido
- Sempre use `--dry-run` e `--backup` antes de mudanças destrutivas.
- Rollback sobrescreve o estado atual do banco — dados posteriores ao backup serão perdidos.
- Em produção, prefira migrations versionadas e testes em staging.
