from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.User import UserCreate, UserUpdate, UserResponse
from app.services.User_service import UserService
from app.core.security import create_access_token

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_service = UserService(db)

    user = user_service.authenticate_user(email=form_data.username, plain_password=form_data.password)

    access_token = create_access_token(data={"sub" : str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/email/{user_email}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user_by_email(user_email: str, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.get_user_by_email(user_email)

@router.post("/create", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.create_user(user)

@router.put("/update/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.update_user(user_id, user_update)

