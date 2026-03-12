from sqlalchemy.orm import Session
from app.repositories.Board_repository import BoardRepository
from app.schemas.Board import BoardCreate, BoardUpdate, BoardResponse, BoardListResponse
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

class BoardService:
    def __init__(self, db: Session):
        self.board_repository = BoardRepository(db)

    def get_board_by_id(self, board_id: int) -> BoardResponse:
        db_board = self.board_repository.get_board_by_id(board_id)
        if not db_board:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
        return BoardResponse.model_validate(db_board)
    
    def get_boards_by_user_id(self, user_id: int) -> BoardListResponse:
        db_boards = self.board_repository.get_boards_by_user_id(user_id)
        if not db_boards:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Boards not found")
        return BoardListResponse.model_validate(db_boards)
    
    def create_board(self, board: BoardCreate) -> BoardResponse:
        try:
            new_board = self.board_repository.create_board(board)
            return BoardResponse.model_validate(new_board)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Board with this name already exists")
    
    def update_board(self, board_id: int, board_update: BoardUpdate) -> BoardResponse:
        try:
            updated_board = self.board_repository.update_board(board_id, board_update)
            if not updated_board:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
            return BoardResponse.model_validate(updated_board)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Board with this name already exists")
    
    def delete_board(self, board_id: int) -> BoardResponse:
        deleted_board = self.board_repository.delete_board(board_id)
        if not deleted_board:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
        return BoardResponse.model_validate(deleted_board)