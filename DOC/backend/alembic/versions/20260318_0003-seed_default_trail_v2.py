"""seed_default_trail_v2

Revision ID: seed_default_trail_v2
Revises: seed_default_trail_vida
Create Date: 2026-03-18 03:00:00.000000

Recria/atualiza a trilha padrão sem restrição de faixa etária,
garantindo que apareça para todos os alunos de todas as idades.
"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy.sql import text


revision: str = 'seed_default_trail_v2'
down_revision: Union[str, None] = 'seed_default_trail_vida'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TRAIL_ID = 'a1b2c3d4-0001-0001-0001-000000000001'
STORY_ID = 'a1b2c3d4-0002-0002-0002-000000000002'

STORY_CONTENT = (
    "Muitas cidades brasileiras surgiram no Período Colonial. "
    "Naquela época, elas eram bem diferentes.\n"
    "As ruas eram feitas de pedra ou de terra. Como havia menos habitantes e as pessoas "
    "andavam a pé, a cavalo ou em carroças, o ambiente costumava ser mais silencioso. "
    "A água vinha de chafarizes ou poços, e as casas eram iluminadas por lampiões ou velas, "
    "já que não havia luz elétrica. O lixo era jogado em terrenos vazios ou rios, pois não havia coleta.\n"
    "Ainda assim, as cidades eram cheias de vida! As pessoas trabalhavam, trocavam produtos "
    "nas feiras e se reuniam nas praças, tudo a um ritmo mais lento do que hoje.\n"
    "Hoje, as grandes cidades mudam rapidamente. Muitas ruas são asfaltadas e há movimento "
    "intenso de carros, ônibus, motos e bicicletas. Vemos prédios altos e modernos, mas também "
    "casas antigas. Muitas têm escolas, hospitais, museus e parques. Parte dos habitantes tem "
    "acesso à luz elétrica, água encanada e coleta de lixo; apesar disso, ainda existem lugares "
    "onde esses serviços não estão disponíveis."
)


def upgrade() -> None:
    conn = op.get_bind()

    # Upsert da trilha — garante dados corretos mesmo se 0002 já criou com age_range errado
    conn.execute(text("""
        INSERT INTO trails (id, title, description, difficulty, is_default, age_range_min, age_range_max, created_at, updated_at)
        VALUES (
            :trail_id,
            'A VIDA NA CIDADE NO PASSADO E NO PRESENTE',
            'Instrumento 0.1 – Série: 3° Ano – A',
            'intermediate',
            true,
            NULL,
            NULL,
            now(),
            now()
        )
        ON CONFLICT (id) DO UPDATE SET
            age_range_min = NULL,
            age_range_max = NULL,
            is_default = true,
            updated_at = now()
    """), {"trail_id": TRAIL_ID})

    # Upsert da história
    conn.execute(text("""
        INSERT INTO trail_stories (id, trail_id, title, subtitle, content, order_position, difficulty, word_count, estimated_time, created_at, updated_at)
        VALUES (
            :story_id,
            :trail_id,
            'A Vida na Cidade no Passado e no Presente',
            'Instrumento 0.1 – 3° Ano',
            :content,
            1,
            'intermediate',
            168,
            120,
            now(),
            now()
        )
        ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            updated_at = now()
    """), {"story_id": STORY_ID, "trail_id": TRAIL_ID, "content": STORY_CONTENT})

    # Atribuir trilha a todos os alunos existentes que ainda não a possuem
    conn.execute(text("""
        INSERT INTO student_trail_progress (id, student_id, trail_id, completed_stories, progress_percentage, started_at, last_accessed_at)
        SELECT
            gen_random_uuid(),
            s.id,
            :trail_id,
            '{}',
            0.0,
            now(),
            now()
        FROM students s
        WHERE NOT EXISTS (
            SELECT 1 FROM student_trail_progress stp
            WHERE stp.student_id = s.id AND stp.trail_id = :trail_id
        )
    """), {"trail_id": TRAIL_ID})


def downgrade() -> None:
    # Apenas desfaz o que esta migration fez além do que 0002 já fez
    # (a remoção do age_range — não apaga dados para não quebrar 0002)
    conn = op.get_bind()
    conn.execute(text("""
        UPDATE trails SET age_range_min = 8, age_range_max = 9 WHERE id = :trail_id
    """), {"trail_id": TRAIL_ID})
