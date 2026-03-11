from sqlalchemy.orm import Session
from repositories.User_repository import UserRepository
from schemas.User import UserCreate, UserUpdate, UserResponse
from fastapi import HTTPException, status

class UserService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def get_user_by_email(self, email: str) -> UserResponse:
        db_user = self.user_repository.get_user_by_email(email)
        if not db_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponse.model_validate(db_user)
    
    def create_user(self, user: UserCreate) -> UserResponse:
        return self.user_repository.create_user(user)
    
    def update_user(self, user_id: int, user_update: UserUpdate) -> UserResponse | None:
        return self.user_repository.update_user(user_id, user_update)
    
    def delete_user(self, user_id: int) -> UserResponse | None:
        return self.user_repository.delete_user(user_id)    