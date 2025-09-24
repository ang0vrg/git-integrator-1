package Integrador.Pasteleria.entity;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Entity
@Table(name = "Venta")/*Relación con la TABLE Venta*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sale")/*Columna id_sale */
    private Integer idSale;/*Tipo de variable */

    @Enumerated(EnumType.STRING)
    @Column(name = "sale_type", nullable = false)
    private Role saleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "sale_status", nullable = false)
    private Status saleStatus = Status.Pendiente;

    @Column(name = "sale_date")
    private Timestamp sale_date;

    @Column(name = "sale_subtotal", nullable = false)
    private Double saleSubtotal;
    
    @Column(name = "id_order", nullable = false)
    private Integer idOrder;

    public enum Role {/*Como se tiene roles enumerados, hay que generarlos */
        Efectivo,
        Tarjeta,
    }

    public enum Status {/*Como se tiene roles enumerados, hay que generarlos */
        Pendiente,
        Completada,
        Cancelada
    }
}
