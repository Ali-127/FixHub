from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

from app.database import get_db
from app.models.user import User
from app.utils.jwt_handler import decode_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )

  try:
    payload = decode_token(token)
    if payload.get("type") != 'access':
      raise credentials_exception
    user_id = payload.get("sub")
  except JWTError:
    raise credentials_exception

  if user_id is None:
    raise credentials_exception
  
  user = db.query(User).filter(User.id == int(user_id)).first()

  if user is None: 
    raise credentials_exception

  return user
