from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Dispositivo


def obtener_o_404(db: Session, modelo, item_id: int):
    objeto = db.get(modelo, item_id)
    if objeto is None:
        raise HTTPException(404, f"{modelo.__name__} con id {item_id} no existe")
    return objeto


def resolver_dispositivo(db: Session, datos: dict) -> dict:
    """El front envía el nombre del dispositivo ('device'); aquí se convierte a device_id."""
    nombre = datos.pop("device", None)
    if nombre is not None:
        dispositivo = db.scalar(select(Dispositivo).where(Dispositivo.name == nombre))
        if dispositivo is None:
            raise HTTPException(404, f"No existe un dispositivo llamado '{nombre}'")
        datos["device_id"] = dispositivo.id
    return datos


def crear_router(
    prefijo,
    modelo,
    entrada,
    salida,
    actualizacion=None,
    relaciones=None,
    preparar=None,
    despues=None,
):
    """Genera el CRUD de una entidad.

    relaciones: {campo_fk: Modelo} para validar que la referencia exista.
    preparar:   función(db, datos) -> datos, para transformar la entrada.
    despues:    función(db, objeto), regla de negocio tras crear/actualizar.
    """
    router = APIRouter(prefix=prefijo, tags=[prefijo.strip("/")])
    actualizacion = actualizacion or entrada
    relaciones = relaciones or {}

    def procesar(db, datos):
        if preparar:
            datos = preparar(db, datos)
        for campo, relacionado in relaciones.items():
            if datos.get(campo) is not None:
                obtener_o_404(db, relacionado, datos[campo])
        return datos

    def guardar(db, objeto):
        db.flush()
        if despues:
            despues(db, objeto)
        db.commit()
        db.refresh(objeto)
        return objeto

    @router.get("", response_model=list[salida])
    def listar(db: Session = Depends(get_db)):
        return db.scalars(select(modelo).order_by(modelo.id)).all()

    @router.get("/{item_id}", response_model=salida)
    def detalle(item_id: int, db: Session = Depends(get_db)):
        return obtener_o_404(db, modelo, item_id)

    @router.post("", response_model=salida, status_code=201)
    def crear(datos: entrada, db: Session = Depends(get_db)):
        objeto = modelo(**procesar(db, datos.model_dump()))
        db.add(objeto)
        return guardar(db, objeto)

    @router.put("/{item_id}", response_model=salida)
    def actualizar(item_id: int, datos: actualizacion, db: Session = Depends(get_db)):
        objeto = obtener_o_404(db, modelo, item_id)
        cambios = procesar(db, datos.model_dump(exclude_unset=True))
        for campo, valor in cambios.items():
            setattr(objeto, campo, valor)
        return guardar(db, objeto)

    @router.delete("/{item_id}", status_code=204)
    def eliminar(item_id: int, db: Session = Depends(get_db)):
        db.delete(obtener_o_404(db, modelo, item_id))
        db.commit()
        return Response(status_code=204)

    return router
