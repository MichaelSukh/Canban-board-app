from pydantic import BaseModel, Field
from typing import Optional

class ColumnBase(BaseModel):
    title: str = Field(..., min_length=4, max_length=30, description="Column title")

class ColumnCreate(ColumnBase):
    pass

class ColumnUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=4, max_length=30, description="Column title")


class ColumnResponse(ColumnBase):
    id: int = Field(..., description="Column id")
    board_id: int = Field(..., description="Column board id")

    class Config:
        from_attributes = True

class ColumnListResponse(BaseModel):
    columns: list[ColumnResponse]
    total_columns: int = Field(..., description="Total number of columns")