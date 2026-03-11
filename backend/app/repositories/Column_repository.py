from sqlalchemy.orm import Session
from models.Column import Column
from schemas.Column import ColumnCreate, ColumnUpdate, ColumnResponse, ColumnListResponse

class ColumnRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_column_by_id(self, column_id: int) -> ColumnResponse | None:
        db_column = self.db.query(Column).filter(Column.id == column_id).first()

        if not db_column:
            return None
        
        return db_column
    
    def get_columns_by_board_id(self, board_id: int) -> ColumnListResponse | None:
        db_columns = self.db.query(Column).filter(Column.board_id == board_id).all()

        if not db_columns:
            return None
        
        return ColumnListResponse(columns=db_columns, total_columns=len(db_columns))
    
    def create_column(self, column: ColumnCreate) -> ColumnResponse:
        db_column = Column(**column.model_dump())
        self.db.add(db_column)
        self.db.commit()
        self.db.refresh(db_column)
        return db_column
    
    def update_column(self, column_id: int, column_update: ColumnUpdate) -> ColumnResponse | None:
        db_column = self.db.query(Column).filter(Column.id == column_id).first()

        if not db_column:
            return None
        
        update_data = column_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_column, key, value)

        self.db.commit()
        self.db.refresh(db_column)

        return db_column
    
    def delete_column(self, column_id: int) -> ColumnResponce | None:
        db_column = self.db.query(Column).filter(Column.id == column_id).first()

        if not db_column:
            return None
        
        self.db.delete(db_column)
        self.db.commit()
        return db_column