from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    user_icon = Column(String, nullable=True)
    password = Column(String, nullable=False)

    boards = relationship("Board", back_populates="owner", cascade="all, delete-orphan")