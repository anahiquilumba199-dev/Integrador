import hashlib
import hmac
import os

ITERACIONES = 100_000


def _derivar(password: str, salt: bytes) -> str:
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt, ITERACIONES).hex()


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    return f"{salt.hex()}${_derivar(password, salt)}"


def verificar_password(password: str, guardado: str) -> bool:
    salt, digest = guardado.split("$")
    return hmac.compare_digest(_derivar(password, bytes.fromhex(salt)), digest)
