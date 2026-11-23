from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..auditoria import registrar
from ..auth_session import emitir_sesion, usuario_actual
from ..database import get_db
from ..models import Usuario
from ..schemas import LoginIn, SesionOut, UsuarioOut
from ..security import verificar_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=SesionOut)
def login(datos: LoginIn, db: Session = Depends(get_db)):
    usuario = db.scalar(select(Usuario).where(func.lower(Usuario.email) == datos.email.strip().lower()))
    if usuario is None or not usuario.active or not verificar_password(datos.password, usuario.password_hash):
        raise HTTPException(401, "Correo o contraseña incorrectos")
    token = emitir_sesion(usuario)
    registrar(db, usuario, "Inicio de sesión", "Autenticación", "Acceso al sistema.")
    db.commit()
    return {"user": usuario, "access_token": token}


@router.get("/me", response_model=UsuarioOut)
def perfil(usuario: Usuario = Depends(usuario_actual)):
    return usuario
