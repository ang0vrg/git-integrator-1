package Integrador.Pasteleria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorDTO {
    private Integer idSupplier;
    private String supplierName;
    private String supplierContact;
    private String supplierPhone;
}
