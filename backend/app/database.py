import os
import re
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import MetaData, create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.schema import CreateSchema

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
DB_SCHEMA = os.getenv("DB_SCHEMA") or None
if DB_SCHEMA and not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", DB_SCHEMA):
    raise ValueError("DB_SCHEMA debe ser un identificador SQL simple.")


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
    opciones = {
        "DRIVER": os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server"),
        "SERVER": os.getenv("DB_SERVER", "localhost"),
        "DATABASE": os.getenv("DB_NAME", "EcoRAEE"),
        "Encrypt": os.getenv("DB_ENCRYPT", "yes"),
        "TrustServerCertificate": os.getenv("DB_TRUST_SERVER_CERTIFICATE", "no"),
    }
    odbc = "".join(f"{clave}={_valor_odbc(valor)};" for clave, valor in opciones.items())
    return f"mssql+pyodbc:///?odbc_connect={quote_plus(odbc + credenciales)}"


engine = create_engine(os.getenv("DB_URL") or _cadena_conexion(), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    metadata = MetaData(schema=DB_SCHEMA)


def inicializar_tablas():
    with engine.begin() as conn:
        inspector = inspect(conn)
        if DB_SCHEMA and not inspector.has_schema(DB_SCHEMA):
            conn.execute(CreateSchema(DB_SCHEMA))
        for tabla in Base.metadata.sorted_tables:
            if not inspector.has_table(tabla.name, schema=tabla.schema):
                continue
            columnas = {columna["name"].lower() for columna in
                        inspector.get_columns(tabla.name, schema=tabla.schema)}
            esperadas = {columna.name.lower() for columna in tabla.columns}
            if tabla.name == "usuarios" and esperadas - columnas == {"active"}:
                nombre = conn.dialect.identifier_preparer.format_table(tabla)
                tipo = "BIT" if conn.dialect.name == "mssql" else "BOOLEAN"
                conn.execute(text(f"ALTER TABLE {nombre} ADD active {tipo} NOT NULL DEFAULT 1"))
            elif esperadas - columnas:
                raise RuntimeError(
                    f"La tabla {tabla.fullname} tiene un esquema incompatible. "
                    "Configure un DB_SCHEMA propio o migre los datos explícitamente."
                )
        Base.metadata.create_all(conn)


def get_db():
    with SessionLocal() as db:
        yield db
