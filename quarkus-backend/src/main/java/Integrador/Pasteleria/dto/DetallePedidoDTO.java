package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DetallePedidoDTO {
    private Integer idOrderDetail;
    private Integer idOrder;
    private Integer idProduct;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private String personalizacion;
}
