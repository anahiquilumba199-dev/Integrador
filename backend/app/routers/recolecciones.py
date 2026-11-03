from ..models import CentroAcopio, Recoleccion
from ..schemas import RecoleccionIn, RecoleccionOut
from .base import crear_router


def marcar_recolectados(db, recoleccion: Recoleccion) -> None:
    """Al completar una recolección, sus dispositivos pasan a RECOLECTADO."""
    if recoleccion.state == "COMPLETADA":
        for dispositivo in recoleccion.dispositivos:
            if dispositivo.state == "REGISTRADO":
                dispositivo.state = "RECOLECTADO"


router = crear_router(
    "/recolecciones",
    Recoleccion,
    RecoleccionIn,
    RecoleccionOut,
    relaciones={"center_id": CentroAcopio},
    despues=marcar_recolectados,
)
