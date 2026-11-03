import datetime as dt
from typing import get_args

from sqlalchemy import CheckConstraint, Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base
from .tipos import Condicion, EstadoDispositivo, EstadoRecoleccion, Resultado, Rol


def en_lista(columna: str, tipo) -> CheckConstraint:
    valores = ", ".join(f"'{v}'" for v in get_args(tipo))
    return CheckConstraint(f"{columna} IN ({valores})")


class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = (en_lista("role", Rol),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="TECNICO")


class CentroAcopio(Base):
    __tablename__ = "centros_acopio"
    __table_args__ = (CheckConstraint("capacity > 0"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    location: Mapped[str] = mapped_column(String(150))
    capacity: Mapped[int]


class Recoleccion(Base):
    __tablename__ = "recolecciones"
    __table_args__ = (en_lista("state", EstadoRecoleccion),)

    id: Mapped[int] = mapped_column(primary_key=True)
    applicant: Mapped[str] = mapped_column(String(100))
    date: Mapped[dt.date] = mapped_column(Date)
    state: Mapped[str] = mapped_column(String(20), default="PENDIENTE")
    center_id: Mapped[int | None] = mapped_column(
        ForeignKey("centros_acopio.id", ondelete="SET NULL")
    )

    dispositivos: Mapped[list["Dispositivo"]] = relationship(passive_deletes=True)


class Dispositivo(Base):
    __tablename__ = "dispositivos"
    __table_args__ = (en_lista("state", EstadoDispositivo),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(60))
    state: Mapped[str] = mapped_column(String(20), default="REGISTRADO")
    collection_id: Mapped[int | None] = mapped_column(
        ForeignKey("recolecciones.id", ondelete="SET NULL")
    )


class Inventario(Base):
    __tablename__ = "inventario"
    __table_args__ = (CheckConstraint("quantity > 0"), en_lista("condition", Condicion))

    id: Mapped[int] = mapped_column(primary_key=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("dispositivos.id", ondelete="CASCADE"))
    center_id: Mapped[int | None] = mapped_column(ForeignKey("centros_acopio.id"))
    quantity: Mapped[int]
    condition: Mapped[str] = mapped_column(String(20), default="PENDIENTE")

    dispositivo: Mapped[Dispositivo] = relationship()

    @property
    def device(self) -> str:
        return self.dispositivo.name


class Evaluacion(Base):
    __tablename__ = "evaluaciones"
    __table_args__ = (en_lista("result", Resultado),)

    id: Mapped[int] = mapped_column(primary_key=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("dispositivos.id", ondelete="CASCADE"))
    evaluator_id: Mapped[int | None] = mapped_column(
        ForeignKey("usuarios.id", ondelete="SET NULL")
    )
    result: Mapped[str] = mapped_column(String(25))
    date: Mapped[dt.date] = mapped_column(Date)

    dispositivo: Mapped[Dispositivo] = relationship()

    @property
    def device(self) -> str:
        return self.dispositivo.name
