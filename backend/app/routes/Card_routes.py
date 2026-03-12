from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.Card import CardCreate, CardUpdate, CardResponse, CardListResponse
from app.services.Card_service import CardService

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

@router.get("/{column_id}", response_model=CardListResponse, status_code=status.HTTP_200_OK)
def get_cards_by_column_id(column_id: int, db: Session = Depends(get_db)):
    card_sevice = CardService(db)
    return card_sevice.get_cards_by_column_id(column_id)

@router.post("/create", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(card: CardCreate, db: Session = Depends(get_db)):
    card_sevice = CardService(db)
    return card_sevice.create_card(card)

@router.put("/update/{card_id}", response_model=CardResponse, status_code=status.HTTP_200_OK)
def update_card(card_id: int, card_update: CardUpdate, db: Session = Depends(get_db)):
    card_sevice = CardService(db)
    return card_sevice.update_card(card_id, card_update)

@router.delete("/delete/{card_id}", response_model=CardResponse, status_code=status.HTTP_200_OK)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    card_sevice = CardService(db)
    return card_sevice.delete_card(card_id)


