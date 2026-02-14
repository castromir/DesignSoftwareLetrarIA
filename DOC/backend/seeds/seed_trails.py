"""
Seeder para criar trilhas padrão com histórias
"""
import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.trail import Trail, TrailStory, TrailDifficulty
import uuid


async def seed_trails():
    """Cria trilhas padrão com histórias"""
    async with AsyncSessionLocal() as session:
        try:
            # Verificar se já existem trilhas
            result = await session.execute(select(Trail))
            existing_trails = result.scalars().all()
            
            if existing_trails:
                print(f"Já existem {len(existing_trails)} trilhas. Pulando seed.")
                return

            # Trilha 1: Iniciante - Letra R
            trail1 = Trail(
                id=uuid.uuid4(),
                title="Trilha Iniciante - Letra R",
                description="Trilha para iniciantes focada na letra R",
                difficulty=TrailDifficulty.beginner,
                is_default=True,
                age_range_min=6,
                age_range_max=8,
            )

            trail1_stories = [
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail1.id,
                    title="Parte 1",
                    subtitle="Letras trabalhadas: R",
                    content="O rato roeu a ropa do rei de roma. Era um rato muito esperto que vivia no castelo real. Todos os dias ele procurava por pedaços de queijo e pão. O rei ficava muito bravo com o rato, mas nunca conseguia pegá-lo.",
                    letters_focus=["R"],
                    order_position=1,
                    difficulty=TrailDifficulty.beginner,
                    word_count=45,
                    estimated_time=120,
                ),
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail1.id,
                    title="Parte 2",
                    subtitle="Letras trabalhadas: R",
                    content="A rainha resolveu ajudar o rei. Ela preparou uma armadilha com queijo. O rato ficou curioso e se aproximou. Mas ele era muito esperto e não caiu na armadilha. O rato riu e correu para longe.",
                    letters_focus=["R"],
                    order_position=2,
                    difficulty=TrailDifficulty.beginner,
                    word_count=42,
                    estimated_time=120,
                ),
            ]

            # Trilha 2: Intermediária - Letra X
            trail2 = Trail(
                id=uuid.uuid4(),
                title="Trilha Intermediária - Letra X",
                description="Trilha intermediária focada na letra X",
                difficulty=TrailDifficulty.intermediate,
                is_default=True,
                age_range_min=8,
                age_range_max=10,
            )

            trail2_stories = [
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail2.id,
                    title="Parte 1",
                    subtitle="Letras trabalhadas: X",
                    content="O xerife xereta xeretou o xaxim do xisto. Ele estava investigando um caso muito estranho. O xerife examinou cada detalhe com cuidado. Nada passava despercebido pelos seus olhos experientes.",
                    letters_focus=["X"],
                    order_position=1,
                    difficulty=TrailDifficulty.intermediate,
                    word_count=38,
                    estimated_time=150,
                ),
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail2.id,
                    title="Parte 2",
                    subtitle="Letras trabalhadas: X",
                    content="O xerife encontrou pistas importantes. Ele examinou o local do crime com atenção. O xerife descobriu que o xaxim tinha sido mexido. A investigação estava ficando interessante.",
                    letters_focus=["X"],
                    order_position=2,
                    difficulty=TrailDifficulty.intermediate,
                    word_count=35,
                    estimated_time=150,
                ),
            ]

            # Trilha 3: Avançada - História Curta
            trail3 = Trail(
                id=uuid.uuid4(),
                title="Trilha Avançada - Histórias Curtas",
                description="Trilha avançada com histórias mais longas",
                difficulty=TrailDifficulty.advanced,
                is_default=True,
                age_range_min=10,
                age_range_max=12,
            )

            trail3_stories = [
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail3.id,
                    title="História Curta",
                    subtitle="Letras trabalhadas: R, S, T",
                    content="O rio que corta a cidade sempre esteve presente na vida dos moradores. Suas águas corriam tranquilas durante o dia e à noite refletiam as luzes das casas. As crianças brincavam em suas margens, os pescadores lançavam suas redes e os idosos contavam histórias sobre suas águas. O rio era mais que água, era parte da identidade da cidade.",
                    letters_focus=["R", "S", "T"],
                    order_position=1,
                    difficulty=TrailDifficulty.advanced,
                    word_count=78,
                    estimated_time=180,
                ),
            ]

            # Trilha 4: Iniciante - Letras R e L
            trail4 = Trail(
                id=uuid.uuid4(),
                title="Trilha Iniciante - Letras R e L",
                description="Trilha para iniciantes focada nas letras R e L",
                difficulty=TrailDifficulty.beginner,
                is_default=True,
                age_range_min=6,
                age_range_max=8,
            )

            trail4_stories = [
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail4.id,
                    title="O Rato e o Leão",
                    subtitle="Letras trabalhadas: R, L",
                    content="O rato e o leão eram amigos. O rato era pequeno e rápido. O leão era grande e forte. Um dia, o rato ajudou o leão a sair de uma armadilha. O leão ficou muito grato e prometeu ajudar o rato sempre que precisasse.",
                    letters_focus=["R", "L"],
                    order_position=1,
                    difficulty=TrailDifficulty.beginner,
                    word_count=52,
                    estimated_time=120,
                ),
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail4.id,
                    title="A Rosa e o Lápis",
                    subtitle="Letras trabalhadas: R, L",
                    content="A rosa vermelha estava no jardim. O lápis estava na mesa. A menina pegou o lápis e desenhou a rosa. O desenho ficou lindo. A rosa e o lápis ficaram felizes.",
                    letters_focus=["R", "L"],
                    order_position=2,
                    difficulty=TrailDifficulty.beginner,
                    word_count=38,
                    estimated_time=100,
                ),
            ]

            # Trilha 5: Intermediária - Letras S e T
            trail5 = Trail(
                id=uuid.uuid4(),
                title="Trilha Intermediária - Letras S e T",
                description="Trilha intermediária focada nas letras S e T",
                difficulty=TrailDifficulty.intermediate,
                is_default=True,
                age_range_min=8,
                age_range_max=10,
            )

            trail5_stories = [
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail5.id,
                    title="O Sol e a Terra",
                    subtitle="Letras trabalhadas: S, T",
                    content="O sol brilha sobre a terra todos os dias. Sua luz aquece o solo e ajuda as plantas a crescerem. As sementes plantadas na terra recebem o calor do sol e começam a brotar. O sol e a terra trabalham juntos para criar a vida.",
                    letters_focus=["S", "T"],
                    order_position=1,
                    difficulty=TrailDifficulty.intermediate,
                    word_count=48,
                    estimated_time=150,
                ),
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail5.id,
                    title="A Estrela e o Telescópio",
                    subtitle="Letras trabalhadas: S, T",
                    content="A estrela brilhava no céu escuro. O astrônomo usou o telescópio para observá-la. Através do telescópio, a estrela parecia ainda mais bonita. O astrônomo ficou encantado com a beleza da estrela distante.",
                    letters_focus=["S", "T"],
                    order_position=2,
                    difficulty=TrailDifficulty.intermediate,
                    word_count=42,
                    estimated_time=140,
                ),
            ]

            # Trilha 6: Avançada - Texto Narrativo Completo
            trail6 = Trail(
                id=uuid.uuid4(),
                title="Trilha Avançada - Narrativas Completas",
                description="Trilha avançada com narrativas mais complexas",
                difficulty=TrailDifficulty.advanced,
                is_default=True,
                age_range_min=10,
                age_range_max=14,
            )

            trail6_stories = [
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail6.id,
                    title="O Rio da Cidade",
                    subtitle="Letras trabalhadas: R, L, S, T",
                    content="O rio que corta a cidade sempre esteve presente na vida das pessoas. Suas margens já foram locais de encontro, de trabalho e de descanso. Nas manhãs, é comum observar remadores, caminhantes e estudantes atravessando as pontes. À noite, as luzes dos prédios refletem na água e criam um cenário que mistura movimento e tranquilidade. Ler sobre o rio é também lembrar como a natureza e a rotina urbana convivem lado a lado. Ao longo do dia, o rio recebe diferentes visitantes. Alguns jogam sementes para os patos, outros apenas se sentam à beira da água para descansar ou conversar. É um espaço que mistura silêncio e movimento, onde cada pessoa encontra seu próprio ritmo.",
                    letters_focus=["R", "L", "S", "T"],
                    order_position=1,
                    difficulty=TrailDifficulty.advanced,
                    word_count=120,
                    estimated_time=240,
                ),
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail6.id,
                    title="As Árvores e o Tempo",
                    subtitle="Letras trabalhadas: R, L, S, T",
                    content="As árvores que margeiam o rio oferecem sombra e refúgio, e em algumas épocas do ano florescem, colorindo a paisagem e atraindo pássaros que cantam sobre a água. Além da beleza, o rio carrega histórias antigas. Antigamente, suas águas eram usadas para transporte e pequenas embarcações cruzavam suas margens carregando mercadorias. Hoje, ele ainda lembra aos moradores que a cidade cresceu ao seu redor, mas que a presença da natureza continua essencial. Caminhar por suas margens é perceber detalhes que passam despercebidos no dia a dia: pequenas conchas, folhas levadas pela correnteza e peixes que surgem de vez em quando.",
                    letters_focus=["R", "L", "S", "T"],
                    order_position=2,
                    difficulty=TrailDifficulty.advanced,
                    word_count=115,
                    estimated_time=230,
                ),
            ]

            # Trilha 7: Iniciante - Sem faixa etária específica (para crianças menores)
            trail7 = Trail(
                id=uuid.uuid4(),
                title="Trilha Iniciante - Primeiras Letras",
                description="Trilha para crianças em fase inicial de alfabetização",
                difficulty=TrailDifficulty.beginner,
                is_default=True,
                age_range_min=None,
                age_range_max=None,
            )

            trail7_stories = [
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail7.id,
                    title="A Casa",
                    subtitle="Letras trabalhadas: A, C, S",
                    content="A casa é grande. A casa tem portas. A casa tem janelas. A casa é bonita. Eu gosto da casa.",
                    letters_focus=["A", "C", "S"],
                    order_position=1,
                    difficulty=TrailDifficulty.beginner,
                    word_count=20,
                    estimated_time=60,
                ),
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail7.id,
                    title="O Gato",
                    subtitle="Letras trabalhadas: G, T, O",
                    content="O gato é fofo. O gato gosta de brincar. O gato come peixe. O gato dorme muito. Eu gosto do gato.",
                    letters_focus=["G", "T", "O"],
                    order_position=2,
                    difficulty=TrailDifficulty.beginner,
                    word_count=24,
                    estimated_time=70,
                ),
                TrailStory(
                    id=uuid.uuid4(),
                    trail_id=trail7.id,
                    title="A Bola",
                    subtitle="Letras trabalhadas: B, L, A",
                    content="A bola é redonda. A bola pula alto. A bola rola no chão. Eu jogo com a bola. A bola é divertida.",
                    letters_focus=["B", "L", "A"],
                    order_position=3,
                    difficulty=TrailDifficulty.beginner,
                    word_count=23,
                    estimated_time=65,
                ),
            ]

            # Adicionar todas as trilhas e histórias ao banco
            all_trails = [trail1, trail2, trail3, trail4, trail5, trail6, trail7]
            all_stories = (
                trail1_stories + trail2_stories + trail3_stories + 
                trail4_stories + trail5_stories + trail6_stories + trail7_stories
            )
            
            for trail in all_trails:
                session.add(trail)
            
            for story in all_stories:
                session.add(story)

            await session.commit()
            total_stories = len(all_stories)
            print(f"✅ Criadas {len(all_trails)} trilhas padrão com {total_stories} histórias!")
            print(f"   - Trilha Iniciante - Letra R: {len(trail1_stories)} histórias")
            print(f"   - Trilha Intermediária - Letra X: {len(trail2_stories)} histórias")
            print(f"   - Trilha Avançada - Histórias Curtas: {len(trail3_stories)} histórias")
            print(f"   - Trilha Iniciante - Letras R e L: {len(trail4_stories)} histórias")
            print(f"   - Trilha Intermediária - Letras S e T: {len(trail5_stories)} histórias")
            print(f"   - Trilha Avançada - Narrativas Completas: {len(trail6_stories)} histórias")
            print(f"   - Trilha Iniciante - Primeiras Letras: {len(trail7_stories)} histórias")

        except Exception as e:
            await session.rollback()
            print(f"❌ Erro ao criar trilhas: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_trails())

