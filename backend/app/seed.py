import os

from sqlalchemy import select

from .database import SessionLocal
from .models import Usuario
from .security import hash_password


def cargar_datos_iniciales() -> None:
    email = os.getenv("BOOTSTRAP_ADMIN_EMAIL", "").strip().lower()
    password = os.getenv("BOOTSTRAP_ADMIN_PASSWORD", "")
    if not email and not password:
        return
    if not email or len(password) < 12:
        raise ValueError("Configura BOOTSTRAP_ADMIN_EMAIL y una contraseña de al menos 12 caracteres.")
    with SessionLocal() as db:
        if db.scalar(select(Usuario.id).where(Usuario.role == "ADMINISTRADOR").limit(1)):
            return
        db.add(Usuario(name="Administrador", email=email, role="ADMINISTRADOR",
                       password_hash=hash_password(password)))
        db.commit()
