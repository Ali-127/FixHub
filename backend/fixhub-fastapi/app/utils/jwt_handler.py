from datetime import datetime, timedelta, timezone
from jose import jwt, JWSError
import os
from dotenv import load_dotenv


load_dotenv()

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]
ACCESS_TOKEN_EXPIRES_MINUTES = int(os.environ["ACCESS_TOKEN_EXPIRES_MINUTES"])
REFRESH_TOKEN_EXPIRES_DAYS = int(os.environ["REFRESH_TOKEN_EXPIRES_DAYS"])

def create_token(data: dict, expires_delta: timedelta) -> str:
  to_encode = data.copy()
  expires = datetime.now(timezone.utc) + expires_delta
  to_encode.update({"exp": expires})

  return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_access_token(user_id: int) -> str:
  return create_token({"sub": str(user_id), "type": "access"}, timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES))

def create_refresh_token(user_id: int) -> str:
  return create_token({"sub": str(user_id), "type": "refresh"}, timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS))

def decode_token(token: str) -> dict:
  return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
