import asyncio
from seeds.seed_users import seed_users
from seeds.seed_students import seed_students
from seeds.seed_activities import seed_activities
from seeds.seed_text_library import seed_text_library
from seeds.seed_trails import seed_trails

async def main():
    print("Executando seed de usuários...")
    await seed_users()
    
    print("\nExecutando seed de alunos...")
    await seed_students()
    
    print("\nExecutando seed de atividades...")
    await seed_activities()
    
    print("\nExecutando seed de biblioteca de textos...")
    await seed_text_library()
    
    print("\nExecutando seed de trilhas...")
    await seed_trails()

if __name__ == "__main__":
    asyncio.run(main())

