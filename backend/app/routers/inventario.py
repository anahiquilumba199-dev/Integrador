from ..models import CentroAcopio, Inventario
from ..schemas import InventarioIn, InventarioOut
from .base import crear_router, resolver_dispositivo

router = crear_router(
    "/inventario",
    Inventario,
    InventarioIn,
    InventarioOut,
    relaciones={"center_id": CentroAcopio},
    preparar=lambda db, datos: resolver_dispositivo(db, datos),
)
