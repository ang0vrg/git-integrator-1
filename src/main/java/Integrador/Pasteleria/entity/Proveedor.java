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
@Entity
@Table(name = "Proveedor")/*Relación con la TABLE Proveedor*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_supplier")/*Columna id_proveedor */
    private Integer idSupplier;/*Tipo de variable */

    @Column(name = "Supplier_name", nullable = false, unique = true)/*Concordancia con la DB */
    private String SupplierName; 

    @Column(name = "supplier_contact")
    private String supplierContact;
    
    @Column(name = "supplier_phone")
    private String supplierPhone;
}