package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "Comprobante")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comprobante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comprobante")
    private Integer idInvoice;

    @ManyToOne
    @JoinColumn(name = "id_venta", nullable = false)
    private Venta idSale;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_comprobante", nullable = false)
    private TipoComprobante invoiceType;

    @Column(name = "serie", nullable = false)
    private String serie;

    @Column(name = "numero", nullable = false)
    private String numero;

    @Column(name = "numero_completo", insertable = false, updatable = false)
    private String invoiceNumber;

    @Column(name = "fecha_emision")
    private LocalDateTime issueDate;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "subtotal", nullable = false)
    private BigDecimal subtotal;

    @Column(name = "impuesto")
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "total", nullable = false)
    private BigDecimal total;

    @Column(name = "cliente_nombre", nullable = false)
    private String billingName;

    @Enumerated(EnumType.STRING)
    @Column(name = "cliente_documento_tipo", nullable = false)
    private TipoDocumento billingDocumentType;

    @Column(name = "cliente_documento_numero", nullable = false)
    private String billingDocument;

    @Column(name = "cliente_direccion")
    private String billingAddress;

    @Column(name = "cliente_email")
    private String billingEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_sunat")
    private EstadoSunat estadoSunat = EstadoSunat.pendiente;

    @Column(name = "codigo_hash")
    private String codigoHash;

    @Column(name = "xml_firmado")
    private String xmlFirmado;

    @Column(name = "cdr_sunat")
    private String cdrSunat;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_anulacion")
    private LocalDateTime fechaAnulacion;

    @Column(name = "motivo_anulacion")
    private String motivoAnulacion;

    public enum TipoComprobante {
        boleta, factura, ticket
    }

    public enum TipoDocumento {
        dni, ruc, pasaporte, ce
    }

    public enum EstadoSunat {
        pendiente, enviado, aceptado, rechazado, anulado
    }

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (issueDate == null)
            issueDate = LocalDateTime.now();
    }
}
