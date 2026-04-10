from sqlalchemy.orm import sessionmaker
from .config import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine(
    settings.database_url
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# def init_db():
#     Base.metadata.create_all(bind=engine)