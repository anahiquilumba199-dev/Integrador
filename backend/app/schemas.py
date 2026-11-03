import datetime as dt

from pydantic import BaseModel, ConfigDict, Field

from .tipos import Condicion, EstadoDispositivo, EstadoRecoleccion, Resultado, Rol

EMAIL = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
PASSWORD_POR_DEFECTO = "ecoraee123"


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
    # El formulario del front no pide contraseña: se asigna una por defecto.
    password: str = Field(default=PASSWORD_POR_DEFECTO, min_length=6, max_length=100)


class UsuarioUpdate(UsuarioBase):
    password: str | None = Field(default=None, min_length=6, max_length=100)


class UsuarioOut(UsuarioBase, Salida):
    pass


class LoginIn(Entrada):
    email: str
    password: str


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
class InventarioIn(Entrada):
    device: str = Field(min_length=2, max_length=100)  # nombre de un dispositivo registrado
    quantity: int = Field(gt=0)
    condition: Condicion = "PENDIENTE"
    center_id: int | None = None


class InventarioOut(InventarioIn, Salida):
    pass


# ---------- Evaluaciones ----------
class EvaluacionIn(Entrada):
    device: str = Field(min_length=2, max_length=100)  # nombre de un dispositivo registrado
    result: Resultado
    date: dt.date
    evaluator_id: int | None = None


class EvaluacionOut(EvaluacionIn, Salida):
    pass
