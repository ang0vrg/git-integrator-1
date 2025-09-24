package Integrador.Pasteleria.entity;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Entity
@Table(name = "Comprobante")/*Relación con la TABLE Comprobante*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comprobante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_invoice")/*Columna id_invoice */
    private Integer idInvoice;/*Tipo de variable */

    @Enumerated(EnumType.STRING)
    @Column(name = "invoice_type", nullable = false)
    private Role invoiceType;

    @Column(name = "invoice_number", nullable = false , unique = true)/*Concordancia con la DB */
    private String invoiceNumber; 

    @Column(name = "issue_date")
    private Timestamp issueDate;
    
    @Column(name = "total", nullable = false)
    private Double total;

    @Column(name = "tax")/*IGV u otro impuesto */
    private Double tax;

    @Column(name = "id_sale", nullable = false)
    private Integer idSale;

    @Column(name = "billing_name", nullable = false)
    private String billingName;

    @Column(name = "billing_document")/*DNI o RUC */
    private String billingDocument;

    public enum Role {/*Como se tiene roles enumerados, hay que generarlos */
        Boleta,
        Factura,
    }
}
