from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.Column import ColumnCreate, ColumnUpdate, ColumnListResponse, ColumnResponse
from app.services.Column_service import ColumnService

router = APIRouter(
    prefix="/columns",
    tags=["Columns"]
)

@router.get("/{board_id}", response_model=ColumnListResponse, status_code=status.HTTP_200_OK)
def get_columns_by_board_id(board_id: int, db: Session = Depends(get_db)):
    column_sevice = ColumnService(db)
    return column_sevice.get_columns_by_board_id(board_id)

@router.post("/create", response_model=ColumnResponse, status_code=status.HTTP_201_CREATED)
def create_column(column: ColumnCreate, db: Session = Depends(get_db)):
    column_sevice = ColumnService(db)
    return column_sevice.create_column(column)

@router.put("/update/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def update_column(column_id: int, column_update: ColumnUpdate, db: Session = Depends(get_db)):
    column_sevice = ColumnService(db)
    return column_sevice.update_column(column_id, column_update)

@router.delete("/delete/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def delete_column(column_id: int, db: Session = Depends(get_db)):
    column_sevice = ColumnService(db)
    return column_sevice.delete_column(column_id)