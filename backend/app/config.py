from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Kanban Board"
    debug: bool = True
    database_url: str = "sqlite:///./test.db"

    server_host: str = "0.0.0.0"
    server_port: int = 8000

    secret_key: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    algorithm: str = "HS256"
    access_token_expires_in: int = 30

    cors_origin: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]


settings = Settings()