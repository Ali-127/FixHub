from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.question import Question
from app.models.user import User
from app.schemas.question import QuestionCreate, QuestionOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/", response_model=List[QuestionOut])
def list_questions(db: Session = Depends(get_db)):
  return db.query(Question).all()

@router.post("/", response_model=QuestionOut)
def create_question(q_in: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  new_q = Question(title=q_in.title, body=q_in.body, owner_id=current_user.id)
  db.add(new_q)
  db.commit()
  db.refresh(new_q)

  return new_q

