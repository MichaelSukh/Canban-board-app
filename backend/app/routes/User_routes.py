import os
import shutil
import glob
import uuid
from fastapi import APIRouter, Depends, status, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.User import UserCreate, UserUpdate, UserResponse
from app.services.User_service import UserService
from app.core.security import create_access_token, get_current_user
from app.models.User import User

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

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/email/{user_email}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user_by_email(user_email: str, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.get_user_by_email(user_email)

@router.post("/create", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.create_user(user)

@router.put("/update", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_user(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_service = UserService(db)
    return user_service.update_user(current_user.id, user_update)

@router.post("/avatar", response_model=UserResponse, status_code=status.HTTP_200_OK)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_service = UserService(db)
    
    extension = file.filename.split(".")[-1]

    # Добавляем суффикс с целью избежания кеширования
    unique_suffix = str(uuid.uuid4())[:8]
    filename = f"{current_user.id}_{unique_suffix}.{extension}"
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    avatars_dir = os.path.join(base_dir, "static", "user_icons")
    os.makedirs(avatars_dir, exist_ok=True)

    old_avatars = glob.glob(os.path.join(avatars_dir, f"{current_user.id}_*.*"))
    for old_file in old_avatars:
        try:
            os.remove(old_file)
        except OSError:
            pass
    
    filepath = os.path.join(avatars_dir, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    icon_url = f"/static/user_icons/{filename}"
    user_update = UserUpdate(user_icon=icon_url)
    return user_service.update_user(current_user.id, user_update)
