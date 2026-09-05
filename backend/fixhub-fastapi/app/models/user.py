from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
  from app.models.question import Question

class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(primary_key=True, index=True)
  email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
  name: Mapped[str | None] = mapped_column(nullable=True)
  hashed_password: Mapped[str] = mapped_column(nullable=False)

  questions: Mapped[list["Question"]] = relationship(back_populates='owner')
