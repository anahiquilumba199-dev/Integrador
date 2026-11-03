-- ============================================================================
-- SCRIPT DE LA BASE DE DATOS - GESTIÓN RAEE 
-- ============================================================================
CREATE DATABASE RAEE
USE RAEE


-- 1. ORGANIZACIÓN
CREATE TABLE ORGANIZACION (
    Id_Organizacion INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Tipo_Organizacion VARCHAR(50),
    Direccion TEXT NOT NULL,
    Fecha_Registro DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- 2. ROL
CREATE TABLE ROL (
    Id_Rol INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_Rol VARCHAR(50) NOT NULL UNIQUE, -- Clave Secundaria (AK)
    Descripcion TEXT
);

-- 3. USUARIO
CREATE TABLE USUARIO (
    Id_Usuario INT IDENTITY(1,1) PRIMARY KEY,
    Id_Organizacion INT NOT NULL,
    Id_Rol INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE, -- Clave Secundaria (AK)
    Hash_Password VARCHAR(255) NOT NULL,
    Estado VARCHAR(20) CHECK (Estado IN ('ACTIVO', 'INACTIVO')),
    CONSTRAINT FK_Usuario_Organizacion FOREIGN KEY (Id_Organizacion) REFERENCES ORGANIZACION(Id_Organizacion),
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (Id_Rol) REFERENCES ROL(Id_Rol)
);

-- 4. AUDITORIA
CREATE TABLE AUDITORIA (
    Id_Auditoria INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Accion VARCHAR(100) NOT NULL,
    Fecha_Hora DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Auditoria_Usuario FOREIGN KEY (Id_Usuario) REFERENCES USUARIO(Id_Usuario)
);

-- 5. CENTRO_ACOPIO
CREATE TABLE CENTRO_ACOPIO (
    Id_Centro INT IDENTITY(1,1) PRIMARY KEY,
    Id_Organizacion INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Direccion TEXT NOT NULL,
    Capacidad_Max_Kg DECIMAL(10,2) NOT NULL CHECK (Capacidad_Max_Kg > 0),
    Estado VARCHAR(20) DEFAULT 'OPERATIVO',
    CONSTRAINT FK_Centro_Organizacion FOREIGN KEY (Id_Organizacion) REFERENCES ORGANIZACION(Id_Organizacion)
);

-- 6. CATEGORIA_RAEE
CREATE TABLE CATEGORIA_RAEE (
    Id_Categoria INT IDENTITY(1,1) PRIMARY KEY,
    Codigo VARCHAR(20) NOT NULL UNIQUE, -- Clave Secundaria (AK)
    Nombre_Categoria VARCHAR(100) NOT NULL,
    Descripcion TEXT
);

-- 7. DESTINO_FINAL
CREATE TABLE DESTINO_FINAL (
    Id_Destino INT IDENTITY(1,1) PRIMARY KEY,
    Tipo_Destino VARCHAR(50) NOT NULL CHECK (Tipo_Destino IN ('REACONDICIONAMIENTO', 'RECICLAJE', 'DISPOSICION_CONTROLADA', 'ASIGNADO')),
    Descripcion TEXT,
    Fecha_Cierre DATETIME2 DEFAULT GETDATE(),
    Certificado VARCHAR(100)
);

-- 8. SOLICITUD_RECOLECCION
CREATE TABLE SOLICITUD_RECOLECCION (
    Id_Solicitud INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario_Generador INT NOT NULL,
    Fecha_Solicitud DATETIME2 NOT NULL DEFAULT GETDATE(),
    Estado_Solicitud VARCHAR(30) CHECK (Estado_Solicitud IN ('PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA')),
    Direccion_Origen TEXT NOT NULL,
    CONSTRAINT FK_Solicitud_Usuario FOREIGN KEY (Id_Usuario_Generador) REFERENCES USUARIO(Id_Usuario)
);

-- 9. LOTE
CREATE TABLE LOTE (
    Id_Lote INT IDENTITY(1,1) PRIMARY KEY,
    Id_Solicitud INT NOT NULL,
    Codigo_Lote VARCHAR(50) NOT NULL UNIQUE, -- Clave Secundaria (AK)
    Fecha_Creacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    Peso_Total_Kg DECIMAL(10,2) CHECK (Peso_Total_Kg >= 0),
    CONSTRAINT FK_Lote_Solicitud FOREIGN KEY (Id_Solicitud) REFERENCES SOLICITUD_RECOLECCION(Id_Solicitud)
);

-- 10. RECEPCION
CREATE TABLE RECEPCION (
    Id_Recepcion INT IDENTITY(1,1) PRIMARY KEY,
    Id_Lote INT NOT NULL,
    Id_Operador INT NOT NULL,
    Fecha_Recepcion DATETIME2 NOT NULL DEFAULT GETDATE(),
    Observaciones TEXT,
    CONSTRAINT FK_Recepcion_Lote FOREIGN KEY (Id_Lote) REFERENCES LOTE(Id_Lote),
    CONSTRAINT FK_Recepcion_Operador FOREIGN KEY (Id_Operador) REFERENCES USUARIO(Id_Usuario)
);

-- 11. DISPOSITIVO
CREATE TABLE DISPOSITIVO (
    Id_Dispositivo INT IDENTITY(1,1) PRIMARY KEY,
    Id_Lote INT NOT NULL,
    Id_Categoria INT NOT NULL,
    Id_Destino INT NULL,
    Num_Serie VARCHAR(100) NOT NULL UNIQUE, -- Clave Secundaria (AK)
    Marca VARCHAR(50),
    Modelo VARCHAR(50),
    Peso_Kg DECIMAL(10,2) CHECK (Peso_Kg > 0),
    Estado_Trazabilidad VARCHAR(30) CHECK (Estado_Trazabilidad IN ('REGISTRADO', 'RECOLECTADO', 'EVALUADO', 'REACONDICIONAMIENTO', 'RECICLAJE', 'DISPOSICION_CONTROLADA', 'CERRADO')),
    Fecha_Registro DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Dispositivo_Lote FOREIGN KEY (Id_Lote) REFERENCES LOTE(Id_Lote),
    CONSTRAINT FK_Dispositivo_Categoria FOREIGN KEY (Id_Categoria) REFERENCES CATEGORIA_RAEE(Id_Categoria),
    CONSTRAINT FK_Dispositivo_Destino FOREIGN KEY (Id_Destino) REFERENCES DESTINO_FINAL(Id_Destino)
);

-- 12. EVALUACION_TECNICA
CREATE TABLE EVALUACION_TECNICA (
    Id_Evaluacion INT IDENTITY(1,1) PRIMARY KEY,
    Id_Dispositivo INT NOT NULL,
    Id_Tecnico INT NOT NULL,
    Condicion_Tecnica VARCHAR(50) NOT NULL,
    Es_Recuperable BIT NOT NULL,
    Observaciones TEXT,
    Fecha_Evaluacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Evaluacion_Dispositivo FOREIGN KEY (Id_Dispositivo) REFERENCES DISPOSITIVO(Id_Dispositivo),
    CONSTRAINT FK_Evaluacion_Tecnico FOREIGN KEY (Id_Tecnico) REFERENCES USUARIO(Id_Usuario)
);

-- 13. INVENTARIO
CREATE TABLE INVENTARIO (
    Id_Inventario INT IDENTITY(1,1) PRIMARY KEY,
    Id_Centro INT NOT NULL,
    Id_Dispositivo INT NOT NULL UNIQUE, 
    Fecha_Ingreso DATETIME2 NOT NULL DEFAULT GETDATE(),
    Estado_Stock VARCHAR(30) DEFAULT 'DISPONIBLE',
    CONSTRAINT FK_Inventario_Centro FOREIGN KEY (Id_Centro) REFERENCES CENTRO_ACOPIO(Id_Centro),
    CONSTRAINT FK_Inventario_Dispositivo FOREIGN KEY (Id_Dispositivo) REFERENCES DISPOSITIVO(Id_Dispositivo)
);

-- 14. MOVIMIENTO_INVENTARIO
CREATE TABLE MOVIMIENTO_INVENTARIO (
    Id_Movimiento INT IDENTITY(1,1) PRIMARY KEY,
    Id_Dispositivo INT NOT NULL,
    Id_Centro_Origen INT NOT NULL,
    Id_Centro_Destino INT NOT NULL,
    Id_Usuario_Autoriza INT NOT NULL,
    Fecha_Movimiento DATETIME2 NOT NULL DEFAULT GETDATE(),
    Estado_Movimiento VARCHAR(30) CHECK (Estado_Movimiento IN ('EN_TRANSITO', 'RECIBIDO', 'CANCELADA')),
    CONSTRAINT FK_Movimiento_Dispositivo FOREIGN KEY (Id_Dispositivo) REFERENCES DISPOSITIVO(Id_Dispositivo),
    CONSTRAINT FK_Movimiento_Origen FOREIGN KEY (Id_Centro_Origen) REFERENCES CENTRO_ACOPIO(Id_Centro),
    CONSTRAINT FK_Movimiento_Destino FOREIGN KEY (Id_Centro_Destino) REFERENCES CENTRO_ACOPIO(Id_Centro),
    CONSTRAINT FK_Movimiento_Autoriza FOREIGN KEY (Id_Usuario_Autoriza) REFERENCES USUARIO(Id_Usuario),
    CONSTRAINT CK_Movimiento_DiferenteCentro CHECK (Id_Centro_Origen <> Id_Centro_Destino) 
);

-- 15. EVIDENCIA
CREATE TABLE EVIDENCIA (
    Id_Evidencia INT IDENTITY(1,1) PRIMARY KEY,
    Id_Dispositivo INT NOT NULL,
    Id_Movimiento INT NULL,
    Url_S3 VARCHAR(500) NOT NULL,
    Tipo_Evidencia VARCHAR(50) NOT NULL,
    Fecha_Carga DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Evidencia_Dispositivo FOREIGN KEY (Id_Dispositivo) REFERENCES DISPOSITIVO(Id_Dispositivo),
    CONSTRAINT FK_Evidencia_Movimiento FOREIGN KEY (Id_Movimiento) REFERENCES MOVIMIENTO_INVENTARIO(Id_Movimiento)
);

-- 16. NODO_RED
CREATE TABLE NODO_RED (
    Id_Nodo INT IDENTITY(1,1) PRIMARY KEY,
    Id_Centro INT NULL,
    Nombre_Nodo VARCHAR(100) NOT NULL,
    Tipo_Nodo VARCHAR(30) NOT NULL CHECK (Tipo_Nodo IN ('ORIGEN', 'INTERMEDIO', 'SUMIDERO')),
    CONSTRAINT FK_Nodo_Centro FOREIGN KEY (Id_Centro) REFERENCES CENTRO_ACOPIO(Id_Centro)
);

-- 17. ARISTA_RED
CREATE TABLE ARISTA_RED (
    Id_Arista INT IDENTITY(1,1) PRIMARY KEY,
    Id_Nodo_Origen INT NOT NULL,
    Id_Nodo_Destino INT NOT NULL,
    Capacidad_Kg DECIMAL(10,2) NOT NULL CHECK (Capacidad_Kg >= 0),
    Distancia_Km DECIMAL(8,2),
    CONSTRAINT FK_Arista_Origen FOREIGN KEY (Id_Nodo_Origen) REFERENCES NODO_RED(Id_Nodo),
    CONSTRAINT FK_Arista_Destino FOREIGN KEY (Id_Nodo_Destino) REFERENCES NODO_RED(Id_Nodo),
    CONSTRAINT CK_Arista_DiferenteNodo CHECK (Id_Nodo_Origen <> Id_Nodo_Destino) 
);

-- ============================================================================
-- CREACIÓN DE ÍNDICES ADICIONALES (Optimización de Consultas y Claves Foráneas)
-- ============================================================================
--CREATE INDEX IX_Usuario_Org ON USUARIO(Id_Organizacion);
--CREATE INDEX IX_Dispositivo_Lote ON DISPOSITIVO(Id_Lote);
--CREATE INDEX IX_Dispositivo_Categoria ON DISPOSITIVO(Id_Categoria);
--CREATE INDEX IX_Inventario_Centro ON INVENTARIO(Id_Centro);
--CREATE INDEX IX_Movimiento_Dispositivo ON MOVIMIENTO_INVENTARIO(Id_Dispositivo);
--CREATE INDEX IX_Arista_Nodos ON ARISTA_RED(Id_Nodo_Origen, Id_Nodo_Destino);