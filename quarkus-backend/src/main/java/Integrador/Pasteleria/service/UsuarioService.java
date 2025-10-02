// quarkus-backend\src\main\java\Integrador\Pasteleria\service\UsuarioService.java
package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Usuario;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

@ApplicationScoped
public class UsuarioService {

    @Inject
    EntityManager em;

    public Optional<Usuario> findByUserEmail(String userEmail) {/*La funcion que se usara en el Auth */
        return em.createQuery("SELECT u FROM Usuario u WHERE u.userEmail = :userEmail", Usuario.class)
                .setParameter("userEmail", userEmail)
                .getResultStream()
                .findFirst();
    }

    @Transactional
    public Usuario saveUser(Usuario usuario) {/*La funcion de guardar usuario en la DB */
        usuario.setUserPassword(BCrypt.hashpw(usuario.getUserPassword(), BCrypt.gensalt()));//Encriptación al final
        em.persist(usuario);
        return usuario;
    }
        /**
     * Hashea una contraseña usando BCrypt
     */
    public String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }
    /**
     * Verifica si la contraseña coincide con el hash
     */
    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
    /**
     * Actualiza la contraseña de un usuario
     */
    @Transactional
    public void updatePassword(Usuario usuario, String newPassword) {
        String hashedPassword = hashPassword(newPassword);
        usuario.setUserPassword(hashedPassword);
        em.merge(usuario);
        em.flush();
    }
}