from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class CardBase(BaseModel):
    title: str = Field(..., min_length=4, max_length=30, description="Card title")
    description: Optional[str] = Field(None, description="Card description")
    time_limit: Optional[date] = Field(None, description="Card time limit")
    priority: Optional[int] = Field(None, description="Card priority")
    is_completed: Optional[bool] = Field(None, description="Card is completed")

class CardCreate(CardBase):
    pass

class CardUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=4, max_length=30, description="Card title")
    description: Optional[str] = Field(None, description="Card description")
    time_limit: Optional[date] = Field(None, description="Card time limit")
    priority: Optional[int] = Field(None, description="Card priority")
    column_id: Optional[int] = Field(None, description="Card column id")
    is_completed: Optional[bool] = Field(None, description="Card is completed")

class CardImageResponce(BaseModel):
    id: int = Field(..., description="Card image id")
    image_url: str = Field(..., description="Card image url")

    class Config:
        from_attributes = True

class CardResponse(CardBase):
    id: int = Field(..., description="Card id")
    column_id: int = Field(..., description="Card column id")

    class Config:
        from_attributes = True

class CardListResponse(BaseModel):
    cards: list[CardResponse]
    total_cards: int = Field(..., description="Total number of cards")
