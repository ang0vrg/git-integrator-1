package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Inventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_stock")
    private Integer idStock;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Producto producto;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "last_update")
    private LocalDateTime lastUpdate;

}
