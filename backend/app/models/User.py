from sqlalchemy import Column, Integer, String
from ..database import Base

class User(Base):
    # Название таблицы в базе данных
    __tablename__ = "users"

    # Уникальный идентификатор пользователя
    id = Column(Integer, primary_key=True, index=True)
    # Имя пользователя, должно быть уникальным
    username = Column(String, nullable=False)
    # Электронная почта, также уникальна
    email = Column(String, unique=True, nullable=False)
    # Хэш пароля пользователя
    password = Column(String, nullable=False)

    boards = relationship("Board", back_populates="owner")

