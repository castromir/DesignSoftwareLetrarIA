import asyncio
from datetime import date, timedelta
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.student import Student, StudentStatus, Gender
from app.models.user import User, UserRole
import uuid


async def seed_students():
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(
                select(User).where(User.role == UserRole.professional).limit(1)
            )
            professional = result.scalar_one_or_none()
            
            if not professional:
                print("Erro: Nenhum profissional encontrado. Execute o seed de usuários primeiro.")
                return
            
            # Verificar se já existem alunos com os mesmos nomes
            student_names = ["João Augusto", "Ana Clara", "Júlia", "Manuela Oliveira", "Pedro Santos", "Beatriz Lima"]
            result = await session.execute(
                select(Student).where(Student.name.in_(student_names))
            )
            existing_students = result.scalars().all()
            
            if len(existing_students) > 0:
                print(f"Alguns alunos já existem no banco ({len(existing_students)} encontrado(s)). Seed não executado.")
                return

            # Dados dos alunos mockados
            students_data = [
                {
                    "name": "João Augusto",
                    "registration": "2024001",
                    "gender": Gender.male,
                    "birth_date": date(2013, 3, 15),  # 12 anos
                    "age": 12,
                    "observations": "Aluno dedicado e participativo nas atividades de leitura.",
                    "status": StudentStatus.active,
                },
                {
                    "name": "Ana Clara",
                    "registration": "2024002",
                    "gender": Gender.female,
                    "birth_date": date(2014, 5, 22),  # 11 anos
                    "age": 11,
                    "observations": "Excelente progresso em atividades de escrita criativa.",
                    "status": StudentStatus.active,
                },
                {
                    "name": "Júlia",
                    "registration": "2024003",
                    "gender": Gender.female,
                    "birth_date": date(2014, 8, 10),  # 11 anos
                    "age": 11,
                    "observations": "Necessita atenção especial com sílabas complexas.",
                    "status": StudentStatus.active,
                },
                {
                    "name": "Manuela Oliveira",
                    "registration": "2024004",
                    "gender": Gender.female,
                    "birth_date": date(2015, 1, 5),  # 10 anos
                    "age": 10,
                    "observations": "Bom desempenho em atividades de leitura.",
                    "status": StudentStatus.active,
                },
                {
                    "name": "Pedro Santos",
                    "registration": "2024005",
                    "gender": Gender.male,
                    "birth_date": date(2013, 11, 20),  # 12 anos
                    "age": 12,
                    "observations": "Requer reforço em atividades de escrita.",
                    "status": StudentStatus.active,
                },
                {
                    "name": "Beatriz Lima",
                    "registration": "2024006",
                    "gender": Gender.female,
                    "birth_date": date(2014, 2, 14),  # 11 anos
                    "age": 11,
                    "observations": "Pronta para atividades de nível avançado.",
                    "status": StudentStatus.active,
                },
            ]
            
            created_count = 0
            for student_data in students_data:
                student = Student(
                    id=uuid.uuid4(),
                    professional_id=professional.id,
                    name=student_data["name"],
                    registration=student_data["registration"],
                    gender=student_data["gender"],
                    birth_date=student_data["birth_date"],
                    age=student_data["age"],
                    observations=student_data["observations"],
                    status=student_data["status"],
                    created_by=professional.id,
                )
                session.add(student)
                created_count += 1
            
            await session.commit()
            print(f"✓ {created_count} aluno(s) criado(s) com sucesso!")
            print(f"  Associados ao profissional: {professional.name} ({professional.email})")
            print("\nAlunos criados:")
            for student_data in students_data:
                print(f"  - {student_data['name']} ({student_data['registration']}) - {student_data['age']} anos")

        except Exception as e:
            await session.rollback()
            print(f"Erro ao criar alunos: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_students())

