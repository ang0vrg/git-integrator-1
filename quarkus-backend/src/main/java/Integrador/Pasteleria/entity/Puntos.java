package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Puntos")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Puntos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_point")
    private Integer idPoint;

    @Column(name = "points_earned")
    private Integer pointsEarned;

    @Column(name = "points_redeemed")
    private Integer pointsRedeemed;

    @Column(name = "total_points")
    private Integer totalPoints;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private Usuario idUser;

    @ManyToOne
    @JoinColumn(name = "id_sale")
    private Venta idSale;

}
