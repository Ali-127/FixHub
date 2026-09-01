from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
  from app.models.user import User

class Question(Base):
  __tablename__ = "questions"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  title: Mapped[str] = mapped_column(String, nullable=False)
  body: Mapped[str] = mapped_column(String, nullable=False)
  owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

  owner: Mapped[list['User']] = relationship(back_populates='questions')
  