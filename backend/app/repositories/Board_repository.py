from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.Board import Board

class BoardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_board_by_id(self, board_id: int) -> Board | None:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()

        if not db_board:
            return None
        
        return db_board

    def get_boards_by_user_id(self, user_id: int) -> list[Board] | None:
        db_boards = self.db.query(Board).filter(Board.owner_id == user_id).all()

        if not db_boards:
            return None
        
        return db_boards
    
    def create_board(self, user_id: int, board: dict) -> Board:
        try:
            db_board = Board(**board, owner_id=user_id)
            self.db.add(db_board)
            self.db.commit()
            self.db.refresh(db_board)
            return db_board
        except IntegrityError:
            self.db.rollback()
            raise

    def update_board(self, board_id: int, board_update: dict) -> Board | None:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()

        if not db_board:
            return None
        
        for key, value in board_update.items():
            setattr(db_board, key, value)

        try:
            self.db.commit()
            self.db.refresh(db_board)
            return db_board
        except IntegrityError:
            self.db.rollback()
            raise

    def delete_board(self, board_id: int) -> Board | None:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()

        if not db_board:
            return None
        
        self.db.delete(db_board)
        self.db.commit()
        return db_board
