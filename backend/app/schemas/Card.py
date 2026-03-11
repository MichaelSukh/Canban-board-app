from pydantic import BaseModel, Field
from typing import Optional

class CardBase(BaseModel):
    title: str = Field(..., min_length=4, max_length=30, description="Card title")
    description: Optional[str] = Field(None, description="Card description")
    time_limit: Optional[str] = Field(None, description="Card time limit")
    priority: Optional[int] = Field(None, description="Card priority")
    column_id: int = Field(..., description="Card column id")

class CardCreate(CardBase):
    pass

class CardUpdate(BaseModel):
    id: int = Field(..., description="Card id")
    title: Optional[str] = Field(None, min_length=4, max_length=30, description="Card title")
    description: Optional[str] = Field(None, description="Card description")
    time_limit: Optional[str] = Field(None, description="Card time limit")
    priority: Optional[int] = Field(None, description="Card priority")
    column_id: Optional[int] = Field(None, description="Card column id")

class CardDelete(BaseModel):
    id: int = Field(..., description="Card id")

class CardResponse(CardBase):
    id: int = Field(..., description="Card id")

    class Config:
        from_attributes = True

class CardListResponse(BaseModel):
    cards: list[CardResponse]
    total_cards: int = Field(..., description="Total number of cards")
