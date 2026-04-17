import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routes import User_routes, Board_routes, Column_routes, Card_routes

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    docs_url="/api/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

os.makedirs(os.path.join(STATIC_DIR, "images"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "user_icons"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):

    errors = exc.errors()
    formatted_errors = []
    for error in errors:
        field = str(error["loc"][-1]) if len(error["loc"]) > 0 else "unknown"
        message = error["msg"]

        formatted_errors.append({
            "field": field,
            "message": message
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation error",
            "message": "Переданы некорректные данные",
            "details": formatted_errors
        }
    )


app.include_router(User_routes.router)
app.include_router(Board_routes.router)
app.include_router(Column_routes.router)
app.include_router(Card_routes.router)


# @app.on_event("startup")
# def on_startup():
#     init_db()
