package Integrador.Pasteleria.dto;

import lombok.Data;
import java.sql.Timestamp;

@Data
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
