from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.User import User
from schemas.User import UserCreate, UserUpdate, UserResponse

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def get_user_by_email(self, email: str) -> UserResponse | None:
        db_user = self.db.query(User).filter(User.email == email).first()

        if not db_user:
            return None
        
        return db_user
    
    def create_user(self, user: UserCreate) -> UserResponse:
        try:
            db_user = User(**user.model_dump())
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:
            self.db.rollback()
            raise

    def update_user(self, user_id: int, user_update: UserUpdate) -> UserResponse | None:
        db_user = self.db.query(User).filter(User.id == user_id).first()

        if not db_user:
            return None
        
        update_data = user_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_user, key, value)

        try:
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:
            self.db.rollback()
            raise

    def delete_user(self, user_id: int) -> UserResponse | None:
        db_user = self.db.query(User).filter(User.id == user_id).first()

        if not db_user:
            return None
        
        self.db.delete(db_user)
        self.db.commit()
        return db_user