from typing import Literal

Rol = Literal["ADMINISTRADOR", "TECNICO", "OPERADOR"]
EstadoDispositivo = Literal["REGISTRADO", "RECOLECTADO", "EVALUADO"]
EstadoRecoleccion = Literal["PENDIENTE", "APROBADA", "COMPLETADA", "RECHAZADA"]
Condicion = Literal["PENDIENTE", "ALMACENADO", "DESPACHADO"]
Resultado = Literal["REACONDICIONAMIENTO", "RECICLAJE", "DISPOSICION_CONTROLADA"]
