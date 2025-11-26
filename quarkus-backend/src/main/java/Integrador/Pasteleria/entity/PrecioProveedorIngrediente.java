package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "PrecioProveedorIngrediente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrecioProveedorIngrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_precio")
    private Integer idPrecio;

    @ManyToOne
    @JoinColumn(name = "id_proveedor", nullable = false)
    private Proveedor proveedor;

    @ManyToOne
    @JoinColumn(name = "id_ingrediente", nullable = false)
    private Ingrediente ingrediente;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cliente", nullable = false)
    private TipoCliente tipoCliente = TipoCliente.minorista;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario = BigDecimal.ZERO;

    @Column(name = "cantidad_minima", precision = 10, scale = 2)
    private BigDecimal cantidadMinima = BigDecimal.ONE;

    @Column(name = "descuento_porcentaje", precision = 5, scale = 2)
    private BigDecimal descuentoPorcentaje = BigDecimal.ZERO;

    @Column(name = "moneda")
    private String moneda = "PEN";

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "fecha_vigencia_inicio")
    private LocalDateTime fechaVigenciaInicio;

    @Column(name = "fecha_vigencia_fin")
    private LocalDateTime fechaVigenciaFin;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public enum TipoCliente {
        minorista, // Precio normal para clientes finales
        mayorista, // Precio para compras al por mayor
        distribuidor // Precio especial para distribuidores
    }

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        if (fechaVigenciaInicio == null) {
            fechaVigenciaInicio = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
