from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.token import Token
from app.schemas.auth import SignupRequest, LoginRequest
from app.schemas.user import UserOut
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

ACCESS_MAX_AGE = 15 * 60
REFRESH_MAX_AGE = 7 * 24 * 60 * 60
COOKIE_SECURE = os.environ["ENV"] == "production"


# Set access and refresh tokens in cookies
def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
  response.set_cookie("accessToken", access_token,
                       httponly=True, secure=COOKIE_SECURE,
                         samesite="lax", max_age=ACCESS_MAX_AGE)

  response.set_cookie("refreshToken", refresh_token,
                       httponly=True, secure=COOKIE_SECURE,
                         samesite="lax", max_age=REFRESH_MAX_AGE)
  

@router.post("/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
  existing = db.query(User).filter(User.email == payload.email).first()
  if existing:
    raise HTTPException(status_code=400, detail="Email is already in use")

  new_user = User(
    email=payload.email,
    name=payload.name,
    hashed_password=hash_password(payload.password)
  )

  db.add(new_user)
  db.commit()
  db.refresh(new_user)

  return {"status": "ok", "data": jsonable_encoder(UserOut.model_validate(new_user))}

@router.post("/login")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
  user = db.query(User).filter(User.email == payload.email).first()

  if not user or not verify_password(payload.password, user.hashed_password):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

  set_auth_cookies(response, create_access_token(user.id), create_refresh_token(user.id))

  return {"status": "ok", "data": jsonable_encoder(UserOut.model_validate(user))}

@router.post('/refresh')
def refresh(request: Request, response: Response):
  token = request.cookies.get("refreshToken")
  if not token:
    raise HTTPException(status_code=401, detail="No refresh token")

  try:
    decoded = decode_token(token)
    if decoded.get("type") != "refresh":
      raise HTTPException(status_code=401, detail="Invalid refresh token")

    sub = decoded.get("sub")
    if sub is None:
      raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = int(sub)

  except JWTError:
    raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

  response.set_cookie("accessToken", create_access_token(user_id), httponly=True,
                      secure=COOKIE_SECURE, samesite='lax', max_age=ACCESS_MAX_AGE)

  return {"status": "ok", "data": {"message": "Token refreshed"}}

@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
  return {"status": "ok", "data": {"user": jsonable_encoder(UserOut.model_validate(current_user))}}


