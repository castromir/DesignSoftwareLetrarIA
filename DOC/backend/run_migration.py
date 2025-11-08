#!/usr/bin/env python3
"""Script para executar migrations do Alembic"""
import sys
import os
from pathlib import Path

backend_dir = Path(__file__).parent.resolve()
os.chdir(backend_dir)

alembic_dir = backend_dir / "alembic"
if str(alembic_dir) in sys.path:
    sys.path.remove(str(alembic_dir))

sys.path.insert(0, str(backend_dir.parent))

import alembic.config
import alembic.command

if __name__ == "__main__":
    alembic_cfg = alembic.config.Config(str(backend_dir / "alembic.ini"))
    print("Executando migrations...")
    alembic.command.upgrade(alembic_cfg, "head")
    print("Migrations executadas com sucesso!")

