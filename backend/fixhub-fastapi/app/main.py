from fastapi import FastAPI

app = FastAPI(title="FixHub API")

@app.get("/")
def root():
  return {"message": "Fixhub API is running"}