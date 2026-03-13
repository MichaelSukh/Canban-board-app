from sqlalchemy.orm import Session
from app.repositories.Column_repository import ColumnRepository
from app.repositories.Board_repository import BoardRepository
from app.schemas.Column import ColumnCreate, ColumnUpdate, ColumnResponse, ColumnListResponse
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

class ColumnService:
    def __init__(self, db: Session):
        self.column_repository = ColumnRepository(db)
        self.board_repository = BoardRepository(db)
    
    def get_columns_by_board_id(self, board_id: int, user_id: int) -> ColumnListResponse:
        db_board = self.board_repository.get_board_by_id(board_id)
        if not db_board:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
        
        if db_board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to get columns from this board")
        
        db_columns = self.column_repository.get_columns_by_board_id(board_id)
        if not db_columns:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Columns not found")
        return ColumnListResponse.model_validate(db_columns)
    

    def create_column(self, board_id: int, user_id: int, column: ColumnCreate) -> ColumnResponse:
        db_board = self.board_repository.get_board_by_id(board_id)
        if not db_board:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
        
        if db_board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to create columns in this board")
        
        try:
            new_column = self.column_repository.create_column(board_id, column)
            return ColumnResponse.model_validate(new_column)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Column with this name already exists")
    
    
    def update_column(self, column_id: int, user_id: int, column_update: ColumnUpdate) -> ColumnResponse:
        db_column = self.column_repository.get_column_by_id(column_id)
        if not db_column:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
        
        if db_column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to update this column")
        
        try:
            updated_column = self.column_repository.update_column(column_id, column_update)
            if not updated_column:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
            return ColumnResponse.model_validate(updated_column)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Column with this name already exists")
    
    def delete_column(self, column_id: int, user_id: int) -> ColumnResponse:
        db_column = self.column_repository.get_column_by_id(column_id)
        if not db_column:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
        
        if db_column.board.owner_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete this column")

        deleted_column = self.column_repository.delete_column(column_id)
        if not deleted_column:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
        return ColumnResponse.model_validate(deleted_column)