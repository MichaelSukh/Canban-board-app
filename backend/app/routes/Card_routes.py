from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.Card import CardCreate, CardUpdate, CardResponse, CardListResponse, CardImageResponce
from app.services.Card_service import CardService
from app.core.security import get_current_user
from app.models.User import User

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

@router.get("/{column_id}", response_model=CardListResponse, status_code=status.HTTP_200_OK)
def get_cards_by_column_id(column_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card_service = CardService(db)
    return card_service.get_cards_by_column_id(column_id, current_user.id)

@router.post("/create/{column_id}", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(column_id: int, card: CardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card_service = CardService(db)
    return card_service.create_card(column_id, current_user.id, card)

@router.put("/update/{card_id}", response_model=CardResponse, status_code=status.HTTP_200_OK)
def update_card(card_id: int, card_update: CardUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card_service = CardService(db)
    return card_service.update_card(card_id, current_user.id, card_update)

@router.delete("/delete/{card_id}", response_model=CardResponse, status_code=status.HTTP_200_OK)
def delete_card(card_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card_service = CardService(db)
    return card_service.delete_card(card_id, current_user.id)

@router.get("/{card_id}/images/get", response_model=list[CardImageResponce], status_code=status.HTTP_200_OK)
def get_card_images_by_card_id(card_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card_service = CardService(db)
    return card_service.get_card_images_by_card_id(card_id, current_user.id)

@router.post("/{card_id}/images/upload", response_model=CardImageResponce, status_code=status.HTTP_201_CREATED)
def upload_card_image(card_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card_service = CardService(db)
    return card_service.create_card_image(card_id, current_user.id, file)

@router.delete("/images/delete/{card_image_id}", response_model=CardImageResponce, status_code=status.HTTP_200_OK)
def delete_card_image(card_image_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card_service = CardService(db)
    return card_service.delete_card_image(card_image_id, current_user.id)

