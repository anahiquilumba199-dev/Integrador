--1. CONSULTA DE USUARIOS CON SUS ROLES Y ORGANIZACIONES 
SELECT 
    u.Id_Usuario,
    u.Nombre AS Nombre_Usuario,
    u.Email,
    u.Estado,
    r.Nombre_Rol,
    o.Nombre AS Nombre_Organizacion
FROM USUARIO u
INNER JOIN ROL r ON u.Id_Rol = r.Id_Rol
INNER JOIN ORGANIZACION o ON u.Id_Organizacion = o.Id_Organizacion;

--2. CONSULTA EL INVENTARIO O LA CAPACIDAD DE LOS CENTROS DE ACOPIO
SELECT 
    c.Id_Centro,
    c.Nombre AS Centro_Acopio,
    c.Direccion,
    c.Capacidad_Max_Kg,
    c.Estado,
    o.Nombre AS Empresa_Propietaria
FROM CENTRO_ACOPIO c
INNER JOIN ORGANIZACION o ON c.Id_Organizacion = o.Id_Organizacion;

--3. LISTAR LAS CATEGORIAS DE LA RAEE DISPONIBLES 
SELECT 
    Id_Categoria,
    Codigo,
    Nombre_Categoria,
    Descripcion
FROM CATEGORIA_RAEE;


--4. CONSULTA QUE SE CONECTA CON EL BACKEND 
SELECT 
    d.Num_Serie,
    d.Marca,
    d.Modelo,
    d.Peso_Kg,
    d.Estado_Trazabilidad,
    c.Nombre_Categoria,
    l.Codigo_Lote,
    df.Tipo_Destino
FROM DISPOSITIVO d
INNER JOIN CATEGORIA_RAEE c ON d.Id_Categoria = c.Id_Categoria
INNER JOIN LOTE l ON d.Id_Lote = l.Id_Lote
LEFT JOIN DESTINO_FINAL df ON d.Id_Destino = df.Id_Destino;