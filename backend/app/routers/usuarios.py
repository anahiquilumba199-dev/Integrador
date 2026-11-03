from ..models import Usuario
from ..schemas import UsuarioIn, UsuarioOut, UsuarioUpdate
from ..security import hash_password
from .base import crear_router


def preparar(db, datos: dict) -> dict:
    password = datos.pop("password", None)
    if password:
        datos["password_hash"] = hash_password(password)
    return datos


router = crear_router(
    "/usuarios", Usuario, UsuarioIn, UsuarioOut, UsuarioUpdate, preparar=preparar
)
