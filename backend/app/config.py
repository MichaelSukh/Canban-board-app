from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Kanban Board"
    debug: bool = True
    database_url: str = "sqlite:///./test.db"

    server_host: str = "0.0.0.0"
    server_port: int = 8000

    cors_origin: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]


settings = Settings()