from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.token import Token
from app.utils.security import verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/login", tags=["auth"])

class RefreshRequest(BaseModel):
  refresh_token: str

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
  user = db.query(User).filter(User.username == form_data.username).first()

  if not user or not verify_password(form_data.password, user.hashed_password):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

  return Token(
    access_token=create_access_token(user.id),
    refresh_token=create_refresh_token(user.id)
  )

@router.post('/refresh', response_model=Token)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
  credential_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired refresh token"
  )

  try:
    decoded = decode_token(payload.refresh_token)
    if decoded.get("type") != "refresh":
      raise credential_exception

    sub = decoded.get("sub")
    if sub is None:
      raise credential_exception
    
    user_id = int(sub)

  except JWTError:
    raise credential_exception

  user = db.query(User).filter(User.id == user_id).first()
  if not user:
    raise credential_exception

  return Token(
    access_token=create_access_token(user.id),
    refresh_token=create_refresh_token(user.id),
  )
