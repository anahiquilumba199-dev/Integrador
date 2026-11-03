from ..models import Evaluacion, Usuario
from ..schemas import EvaluacionIn, EvaluacionOut
from .base import crear_router, resolver_dispositivo


def marcar_evaluado(db, evaluacion: Evaluacion) -> None:
    """Al evaluar un dispositivo, su estado pasa a EVALUADO."""
    evaluacion.dispositivo.state = "EVALUADO"


router = crear_router(
    "/evaluaciones",
    Evaluacion,
    EvaluacionIn,
    EvaluacionOut,
    relaciones={"evaluator_id": Usuario},
    preparar=lambda db, datos: resolver_dispositivo(db, datos),
    despues=marcar_evaluado,
)
