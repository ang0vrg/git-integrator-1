package Integrador.Pasteleria.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

/*Entidad para almacenar las Quejas o Consultas*/
@Entity
public class Queja extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id; // Clave primaria, se genera automáticamente

    // Campos mapeados desde el formulario
    public String firstName;
    public String lastName;
    public String email;
    public String phone;
    public String subject;
    public String message;

    // campos para la gestión interna del proceso de quejas
    public LocalDateTime fechaRegistro = LocalDateTime.now(); // marca de tiempo
    public String estado = "Pendiente"; // Seguimiento del estado de la queja

    public Queja() {
    }
}
