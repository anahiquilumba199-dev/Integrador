from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Dispositivo, Inventario, Recoleccion

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def resumen(db: Session = Depends(get_db)):
    """Valores de las 4 tarjetas del Panel principal."""
    return {
        "registered": db.scalar(select(func.count(Dispositivo.id))),
        "collected": db.scalar(
            select(func.count(Dispositivo.id)).where(Dispositivo.state == "RECOLECTADO")
        ),
        "evaluated": db.scalar(
            select(func.count(Dispositivo.id)).where(Dispositivo.state == "EVALUADO")
        ),
        "inventory": db.scalar(select(func.coalesce(func.sum(Inventario.quantity), 0))),
        "pending": db.scalar(
            select(func.count(Recoleccion.id)).where(Recoleccion.state == "PENDIENTE")
        ),
    }
