package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoDTO {
    private Integer idProduct;
    private Integer idReceta;
    private String sku;
    private String productName;
    private String productDescription;
    private String categoria;
    private BigDecimal costoProduccion;
    private BigDecimal margenGanancia;
    private BigDecimal productPrice;
    private Integer pesoGramos;
    private Integer porciones;
    private Boolean requiereRefrigeracion;
    private Integer diasVidaUtil;
    private Boolean disponibleCatalogo;
    private Boolean requierePedidoAnticipado;
    private Integer diasAnticipacion;
    private Integer stockDisponible;
    private String productImage;
    private String etiquetas;
    private Integer ordenVisualizacion;
    private Boolean destacado;
    private Boolean active;
}
