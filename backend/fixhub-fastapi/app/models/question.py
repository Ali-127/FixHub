from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Question(Base):
  __tablename__ = "questions"

  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, nullable=False)
  body = Column(String, nullable=False)
  owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

  owner = relationship("User", back_populates='questions')
  