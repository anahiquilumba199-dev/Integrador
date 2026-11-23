from fastapi import APIRouter, Depends
from sqlalchemy import func, select, true
from sqlalchemy.orm import Session

from ..auth_session import usuario_actual
from ..database import get_db
from ..models import Dispositivo, Inventario, Recoleccion, Usuario

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", dependencies=[Depends(usuario_actual)])
def resumen(db: Session = Depends(get_db), usuario: Usuario = Depends(usuario_actual)):
    """Valores de las 4 tarjetas del Panel principal."""
    datos = {
        "registered": db.scalar(select(func.count(Dispositivo.id))),
        "collected": db.scalar(
            select(func.count(Dispositivo.id)).where(Dispositivo.state.in_(("RECOLECTADO", "EVALUADO")))
        ),
        "evaluated": db.scalar(
            select(func.count(Dispositivo.id)).where(Dispositivo.state == "EVALUADO")
        ),
        "inventory": db.scalar(select(func.coalesce(func.sum(Inventario.quantity), 0))),
        "pending": db.scalar(
            select(func.count(Recoleccion.id)).where(Recoleccion.state == "PENDIENTE")
        ),
    }
    if usuario.role == "ADMINISTRADOR":
        datos["active_users"] = db.scalar(
            select(func.count(Usuario.id)).where(Usuario.active == true())
        )
    return datos
