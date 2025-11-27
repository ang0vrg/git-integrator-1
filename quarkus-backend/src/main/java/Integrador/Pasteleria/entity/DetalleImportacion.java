package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "DetalleImportacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleImportacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_importacion", nullable = false)
    private Importacion importacion;

    @ManyToOne
    @JoinColumn(name = "id_ingrediente", nullable = false)
    private Ingrediente ingrediente;

    @Column(name = "cantidad", nullable = false)
    private BigDecimal cantidad;

    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario;
}
