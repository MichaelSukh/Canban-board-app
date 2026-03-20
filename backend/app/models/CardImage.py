from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class CardImage(Base):
    __tablename__ = "card_images"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    card=relationship("Card", back_populates="images")