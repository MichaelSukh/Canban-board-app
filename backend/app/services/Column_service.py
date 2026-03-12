from sqlalchemy.orm import Session
from app.repositories.Column_repository import ColumnRepository
from app.schemas.Column import ColumnCreate, ColumnUpdate, ColumnResponse, ColumnListResponse
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

class ColumnService:
    def __init__(self, db: Session):
        self.column_repository = ColumnRepository(db)

    def get_column_by_id(self, column_id: int) -> ColumnResponse:
        db_column = self.column_repository.get_column_by_id(column_id)
        if not db_column:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
        return ColumnResponse.model_validate(db_column)
    
    def get_columns_by_board_id(self, board_id: int) -> ColumnListResponse:
        db_columns = self.column_repository.get_columns_by_board_id(board_id)
        if not db_columns:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Columns not found")
        return ColumnListResponse.model_validate(db_columns)
    
    def create_column(self, column: ColumnCreate) -> ColumnResponse:
        try:
            new_column = self.column_repository.create_column(column)
            return ColumnResponse.model_validate(new_column)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Column with this name already exists")
    
    def update_column(self, column_id: int, column_update: ColumnUpdate) -> ColumnResponse:
        try:
            updated_column = self.column_repository.update_column(column_id, column_update)
            if not updated_column:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
            return ColumnResponse.model_validate(updated_column)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Column with this name already exists")
    
    def delete_column(self, column_id: int) -> ColumnResponse:
        deleted_column = self.column_repository.delete_column(column_id)
        if not deleted_column:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
        return ColumnResponse.model_validate(deleted_column)