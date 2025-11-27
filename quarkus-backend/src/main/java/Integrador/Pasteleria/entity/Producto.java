package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "ProductoFinal")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProduct;

    @ManyToOne
    @JoinColumn(name = "id_receta", nullable = true)
    private Receta receta;

    @Column(name = "codigo_sku", unique = true)
    private String sku;

    @Column(name = "nombre", nullable = false, unique = true)
    private String productName;

    @Column(name = "descripcion")
    private String productDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria")
    private Categoria categoria = Categoria.torta;

    @Column(name = "costo_produccion")
    private BigDecimal costoProduccion = BigDecimal.ZERO;

    @Column(name = "margen_ganancia_porcentaje")
    private BigDecimal margenGanancia = new BigDecimal("30.00");

    @Column(name = "precio_venta", nullable = false)
    private BigDecimal productPrice;

    @Column(name = "peso_gramos")
    private Integer pesoGramos;

    @Column(name = "porciones")
    private Integer porciones;

    @Column(name = "requiere_refrigeracion")
    private Boolean requiereRefrigeracion = false;

    @Column(name = "dias_vida_util")
    private Integer diasVidaUtil;

    @Column(name = "disponible_catalogo")
    private Boolean disponibleCatalogo = true;

    @Column(name = "requiere_pedido_anticipado")
    private Boolean requierePedidoAnticipado = false;

    @Column(name = "dias_anticipacion")
    private Integer diasAnticipacion = 0;

    @Column(name = "stock_disponible")
    private Integer stockDisponible = 0;

    @Column(name = "imagen_url", columnDefinition = "LONGTEXT")
    private String productImage;

    @Column(name = "etiquetas")
    private String etiquetas;

    @Column(name = "orden_visualizacion")
    private Integer ordenVisualizacion = 999;

    @Column(name = "destacado")
    private Boolean destacado = false;

    @Column(name = "activo")
    private Boolean active = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime addedOn;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime updatedOn;

    public enum Categoria {
        torta, cupcake, galleta, pan, postre, otro
    }

    @PrePersist
    protected void onCreate() {
        addedOn = LocalDateTime.now();
        updatedOn = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedOn = LocalDateTime.now();
    }
}
