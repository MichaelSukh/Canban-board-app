from sqlalchemy.orm import Session
from app.repositories.Card_repository import CardRepository
from app.schemas.Card import CardCreate, CardUpdate, CardResponse, CardListResponse
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

class CardService:
    def __init__(self, db: Session):
        self.card_repository = CardRepository(db)

    def get_card_by_id(self, card_id: int) -> CardResponse:
        db_card = self.card_repository.get_card_by_id(card_id)
        if not db_card:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        return CardResponse.model_validate(db_card)
    
    def get_cards_by_column_id(self, column_id: int) -> CardListResponse:
        db_cards = self.card_repository.get_cards_by_column_id(column_id)
        if not db_cards:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cards not found")
        return CardListResponse.model_validate(db_cards)
    
    def create_card(self, card: CardCreate) -> CardResponse:
        try:
            new_card = self.card_repository.create_card(card)
            return CardResponse.model_validate(new_card)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Card with this name already exists")
    
    def update_card(self, card_id: int, card_update: CardUpdate) -> CardResponse:
        try:
            updated_card = self.card_repository.update_card(card_id, card_update)
            if not updated_card:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
            return CardResponse.model_validate(updated_card)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Card with this name already exists")
    
    def delete_card(self, card_id: int) -> CardResponse:
        deleted_card = self.card_repository.delete_card(card_id)
        if not deleted_card:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        return CardResponse.model_validate(deleted_card)

