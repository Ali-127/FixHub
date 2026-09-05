from pydantic import BaseModel, EmailStr, model_validator
class SignupRequest(BaseModel):
  name: str | None = None
  email: EmailStr
  password: str
  passwordConfirm: str

  @model_validator(mode='after')
  def password_match(self):
    if self.password != self.passwordConfirm:
      raise ValueError("Passwords do not match")

    return self

class LoginRequest(BaseModel):
  email: EmailStr
  password: str
  