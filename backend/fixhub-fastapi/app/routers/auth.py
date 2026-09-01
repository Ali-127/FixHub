from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.token import Token
from app.utils.security import verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token

router = APIRouter(prefix="/login", tags=["auth"])

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
  user = db.query(User).filter(User.username == form_data.username).first()

  if not user or not verify_password(form_data.password, user.hashed_password):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

  return Token(
    access_token=create_access_token(user.id),
    refresh_token=create_refresh_token(user.id)
  )
  