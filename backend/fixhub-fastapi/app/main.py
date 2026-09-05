from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.database import Base, engine
from app.models import user, question
from app.routers import user as user_router, questions as question_router
from app.routers import auth as auth_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="FixHub API")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"], # Nextjs dev server
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
  errors: dict[str, list[str]] = {}
  for err in exc.errors():
    field = str(err["loc"[-1]])
    errors.setdefault(field, []).append(err["msg"])

  return JSONResponse(
    status_code=300,
    content={"status": "error", "message": "Validation failed", "errors": errors}
  )

app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
  return JSONResponse(
    status_code=exc.status_code,
    content={"status": "error", "message": exc.detail}
  )

app.include_router(user_router.router)
app.include_router(question_router.router)
app.include_router(auth_router.router)


@app.get("/")
def root():
  return {"message": "Fixhub API is running"}
