from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.utils.security import hash_password

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/signup", response_model=UserOut)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
  existing = db.query(User).filter(
    (User.username == user_in.username) | (User.email == user_in.email)
  ).first()

  if existing:
    raise HTTPException(status_code=400, detail="Username or email already taken")

  new_user = User(
    username=user_in.username,
    email=user_in.email,
    hash_password=hash_password(user_in.password)
  )

  db.add(new_user)
  db.commit()
  db.refresh(new_user)

  return new_user
