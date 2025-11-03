import asyncio
from seeds.seed_users import seed_users

if __name__ == "__main__":
    print("Executando seed de usuários...")
    asyncio.run(seed_users())

