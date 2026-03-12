from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="User name", examples=["Ivanushka"])
    email: str = Field(..., pattern=r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b", description="User email", examples=["user_email@example.com"])
    user_icon: Optional[str] = Field(None, description="User icon", examples=["https://example.com/user_icon.jpg"])
    password: str = Field(..., description="User password", examples=["hashed_password"])

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50, description="User name", examples=["Ivanushka"])
    email: Optional[str] = Field(None, pattern=r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b", description="User email", examples=["user_email@example.com"])
    user_icon: Optional[str] = Field(None, description="User icon", examples=["https://example.com/user_icon.jpg"])
    password: Optional[str] = Field(None, description="User password", examples=["hashed_password"])

class UserResponse(UserBase):
    id: int = Field(..., description="User id", examples=[1])
    
    class Config:
        from_attributes = True