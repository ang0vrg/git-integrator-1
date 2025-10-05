package Integrador.Pasteleria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedidoDTO {
    private Integer idOrderDetail;
    private Integer idOrder;
    private Integer idProduct;
    private Integer quantity;
    private Double price;
}
