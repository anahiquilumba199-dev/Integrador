from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .database import Base, engine
from .routers import (
    auth,
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
    Base.metadata.create_all(engine)
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
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

for modulo in (auth, dashboard, usuarios, centros, recolecciones,
               dispositivos, inventario, evaluaciones):
    app.include_router(modulo.router)


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
