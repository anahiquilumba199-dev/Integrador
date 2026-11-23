import datetime as dt
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

from .tipos import Condicion, EstadoDispositivo, EstadoRecoleccion, Resultado, Rol

EMAIL = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class Entrada(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)


class Salida(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Usuarios ----------
class UsuarioBase(Entrada):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(pattern=EMAIL, max_length=120)
    role: Rol = "TECNICO"


class UsuarioIn(UsuarioBase):
    password: Annotated[str, StringConstraints(strip_whitespace=False)] = Field(min_length=8, max_length=100)


class UsuarioUpdate(UsuarioBase):
    password: Annotated[str, StringConstraints(strip_whitespace=False)] | None = Field(default=None, min_length=8, max_length=100)


class UsuarioOut(UsuarioBase, Salida):
    active: bool


class EstadoUsuario(BaseModel):
    active: bool


class SesionOut(BaseModel):
    user: UsuarioOut
    access_token: str


class LoginIn(BaseModel):
    email: str
    password: str = Field(min_length=1, max_length=100)


# ---------- Centros de acopio ----------
class CentroIn(Entrada):
    name: str = Field(min_length=3, max_length=100)
    location: str = Field(min_length=3, max_length=150)
    capacity: int = Field(gt=0)


class CentroOut(CentroIn, Salida):
    pass


# ---------- Recolecciones ----------
class RecoleccionIn(Entrada):
    applicant: str = Field(min_length=3, max_length=100)
    date: dt.date
    state: EstadoRecoleccion = "PENDIENTE"
    center_id: int | None = None


class RecoleccionOut(RecoleccionIn, Salida):
    pass


# ---------- Dispositivos ----------
class DispositivoIn(Entrada):
    name: str = Field(min_length=2, max_length=100)
    category: str = Field(min_length=2, max_length=60)
    state: EstadoDispositivo = "REGISTRADO"
    collection_id: int | None = None


class DispositivoOut(DispositivoIn, Salida):
    pass


# ---------- Inventario ----------
class ReferenciaDispositivo(Entrada):
    device: str | None = Field(default=None, min_length=2, max_length=100)
    device_id: int | None = Field(default=None, gt=0)

    @model_validator(mode="after")
    def validar_referencia(self):
        if self.device_id is None and self.device is None:
            raise ValueError("Selecciona un dispositivo registrado.")
        return self


class InventarioIn(ReferenciaDispositivo):
    quantity: int = Field(gt=0)
    condition: Condicion = "PENDIENTE"
    center_id: int | None = None


class InventarioOut(InventarioIn, Salida):
    device: str
    device_id: int


# ---------- Evaluaciones ----------
class EvaluacionIn(ReferenciaDispositivo):
    result: Resultado
    date: dt.date
    evaluator_id: int | None = None


class EvaluacionOut(EvaluacionIn, Salida):
    device: str
    device_id: int
