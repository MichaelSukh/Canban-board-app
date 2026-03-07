from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="User name")
    email: str = Field(..., regex=r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b", description="User email")
    user_icon: Optional[str] = Field(None, description="User icon")
    password: str = Field(..., description="User password")

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50, description="User name")
    email: Optional[str] = Field(None, regex=r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b", description="User email")
    user_icon: Optional[str] = Field(None, description="User icon")
    password: Optional[str] = Field(None, description="User password")

class UserResponse(UserBase):
    id: int = Field(..., description="User id")
    
    class Config:
        from_attributes = True