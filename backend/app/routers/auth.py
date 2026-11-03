from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Usuario
from ..schemas import LoginIn, UsuarioOut
from ..security import verificar_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=UsuarioOut)
def login(datos: LoginIn, db: Session = Depends(get_db)):
    usuario = db.scalar(select(Usuario).where(Usuario.email == datos.email))
    if usuario is None or not verificar_password(datos.password, usuario.password_hash):
        raise HTTPException(401, "Correo o contraseña incorrectos")
    return usuario
