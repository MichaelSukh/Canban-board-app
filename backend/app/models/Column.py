from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base
from sqlalchemy.orm import relationship


class Column(Base):
    __tablename__ = "columns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    
    board_id = Column(Integer, ForeignKey("boards.id"))
    board = relationship("Board", back_populates="columns")

    cards = relationship("Card", back_populates="column") 