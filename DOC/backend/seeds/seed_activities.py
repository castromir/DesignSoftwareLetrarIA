import asyncio
from datetime import date, time, timedelta
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.activity import Activity, ActivityType, ActivityDifficulty, ActivityStatus, StudentActivity
from app.models.user import User, UserRole
from app.models.student import Student
import uuid


async def seed_activities():
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(
                select(User).where(User.role == UserRole.professional)
            )
            professionals = result.scalars().all()
            
            if not professionals:
                print("Erro: Nenhum profissional encontrado. Execute o seed de usuários primeiro.")
                return
            
            activities_data = []
            
            for professional in professionals:
                result = await session.execute(
                    select(Student).where(Student.professional_id == professional.id)
                )
                students = result.scalars().all()
                
                if not students:
                    print(f"  Nenhum aluno encontrado para {professional.name}. Pulando...")
                    continue
                
                student_ids = [s.id for s in students]
                
                professional_activities = [
                    {
                        "title": "Leitura de palavras com R",
                        "description": "Atividade focada em palavras que contêm a letra R, desenvolvendo a leitura e reconhecimento fonético.",
                        "type": ActivityType.reading,
                        "difficulty": ActivityDifficulty.easy,
                        "status": ActivityStatus.completed,
                        "scheduled_date": date.today() - timedelta(days=5),
                        "scheduled_time": time(9, 0),
                        "words": ["rato", "rosa", "carro", "porta", "árvore"],
                        "student_indices": [0, 1, 2],
                    },
                    {
                        "title": "Leitura de frases simples",
                        "description": "Prática de leitura de frases curtas com palavras conhecidas.",
                        "type": ActivityType.reading,
                        "difficulty": ActivityDifficulty.medium,
                        "status": ActivityStatus.in_progress,
                        "scheduled_date": date.today() - timedelta(days=2),
                        "scheduled_time": time(10, 30),
                        "words": ["O gato está na casa.", "A menina brinca no parque.", "O sol brilha no céu."],
                        "student_indices": [0, 1],
                    },
                    {
                        "title": "Escrita de palavras com sílabas complexas",
                        "description": "Atividade de escrita focada em palavras com dígrafos e encontros consonantais.",
                        "type": ActivityType.writing,
                        "difficulty": ActivityDifficulty.medium,
                        "status": ActivityStatus.pending,
                        "scheduled_date": date.today() + timedelta(days=2),
                        "scheduled_time": time(14, 0),
                        "words": ["chave", "porta", "flor", "prato"],
                        "student_indices": [1, 2, 3],
                    },
                    {
                        "title": "Leitura de texto narrativo",
                        "description": "Leitura e compreensão de um texto narrativo curto.",
                        "type": ActivityType.reading,
                        "difficulty": ActivityDifficulty.hard,
                        "status": ActivityStatus.pending,
                        "scheduled_date": date.today() + timedelta(days=5),
                        "scheduled_time": time(9, 30),
                        "words": ["Era uma vez um gatinho curioso.", "Ele adorava explorar o jardim.", "Um dia encontrou uma borboleta colorida."],
                        "student_indices": [0, 4, 5],
                    },
                    {
                        "title": "Produção de texto criativo",
                        "description": "Criação de um pequeno texto narrativo sobre um tema livre.",
                        "type": ActivityType.writing,
                        "difficulty": ActivityDifficulty.hard,
                        "status": ActivityStatus.pending,
                        "scheduled_date": date.today() + timedelta(days=7),
                        "scheduled_time": time(11, 0),
                        "words": None,
                        "student_indices": [4, 5],
                    },
                    {
                        "title": "Leitura de palavras com L",
                        "description": "Atividade de leitura focada em palavras com a letra L em diferentes posições.",
                        "type": ActivityType.reading,
                        "difficulty": ActivityDifficulty.easy,
                        "status": ActivityStatus.completed,
                        "scheduled_date": date.today() - timedelta(days=7),
                        "scheduled_time": time(8, 30),
                        "words": ["lua", "bola", "flor", "alho", "calma"],
                        "student_indices": [2, 3],
                    },
                ]
                
                for activity_data in professional_activities:
                    activity = Activity(
                        id=uuid.uuid4(),
                        created_by=professional.id,
                        title=activity_data["title"],
                        description=activity_data["description"],
                        type=activity_data["type"],
                        difficulty=activity_data["difficulty"],
                        status=activity_data["status"],
                        scheduled_date=activity_data["scheduled_date"],
                        scheduled_time=activity_data["scheduled_time"],
                        words=activity_data["words"],
                    )
                    session.add(activity)
                    await session.flush()
                    
                    selected_student_ids = [
                        student_ids[i] 
                        for i in activity_data["student_indices"] 
                        if 0 <= i < len(student_ids)
                    ]
                    
                    for student_id in selected_student_ids:
                        student_activity = StudentActivity(
                            id=uuid.uuid4(),
                            student_id=student_id,
                            activity_id=activity.id,
                            status=activity_data["status"],
                            score=None,
                            completed_at=None,
                            notes=None,
                        )
                        session.add(student_activity)
                    
                    activities_data.append({
                        "title": activity_data["title"],
                        "professional": professional.name,
                        "students_count": len(selected_student_ids),
                        "status": activity_data["status"].value,
                    })
            
            await session.commit()
            print(f"✓ {len(activities_data)} atividade(s) criada(s) com sucesso!")
            print("\nAtividades criadas:")
            for act_data in activities_data:
                print(f"  - {act_data['title']} ({act_data['professional']}) - {act_data['students_count']} aluno(s) - Status: {act_data['status']}")

        except Exception as e:
            await session.rollback()
            print(f"Erro ao criar atividades: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_activities())

