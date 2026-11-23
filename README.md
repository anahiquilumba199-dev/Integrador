# EcoRAEE Cloud

Frontend React y Vite, API FastAPI y base de datos SQL Server.

## Ejecutar en desarrollo

1. Crea el catálogo `EcoRAEE` en SQL Server o configura `DB_NAME` con el catálogo que corresponda.
2. En `backend`, copia `.env.example` a `.env`. Configura el servidor y el driver ODBC que estén instalados. El backend usa autenticación integrada de Windows si `DB_USER` está vacío. Con un usuario SQL, configura también `DB_PASSWORD`.
3. Genera `AUTH_SECRET` con `python -c "import secrets; print(secrets.token_urlsafe(48))"`. Para crear la primera cuenta, configura también `BOOTSTRAP_ADMIN_EMAIL` y `BOOTSTRAP_ADMIN_PASSWORD` (mínimo 12 caracteres). Retíralos del entorno tras preparar el administrador.
4. En `backend`, instala con `python -m pip install -r requirements.txt` y ejecuta `python -m uvicorn app.main:app --reload`.
5. En `frontend`, ejecuta `npm ci` y `npm run dev`. La URL habitual es `http://localhost:5173`.
6. Comprueba `http://127.0.0.1:8000/health/ready` y abre el frontend. Los endpoints protegidos requieren la sesión emitida al iniciar sesión.

Deja `DB_INITIALIZE=true` para preparar las tablas con una cuenta autorizada a crear objetos. Una vez preparado el esquema, usa `DB_INITIALIZE=false` y un usuario SQL de aplicación limitado a sus tablas.

## AWS

- En EC2, configura `DB_SERVER=tcp:ENDPOINT_RDS,1433`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`. Autoriza el puerto 1433 desde el grupo de seguridad de EC2 en el grupo de RDS. Usa TLS y `DB_TRUST_SERVER_CERTIFICATE=no` con una cadena de confianza válida.
- Si usas CloudFront con rutas al mismo dominio, envía `/api/*` al backend y retira el prefijo `/api` en el proxy antes de FastAPI. Reenvía el encabezado `Authorization` y evita caché para la API. El frontend estático usa rutas hash.
- Si usas un dominio aparte para la API, define `VITE_API_URL` con la URL HTTPS antes de `npm run build` y agrega el origen HTTPS del frontend a `CORS_ORIGINS`. Publica solo `frontend/dist`. Mantén las credenciales SQL en EC2.

## Datos anteriores y alcance

El esquema de las tablas de `RAEE.bak` difiere del que usa el frontend. Si ambos comparten un catálogo, usa `DB_SCHEMA=ecoraee_app` para aislar las tablas de aplicación. Para reutilizar los registros del respaldo hace falta mapear las tablas y validar la migración de datos. La API detecta tablas incompatibles antes de iniciar.

El login, la gestión de usuarios, los centros, los dispositivos, las recolecciones, el inventario, las evaluaciones la auditoría y los indicadores del administrador consultan el backend. Reportes detallados, bandeja técnica y operaciones de operador todavía muestran datos de demostración.
