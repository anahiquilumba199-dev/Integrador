from ..models import Dispositivo, Recoleccion
from ..schemas import DispositivoIn, DispositivoOut
from .base import crear_router

router = crear_router(
    "/dispositivos",
    Dispositivo,
    DispositivoIn,
    DispositivoOut,
    relaciones={"collection_id": Recoleccion},
)
