from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.Card import Card
from schemas.Card import CardCreate, CardUpdate, CardResponse, CardListResponse

class CardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_card_by_id(self, card_id: int) -> CardResponse | None:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()

        if not db_card:
            return None
        
        return db_card
    
    def get_cards_by_column_id(self, column_id: int) -> CardListResponse | None:
        db_cards = self.db.query(Card).filter(Card.column_id == column_id).all()

        if not db_cards:
            return None
        
        return CardListResponse(cards=db_cards, total_cards=len(db_cards))
    
    def create_card(self, card: CardCreate) -> CardResponse:
        try:
            db_card = Card(**card.model_dump())
            self.db.add(db_card)
            self.db.commit()
            self.db.refresh(db_card)
            return db_card
        except IntegrityError:
            self.db.rollback()
            raise
    
    def update_card(self, card_id: int, card_update: CardUpdate) -> CardResponse | None:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()

        if not db_card:
            return None
        
        update_data = card_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_card, key, value)

        try:
            self.db.commit()
            self.db.refresh(db_card)
            return db_card
        except IntegrityError:
            self.db.rollback()
            raise
    
    def delete_card(self, card_id: int) -> CardResponse | None:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()

        if not db_card:
            return None
        
        self.db.delete(db_card)
        self.db.commit()
        return db_card