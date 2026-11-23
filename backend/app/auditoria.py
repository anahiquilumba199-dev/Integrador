from .models import RegistroAuditoria


def registrar(db, usuario, accion, modulo, descripcion):
    db.add(RegistroAuditoria(usuario=usuario.name, rol=usuario.role,
                             accion=accion, modulo=modulo, descripcion=descripcion))
