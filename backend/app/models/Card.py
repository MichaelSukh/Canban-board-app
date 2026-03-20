from sqlalchemy import Column, Integer, String, ForeignKey, Date
from app.database import Base
from sqlalchemy.orm import relationship

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    time_limit = Column(Date, nullable=True)
    priority = Column(Integer, nullable=True)

    column_id = Column(Integer, ForeignKey("columns.id"), nullable=False)
    column = relationship("Column", back_populates="cards")

    images = relationship("CardImage", back_populates="card", cascade="all, delete-orphan")