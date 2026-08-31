from fastapi import FastAPI
from app.database import Base, engine
from app.models import user, question
from app.routers import user as user_router, question as question_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="FixHub API")

app.include_router(user_router.router)
app.include_router(question_router.router)

@app.get("/")
def root():
  return {"message": "Fixhub API is running"}
