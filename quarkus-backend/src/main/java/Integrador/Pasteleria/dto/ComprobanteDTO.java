package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
public class ComprobanteDTO {
    private Integer idInvoice;
    private Integer idVenta;
    private String invoiceType;
    private String serie;
    private String numero;
    private String invoiceNumber;
    private LocalDateTime issueDate;
    private LocalDate fechaVencimiento;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private String billingName;
    private String billingDocumentType;
    private String billingDocument;
    private String billingAddress;
    private String billingEmail;
    private String estadoSunat;
    private String codigoHash;
    private String xmlFirmado;
    private String cdrSunat;
    private LocalDateTime fechaAnulacion;
    private String motivoAnulacion;
}
