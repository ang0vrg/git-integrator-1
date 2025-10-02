Proyecto: Sistema Web - Pastelería La Casa del Chantilly

1. Descripción
La Casa del Chantilly es una pastelería que ofrece una gran variedad de postres, pasteles y platos salados. Actualmente, la empresa no dispone de un sistema digital para controlar sus ventas y pedidos, lo que genera ineficiencias y pérdida de tiempo.  
La solución propuesta es el desarrollo de un sistema web que permita gestionar ventas, pedidos, catálogo de productos, promociones y fidelización de clientes, optimizando los procesos internos y mejorando la experiencia del usuario.

2. Objetivos
- Digitalizar el registro y control de ventas.  
- Mejorar la experiencia de compra del cliente mediante un catálogo digital y opciones de personalización.  
- Reducir la dependencia de aplicaciones externas como PedidosYa y DiDi Food.  
- Implementar reportes automáticos de ventas y métodos de pago digitales.  

3. Tecnologías
- **Backend**: Java Spring Boot  
- **Frontend**: React  
- **Base de Datos**: MySQL con JPA  
- **Recursos Java**: Google Guava, Apache POI, Apache Commons, Logback  

4. Diseño de la Solución
- Patrón **Modelo-Vista-Controlador (MVC)** para separar lógica, interfaz y datos.  
- **Test-Driven Development (TDD)** para asegurar calidad desde el inicio.  
- Patrón **DAO (Data Access Object)** para gestionar el acceso a datos.  
- Principios **SOLID** para garantizar mantenibilidad y escalabilidad.  
- **Conexión a Base de Datos** mediante JPA, facilitando la integración con MySQL.  

5. Vistas Funcionales
- **Login**: acceso de clientes y administradores.  
- **Inicio**: presentación de productos y promociones.  
- **Promociones**: sección de ofertas especiales.  
- **Menú**: catálogo digital con opciones de personalización.  
- **Reseñas**: espacio para opiniones de clientes.  
- **Contacto**: información de sucursales y formulario de atención.  

6. Alcances
- Registro de clientes con datos de contacto.  
- Registro y gestión de ventas y pedidos.  
- Catálogo digital actualizado en tiempo real.  
- Métodos de pago: efectivo, tarjeta, Yape, Plin y PayPal.  
- Generación de reportes automáticos (diarios, semanales, mensuales).  
- Emisión de comprobantes digitales en PDF.  
- Roles diferenciados: cliente y administrador.  
- Sistema de promociones y fidelización de clientes frecuentes.  

7. Equipo y Responsabilidades
- **Integrante 1**: Desarrollo del backend con Spring Boot y conexión a la base de datos.  
- **Integrante 2**: Desarrollo del frontend en React y diseño de vistas funcionales.  
- **Ambos**: Elaboración del informe, pruebas de software y documentación técnica.  

8. Licencia
Este proyecto se desarrolla con fines académicos. Puede adaptarse bajo la licencia MIT para fines de uso libre y educativo.
