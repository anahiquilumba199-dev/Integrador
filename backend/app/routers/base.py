from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auditoria import registrar
from ..auth_session import exigir_roles
from ..database import get_db
from ..models import Dispositivo


def obtener_o_404(db: Session, modelo, item_id: int):
    objeto = db.get(modelo, item_id)
    if objeto is None:
        raise HTTPException(404, f"{modelo.__name__} con id {item_id} no existe")
    return objeto


def resolver_dispositivo(db: Session, datos: dict) -> dict:
    """Resuelve un dispositivo por ID o por nombre inequívoco."""
    nombre = datos.pop("device", None)
    dispositivo_id = datos.pop("device_id", None)
    if dispositivo_id is not None:
        datos["device_id"] = obtener_o_404(db, Dispositivo, dispositivo_id).id
    elif nombre is not None:
        coincidencias = db.scalars(select(Dispositivo).where(Dispositivo.name == nombre).limit(2)).all()
        if not coincidencias:
            raise HTTPException(404, f"No existe un dispositivo llamado '{nombre}'")
        if len(coincidencias) > 1:
            raise HTTPException(409, "Hay varios dispositivos con ese nombre. Usa su ID.")
        datos["device_id"] = coincidencias[0].id
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
    lectura=("ADMINISTRADOR", "TECNICO", "OPERADOR"),
    escritura=None,
    antes_eliminar=None,
    antes_actualizar=None,
):
    """Genera el CRUD de una entidad.

    relaciones: {campo_fk: Modelo} para validar que la referencia exista.
    preparar:   función(db, datos) -> datos, para transformar la entrada.
    despues:    función(db, objeto), regla de negocio tras crear/actualizar.
    """
    router = APIRouter(prefix=prefijo, tags=[prefijo.strip("/")])
    puede_leer = [Depends(exigir_roles(*lectura))]
    puede_escribir = exigir_roles(*(escritura or lectura))
    modulo = prefijo.strip("/").capitalize()
    actualizacion = actualizacion or entrada
    relaciones = relaciones or {}

    def procesar(db, datos):
        if preparar:
            datos = preparar(db, datos)
        for campo, relacionado in relaciones.items():
            if datos.get(campo) is not None:
                obtener_o_404(db, relacionado, datos[campo])
        return datos

    def guardar(db, objeto, usuario, accion):
        db.flush()
        if despues:
            despues(db, objeto)
        registrar(db, usuario, accion, modulo, f"Registro #{objeto.id}")
        db.commit()
        db.refresh(objeto)
        return objeto

    @router.get("", response_model=list[salida], dependencies=puede_leer)
    def listar(db: Session = Depends(get_db)):
        return db.scalars(select(modelo).order_by(modelo.id)).all()

    @router.get("/{item_id}", response_model=salida, dependencies=puede_leer)
    def detalle(item_id: int, db: Session = Depends(get_db)):
        return obtener_o_404(db, modelo, item_id)

    @router.post("", response_model=salida, status_code=201)
    def crear(datos: entrada, db: Session = Depends(get_db), usuario=Depends(puede_escribir)):
        objeto = modelo(**procesar(db, datos.model_dump()))
        db.add(objeto)
        return guardar(db, objeto, usuario, "Creación")

    @router.put("/{item_id}", response_model=salida)
    def actualizar(item_id: int, datos: actualizacion, db: Session = Depends(get_db),
                   usuario=Depends(puede_escribir)):
        objeto = obtener_o_404(db, modelo, item_id)
        cambios = procesar(db, datos.model_dump(exclude_unset=True))
        if antes_actualizar:
            antes_actualizar(db, objeto, cambios)
        for campo, valor in cambios.items():
            setattr(objeto, campo, valor)
        return guardar(db, objeto, usuario, "Actualización")

    @router.delete("/{item_id}", status_code=204)
    def eliminar(item_id: int, db: Session = Depends(get_db), usuario=Depends(puede_escribir)):
        objeto = obtener_o_404(db, modelo, item_id)
        if antes_eliminar:
            antes_eliminar(db, objeto)
        registrar(db, usuario, "Eliminación", modulo, f"Registro #{objeto.id}")
        db.delete(objeto)
        db.commit()
        return Response(status_code=204)

    return router
