package Integrador.Pasteleria.entity;
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
@Table(name = "DetallePedido")/*Relación con la TABLE DetallePedido*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order")/*Columna id_order */
    private Integer idOrder;/*Tipo de variable */

    @Column(name = " id_product")/*Concordancia con la DB */
    private Integer  idProduct; 

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "price", nullable = false)
    private Double price;
}
