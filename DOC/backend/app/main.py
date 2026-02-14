from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.api.routes import (
    auth,
    professionals,
    students,
    activities,
    transcription,
    text_library,
    trails,
    recording,
    ai_insights,
    diagnostics,
    reports,
    student_activities,
)

app = FastAPI(
    title="Letrar IA API",
    description="API da plataforma Letrar IA para alfabetização inteligente",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(professionals.router)
app.include_router(students.router)
app.include_router(activities.router)
app.include_router(transcription.router)
app.include_router(text_library.router)
app.include_router(trails.router)
app.include_router(recording.router)
app.include_router(ai_insights.router)
app.include_router(diagnostics.router)
app.include_router(reports.router)
app.include_router(student_activities.router)

# Servir arquivos estáticos de uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {"message": "Letrar IA API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

