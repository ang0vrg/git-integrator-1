package Integrador.Pasteleria.entity;
import java.sql.Date;
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
@Table(name = "Reporte")/*Relación con la TABLE Reporte*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_report")/*Columna id_report */
    private Integer idReport;/*Tipo de variable */

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false)
    private Role reportType;

    @Column(name = "start_date", nullable = false)/*Concordancia con la DB */
    private Date startDate; 

    @Column(name = "end_date", nullable = false)
    private Date endDate;
    
    @Column(name = "report_data")
    private String reportData;

    @Column(name = "created_at")
    private Timestamp createdAt;

    public enum Role {
        Ventas, Pedidos, Clientes, Productos,
    }
}