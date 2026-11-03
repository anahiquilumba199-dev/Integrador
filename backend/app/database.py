import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()


def _valor_odbc(valor: str) -> str:
    return "{" + valor.replace("}", "}}") + "}"


def _cadena_conexion() -> str:
    usuario = os.getenv("DB_USER")
    if usuario:
        password = os.getenv("DB_PASSWORD")
        if not password:
            raise ValueError("DB_PASSWORD es obligatorio cuando se configura DB_USER.")
        credenciales = f"UID={_valor_odbc(usuario)};PWD={_valor_odbc(password)};"
    else:
        credenciales = "Trusted_Connection=yes;"
    odbc = (
        f"DRIVER={{{os.getenv('DB_DRIVER', 'ODBC Driver 17 for SQL Server')}}};"
        f"SERVER={os.getenv('DB_SERVER', 'localhost')};"
        f"DATABASE={os.getenv('DB_NAME', 'EcoRAEE')};"
        f"{credenciales}TrustServerCertificate=yes;"
    )
    return f"mssql+pyodbc:///?odbc_connect={quote_plus(odbc)}"


engine = create_engine(_cadena_conexion())
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    with SessionLocal() as db:
        yield db
