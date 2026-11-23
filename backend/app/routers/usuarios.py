from fastapi import Depends, HTTPException
from sqlalchemy import func, select, true
from sqlalchemy.orm import Session

from ..auditoria import registrar
from ..auth_session import exigir_roles
from ..database import get_db
from ..models import Usuario
from ..schemas import EstadoUsuario, UsuarioIn, UsuarioOut, UsuarioUpdate
from ..security import hash_password
from .base import crear_router, obtener_o_404


def preparar(db, datos: dict) -> dict:
    datos["email"] = datos["email"].lower()
    password = datos.pop("password", None)
    if password:
        datos["password_hash"] = hash_password(password)
    return datos


def proteger_administrador(db, usuario):
    if usuario.active and usuario.role == "ADMINISTRADOR":
        cantidad = db.scalar(select(func.count(Usuario.id)).where(
            Usuario.role == "ADMINISTRADOR", Usuario.active == true()
        ))
        if cantidad <= 1:
            raise HTTPException(409, "Debe quedar al menos un administrador activo.")


def proteger_cambio_de_rol(db, usuario, cambios):
    if cambios.get("role", usuario.role) != usuario.role:
        proteger_administrador(db, usuario)


solo_admin = exigir_roles("ADMINISTRADOR")
router = crear_router(
    "/usuarios", Usuario, UsuarioIn, UsuarioOut, UsuarioUpdate, preparar=preparar,
    lectura=("ADMINISTRADOR",), antes_eliminar=proteger_administrador,
    antes_actualizar=proteger_cambio_de_rol
)


@router.patch("/{item_id}/estado", response_model=UsuarioOut)
def estado(item_id: int, datos: EstadoUsuario, db: Session = Depends(get_db),
           usuario: Usuario = Depends(solo_admin)):
    destino = obtener_o_404(db, Usuario, item_id)
    if not datos.active:
        if usuario.id == item_id:
            raise HTTPException(409, "No puedes desactivar tu propia cuenta.")
        proteger_administrador(db, destino)
    destino.active = datos.active
    registrar(db, usuario, "Cambio de estado", "Usuarios", f"Registro #{destino.id}")
    db.commit()
    db.refresh(destino)
    return destino
