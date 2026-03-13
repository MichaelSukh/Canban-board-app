from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.Board import BoardCreate, BoardUpdate, BoardListResponse, BoardResponse
from app.services.Board_service import BoardService
from app.models.User import User
from app.core.security import get_current_user

router = APIRouter(
    prefix="/boards",
    tags=["Boards"]
)

@router.get("", response_model=BoardListResponse, status_code=status.HTTP_200_OK)
def get_boards_by_user_id(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    board_service = BoardService(db)
    return board_service.get_boards_by_user_id(current_user.id)

@router.post("/create", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
def create_board(board: BoardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    board_service = BoardService(db)
    return board_service.create_board(current_user.id, board)

@router.put("/update/{board_id}", response_model=BoardResponse, status_code=status.HTTP_200_OK)
def update_board(board_id: int, board_update: BoardUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    board_service = BoardService(db)
    return board_service.update_board(board_id, board_update, current_user.id)

@router.delete("/delete/{board_id}", response_model=BoardResponse, status_code=status.HTTP_200_OK)
def delete_board(board_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    board_service = BoardService(db)
    return board_service.delete_board(board_id, current_user.id)