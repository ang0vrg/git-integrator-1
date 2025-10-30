package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.dto.UsuarioDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UsuarioService {

    @Inject
    EntityManager em;

    public Optional<Usuario> findByUserEmail(String userEmail) {
        return em.createQuery("SELECT u FROM Usuario u WHERE u.userEmail = :email", Usuario.class)
                .setParameter("email", userEmail)
                .getResultStream()
                .findFirst();
    }

    @Transactional
    public Usuario saveUser(Usuario usuario) {
        usuario.setUserPassword(hashPassword(usuario.getUserPassword()));
        em.persist(usuario);
        return usuario;
    }

    public String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }

    @Transactional
    public void updatePassword(Usuario usuario, String newPassword) {
        usuario.setUserPassword(hashPassword(newPassword));
        em.merge(usuario);
    }

    public List<Usuario> findAllUsers() {
        return em.createQuery("SELECT u FROM Usuario u ORDER BY u.createdAt DESC", Usuario.class)
                .getResultList();
    }

    @Transactional
    public boolean   deleteUser(Integer userId) {
        Usuario usuario = em.find(Usuario.class, userId);
        if (usuario != null) {
            em.remove(usuario);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean updateUserRole(Integer userId, Usuario.Role newRole) {
        Usuario usuario = em.find(Usuario.class, userId);
        if (usuario != null) {
            usuario.setUserRole(newRole);
            em.merge(usuario);
            return true;
        }
        return false;
    }

    public Optional<Usuario> findById(Integer userId) {
        return Optional.ofNullable(em.find(Usuario.class, userId));
    }

    public List<UsuarioDTO> listUsers(String role) {
        return em.createNativeQuery("""
                    SELECT id_user AS id,
                           username AS username,
                           user_email AS userEmail,
                           user_role AS userRole,
                           phone_number AS phoneNumber,
                           created_at AS createdAt
                    FROM Usuario
                    WHERE (:role IS NULL OR user_role = :role)
                    ORDER BY created_at DESC
                """, UsuarioDTO.class)
                .setParameter("role", role)
                .getResultList();
    }

    @Transactional
    public boolean deleteById(Integer id) {
        return em.createQuery("DELETE FROM Usuario u WHERE u.idUser = :id")
                .setParameter("id", id)
                .executeUpdate() > 0;
    }

    public List<Usuario> listAllUsers() {
        return Usuario.listAll(); // Si usas PanacheEntity
    }
}
