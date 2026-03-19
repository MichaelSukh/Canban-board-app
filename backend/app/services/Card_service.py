from sqlalchemy.orm import Session
from app.repositories.Card_repository import CardRepository
from app.repositories.Column_repository import ColumnRepository
from app.schemas.Card import CardCreate, CardUpdate, CardResponse, CardListResponse
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

class CardService:
    def __init__(self, db: Session):
        self.card_repository = CardRepository(db)
        self.column_repository = ColumnRepository(db)
    
    def get_cards_by_column_id(self, column_id: int, user_id: int) -> CardListResponse:
        db_column = self.column_repository.get_column_by_id(column_id)
        if not db_column:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
        
        if db_column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to get cards from this column")
        
        db_cards = self.card_repository.get_cards_by_column_id(column_id)

        cards_list = [CardResponse.model_validate(card) for card in db_cards]
        if not cards_list:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cards not found")
        return CardListResponse(cards=cards_list, total_cards=len(cards_list))
    
    def create_card(self, column_id: int, user_id: int, card: CardCreate) -> CardResponse:
        db_column = self.column_repository.get_column_by_id(column_id)
        if not db_column:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
        
        if db_column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to create a card in this column")
        
        try:
            new_card = self.card_repository.create_card(column_id, card.model_dump())
            return CardResponse.model_validate(new_card)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Card with this name already exists")
    
    def update_card(self, card_id: int, user_id: int, card_update: CardUpdate) -> CardResponse:
        db_card = self.card_repository.get_card_by_id(card_id)
        if not db_card:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        
        if db_card.column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to update this card")
        
        try:
            updated_card = self.card_repository.update_card(card_id, card_update.model_dump(exclude_unset=True))
            if not updated_card:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
            return CardResponse.model_validate(updated_card)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Card with this name already exists")
    
    def delete_card(self, card_id: int, user_id: int) -> CardResponse:
        db_card = self.card_repository.get_card_by_id(card_id)
        if not db_card:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        
        if db_card.column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete this card")
        
        deleted_card = self.card_repository.delete_card(card_id)
        if not deleted_card:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        return CardResponse.model_validate(deleted_card)

