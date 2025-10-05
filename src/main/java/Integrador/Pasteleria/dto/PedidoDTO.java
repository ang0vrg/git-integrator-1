package Integrador.Pasteleria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Integer idOrder;
    private Integer idUser;
    private Double orderDiscount;
    private Double orderTotal;
    private java.sql.Timestamp orderDate;
}
