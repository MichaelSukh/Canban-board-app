from pydantic import BaseModel, Field
from typing import Optional
from .Card import CardResponce

class ColumnBase(BaseModel):
    title: str = Field(..., min_length=4, max_length=30, description="Column title")
    description: Optional[str] = Field(None, description="Column description")
    cards: Optional[list[CardResponce]] = Field(None, description="Column cards")
    board_id: int = Field(..., description="Column board id")

class ColumnCreate(ColumnBase):
    pass

class ColumnUpdate(BaseModel):
    id: int = Field(..., description="Column id")
    title: Optional[str] = Field(None, min_length=4, max_length=30, description="Column title")
    description: Optional[str] = Field(None, description="Column description")
    cards: Optional[list[CardResponce]] = Field(None, description="Column cards")

class ColumnDelete(BaseModel):
    id: int = Field(..., description="Column id")

class ColumnResponce(ColumnBase):
    id: int = Field(..., description="Column id")

    class Config:
        from_attributes = True

class ColumnListResponse(BaseModel):
    columns: list[ColumnResponce]
    total_columns: int = Field(..., description="Total number of columns")