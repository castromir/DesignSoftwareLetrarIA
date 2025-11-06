import asyncio
from seeds.seed_users import seed_users
from seeds.seed_students import seed_students
from seeds.seed_activities import seed_activities

async def main():
    print("Executando seed de usuários...")
    await seed_users()
    
    print("\nExecutando seed de alunos...")
    await seed_students()
    
    print("\nExecutando seed de atividades...")
    await seed_activities()

if __name__ == "__main__":
    asyncio.run(main())

