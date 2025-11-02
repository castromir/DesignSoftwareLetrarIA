from fastapi import FastAPI

app = FastAPI(
    title="Letrar IA API",
    description="API da plataforma Letrar IA para alfabetização inteligente",
    version="1.0.0"
)


@app.get("/")
async def root():
    return {"message": "Letrar IA API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

