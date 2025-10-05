package Integrador.Pasteleria.entity;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Entity
@Table(name = "Pedido")/*Relación con la TABLE Pedido*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order")/*Columna id_order */
    private Integer idOrder;/*Tipo de variable */

    @Column(name = "order_date", nullable = false)/*Concordancia con la DB */
    private Timestamp orderDate;
    
    @Column(name = "order_discount")
    private Double orderDiscount;

    @Column(name = "order_total")
    private Double orderTotal;

    @Column(name = "id_user", nullable = false)
    private Integer idUser;
}
