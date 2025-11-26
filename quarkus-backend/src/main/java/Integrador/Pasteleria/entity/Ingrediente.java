package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "Ingrediente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingrediente")
    private Integer idIngrediente;

    @Column(name = "codigo_interno", unique = true)
    private String codigoInterno;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria")
    private Categoria categoria = Categoria.otro;

    @Column(name = "unidad_medida", nullable = false)
    private String unidadMedida;

    @Column(name = "stock_actual")
    private BigDecimal stockActual = BigDecimal.ZERO;

    @Column(name = "stock_minimo")
    private BigDecimal stockMinimo = BigDecimal.ZERO;

    @Column(name = "stock_maximo")
    private BigDecimal stockMaximo;

    @Column(name = "punto_reorden")
    private BigDecimal puntoReorden = BigDecimal.ZERO;

    @Column(name = "costo_promedio")
    private BigDecimal costoPromedio = BigDecimal.ZERO;

    @Column(name = "ultimo_costo")
    private BigDecimal ultimoCosto = BigDecimal.ZERO;

    @Column(name = "requiere_refrigeracion")
    private Boolean requiereRefrigeracion = false;

    @Column(name = "dias_vida_util")
    private Integer diasVidaUtil;

    @Column(name = "alergeno")
    private Boolean alergeno = false;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public enum Categoria {
        harina, azucar, lacteo, fruta, chocolate, decoracion, otro
    }

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
