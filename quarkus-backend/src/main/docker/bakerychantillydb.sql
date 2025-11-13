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
-- TABLA PRODUCTO
-- =====================================================
CREATE TABLE Producto (
  id_product INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL UNIQUE,
  product_description VARCHAR(255) NOT NULL,
  product_quantity INT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  id_supplier INT,
  added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_supplier) REFERENCES Proveedor(id_supplier) ON DELETE SET NULL ON UPDATE CASCADE
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
  id_product INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_order) REFERENCES Pedido(id_order) ON DELETE CASCADE,
  FOREIGN KEY (id_product) REFERENCES Producto(id_product) ON DELETE RESTRICT
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
-- TABLA INVENTARIO
-- =====================================================
CREATE TABLE Inventario (
  id_stock     INT AUTO_INCREMENT PRIMARY KEY,
  id_product   INT NOT NULL,
  quantity     INT NOT NULL,
  last_update  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_product) REFERENCES Producto(id_product)
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
