from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.Card import Card
from app.models.CardImage import CardImage
import os

class CardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_card_by_id(self, card_id: int) -> Card | None:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()

        if not db_card:
            return None
        
        return db_card
    
    def get_cards_by_column_id(self, column_id: int) -> list[Card] | None:
        db_cards = self.db.query(Card).filter(Card.column_id == column_id).all()

        if not db_cards:
            return None
        
        return db_cards
    
    def create_card(self, column_id: int, card: dict) -> Card:
        try:
            db_card = Card(**card, column_id=column_id)
            self.db.add(db_card)
            self.db.commit()
            self.db.refresh(db_card)
            return db_card
        except IntegrityError:
            self.db.rollback()
            raise
    
    def update_card(self, card_id: int, card_update: dict) -> Card | None:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()

        if not db_card:
            return None
        
        for key, value in card_update.items():
            setattr(db_card, key, value)

        try:
            self.db.commit()
            self.db.refresh(db_card)
            return db_card
        except IntegrityError:
            self.db.rollback()
            raise
    
    def delete_card(self, card_id: int) -> Card | None:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()

        if not db_card:
            return None
        
        self.db.delete(db_card)
        self.db.commit()
        return db_card

    def create_card_image(self, card_id: int, image_url: str) -> CardImage:
        try:
            db_card_image = CardImage(card_id=card_id, image_url=image_url)
            self.db.add(db_card_image)
            self.db.commit()
            self.db.refresh(db_card_image)
            return db_card_image
        except IntegrityError:
            self.db.rollback()
            raise
    
    def delete_card_image(self, card_image_id: int) -> CardImage | None:
        db_card_image = self.db.query(CardImage).filter(CardImage.id == card_image_id).first()

        if not db_card_image:
            return None
        
        file_path = db_card_image.image_url.lstrip("/")
        if os.path.exists(file_path):
            os.remove(file_path)

        self.db.delete(db_card_image)
        self.db.commit()
        return db_card_image

    def get_card_image_by_id(self, card_image_id: int) -> CardImage | None:
        db_card_image = self.db.query(CardImage).filter(CardImage.id == card_image_id).first()
        return db_card_image

    def get_card_images_by_card_id(self, card_id: int) -> list[CardImage] | None:
        db_card_images = self.db.query(CardImage).filter(CardImage.card_id == card_id).all()
        return db_card_images