from ..models import CentroAcopio
from ..schemas import CentroIn, CentroOut
from .base import crear_router

router = crear_router("/centros", CentroAcopio, CentroIn, CentroOut)
