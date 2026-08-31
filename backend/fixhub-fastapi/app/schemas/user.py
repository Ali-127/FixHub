from pydantic import EmailStr, BaseModel

# what client sends when signing up
class UserCreate(BaseModel):
  username: str
  email: EmailStr
  password: str

# what we send back
class UserOut(BaseModel):
  id: int
  username: str
  email: EmailStr

  class Config:
    from_attributes = True
