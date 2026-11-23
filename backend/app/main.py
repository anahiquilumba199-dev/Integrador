import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .database import engine, inicializar_tablas
from .routers import (
    auth,
    auditoria,
    centros,
    dashboard,
    dispositivos,
    evaluaciones,
    inventario,
    recolecciones,
    usuarios,
)
from .seed import cargar_datos_iniciales


@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("DB_INITIALIZE", "true").lower() == "true":
        inicializar_tablas()
    cargar_datos_iniciales()
    yield


app = FastAPI(title="EcoRAEE Cloud API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        *(origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip()),
    ],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

for modulo in (auth, auditoria, dashboard, usuarios, centros, recolecciones,
               dispositivos, inventario, evaluaciones):
    app.include_router(modulo.router)


@app.exception_handler(RequestValidationError)
async def error_validacion(request: Request, exc: RequestValidationError):
    errores = [
        {clave: error[clave] for clave in ("loc", "msg", "type")}
        for error in exc.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": errores})


@app.exception_handler(IntegrityError)
async def error_integridad(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=409,
        content={"detail": "Operación no permitida: el dato ya existe o está relacionado con otros registros."},
    )


@app.exception_handler(SQLAlchemyError)
async def error_base_datos(request: Request, exc: SQLAlchemyError):
    return JSONResponse(status_code=500, content={"detail": "Error al acceder a la base de datos."})


@app.get("/", tags=["estado"])
def estado():
    return {"app": "EcoRAEE Cloud API", "estado": "activo"}


@app.get("/health/ready", tags=["estado"])
def disponibilidad():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except SQLAlchemyError:
        return JSONResponse(status_code=503, content={"estado": "base de datos no disponible"})
    return {"estado": "listo"}
