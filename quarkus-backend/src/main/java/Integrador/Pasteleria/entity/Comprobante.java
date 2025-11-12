package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
@Entity
@Table(name = "Comprobante")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comprobante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_invoice")
    private Integer idInvoice;

    @Column(name = "invoice_type")
    private String invoiceType;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "issue_date")
    private LocalDateTime issueDate;

    @Column(name = "total")
    private Double total;

    @Column(name = "tax")
    private Double tax;

    @ManyToOne
    @JoinColumn(name = "id_sale")
    private Venta idSale;

    @Column(name = "billing_name")
    private String billingName;

    @Column(name = "billing_document")
    private String billingDocument;
}
