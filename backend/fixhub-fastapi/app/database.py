from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os



load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base model
Base = declarative_base()



# gives each request a DB session
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

