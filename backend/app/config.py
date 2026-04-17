from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Kanban Board"
    debug: bool
    database_url: str

    server_host: str
    server_port: int

    secret_key: str
    algorithm: str
    access_token_expires_in: int

    cors_origin: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://kanban-board.kulyushik.online"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = Settings()