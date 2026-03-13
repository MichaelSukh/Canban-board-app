from sqlalchemy.orm import Session
from app.repositories.User_repository import UserRepository
from app.schemas.User import UserCreate, UserUpdate, UserResponse
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.core.security import get_password_hash

class UserService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def get_user_by_email(self, email: str) -> UserResponse:
        db_user = self.user_repository.get_user_by_email(email)
        if not db_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponse.model_validate(db_user)
    
    def create_user(self, user: UserCreate) -> UserResponse:
        try:
            user_data = user.model_dump()
            user_data["password"] = get_password_hash(user_data["password"])
            new_user = self.user_repository.create_user(user_data)
            return UserResponse.model_validate(new_user)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User with this email already exists")
    
    def update_user(self, user_id: int, user_update: UserUpdate) -> UserResponse:
        try:
            updated_user = self.user_repository.update_user(user_id, user_update)
            if not updated_user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            return UserResponse.model_validate(updated_user)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User with this email already exists")
    
    def delete_user(self, user_id: int) -> UserResponse:
        deleted_user = self.user_repository.delete_user(user_id)
        if not deleted_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponse.model_validate(deleted_user)    