from sqlalchemy.orm import Session
from app.repositories.User_repository import UserRepository
from app.schemas.User import UserCreate, UserUpdate, UserResponse
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.core.security import get_password_hash, verify_password

class UserService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def authenticate_user(self, email: str, plain_password: str) -> UserResponse:
        db_user = self.user_repository.get_user_by_email(email)

        if not db_user or not verify_password(plain_password, db_user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"}
            )
        return UserResponse.model_validate(db_user)

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
            update_data = user_update.model_dump(exclude_unset=True)
            if "password" in update_data:
                update_data["password"] = get_password_hash(update_data["password"])
            updated_user = self.user_repository.update_user(user_id, update_data)
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