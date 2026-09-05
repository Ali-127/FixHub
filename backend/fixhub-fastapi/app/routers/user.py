from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.utils.security import hash_password

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/dashboard")
def dashboard(current_user: User = Depends(get_current_user)):
  return {
    "status": "ok",
    "data": {"message": f"Welcome, {current_user.name or current_user.email}", "userId": current_user.id}
  }
