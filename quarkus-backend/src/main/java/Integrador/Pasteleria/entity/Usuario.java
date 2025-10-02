// quarkus-backend\src\main\java\Integrador\Pasteleria\entity\Usuario.java
package Integrador.Pasteleria.entity;

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
@Table(name = "Usuario")/*Relación con la TABLE Usuario*/
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")/*Columna id_user */
    private Integer idUser;/*Tipo de variable */

    @Column(name = "username", nullable = false, unique = true)/*Concordancia con la DB */
    private String username; 

    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;
    
    @Column(name = "user_password", nullable = false)
    private String userPassword;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private Role userRole = Role.cliente;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    /*El tema de la hora de registro es automatico
     * por ello no se necesita aca.*/

    public enum Role {/*Como se tiene roles enumerados, hay que generarlos */
        cliente,
        administrador,
        trabajador
    }
}