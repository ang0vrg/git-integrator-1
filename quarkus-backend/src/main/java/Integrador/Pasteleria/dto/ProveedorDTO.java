package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProveedorDTO {
    private Integer idSupplier;
    private String supplierName;
    private String businessName;
    private String ruc;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private String address;
    private String district;
    private String city;
    private Integer deliveryTimeDays;
    private BigDecimal rating;
    private Boolean active;
}
