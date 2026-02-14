#!/usr/bin/env python3
"""Script para executar migrations do Alembic"""
import sys
import os
from pathlib import Path

backend_dir = Path(__file__).parent.resolve()
os.chdir(backend_dir)

alembic_local = backend_dir / "alembic"
venv_site_packages = backend_dir / "venv" / "lib" / "python3.12" / "site-packages"

sys.path = [str(venv_site_packages)] + [p for p in sys.path if str(alembic_local) not in p]

import alembic.config
import alembic.command

if __name__ == "__main__":
    alembic_cfg = alembic.config.Config(str(backend_dir / "alembic.ini"))
    print("Executando migrations...")
    try:
        alembic.command.upgrade(alembic_cfg, "head")
        print("✓ Migrations executadas com sucesso!")
    except Exception as e:
        print(f"✗ Erro ao executar migrations: {e}")
        sys.exit(1)

