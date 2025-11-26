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
import java.util.stream.Collectors;

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

    public Optional<Usuario> findByPhoneNumber(String phoneNumber) {
        return em.createQuery("SELECT u FROM Usuario u WHERE u.phoneNumber = :phone", Usuario.class)
                .setParameter("phone", phoneNumber)
                .getResultStream()
                .findFirst();
    }

    public Optional<Usuario> findByUsername(String username) {
        return em.createQuery("SELECT u FROM Usuario u WHERE u.username = :username", Usuario.class)
                .setParameter("username", username)
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
    public boolean deleteUser(Integer userId) {
        Usuario usuario = em.find(Usuario.class, userId);
        if (usuario != null) {
            // Soft delete
            usuario.setActive(false);
            usuario.setDeletedAt(java.time.LocalDateTime.now());
            em.merge(usuario);
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
        List<Usuario> users;
        if (role == null || role.isBlank()) {
            users = em.createQuery("SELECT u FROM Usuario u ORDER BY u.createdAt DESC", Usuario.class)
                    .getResultList();
        } else {
            users = em
                    .createQuery("SELECT u FROM Usuario u WHERE u.userRole = :role ORDER BY u.createdAt DESC",
                            Usuario.class)
                    .setParameter("role", Usuario.Role.valueOf(role))
                    .getResultList();
        }
        return users.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private UsuarioDTO convertToDTO(Usuario u) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUser(u.getIdUser());
        dto.setUsername(u.getUsername());
        dto.setUserEmail(u.getUserEmail());
        dto.setUserRole(u.getUserRole().name());
        dto.setPhoneNumber(u.getPhoneNumber());
        dto.setLastAccess(u.getLastAccess());
        dto.setActive(u.getActive());
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }

    @Transactional
    public UsuarioDTO update(Integer id, UsuarioDTO dto) {
        Usuario usuario = em.find(Usuario.class, id);
        if (usuario != null) {
            updateEntityFromDTO(usuario, dto);
            em.merge(usuario);
            return convertToDTO(usuario);
        }
        return null;
    }

    private void updateEntityFromDTO(Usuario entity, UsuarioDTO dto) {
        if (dto.getUsername() != null)
            entity.setUsername(dto.getUsername());
        if (dto.getUserEmail() != null)
            entity.setUserEmail(dto.getUserEmail());
        if (dto.getPhoneNumber() != null)
            entity.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getUserRole() != null)
            entity.setUserRole(Usuario.Role.valueOf(dto.getUserRole()));
        if (dto.getActive() != null)
            entity.setActive(dto.getActive());
    }

    @Transactional
    public boolean deleteById(Integer id) {
        return deleteUser(id);
    }

    public Integrador.Pasteleria.dto.UserStatsDTO getUserStats() {
        long totalUsers = em.createQuery("SELECT COUNT(u) FROM Usuario u", Long.class).getSingleResult();

        Usuario lastUser = em.createQuery("SELECT u FROM Usuario u ORDER BY u.createdAt DESC", Usuario.class)
                .setMaxResults(1)
                .getResultStream()
                .findFirst()
                .orElse(null);

        String lastUserName = (lastUser != null) ? lastUser.getUsername() : "N/A";
        String lastUserDate = (lastUser != null && lastUser.getCreatedAt() != null)
                ? lastUser.getCreatedAt().toString()
                : "N/A";

        return new Integrador.Pasteleria.dto.UserStatsDTO(totalUsers, lastUserName, lastUserDate);
    }
}
