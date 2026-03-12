from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import User_routes
from app.database import init_db

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    docs_url="/api/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(User_routes.router)

@app.on_event("startup")
def on_startup():
    init_db()
