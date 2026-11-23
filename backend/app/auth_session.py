import hashlib
import hmac
import os
import time

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from .database import get_db
from .models import Usuario

bearer = HTTPBearer(auto_error=False)
DURACION = 8 * 60 * 60


def _firma(datos: str, usuario: Usuario) -> str:
    secreto = os.getenv("AUTH_SECRET", "")
    if len(secreto) < 32:
        raise HTTPException(503, "Falta configurar AUTH_SECRET en el backend.")
    contenido = f"{datos}:{usuario.password_hash}".encode()
    return hmac.new(secreto.encode(), contenido, hashlib.sha256).hexdigest()


def emitir_sesion(usuario: Usuario) -> str:
    datos = f"{usuario.id}.{int(time.time()) + DURACION}"
    return f"{datos}.{_firma(datos, usuario)}"


def usuario_actual(
    credenciales: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> Usuario:
    invalida = HTTPException(401, "Inicia sesión para continuar.",
                            headers={"WWW-Authenticate": "Bearer"})
    if credenciales is None:
        raise invalida
    try:
        identificador, vencimiento, firma = credenciales.credentials.split(".")
        usuario_id = int(identificador)
        if not 0 < usuario_id <= 2147483647 or int(vencimiento) <= time.time():
            raise ValueError
    except ValueError:
        raise invalida from None
    usuario = db.get(Usuario, usuario_id)
    if usuario is None or not usuario.active:
        raise invalida
    esperada = _firma(f"{identificador}.{vencimiento}", usuario)
    if not hmac.compare_digest(firma.encode(), esperada.encode()):
        raise invalida
    return usuario


def exigir_roles(*roles):
    def comprobar(usuario: Usuario = Depends(usuario_actual)):
        if usuario.role not in roles:
            raise HTTPException(403, "Tu rol no permite esta operación.")
        return usuario
    return comprobar
