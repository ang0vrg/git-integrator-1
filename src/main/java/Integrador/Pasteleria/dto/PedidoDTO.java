package Integrador.Pasteleria.dto;

import lombok.Data;

@Data
public class PedidoDTO {
    private Integer idOrder;
    private Integer idUserd;
    private Double orderDiscount;
    private Double orderTotal;
    private java.sql.Timestamp orderDate;
}
