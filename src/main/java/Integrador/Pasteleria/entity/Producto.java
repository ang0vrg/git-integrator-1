package Integrador.Pasteleria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.sql.Timestamp;

@Entity
@Table(name = "Producto")/*Relación con la TABLE Producto*/ 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")/*Columna id_producto */
    private Integer idProduct;/*Tipo de variable */

    @Column(name = "product_name", nullable = false, unique = true)/*Concordancia con la DB */
    private String productName; 

    @Column(name = "product_description", nullable = false)
    private String productDescription;
    
    @Column(name = "product_price", nullable = false)
    private Double productPrice;

    @Column(name = "product_quantity", nullable = false)
    private Integer productQuantity;
    
    @Column(name = "id_supplier", nullable = false)
    private Integer idSupplier;

    @Column(name = "added_on")
    private Timestamp addedOn;

    @Column(name = "updated_on")
    private Timestamp updatedOn;
}