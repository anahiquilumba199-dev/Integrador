import datetime as dt

from .database import SessionLocal
from .models import CentroAcopio, Dispositivo, Evaluacion, Inventario, Recoleccion, Usuario
from .security import hash_password


def cargar_datos_iniciales() -> None:
    """Inserta datos de prueba (los mismos del front) solo si la base está vacía."""
    with SessionLocal() as db:
        if db.query(Usuario).first():
            return

        admin = Usuario(name="Administrador", email="admin@ecoraee.com",
                        password_hash=hash_password("admin123"), role="ADMINISTRADOR")
        tecnico = Usuario(name="Técnico RAEE", email="tecnico@ecoraee.com",
                          password_hash=hash_password("tecnico123"), role="TECNICO")
        principal = CentroAcopio(name="Centro de Acopio Principal",
                                 location="Edificio administrativo", capacity=500)
        secundario = CentroAcopio(name="Centro de Acopio Secundario",
                                  location="Laboratorio de sistemas", capacity=250)
        db.add_all([admin, tecnico, principal, secundario])
        db.flush()

        pendiente = Recoleccion(applicant="Laboratorio de sistemas", date=dt.date(2026, 10, 20),
                                state="PENDIENTE", center_id=secundario.id)
        aprobada = Recoleccion(applicant="Área administrativa", date=dt.date(2026, 10, 22),
                               state="APROBADA", center_id=principal.id)
        db.add_all([pendiente, aprobada])
        db.flush()

        pc = Dispositivo(name="Computadora de escritorio", category="Informática",
                         state="REGISTRADO", collection_id=pendiente.id)
        monitor = Dispositivo(name="Monitor LED", category="Pantallas",
                              state="RECOLECTADO", collection_id=aprobada.id)
        impresora = Dispositivo(name="Impresora", category="Impresión",
                                state="EVALUADO", collection_id=aprobada.id)
        db.add_all([pc, monitor, impresora])
        db.flush()

        db.add_all([
            Inventario(device_id=pc.id, center_id=principal.id, quantity=15, condition="PENDIENTE"),
            Inventario(device_id=monitor.id, center_id=principal.id, quantity=22, condition="ALMACENADO"),
            Inventario(device_id=impresora.id, center_id=secundario.id, quantity=8, condition="ALMACENADO"),
            Evaluacion(device_id=pc.id, evaluator_id=tecnico.id,
                       result="REACONDICIONAMIENTO", date=dt.date(2026, 10, 20)),
            Evaluacion(device_id=monitor.id, evaluator_id=tecnico.id,
                       result="RECICLAJE", date=dt.date(2026, 10, 22)),
        ])
        db.commit()
