-- =====================================================
-- TABLA USUARIO
-- =====================================================
CREATE TABLE Usuario (
  id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  user_email VARCHAR(100) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL, -- soporta bcrypt/argon2
  user_role ENUM('cliente','administrador','trabajador') NOT NULL DEFAULT 'Cliente',
  phone_number VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (phone_number REGEXP '^\\+[0-9]{7,15}$')
);

-- =====================================================
-- TABLA PROVEEDOR
-- =====================================================
CREATE TABLE Proveedor (
  id_supplier INT AUTO_INCREMENT PRIMARY KEY,
  supplier_name VARCHAR(100) NOT NULL UNIQUE,
  supplier_contact VARCHAR(100),
  supplier_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA INGREDIENTE
-- =====================================================
CREATE TABLE Ingrediente (
  id_ingrediente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  unidad_medida VARCHAR(20) NOT NULL,
  stock_actual DECIMAL(10,2) DEFAULT 0,
  costo_promedio DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA COMPRA
-- =====================================================
CREATE TABLE Compra (
  id_compra INT AUTO_INCREMENT PRIMARY KEY,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_proveedor INT NOT NULL,
  total DECIMAL(10,2),
  FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_supplier)
);

-- =====================================================
-- TABLA DETALLE COMPRA
-- =====================================================
CREATE TABLE CompraDetalle (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_compra INT NOT NULL,
  id_ingrediente INT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  FOREIGN KEY (id_compra) REFERENCES Compra(id_compra) ON DELETE CASCADE,
  FOREIGN KEY (id_ingrediente) REFERENCES Ingrediente(id_ingrediente)
);

-- =====================================================
-- TABLA RECETA
-- =====================================================
CREATE TABLE Receta (
  id_receta INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
);

-- =====================================================
-- TABLA RECETA
-- =====================================================
CREATE TABLE RecetaDetalle (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_receta INT NOT NULL,
  id_ingrediente INT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_receta) REFERENCES Receta(id_receta),
  FOREIGN KEY (id_ingrediente) REFERENCES Ingrediente(id_ingrediente)
);

-- =====================================================
-- TABLA PRODUCTO FINAL
-- =====================================================
CREATE TABLE ProductoFinal (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  precio_venta DECIMAL(10,2) NOT NULL,
  id_receta INT NOT NULL,
  FOREIGN KEY (id_receta) REFERENCES Receta(id_receta)
);

-- =====================================================
-- TABLA PEDIDO (Cabecera)
-- =====================================================
CREATE TABLE Pedido (
  id_order INT AUTO_INCREMENT PRIMARY KEY,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_discount DECIMAL(10,2) DEFAULT 0,
  order_total DECIMAL(10,2),
  id_user INT NOT NULL,
  FOREIGN KEY (id_user) REFERENCES Usuario(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DETALLE_PEDIDO
-- =====================================================
CREATE TABLE DetallePedido (
  id_order_detail INT AUTO_INCREMENT PRIMARY KEY,
  id_order INT,
  id_producto_final INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_order) REFERENCES Pedido(id_order) ON DELETE CASCADE,
  FOREIGN KEY (id_producto_final) REFERENCES ProductoFinal(id_producto_final) ON DELETE RESTRICT
);

-- =====================================================
-- TABLA VENTA
-- =====================================================
CREATE TABLE Venta (
  id_sale INT AUTO_INCREMENT PRIMARY KEY,
  sale_type ENUM('EFECTIVO','TARJETA') NOT NULL,
  sale_status ENUM('PENDIENTE','CONFIRMADO','RECHAZADO') DEFAULT 'PENDIENTE',
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sale_subtotal DECIMAL(10,2) NOT NULL,
  id_order INT NOT NULL,
  FOREIGN KEY (id_order) REFERENCES Pedido(id_order) ON DELETE CASCADE
);

-- =====================================================
-- TABLA REPORTE
-- =====================================================
CREATE TABLE Reporte (
  id_report INT AUTO_INCREMENT PRIMARY KEY,
  report_type ENUM('VENTAS','PEDIDOS','CLIENTES','PRODUCTOS') NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  report_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA PUNTOS
-- =====================================================
CREATE TABLE Puntos (
  id_point INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  points_earned INT NOT NULL,
  points_redeemed INT DEFAULT 0,
  total_points INT NOT NULL, -- saldo acumulado
  id_sale INT, -- referencia a la venta donde se generaron
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES Usuario(id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_sale) REFERENCES Venta(id_sale) ON DELETE CASCADE
);

-- =====================================================
-- TABLA COMPROBANTE (Boleta / Factura)
-- =====================================================
CREATE TABLE Comprobante (
  id_invoice INT AUTO_INCREMENT PRIMARY KEY,
  invoice_type ENUM('Boleta','Factura') NOT NULL,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0, -- IGV u otro impuesto
  id_sale INT NOT NULL,
  billing_name VARCHAR(100) NOT NULL,
  billing_document VARCHAR(20), -- DNI o RUC
  FOREIGN KEY (id_sale) REFERENCES Venta(id_sale) ON DELETE CASCADE
);
