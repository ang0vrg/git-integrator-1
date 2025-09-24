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
@Table(name = "Puntos")/*Relación con la TABLE Puntos*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Puntos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_point")/*Columna id_point */
    private Integer idPoint;/*Tipo de variable */

    @Column(name = "id_user", nullable = false)/*Concordancia con la DB */
    private Integer idUser; 

    @Column(name = "points_earned", nullable = false)
    private Integer pointsEarned;

    @Column(name = "points_redeemed")
    private Integer pointsRedeemed = 0;
    
    @Column(name = "total_points", nullable = false)/*saldo acumulado */
    private Integer totalPoints;

    @Column(name = "id_sale")/*referencia a la venta donde se generaron */
    private Integer idSale;

    @Column(name = "created_at")
    private Timestamp createdAt;
}