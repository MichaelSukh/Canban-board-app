from sqlalchemy.orm import Session
from app.repositories.Card_repository import CardRepository
from app.repositories.Column_repository import ColumnRepository
from app.schemas.Card import CardCreate, CardUpdate, CardResponse, CardListResponse, CardImageResponce
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status, UploadFile
import uuid
import shutil
import os

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

        if not db_cards:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cards not found")

        cards_list = [CardResponse.model_validate(card) for card in db_cards]
        
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


    def get_card_images_by_card_id(self, card_id: int, user_id: int) -> list[CardImageResponce]:
        db_card = self.card_repository.get_card_by_id(card_id)
        if not db_card:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        
        if db_card.column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to get images for this card")
        
        db_card_images = self.card_repository.get_card_images_by_card_id(card_id)
        if not db_card_images:
            return []
        
        card_images_list = [CardImageResponce.model_validate(card_image) for card_image in db_card_images]
        return card_images_list

    def create_card_image(self, card_id: int, user_id: int, file: UploadFile) -> CardImageResponce:
        db_card = self.card_repository.get_card_by_id(card_id)
        file_ext = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"static/images/{unique_filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_url = f"/{file_path}"

        if not db_card:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        
        if db_card.column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to create an image for this card")

        try:
            new_card_image = self.card_repository.create_card_image(card_id, image_url)
            return CardImageResponce.model_validate(new_card_image)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Card image with this name already exists")


    def delete_card_image(self, card_image_id: int, user_id: int) -> CardImageResponce:
        db_card_image = self.card_repository.get_card_image_by_id(card_image_id)
        if not db_card_image:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card image not found")
        
        if db_card_image.card.column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete this card image")
        
        deleted_card_image = self.card_repository.delete_card_image(card_image_id)
        if not deleted_card_image:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card image not found")
        return CardImageResponce.model_validate(deleted_card_image)