from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.Board import Board
from app.schemas.Board import BoardCreate, BoardUpdate, BoardResponse, BoardListResponse

class BoardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_board_by_id(self, board_id: int) -> BoardResponse | None:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()

        if not db_board:
            return None
        
        return db_board

    def get_boards_by_user_id(self, user_id: int) -> BoardListResponse | None:
        db_boards = self.db.query(Board).filter(Board.owner_id == user_id).all()

        if not db_boards:
            return None
        
        return BoardListResponse(boards=db_boards, total_boards=len(db_boards))
    
    def create_board(self, user_id: int, board: BoardCreate) -> BoardResponse:
        try:
            db_board = Board(**board.model_dump(), owner_id=user_id)
            self.db.add(db_board)
            self.db.commit()
            self.db.refresh(db_board)
            return db_board
        except IntegrityError:
            self.db.rollback()
            raise

    def update_board(self, board_id: int, board_update: BoardUpdate) -> BoardResponse | None:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()

        if not db_board:
            return None
        
        update_data = board_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_board, key, value)

        try:
            self.db.commit()
            self.db.refresh(db_board)
            return db_board
        except IntegrityError:
            self.db.rollback()
            raise

    def delete_board(self, board_id: int) -> BoardResponse | None:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()

        if not db_board:
            return None
        
        self.db.delete(db_board)
        self.db.commit()
        return db_board
