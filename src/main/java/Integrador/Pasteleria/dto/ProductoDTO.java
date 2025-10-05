package Integrador.Pasteleria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Integer idProduct;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private Integer idSupplier;
    private Timestamp addedOn;
    private Timestamp updatedOn;
}
