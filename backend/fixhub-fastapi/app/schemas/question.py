from pydantic import BaseModel

class QuestionCreate(BaseModel):
  title: str
  body: str

class QuestionOut(BaseModel):
  id: int
  title: str
  body: str
  owner_id: int

  class Config:
    from_attribute = True
