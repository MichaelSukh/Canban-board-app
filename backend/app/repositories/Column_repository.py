from sqlalchemy.orm import Session
from app.models.Column import Column
from sqlalchemy.exc import IntegrityError

class ColumnRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_column_by_id(self, column_id: int) -> Column | None:
        db_column = self.db.query(Column).filter(Column.id == column_id).first()

        if not db_column:
            return None
        
        return db_column
    
    def get_columns_by_board_id(self, board_id: int) -> list[Column] | None:
        db_columns = self.db.query(Column).filter(Column.board_id == board_id).all()

        if not db_columns:
            return None
        
        return db_columns
    
    def create_column(self, board_id: int, column: dict) -> Column:
        try:
            db_column = Column(**column, board_id=board_id)
            self.db.add(db_column)
            self.db.commit()
            self.db.refresh(db_column)
            return db_column
        except IntegrityError:
            self.db.rollback()
            raise
    
    def update_column(self, column_id: int, column_update: dict) -> Column | None:
        db_column = self.db.query(Column).filter(Column.id == column_id).first()

        if not db_column:
            return None
        
        for key, value in column_update.items():
            setattr(db_column, key, value)

        try:
            self.db.commit()
            self.db.refresh(db_column)
            return db_column
        except IntegrityError:
            self.db.rollback()
            raise
    
    def delete_column(self, column_id: int) -> Column | None:
        db_column = self.db.query(Column).filter(Column.id == column_id).first()

        if not db_column:
            return None
        
        self.db.delete(db_column)
        self.db.commit()
        return db_column