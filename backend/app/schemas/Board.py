from pydantic import BaseModel, Field
from typing import Optional

class BoardBase(BaseModel):
    title: str = Field(..., min_length=4, max_length=30, description="Board title")
    description: Optional[str] = Field(None, description="Board description")
    owner_id: int = Field(..., description="Board owner id")

class BoardCreate(BoardBase):
    pass

class BoardUpdate(BaseModel):
    id: int = Field(..., description="Board id")
    title: Optional[str] = Field(None, min_length=4, max_length=30, description="Board title")
    description: Optional[str] = Field(None, description="Board description")

class BoardDelete(BaseModel):
    id: int = Field(..., description="Board id")

class BoardResponse(BoardBase):
    id: int = Field(..., description="Board id")

    class Config:
        from_attributes = True

class BoardListResponse(BaseModel):
    boards: list[BoardResponse]
    total_boards: int = Field(..., description="Total number of boards")