package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "Receta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_receta")
    private Integer idReceta;

    @Column(name = "codigo", unique = true)
    private String codigo;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "porciones")
    private Integer porciones = 1;

    @Column(name = "tiempo_preparacion_min")
    private Integer tiempoPreparacionMin;

    @Enumerated(EnumType.STRING)
    @Column(name = "dificultad")
    private Dificultad dificultad = Dificultad.media;

    @Column(name = "costo_ingredientes")
    private BigDecimal costoIngredientes = BigDecimal.ZERO;

    @Column(name = "costo_mano_obra")
    private BigDecimal costoManoObra = BigDecimal.ZERO;

    @Column(name = "costo_total", insertable = false, updatable = false)
    private BigDecimal costoTotal;

    @Column(name = "instrucciones")
    private String instrucciones;

    @Column(name = "notas_alergenos")
    private String notasAlergenos;

    @Column(name = "activa")
    private Boolean activa = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public enum Dificultad {
        facil, media, dificil
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
