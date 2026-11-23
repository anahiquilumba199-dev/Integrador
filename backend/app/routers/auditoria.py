from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth_session import exigir_roles
from ..database import get_db
from ..models import RegistroAuditoria

router = APIRouter(prefix="/auditoria", tags=["auditoria"],
                   dependencies=[Depends(exigir_roles("ADMINISTRADOR"))])


@router.get("")
def listar(db: Session = Depends(get_db)):
    registros = db.scalars(
        select(RegistroAuditoria).order_by(RegistroAuditoria.id.desc()).limit(500)
    )
    return [
        {
            "id": registro.id,
            "codigo": f"AUD-{registro.id:03}",
            "usuario": registro.usuario,
            "rol": registro.rol,
            "accion": registro.accion,
            "modulo": registro.modulo,
            "descripcion": registro.descripcion,
            "fecha": registro.fecha.date().isoformat(),
            "hora": registro.fecha.strftime("%H:%M UTC"),
            "resultado": "Exitoso",
        }
        for registro in registros
    ]
