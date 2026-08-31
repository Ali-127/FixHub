from fastapi import FastAPI
from app.database import Base, engine
from app.models import user, question


Base.metadata.create_all(bind=engine)

app = FastAPI(title="FixHub API")

@app.get("/")
def root():
  return {"message": "Fixhub API is running"}