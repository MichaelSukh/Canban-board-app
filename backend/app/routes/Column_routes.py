from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.Column import ColumnCreate, ColumnUpdate, ColumnListResponse, ColumnResponse
from app.services.Column_service import ColumnService
from app.core.security import get_current_user
from app.models.User import User

router = APIRouter(
    prefix="/columns",
    tags=["Columns"]
)

@router.get("/{board_id}", response_model=ColumnListResponse, status_code=status.HTTP_200_OK)
def get_columns_by_board_id(board_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    column_sevice = ColumnService(db)
    return column_sevice.get_columns_by_board_id(board_id, current_user.id)

@router.post("/create/{board_id}", response_model=ColumnResponse, status_code=status.HTTP_201_CREATED)
def create_column(board_id: int, column: ColumnCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    column_sevice = ColumnService(db)
    return column_sevice.create_column(board_id, current_user.id, column)

@router.put("/update/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def update_column(column_id: int, column_update: ColumnUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    column_sevice = ColumnService(db)
    return column_sevice.update_column(column_id, current_user.id, column_update)

@router.delete("/delete/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def delete_column(column_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    column_sevice = ColumnService(db)
    return column_sevice.delete_column(column_id, current_user.id)