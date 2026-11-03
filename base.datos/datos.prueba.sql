USE RAEE;
GO

-- 1. Insertar Roles
INSERT INTO ROL (Nombre_Rol, Descripcion) VALUES 
('ADMIN', 'Administrador del sistema'),
('OPERADOR', 'Operador de centro de acopio y recepcion'),
('GENERADOR', 'Ciudadano o empresa que entrega RAEE');

-- 2. Insertar Organización de prueba
INSERT INTO ORGANIZACION (Nombre, Tipo_Organizacion, Direccion) VALUES 
('Recicladora Quito S.A.', 'Empresa Privada', 'Av. Amazonas y Naciones Unidas');

-- 3. Insertar Usuarios de prueba (contraseña genérica en hash simulado)
INSERT INTO USUARIO (Id_Organizacion, Id_Rol, Nombre, Email, Hash_Password, Estado) VALUES 
(1, 1, 'Admin Principal', 'admin@ecoraee.com', 'hash_seguro_123', 'ACTIVO'),
(1, 2, 'Carlos Operador', 'operador@ecoraee.com', 'hash_seguro_123', 'ACTIVO'),
(1, 3, 'Maria Generador', 'generador@ecoraee.com', 'hash_seguro_123', 'ACTIVO');

-- 4. Insertar Categorías RAEE
INSERT INTO CATEGORIA_RAEE (Codigo, Nombre_Categoria, Descripcion) VALUES 
('CAT-01', 'Línea Blanca', 'Refrigeradores, lavadoras, cocinas'),
('CAT-02', 'Informática y Comunicaciones', 'Computadoras, laptops, impresoras, teléfonos'),
('CAT-03', 'Pequeños Electrodomésticos', 'Licuadoras, microondas, planchas');

-- 5. Insertar Centro de Acopio
INSERT INTO CENTRO_ACOPIO (Id_Organizacion, Nombre, Direccion, Capacidad_Max_Kg, Estado) VALUES 
(1, 'Centro de Acopio Norte', 'Parque Industrial Carapungo', 5000.00, 'OPERATIVO');

-- 6. Insertar un Destino Final base (para cuando se procesen)
INSERT INTO DESTINO_FINAL (Tipo_Destino, Descripcion, Certificado) VALUES 
('RECICLAJE', 'Proceso de separación de metales y plásticos', 'CERT-2026-001');