-- =====================================================
-- BASE DE DATOS: SISTEMA DE PASTELERÍA
-- Versión: 2.0
-- Charset: utf8mb4 (soporte completo de caracteres)
-- =====================================================

SET NAMES utf8mb4;
SET TIME_ZONE = '-05:00'; -- Ajustar según tu zona horaria


-- =====================================================
-- TABLA: USUARIO
-- Descripción: Gestión de usuarios del sistema (clientes, administradores, trabajadores)
-- =====================================================
CREATE TABLE Usuario (
    -- Identificación
    id_usuario                  INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario              VARCHAR(50)     NOT NULL UNIQUE,
    correo                      VARCHAR(100)    NOT NULL UNIQUE,
    contrasena                  VARCHAR(255)    NOT NULL,  -- bcrypt/argon2
    
    -- Clasificación
    rol                         ENUM('cliente', 'administrador', 'trabajador') 
                                                NOT NULL DEFAULT 'cliente',
    
    -- Contacto
    telefono                    VARCHAR(20)     UNIQUE,
    
    -- Seguridad
    ultimo_acceso               TIMESTAMP       NULL,
    intentos_fallidos           TINYINT         DEFAULT 0,
    cuenta_bloqueada            BOOLEAN         DEFAULT FALSE,
    token_recuperacion          VARCHAR(255)    NULL,
    token_expiracion            TIMESTAMP       NULL,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_eliminacion           TIMESTAMP       NULL,  -- Soft delete
    activo                      BOOLEAN         DEFAULT TRUE,
    
    -- Constraints
    CHECK (telefono REGEXP '^\\+?[0-9]{7,15}$'),
    CHECK (correo REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'),
    
    -- Índices
    INDEX idx_correo (correo),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: DIRECCION
-- Descripción: Direcciones de entrega de los usuarios
-- =====================================================
CREATE TABLE Direccion (
    id_direccion                INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario                  INT             NOT NULL,
    
    -- Datos de dirección
    alias                       VARCHAR(50)     NOT NULL,  -- "Casa", "Trabajo", etc.
    calle                       VARCHAR(150)    NOT NULL,
    numero                      VARCHAR(10),
    piso_dpto                   VARCHAR(20),
    distrito                    VARCHAR(50)     NOT NULL,
    ciudad                      VARCHAR(50)     NOT NULL,
    codigo_postal               VARCHAR(10),
    referencia                  VARCHAR(200),
    
    -- Coordenadas (opcional para delivery)
    latitud                     DECIMAL(10,8)   NULL,
    longitud                    DECIMAL(11,8)   NULL,
    
    -- Estado
    es_predeterminada           BOOLEAN         DEFAULT FALSE,
    activa                      BOOLEAN         DEFAULT TRUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_usuario (id_usuario),
    INDEX idx_predeterminada (es_predeterminada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- =====================================================
-- TABLA: PROVEEDOR
-- Descripción: Proveedores de ingredientes
-- =====================================================
CREATE TABLE Proveedor (
    id_proveedor                INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Datos básicos
    nombre_proveedor            VARCHAR(100)    NOT NULL UNIQUE,
    razon_social                VARCHAR(150),
    ruc                         VARCHAR(11)     UNIQUE,
    
    -- Contacto
    contacto_nombre             VARCHAR(100),
    contacto_telefono           VARCHAR(20),
    contacto_email              VARCHAR(100),
    
    -- Dirección
    direccion                   VARCHAR(200),
    distrito                    VARCHAR(50),
    ciudad                      VARCHAR(50),
    
    -- Información comercial
    tiempo_entrega_dias         TINYINT         DEFAULT 0,
    calificacion                DECIMAL(3,2)    DEFAULT 0.00,  -- 0.00 a 5.00
    
    -- Estado
    activo                      BOOLEAN         DEFAULT TRUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_nombre (nombre_proveedor),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: INGREDIENTE
-- Descripción: Catálogo de ingredientes e inventario
-- =====================================================
CREATE TABLE Ingrediente (
    id_ingrediente              INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Identificación
    codigo_interno              VARCHAR(20)     UNIQUE,
    nombre                      VARCHAR(100)    NOT NULL UNIQUE,
    descripcion                 VARCHAR(255),
    categoria                   ENUM('harina', 'azucar', 'lacteo', 'fruta', 
                                     'chocolate', 'decoracion', 'otro') 
                                                DEFAULT 'otro',
    
    -- Inventario
    unidad_medida               VARCHAR(20)     NOT NULL,  -- kg, L, unidad, etc.
    stock_actual                DECIMAL(10,3)   DEFAULT 0.000,
    stock_minimo                DECIMAL(10,3)   DEFAULT 0.000,
    stock_maximo                DECIMAL(10,3)   NULL,
    punto_reorden               DECIMAL(10,3)   DEFAULT 0.000,
    
    -- Costos
    costo_promedio              DECIMAL(10,2)   DEFAULT 0.00,
    ultimo_costo                DECIMAL(10,2)   DEFAULT 0.00,
    
    -- Información adicional
    requiere_refrigeracion      BOOLEAN         DEFAULT FALSE,
    dias_vida_util              INT             NULL,
    alergeno                    BOOLEAN         DEFAULT FALSE,
    
    -- Estado
    activo                      BOOLEAN         DEFAULT TRUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (stock_actual >= 0),
    CHECK (stock_minimo >= 0),
    CHECK (costo_promedio >= 0),
    
    -- Índices
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_stock (stock_actual),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: LOTE_INGREDIENTE
-- Descripción: Control de lotes de ingredientes (trazabilidad)
-- =====================================================
CREATE TABLE LoteIngrediente (
    id_lote                     INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_ingrediente              INT             NOT NULL,
    
    -- Identificación del lote
    numero_lote                 VARCHAR(50)     NOT NULL,
    cantidad                    DECIMAL(10,3)   NOT NULL,
    
    -- Fechas importantes
    fecha_ingreso               DATE            NOT NULL,
    fecha_vencimiento           DATE            NULL,
    
    -- Estado
    cantidad_disponible         DECIMAL(10,3)   NOT NULL,
    estado                      ENUM('disponible', 'agotado', 'vencido') 
                                                DEFAULT 'disponible',
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_ingrediente) REFERENCES Ingrediente(id_ingrediente)
        ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_ingrediente (id_ingrediente),
    INDEX idx_vencimiento (fecha_vencimiento),
    INDEX idx_estado (estado),
    
    UNIQUE KEY uk_ingrediente_lote (id_ingrediente, numero_lote)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: COMPRA
-- Descripción: Órdenes de compra a proveedores
-- =====================================================
CREATE TABLE Compra (
    id_compra                   INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_proveedor                INT             NOT NULL,
    id_usuario_registro         INT             NOT NULL,  -- Quién registró la compra
    
    -- Datos de la compra
    numero_orden                VARCHAR(20)     UNIQUE,
    fecha_orden                 DATE            NOT NULL,
    fecha_entrega_estimada      DATE            NULL,
    fecha_entrega_real          DATE            NULL,
    
    -- Montos
    subtotal                    DECIMAL(10,2)   DEFAULT 0.00,
    impuesto                    DECIMAL(10,2)   DEFAULT 0.00,
    total                       DECIMAL(10,2)   DEFAULT 0.00,
    
    -- Estado
    estado                      ENUM('pendiente', 'confirmada', 'en_transito', 
                                     'recibida', 'cancelada') 
                                                DEFAULT 'pendiente',
    
    -- Observaciones
    notas                       TEXT            NULL,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor)
        ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario_registro) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT,
    
    -- Índices
    INDEX idx_proveedor (id_proveedor),
    INDEX idx_fecha_orden (fecha_orden),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: COMPRA_DETALLE
-- Descripción: Detalle de items en cada compra
-- =====================================================
CREATE TABLE CompraDetalle (
    id_detalle                  INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_compra                   INT             NOT NULL,
    id_ingrediente              INT             NOT NULL,
    
    -- Cantidades
    cantidad                    DECIMAL(10,3)   NOT NULL,
    precio_unitario             DECIMAL(10,2)   NOT NULL,
    subtotal                    DECIMAL(10,2)   GENERATED ALWAYS AS 
                                                (cantidad * precio_unitario) STORED,
    
    -- Control de lote
    numero_lote                 VARCHAR(50)     NULL,
    fecha_vencimiento           DATE            NULL,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_compra) REFERENCES Compra(id_compra) 
        ON DELETE CASCADE,
    FOREIGN KEY (id_ingrediente) REFERENCES Ingrediente(id_ingrediente)
        ON DELETE RESTRICT,
    
    -- Constraints
    CHECK (cantidad > 0),
    CHECK (precio_unitario >= 0),
    
    -- Índices
    INDEX idx_compra (id_compra),
    INDEX idx_ingrediente (id_ingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: MOVIMIENTO_INVENTARIO
-- Descripción: Historial de movimientos de inventario
-- =====================================================
CREATE TABLE MovimientoInventario (
    id_movimiento               INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_ingrediente              INT             NOT NULL,
    id_usuario                  INT             NULL,
    id_compra                   INT             NULL,  -- Si es ingreso por compra
    id_pedido                   INT             NULL,  -- Si es salida por producción
    
    -- Tipo de movimiento
    tipo_movimiento             ENUM('ingreso_compra', 'salida_produccion', 
                                     'ajuste_inventario', 'merma', 'devolucion')
                                                NOT NULL,
    
    -- Cantidades
    cantidad                    DECIMAL(10,3)   NOT NULL,
    stock_anterior              DECIMAL(10,3)   NOT NULL,
    stock_actual                DECIMAL(10,3)   NOT NULL,
    
    -- Información adicional
    motivo                      VARCHAR(255)    NULL,
    numero_lote                 VARCHAR(50)     NULL,
    
    -- Auditoría
    fecha_movimiento            TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_ingrediente) REFERENCES Ingrediente(id_ingrediente)
        ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE SET NULL,
    FOREIGN KEY (id_compra) REFERENCES Compra(id_compra)
        ON DELETE SET NULL,
    -- NOTA: id_pedido se agregará en PARTE 4
    
    -- Índices
    INDEX idx_ingrediente (id_ingrediente),
    INDEX idx_tipo (tipo_movimiento),
    INDEX idx_fecha (fecha_movimiento),
    INDEX idx_compra (id_compra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;-- =====================================================
-- TABLA: RECETA
-- Descripción: Recetas de productos (pasteles)
-- =====================================================
CREATE TABLE Receta (
    id_receta                   INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Identificación
    codigo                      VARCHAR(20)     UNIQUE,
    nombre                      VARCHAR(100)    NOT NULL UNIQUE,
    descripcion                 TEXT,
    
    -- Producción
    porciones                   INT             DEFAULT 1,
    tiempo_preparacion_min      INT             NULL,
    dificultad                  ENUM('facil', 'media', 'dificil') 
                                                DEFAULT 'media',
    
    -- Costos calculados (se actualizan con trigger)
    costo_ingredientes          DECIMAL(10,2)   DEFAULT 0.00,
    costo_mano_obra             DECIMAL(10,2)   DEFAULT 0.00,
    costo_total                 DECIMAL(10,2)   GENERATED ALWAYS AS 
                                                (costo_ingredientes + costo_mano_obra) STORED,
    
    -- Información adicional
    instrucciones               TEXT            NULL,
    notas_alergenos             VARCHAR(255)    NULL,
    
    -- Estado
    activa                      BOOLEAN         DEFAULT TRUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_nombre (nombre),
    INDEX idx_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: RECETA_DETALLE
-- Descripción: Ingredientes necesarios por receta
-- =====================================================
CREATE TABLE RecetaDetalle (
    id_detalle                  INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_receta                   INT             NOT NULL,
    id_ingrediente              INT             NOT NULL,
    
    -- Cantidades
    cantidad                    DECIMAL(10,3)   NOT NULL,
    unidad_medida               VARCHAR(20)     NOT NULL,
    
    -- Información adicional
    es_opcional                 BOOLEAN         DEFAULT FALSE,
    notas                       VARCHAR(200)    NULL,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_receta) REFERENCES Receta(id_receta)
        ON DELETE CASCADE,
    FOREIGN KEY (id_ingrediente) REFERENCES Ingrediente(id_ingrediente)
        ON DELETE RESTRICT,
    
    -- Constraints
    CHECK (cantidad > 0),
    
    -- Índices
    INDEX idx_receta (id_receta),
    INDEX idx_ingrediente (id_ingrediente),
    
    UNIQUE KEY uk_receta_ingrediente (id_receta, id_ingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: PRODUCTO_FINAL
-- Descripción: Catálogo de productos disponibles para venta
-- =====================================================
CREATE TABLE ProductoFinal (
    id_producto                 INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_receta                   INT             NOT NULL,
    
    -- Identificación
    codigo_sku                  VARCHAR(30)     UNIQUE,
    nombre                      VARCHAR(100)    NOT NULL UNIQUE,
    descripcion                 TEXT,
    categoria                   ENUM('torta', 'cupcake', 'galleta', 
                                     'pan', 'postre', 'otro') 
                                                DEFAULT 'torta',
    
    -- Precios
    costo_produccion            DECIMAL(10,2)   DEFAULT 0.00,  -- De la receta
    margen_ganancia_porcentaje  DECIMAL(5,2)    DEFAULT 30.00,
    precio_venta                DECIMAL(10,2)   NOT NULL,
    
    -- Características
    peso_gramos                 INT             NULL,
    porciones                   INT             NULL,
    requiere_refrigeracion      BOOLEAN         DEFAULT FALSE,
    dias_vida_util              INT             NULL,
    
    -- Disponibilidad
    disponible_catalogo         BOOLEAN         DEFAULT TRUE,
    requiere_pedido_anticipado  BOOLEAN         DEFAULT FALSE,
    dias_anticipacion           INT             DEFAULT 0,
    stock_disponible            INT             DEFAULT 0,  -- Para productos pre-hechos
    
    -- SEO y Marketing
    imagen_url                  VARCHAR(255)    NULL,
    etiquetas                   VARCHAR(255)    NULL,  -- JSON: ["sin gluten", "vegano"]
    orden_visualizacion         INT             DEFAULT 999,
    destacado                   BOOLEAN         DEFAULT FALSE,
    
    -- Estado
    activo                      BOOLEAN         DEFAULT TRUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_receta) REFERENCES Receta(id_receta)
        ON DELETE RESTRICT,
    
    -- Constraints
    CHECK (precio_venta >= 0),
    CHECK (margen_ganancia_porcentaje >= 0),
    
    -- Índices
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_precio (precio_venta),
    INDEX idx_disponible (disponible_catalogo),
    INDEX idx_destacado (destacado),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: ESTADO_PEDIDO
-- Descripción: Catálogo de estados del pedido (FSM - Máquina de Estados)
-- =====================================================
CREATE TABLE EstadoPedido (
    id_estado                   INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Identificación
    codigo                      VARCHAR(30)     NOT NULL UNIQUE,
    nombre                      VARCHAR(50)     NOT NULL,
    descripcion                 VARCHAR(200),
    
    -- Configuración
    orden                       INT             NOT NULL UNIQUE,
    color_hex                   VARCHAR(7)      DEFAULT '#CCCCCC',  -- Para UI
    icono                       VARCHAR(30)     NULL,
    
    -- Comportamiento
    es_estado_inicial           BOOLEAN         DEFAULT FALSE,
    es_estado_final             BOOLEAN         DEFAULT FALSE,
    requiere_notificacion       BOOLEAN         DEFAULT TRUE,
    
    -- Estado
    activo                      BOOLEAN         DEFAULT TRUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_orden (orden),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;-- =====================================================
-- TABLA: PEDIDO
-- Descripción: Pedidos de clientes (cabecera)
-- =====================================================
CREATE TABLE Pedido (
    id_pedido                   INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_usuario                  INT             NOT NULL,
    id_direccion                INT             NULL,  -- Dirección de entrega
    id_estado_actual            INT             NOT NULL DEFAULT 1,
    
    -- Identificación
    numero_pedido               VARCHAR(20)     NOT NULL UNIQUE,
    
    -- Fechas
    fecha_pedido                TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega_estimada      TIMESTAMP       NULL,
    fecha_entrega_real          TIMESTAMP       NULL,
    
    -- Montos
    subtotal                    DECIMAL(10,2)   DEFAULT 0.00,
    descuento                   DECIMAL(10,2)   DEFAULT 0.00,
    impuesto                    DECIMAL(10,2)   DEFAULT 0.00,
    costo_envio                 DECIMAL(10,2)   DEFAULT 0.00,
    total                       DECIMAL(10,2)   NOT NULL,
    
    -- Método de entrega
    metodo_entrega              ENUM('delivery', 'recojo_tienda', 'programado')
                                                DEFAULT 'delivery',
    
    -- Información adicional
    notas_cliente               TEXT            NULL,
    notas_internas              TEXT            NULL,
    dedicatoria                 VARCHAR(255)    NULL,
    
    -- Tracking
    codigo_seguimiento          VARCHAR(50)     UNIQUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_cancelacion           TIMESTAMP       NULL,
    
    -- Relaciones
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id_direccion)
        ON DELETE SET NULL,
    FOREIGN KEY (id_estado_actual) REFERENCES EstadoPedido(id_estado)
        ON DELETE RESTRICT,
    
    -- Constraints
    CHECK (subtotal >= 0),
    CHECK (descuento >= 0),
    CHECK (total >= 0),
    
    -- Índices
    INDEX idx_usuario (id_usuario),
    INDEX idx_numero_pedido (numero_pedido),
    INDEX idx_fecha_pedido (fecha_pedido),
    INDEX idx_estado (id_estado_actual),
    INDEX idx_metodo_entrega (metodo_entrega)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: HISTORIAL_ESTADO_PEDIDO
-- Descripción: Trazabilidad de cambios de estado
-- =====================================================
CREATE TABLE HistorialEstadoPedido (
    id_historial                INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_pedido                   INT             NOT NULL,
    id_estado                   INT             NOT NULL,
    id_usuario_cambio           INT             NULL,  -- Quién cambió el estado
    
    -- Información del cambio
    fecha_cambio                TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    comentario                  VARCHAR(255)    NULL,
    
    -- Relaciones
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
        ON DELETE CASCADE,
    FOREIGN KEY (id_estado) REFERENCES EstadoPedido(id_estado)
        ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario_cambio) REFERENCES Usuario(id_usuario)
        ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_pedido (id_pedido),
    INDEX idx_estado (id_estado),
    INDEX idx_fecha (fecha_cambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: PEDIDO_DETALLE
-- Descripción: Productos incluidos en cada pedido
-- =====================================================
CREATE TABLE PedidoDetalle (
    id_detalle                  INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_pedido                   INT             NOT NULL,
    id_producto                 INT             NOT NULL,
    
    -- Cantidades
    cantidad                    INT             NOT NULL DEFAULT 1,
    precio_unitario             DECIMAL(10,2)   NOT NULL,
    subtotal                    DECIMAL(10,2)   GENERATED ALWAYS AS 
                                                (cantidad * precio_unitario) STORED,
    
    -- Personalización
    personalizacion             TEXT            NULL,  -- JSON con opciones
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
        ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES ProductoFinal(id_producto)
        ON DELETE RESTRICT,
    
    -- Constraints
    CHECK (cantidad > 0),
    CHECK (precio_unitario >= 0),
    
    -- Índices
    INDEX idx_pedido (id_pedido),
    INDEX idx_producto (id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: METODO_PAGO
-- Descripción: Métodos de pago disponibles
-- =====================================================
CREATE TABLE MetodoPago (
    id_metodo_pago              INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Identificación
    codigo                      VARCHAR(30)     NOT NULL UNIQUE,
    nombre                      VARCHAR(50)     NOT NULL,
    descripcion                 VARCHAR(200),
    
    -- Configuración
    tipo                        ENUM('efectivo', 'tarjeta', 'transferencia', 
                                     'billetera_digital', 'otro')
                                                NOT NULL,
    proveedor                   VARCHAR(50)     NULL,  -- "Visa", "PayPal", etc.
    requiere_validacion_online  BOOLEAN         DEFAULT FALSE,
    comision_porcentaje         DECIMAL(5,2)    DEFAULT 0.00,
    
    -- Estado
    activo                      BOOLEAN         DEFAULT TRUE,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: VENTA
-- Descripción: Ventas confirmadas (transacción financiera)
-- =====================================================
CREATE TABLE Venta (
    id_venta                    INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_pedido                   INT             NOT NULL,
    id_metodo_pago              INT             NOT NULL,
    id_usuario_registro         INT             NULL,  -- Cajero/vendedor
    
    -- Identificación
    numero_venta                VARCHAR(20)     NOT NULL UNIQUE,
    
    -- Montos
    monto_total                 DECIMAL(10,2)   NOT NULL,
    monto_pagado                DECIMAL(10,2)   DEFAULT 0.00,
    monto_cambio                DECIMAL(10,2)   DEFAULT 0.00,
    
    -- Información de pago
    estado_pago                 ENUM('pendiente', 'pagado', 'parcial', 
                                     'rechazado', 'reembolsado')
                                                DEFAULT 'pendiente',
    referencia_transaccion      VARCHAR(100)    NULL,  -- ID de pasarela de pago
    
    -- Fechas
    fecha_venta                 TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_pago                  TIMESTAMP       NULL,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
        ON DELETE RESTRICT,
    FOREIGN KEY (id_metodo_pago) REFERENCES MetodoPago(id_metodo_pago)
        ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario_registro) REFERENCES Usuario(id_usuario)
        ON DELETE SET NULL,
    
    -- Constraints
    CHECK (monto_total >= 0),
    CHECK (monto_pagado >= 0),
    
    -- Índices
    INDEX idx_pedido (id_pedido),
    INDEX idx_numero_venta (numero_venta),
    INDEX idx_fecha_venta (fecha_venta),
    INDEX idx_estado_pago (estado_pago),
    INDEX idx_metodo_pago (id_metodo_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: COMPROBANTE
-- Descripción: Comprobantes de pago (boleta/factura)
-- =====================================================
CREATE TABLE Comprobante (
    id_comprobante              INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_venta                    INT             NOT NULL,
    
    -- Identificación
    tipo_comprobante            ENUM('boleta', 'factura', 'ticket')
                                                NOT NULL,
    serie                       VARCHAR(4)      NOT NULL,
    numero                      VARCHAR(8)      NOT NULL,
    numero_completo             VARCHAR(13)     GENERATED ALWAYS AS 
                                                (CONCAT(serie, '-', numero)) STORED,
    
    -- Fechas
    fecha_emision               TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento           DATE            NULL,  -- Para facturas
    
    -- Montos
    subtotal                    DECIMAL(10,2)   NOT NULL,
    impuesto                    DECIMAL(10,2)   DEFAULT 0.00,
    total                       DECIMAL(10,2)   NOT NULL,
    
    -- Datos del cliente
    cliente_nombre              VARCHAR(100)    NOT NULL,
    cliente_documento_tipo      ENUM('dni', 'ruc', 'pasaporte', 'ce')
                                                NOT NULL,
    cliente_documento_numero    VARCHAR(20)     NOT NULL,
    cliente_direccion           VARCHAR(200)    NULL,
    cliente_email               VARCHAR(100)    NULL,
    
    -- Estado SUNAT (para Perú)
    estado_sunat                ENUM('pendiente', 'enviado', 'aceptado', 
                                     'rechazado', 'anulado')
                                                DEFAULT 'pendiente',
    codigo_hash                 VARCHAR(255)    NULL,  -- Hash para QR
    xml_firmado                 MEDIUMTEXT      NULL,
    cdr_sunat                   MEDIUMTEXT      NULL,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_anulacion             TIMESTAMP       NULL,
    motivo_anulacion            VARCHAR(255)    NULL,
    
    -- Relaciones
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta)
        ON DELETE RESTRICT,
    
    -- Índices
    INDEX idx_venta (id_venta),
    INDEX idx_tipo (tipo_comprobante),
    INDEX idx_fecha_emision (fecha_emision),
    INDEX idx_cliente_documento (cliente_documento_numero),
    INDEX idx_estado_sunat (estado_sunat),
    
    UNIQUE KEY uk_serie_numero (serie, numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;-- =====================================================
-- TABLA: PUNTOS
-- Descripción: Sistema de puntos de fidelidad
-- =====================================================
CREATE TABLE Puntos (
    id_punto                    INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_usuario                  INT             NOT NULL,
    id_venta                    INT             NULL,  -- Referencia a venta
    
    -- Movimiento de puntos
    tipo_movimiento             ENUM('ganados', 'canjeados', 'vencidos', 'ajuste')
                                                NOT NULL,
    puntos_movimiento           INT             NOT NULL,  -- Puede ser negativo
    
    -- Saldos
    saldo_anterior              INT             DEFAULT 0,
    saldo_actual                INT             GENERATED ALWAYS AS 
                                                (saldo_anterior + puntos_movimiento) STORED,
    
    -- Información adicional
    concepto                    VARCHAR(200)    NULL,
    fecha_vencimiento           DATE            NULL,
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta)
        ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_usuario (id_usuario),
    INDEX idx_venta (id_venta),
    INDEX idx_tipo (tipo_movimiento),
    INDEX idx_fecha_vencimiento (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TABLA: REPORTE
-- Descripción: Reportes generados del sistema
-- =====================================================
CREATE TABLE Reporte (
    id_reporte                  INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones
    id_usuario_generador        INT             NOT NULL,
    
    -- Identificación
    tipo_reporte                ENUM('ventas', 'pedidos', 'clientes', 
                                     'productos', 'inventario', 'financiero')
                                                NOT NULL,
    nombre                      VARCHAR(100)    NOT NULL,
    descripcion                 VARCHAR(255),
    
    -- Período
    fecha_inicio                DATE            NOT NULL,
    fecha_fin                   DATE            NOT NULL,
    
    -- Datos del reporte
    datos_json                  JSON            NULL,
    archivo_url                 VARCHAR(255)    NULL,  -- PDF generado
    
    -- Estado
    estado                      ENUM('generando', 'completado', 'error')
                                                DEFAULT 'generando',
    
    -- Auditoría
    fecha_creacion              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_usuario_generador) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT,
    
    -- Índices
    INDEX idx_tipo (tipo_reporte),
    INDEX idx_periodo (fecha_inicio, fecha_fin),
    INDEX idx_usuario (id_usuario_generador),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- AHORA PODEMOS AGREGAR LA FK FALTANTE EN MOVIMIENTO_INVENTARIO
-- =====================================================
ALTER TABLE MovimientoInventario
ADD FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
    ON DELETE SET NULL;

ALTER TABLE MovimientoInventario
ADD INDEX idx_pedido (id_pedido);


-- =====================================================
-- DATOS INICIALES: ESTADOS DE PEDIDO
-- =====================================================
INSERT INTO EstadoPedido (codigo, nombre, descripcion, orden, color_hex, es_estado_inicial, es_estado_final) VALUES
('PENDIENTE_PAGO',    'Pendiente de Pago',     'Esperando confirmación de pago',           1, '#FFC107', TRUE,  FALSE),
('PAGADO',            'Pagado',                'Pago confirmado, listo para producción',   2, '#4CAF50', FALSE, FALSE),
('EN_PRODUCCION',     'En Producción',         'El pedido está siendo preparado',          3, '#2196F3', FALSE, FALSE),
('LISTO_ENTREGA',     'Listo para Entrega',    'Producto terminado, esperando envío',      4, '#9C27B0', FALSE, FALSE),
('EN_RUTA',           'En Ruta',               'El pedido está en camino al cliente',      5, '#FF9800', FALSE, FALSE),
('ENTREGADO',         'Entregado',             'Pedido entregado al cliente',              6, '#8BC34A', FALSE, TRUE),
('CANCELADO',         'Cancelado',             'Pedido cancelado por cliente o sistema',   7, '#F44336', FALSE, TRUE);


-- =====================================================
-- DATOS INICIALES: MÉTODOS DE PAGO
-- =====================================================
INSERT INTO MetodoPago (codigo, nombre, tipo, proveedor, requiere_validacion_online, comision_porcentaje) VALUES
('EFECTIVO',          'Efectivo',                'efectivo',              NULL,         FALSE, 0.00),
('TARJETA_VISA',      'Tarjeta Visa',            'tarjeta',               'Visa',       TRUE,  3.50),
('TARJETA_MC',        'Tarjeta Mastercard',      'tarjeta',               'Mastercard', TRUE,  3.50),
('TRANSFERENCIA',     'Transferencia Bancaria',  'transferencia',         NULL,         FALSE, 0.00),
('YAPE',              'Yape',                    'billetera_digital',     'BCP',        FALSE, 0.00),
('PLIN',              'Plin',                    'billetera_digital',     'BBVA',       FALSE, 0.00),
('PAYPAL',            'PayPal',                  'billetera_digital',     'PayPal',     TRUE,  4.50);


-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para búsquedas frecuentes
CREATE INDEX idx_pedido_usuario_fecha ON Pedido(id_usuario, fecha_pedido);
CREATE INDEX idx_venta_fecha_estado ON Venta(fecha_venta, estado_pago);
CREATE INDEX idx_ingrediente_stock_categoria ON Ingrediente(categoria, stock_actual);
CREATE INDEX idx_producto_categoria_precio ON ProductoFinal(categoria, precio_venta);


-- =====================================================
-- COMENTARIOS EN TABLAS (DOCUMENTACIÓN)
-- =====================================================

ALTER TABLE Usuario COMMENT = 'Usuarios del sistema: clientes, administradores y trabajadores';
ALTER TABLE Direccion COMMENT = 'Direcciones de entrega de usuarios';
ALTER TABLE Proveedor COMMENT = 'Proveedores de ingredientes';
ALTER TABLE Ingrediente COMMENT = 'Catálogo e inventario de ingredientes';
ALTER TABLE LoteIngrediente COMMENT = 'Control de lotes para trazabilidad';
ALTER TABLE Compra COMMENT = 'Órdenes de compra a proveedores';
ALTER TABLE CompraDetalle COMMENT = 'Detalle de items en compras';
ALTER TABLE MovimientoInventario COMMENT = 'Historial de movimientos de inventario';
ALTER TABLE Receta COMMENT = 'Recetas de productos con costos calculados';
ALTER TABLE RecetaDetalle COMMENT = 'Ingredientes necesarios por receta';
ALTER TABLE ProductoFinal COMMENT = 'Productos finales disponibles para venta';
ALTER TABLE EstadoPedido COMMENT = 'Catálogo de estados del pedido (FSM)';
ALTER TABLE Pedido COMMENT = 'Cabecera de pedidos de clientes';
ALTER TABLE HistorialEstadoPedido COMMENT = 'Trazabilidad de cambios de estado';
ALTER TABLE PedidoDetalle COMMENT = 'Productos incluidos en cada pedido';
ALTER TABLE MetodoPago COMMENT = 'Métodos de pago disponibles';
ALTER TABLE Venta COMMENT = 'Transacciones financieras confirmadas';
ALTER TABLE Comprobante COMMENT = 'Comprobantes de pago (boleta/factura)';
ALTER TABLE Puntos COMMENT = 'Sistema de puntos de fidelidad';
ALTER TABLE Reporte COMMENT = 'Reportes generados del sistema';