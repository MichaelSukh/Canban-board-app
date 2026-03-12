from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.Board import BoardCreate, BoardUpdate, BoardListResponse, BoardResponse
from app.services.Board_service import BoardService

router = APIRouter(
    prefix="/boards",
    tags=["Boards"]
)

@router.get("/{user_id}", response_model=BoardListResponse, status_code=status.HTTP_200_OK)
def get_boards_by_user_id(user_id: int, db: Session = Depends(get_db)):
    board_sevice = BoardService(db)
    return board_sevice.get_boards_by_user_id(user_id)

@router.post("/create", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
def create_board(board: BoardCreate, db: Session = Depends(get_db)):
    board_sevice = BoardService(db)
    return board_sevice.create_board(board)

@router.put("/update/{board_id}", response_model=BoardResponse, status_code=status.HTTP_200_OK)
def update_board(board_id: int, board_update: BoardUpdate, db: Session = Depends(get_db)):
    board_sevice = BoardService(db)
    return board_sevice.update_board(board_id, board_update)

@router.delete("/delete/{board_id}", response_model=BoardResponse, status_code=status.HTTP_200_OK)
def delete_board(board_id: int, db: Session = Depends(get_db)):
    board_sevice = BoardService(db)
    return board_sevice.delete_board(board_id)