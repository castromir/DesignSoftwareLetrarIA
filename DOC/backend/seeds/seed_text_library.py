import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.text_library import TextLibrary
from app.models.trail import TrailDifficulty
from app.models.user import User, UserRole
import uuid


async def seed_text_library():
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(
                select(User).where(User.role == UserRole.professional).limit(1)
            )
            professional = result.scalar_one_or_none()
            
            if not professional:
                print("Erro: Nenhum profissional encontrado. Execute o seed de usuários primeiro.")
                return
            
            result = await session.execute(
                select(TextLibrary).limit(1)
            )
            existing_text = result.scalar_one_or_none()
            
            if existing_text:
                print("Textos já existem no banco. Seed não executado.")
                return

            texts_data = [
                {
                    "title": "Parte 1",
                    "subtitle": "Letras trabalhadas: R",
                    "content": "O rato roeu a ropa do rei de roma. Era um rato muito esperto que vivia no castelo real. Todos os dias ele procurava por pedaços de queijo e pão. O rei ficava muito bravo com o rato, mas nunca conseguia pegá-lo.",
                    "difficulty": TrailDifficulty.beginner,
                    "age_range_min": 6,
                    "age_range_max": 10,
                    "letters_focus": ["R"],
                    "word_count": 45,
                    "is_public": True,
                },
                {
                    "title": "História curta",
                    "subtitle": "Letras trabalhadas: R e L",
                    "content": """O rio que corta a cidade sempre esteve presente na vida das pessoas.
Suas margens já foram locais de encontro, de trabalho e de descanso.
Nas manhãs, é comum observar remadores, caminhantes e estudantes atravessando as pontes.
À noite, as luzes dos prédios refletem na água e criam um cenário que mistura movimento e tranquilidade.
Ler sobre o rio é também lembrar como a natureza e a rotina urbana convivem lado a lado.

Ao longo do dia, o rio recebe diferentes visitantes. Alguns jogam sementes para os patos, outros apenas se sentam à beira da água para descansar ou conversar. É um espaço que mistura silêncio e movimento, onde cada pessoa encontra seu próprio ritmo.
As árvores que margeiam o rio oferecem sombra e refúgio, e em algumas épocas do ano florescem, colorindo a paisagem e atraindo pássaros que cantam sobre a água.

Além da beleza, o rio carrega histórias antigas. Antigamente, suas águas eram usadas para transporte e pequenas embarcações cruzavam suas margens carregando mercadorias. Hoje, ele ainda lembra aos moradores que a cidade cresceu ao seu redor, mas que a presença da natureza continua essencial.

Caminhar por suas margens é perceber detalhes que passam despercebidos no dia a dia: pequenas conchas, folhas levadas pela correnteza e peixes que surgem de vez em quando. É também um convite à reflexão, mostrando como a vida urbana e os elementos naturais podem coexistir de forma harmoniosa, criando um espaço de encontro entre passado e presente.""",
                    "difficulty": TrailDifficulty.intermediate,
                    "age_range_min": 8,
                    "age_range_max": 12,
                    "letters_focus": ["R", "L"],
                    "word_count": 180,
                    "is_public": True,
                },
                {
                    "title": "Parte 2",
                    "subtitle": "Letras trabalhadas: X",
                    "content": "O xerife xereta xeretou o xaxim do xisto. Ele gostava muito de xadrez e xixi de xale. Todas as quintas-feiras ele tocava xilofone na praça da cidade.",
                    "difficulty": TrailDifficulty.beginner,
                    "age_range_min": 7,
                    "age_range_max": 10,
                    "letters_focus": ["X"],
                    "word_count": 28,
                    "is_public": True,
                },
                {
                    "title": "História curta",
                    "subtitle": "Letras trabalhadas: R e L",
                    "content": "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
                    "difficulty": TrailDifficulty.advanced,
                    "age_range_min": 10,
                    "age_range_max": 14,
                    "letters_focus": ["R", "L"],
                    "word_count": 35,
                    "is_public": True,
                },
                {
                    "title": "Texto 3",
                    "subtitle": "Letras trabalhadas: S e T",
                    "content": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
                    "difficulty": TrailDifficulty.intermediate,
                    "age_range_min": 9,
                    "age_range_max": 13,
                    "letters_focus": ["S", "T"],
                    "word_count": 32,
                    "is_public": True,
                },
                {
                    "title": "História curta",
                    "subtitle": "Letras trabalhadas: L e M",
                    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "difficulty": TrailDifficulty.intermediate,
                    "age_range_min": 8,
                    "age_range_max": 12,
                    "letters_focus": ["L", "M"],
                    "word_count": 38,
                    "is_public": True,
                },
            ]
            
            created_count = 0
            for text_data in texts_data:
                text = TextLibrary(
                    id=uuid.uuid4(),
                    title=text_data["title"],
                    subtitle=text_data["subtitle"],
                    content=text_data["content"],
                    difficulty=text_data["difficulty"],
                    age_range_min=text_data["age_range_min"],
                    age_range_max=text_data["age_range_max"],
                    letters_focus=text_data["letters_focus"],
                    word_count=text_data["word_count"],
                    is_public=text_data["is_public"],
                    created_by=professional.id,
                )
                session.add(text)
                created_count += 1
            
            await session.commit()
            print(f"✓ {created_count} texto(s) criado(s) com sucesso!")
            print(f"  Criados pelo profissional: {professional.name} ({professional.email})")
            print("\nTextos criados:")
            for text_data in texts_data:
                letters = ", ".join(text_data["letters_focus"])
                print(f"  - {text_data['title']} (Letras: {letters}) - {text_data['difficulty'].value} - {text_data['word_count']} palavras")

        except Exception as e:
            await session.rollback()
            print(f"Erro ao criar textos: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_text_library())

